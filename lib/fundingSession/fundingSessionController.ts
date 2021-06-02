/* eslint-disable no-param-reassign */
import moment from 'moment';
import mongoose from 'mongoose';
import { collectFields } from 'graphql/execution/execute';
import FundingSession, { IFundingSession, IFundingSessionInput } from './fundingSessionModel';
import Collectives from '../collectives/CollectivesController';
import CollectiveSessionTotals from '../payment/collectiveSessionTotalsModel';
import Qf from '../../utils/qf';
import dbConnect from '../dbConnect';
import NominationModel from '../collectives/NominationModel';
import Payments from '../payment/paymentController';

const getCollectivesFromInput = async (session) => {
  const collectivesSlugs = session.collectives.split('\n')
    .map((url) => url.split('opencollective.com/')[1]?.trim());
  const allCollectives = await Promise.all(
    collectivesSlugs.map(async (slug) => Collectives.get(slug)),
  );
  const collectives = allCollectives.filter((collective: any) => !collective.error);
  const collectiveImportErrors = allCollectives.filter((collective: any) => collective.error)
    .reduce((obj, value:any) => ({ ...obj as any, [value.slug]: value.error }), {});

  return { collectives, collectiveImportErrors };
};

const setCollectiveTotals = async (session) => {
  const totals = (await CollectiveSessionTotals.find({ session: session._id }))
    .reduce((totalsMap, tot) => ({
      ...totalsMap,
      ...{ [tot.collective]: { donations: tot.donations, amount: tot.amount } },
    }), {});
  const collectives = session.collectives.map(
    (collective) => {
      collective.totals = totals[collective._id] || { donations: [], amount: 0 };
      return collective;
    },
  );
  session.collectives = collectives;
  return session;
};

export const getDonationsConfig = () => ({
  min: Number(process.env.DONATION_MIN),
  max: Number(process.env.DONATION_MAX),
  def: Number(process.env.DONATION_DEFAULT),
  choice: process.env.DONATION_CHOICE.split(',').map((n) => Number(n)),
});

const median = (values) => {
  if (values.length === 0) return 0;
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

export const getPredictedAverages = (session) => {
  const timeElapsed = moment().diff(moment(session.start));
  const {
    totals, numberDonationEst, averageDonationEst, matchedFunds,
  } = session;
  if (timeElapsed) {
    const timeLeft = moment(session.end).diff(moment());
    const totalTime = timeElapsed + timeLeft;
    const { donations, amount } = totals || { donations: [], amount: 0 };
    const d = donations.length;
    const medianDonation = median(donations);
    const avg = {
      match: matchedFunds / ((numberDonationEst * timeLeft + d * timeElapsed) / totalTime),
      average: (averageDonationEst * timeLeft + (amount / d) * timeElapsed) / totalTime,
      fudge: 1,
      exp: session.matchingCurve?.exp || 2,
      symetric: session.matchingCurve?.symetric || false,
    };
    const currentMatches = donations.reduce(
      (total, don) => total + Qf.calculate(
        don,
        amount / donations.length,
        matchedFunds / donations.length,
        session.matchingCurve.exp || 2,
        1,
        session.matchingCurve.symetric,
      ),
      0,
    );
    avg.fudge = ((matchedFunds / donations.length) / (amount / donations.length))
      / (currentMatches / amount);
    return avg;
  }
  return {
    match: session.matchedFunds / numberDonationEst,
    donation: averageDonationEst * averageDonationEst,
    fudge: 1,
    exp: session.matchingCurve.exp,
    symetric: session.matchingCurve.symetric,
  };
};

export async function insertSession(session) {
  await dbConnect();
  if (session.collectives) {
    session.collectives = (await getCollectivesFromInput(session)).collectives;
  } else {
    session.collectives = [];
  }
  return FundingSession.create(session);
}

export async function editSession(session) {
  await dbConnect();
  session.start = moment(session.start).utc().set('hour', 12).toDate();
  session.end = moment(session.end).utc().set('hour', 12).toDate();
  await FundingSession.updateOne(
    { _id: session._id },
    session.collectives ? { ...session, ...await getCollectivesFromInput(session) } : session,
  );
  return FundingSession.findOne({ _id: session._id });
}

export async function getCurrentSession():Promise<any> {
  await dbConnect();
  const session = await FundingSession.findOne({
    start: { $lte: new Date() },
    end: { $gte: new Date() },
    published: true,
  }).populate('collectives');
  if (session) {
    const sessionData = await setCollectiveTotals(session);
    sessionData.donateConfig = getDonationsConfig();
    sessionData.collectives = session.collectives.sort(() => 0.5 - Math.random());
    return sessionData;
  }
  return false;
}

export async function getFinishedSession():Promise<any> {
  await dbConnect();
  const session = await FundingSession.findOne({
    end: { $gte: moment().subtract(5, 'days').toDate() },
    published: true,
  }).populate('collectives');
  if (session) {
    if (!session.disbursments) {
      const disbursments = (await Payments.getSessionDisbursement(session._id))
        .reduce((obj, col) => (
          { ...obj, ...{ [col.slug]: col } }
        ), {});
      FundingSession.updateOne({ _id: session._id, disbursments });
      session.disbursments = disbursments;
    }
    const sessionData = await setCollectiveTotals(session);
    sessionData.collectives = session.collectives.sort(() => 0.5 - Math.random());
    return sessionData;
  }
  return false;
}

export async function getUpcomingSessionInfo():Promise<any> {
  await dbConnect();
  const session = await FundingSession.findOne({
    start: { $gte: new Date() },
    published: true,
  }).select('_id slug name tagline sponsors description start end averageDonationEst numberDonationEst matchedFunds totals matchingCurve description');
  return session;
}

export async function getUpcomingSession():Promise<any> {
  await dbConnect();
  const session = await FundingSession.findOne({
    start: { $gte: new Date() },
    published: true,
  }).populate('collectives');

  return session;
}

export async function getCurrentSessionId():Promise<string> {
  await dbConnect();
  const session = await FundingSession.findOne({
    start: { $lte: new Date() },
    end: { $gte: new Date() },
    published: true,
  }).select('_id');
  return session._id;
}

export async function getCurrentSessionInfo():Promise<any> {
  await dbConnect();
  const session = await FundingSession.findOne({
    start: { $lte: new Date() },
    end: { $gte: new Date() },
    published: true,
  }).select('_id name slug tagline description sponsors start end averageDonationEst numberDonationEst matchedFunds totals matchingCurve');
  return session;
}

export async function getAll():Promise<IFundingSession[]> {
  await dbConnect();
  const sessions = await FundingSession.find();
  return sessions;
}

export async function getById(id:string):Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne({ _id: id }).populate('collectives');
  session.collectives = session.collectives.sort(() => 0.5 - Math.random());
  return session;
}

export async function getBySlug(slug:string):Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne({ slug }).populate('collectives');
  if (session._id) {
    const sessionData = await setCollectiveTotals(session);
    sessionData.donateConfig = getDonationsConfig();
    return sessionData;
  }
  return session;
}

export async function getCollectiveSessions(collectiveId) {
  await dbConnect();
  const sessions = await FundingSession.find({ collectives: collectiveId })
    .select('_id name slug start end matchedFunds');
  return sessions;
}

export async function nominate(sessionId, collectiveSlug, userId = null) {
  await dbConnect();
  const collective = await Collectives.get(collectiveSlug);
  if (collective._id) {
    const collectiveInSession = await FundingSession.find({
      _id: sessionId,
      collectives: collective._id,
    });
    if (!collectiveInSession.length) {
      await FundingSession.updateOne(
        { _id: sessionId },
        { $push: { collectives: collective._id } as any },
      );
    }

    if (userId) {
      NominationModel.create({
        session: sessionId,
        collective: collective._id,
        user: userId,
      });
    }
  }
  return collective;
}

export async function getNominations(sesion) {
  await dbConnect();
  const nominations = await NominationModel.aggregate([
    { $match: { session: mongoose.Types.ObjectId(sesion) } },
    { $group: { _id: { collective: '$collective' }, count: { $sum: 1 } } },
  ]);
  return nominations.reduce((noms, collective) => ({
    ...noms,
    ...{ [collective._id.collective]: collective.count },
  }), {});
}

export async function getUserNominations(user, session) {
  await dbConnect();
  const nominations = await NominationModel.aggregate([
    {
      $match: {
        session: mongoose.Types.ObjectId(session),
        user: mongoose.Types.ObjectId(user),
      },
    },
    { $group: { _id: { collective: '$collective' }, count: { $sum: 1 } } },
  ]);
  return nominations.map((collective) => collective._id.collective);
}

export default class FundingSessionController {
    static insert = insertSession

    static getFinished = getFinishedSession

    static getCurrent = getCurrentSession

    static getCurrentId = getCurrentSessionId

    static getAll = getAll

    static getById = getById

    static edit = editSession

    static getBySlug = getBySlug

    static getCurrentSessionInfo = getCurrentSessionInfo

    static nominate = nominate

    static getCollectiveSessions = getCollectiveSessions

    static getUpcomingSessionInfo = getUpcomingSessionInfo

    static getUpcomingSession = getUpcomingSession

    static getNominations = getNominations

    static getUserNominations = getUserNominations

    static getDonationsConfig = getDonationsConfig
}
