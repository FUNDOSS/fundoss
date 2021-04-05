/* eslint-disable no-param-reassign */
import moment from 'moment';
import FundingSession, { IFundingSession, IFundingSessionInput } from './fundingSessionModel';
import Collectives from '../collectives/CollectivesController';
import CollectiveSessionTotals from '../payment/collectiveSessionTotalsModel';
import Qf from '../../utils/qf';
import dbConnect from '../dbConnect';

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
    const avg = {
      match: matchedFunds / ((numberDonationEst * timeLeft + d * timeElapsed) / totalTime),
      average: (averageDonationEst * timeLeft + (amount / d) * timeElapsed) / totalTime,
      fudge: 1,
      exp: session.matchingCurve.exp,
      inout: session.matchingCurve.inout,
    };
    const currentMatches = donations.reduce(
      (total, don) => total + Qf.calculate(
        don,
        avg.average,
        avg.match,
        session.matchingCurve.exp || 2,
        1,
        session.matchingCurve.inout,
      ),
      0,
    );
    avg.fudge = ((currentMatches / timeElapsed) * totalTime) / matchedFunds;
    return avg;
  }
  return {
    match: session.matchedFunds / numberDonationEst,
    donation: averageDonationEst * averageDonationEst,
    fudge: 1,
    exp: session.matchingCurve.exp,
    inout: session.matchingCurve.inout,
  };
};

export async function insertSession(session):Promise<IFundingSession> {
  await dbConnect();
  return FundingSession.create(
    session.collectives ? { ...session, ...await getCollectivesFromInput(session) } : session,
  );
}

export async function editSession(session:IFundingSessionInput):Promise<IFundingSession> {
  await dbConnect();
  await FundingSession.updateOne(
    { _id: session._id },
    session.collectives ? { ...session, ...await getCollectivesFromInput(session) } : session,
  );
  return FundingSession.findOne({ _id: session._id });
}

export async function getCurrentSession():Promise<any> {
  await dbConnect();
  const session = await FundingSession.findOne().populate('collectives predicted');
  return setCollectiveTotals(session);
}

export async function getCurrentSessionId():Promise<string> {
  await dbConnect();
  const session = await FundingSession.findOne().select('_id');
  return session._id;
}

export async function getCurrentSessionInfo():Promise<any> {
  await dbConnect();
  const session = await FundingSession.findOne().select('_id name start end averageDonationEst numberDonationEst matchedFunds totals matchingCurve');
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
  return session;
}

export async function getBySlug(slug:string):Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne({ slug }).populate('collectives');
  const sessionData = await setCollectiveTotals(session);
  return sessionData;
}

export async function getCollectiveSessions(collectiveId) {
  await dbConnect();
  const sessions = await FundingSession.find({ collectives: collectiveId })
    .select('_id name slug start end matchedFunds');
  return sessions;
}

export async function nominate(sessionId, collectiveSlug) {
  await dbConnect();
  const collective = await Collectives.get(collectiveSlug);
  if (collective._id) {
    await FundingSession.updateOne(
      { _id: sessionId },
      { $push: { collectives: collective._id } as any },
    );
  }
  return collective;
}

export default class FundingSessionController {
    static insert = insertSession

    static getCurrent = getCurrentSession

    static getCurrentId = getCurrentSessionId

    static getAll = getAll

    static getById = getById

    static edit = editSession

    static getBySlug = getBySlug

    static getCurrentSessionInfo = getCurrentSessionInfo

    static nominate = nominate

    static getCollectiveSessions = getCollectiveSessions
}
