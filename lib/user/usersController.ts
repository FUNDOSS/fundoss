import User from './userModel';
import dbConnect from '../dbConnect';

export async function insertUser(user) {
  await dbConnect();
  return User.create(user);
}

export async function updateUser(user) {
  await dbConnect();
  return User.updateOne({ _id: user._id }, user);
}

export async function findByEmail(email:string) {
  await dbConnect();
  return User.findOne({ email });
}

export async function findByGithubId(githubid:string) {
  await dbConnect();
  return User.findOne({ githubid });
}

export async function findById(id:string) {
  await dbConnect();
  return User.findOne({ _id: id });
}

export default class Users {
    static insert = insertUser

    static findByEmail = findByEmail

    static findById = findById

    static findByGithubId = findByGithubId

    static update = updateUser
}
