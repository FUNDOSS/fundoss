import FundingSession, { IFundingSession, IFundingSessionInput } from './fundingSessionModel';
import Collectives from '../collectives/CollectivesController';
import dbConnect from '../dbConnect';

const getCollectivesFromInput = async (session) => {
  const collectivesSlugs = session.collectives.split('\n')
    .map((url) => url.split('opencollective.com/')[1]?.trim());
  const allCollectives = await Promise.all(
    collectivesSlugs.map(async (slug) => Collectives.get(slug)),
  );
  const collectives = allCollectives.filter((collective: any) => !collective.error);
  const collectiveImportErrors = allCollectives.filter((collective: any) => collective.error)
    .reduce((obj, value:any) => ({ ...obj as object, [value.slug]: value.error }), {});

  return { collectives, collectiveImportErrors };
};

export async function insertSession(session):Promise<IFundingSession> {
  await dbConnect();
  if (session.collectives) session = { ...session, ...await getCollectivesFromInput(session) };
  return FundingSession.create(session);
}

export async function editSession(session:IFundingSessionInput):Promise<any> {
  await dbConnect();
  if (session.collectives) session = { ...session, ...await getCollectivesFromInput(session) };
  await FundingSession.updateOne({ _id: session._id }, session);
  return FundingSession.findOne({ _id: session._id });
}

export async function getCurrentSession():Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne().populate('collectives');
  return session;
}

export async function getCurrentSessionId():Promise<string> {
  await dbConnect();
  const session = await FundingSession.findOne().select('_id');
  return session._id;
}

export async function getAll():Promise<IFundingSession[]> {
  await dbConnect();
  const sessions = await FundingSession.find();
  return sessions;
}

export async function getById(id:string):Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne({ id });
  return session;
}

export async function getBySlug(slug:string):Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne({ slug }).populate('collectives');
  return session;
}

export default class Users {
    static insert = insertSession

    static getCurrent = getCurrentSession

    static getCurrentId = getCurrentSessionId

    static getAll = getAll

    static getById = getById

    static edit = editSession

    static getBySlug = getBySlug
}
