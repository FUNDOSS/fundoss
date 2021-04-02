import FundingSession, { IFundingSession, IFundingSessionInput } from './fundingSessionModel';
import Collectives, { updateCollectivesTotals } from '../collectives/CollectivesController';
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

export async function getCurrentSession():Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne().populate('collectives');
  const collectives = session.collectives.map((col) => {
    const totals = col.totals ? col.totals[session._id] : {amount: 0, donations: []}
    if(!Array.isArray(totals?.donations)){
      col.totals = {amount: 0, donations: []};
      updateCollectivesTotals([col._id],session._id);
    } else {
      col.totals = totals;
    }
    return col
    }
  )
  session.collectives = collectives;
  return session;
}

export async function getCurrentSessionId():Promise<string> {
  await dbConnect();
  const session = await FundingSession.findOne().select('_id');
  return session._id;
}

export async function getCurrentSessionInfo():Promise<string> {
  await dbConnect();
  const session = await FundingSession.findOne().select('_id name start end averageDonationEst numberDonationEst matchedFunds');
  return session;
}

export async function getAll():Promise<IFundingSession[]> {
  await dbConnect();
  const sessions = await FundingSession.find();
  return sessions;
}

export async function getById(id:string):Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne({ _id:id }).populate('collectives');
  return session;
}

export async function getBySlug(slug:string):Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne({ slug }).populate('collectives');
  return session;
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
}
