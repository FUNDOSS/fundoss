import Session from './SessionModel';
import dbConnect from '../dbConnect';

export async function findByConnectSid(id:string) {
  await dbConnect();
  return Session.findOne({ _id: id });
}

export default class Users {
    static findBySid = findByConnectSid
}
