import FundingSession, { IFundingSession, IFundingSessionInput } from './fundingSessionModel';
import Collectives from '../collectives/CollectivesController';
import dbConnect from '../dbConnect';

export async function insertSession(session):Promise<IFundingSession> {
  await dbConnect();
  if (session.collectives) {
    const collectivesSlugs = session.collectives.split('\n')
      .map((url) => url.split('opencollective.com/')[1].trim());
    const collectives = await Promise.all(
      collectivesSlugs.map(async (slug) => Collectives.get(slug)),
    );
    session.collectives = collectives.filter((collective: any) => !collective.error);
  }
  return FundingSession.create(session);
}

export async function editSession(session:IFundingSessionInput):Promise<any> {
  await dbConnect();
  if (session.collectives) {
    const collectivesSlugs = session.collectives.split('\n')
      .map((url) => url.split('opencollective.com/')[1].trim());
    const collectives = await Promise.all(
      collectivesSlugs.map(async (slug) => Collectives.get(slug)),
    );
    session.collectives = collectives.filter((collective: any) => !collective.error);
  }
  return FundingSession.updateOne({ _id: session._id }, session);
}

export async function getCurrentSession():Promise<IFundingSession> {
  await dbConnect();
  const session = await FundingSession.findOne().populate('collectives');
  return session;
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

    static getAll = getAll

    static getById = getById

    static edit = editSession

    static getBySlug = getBySlug
}
