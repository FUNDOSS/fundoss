import mongoose, { Document, Schema } from 'mongoose';

export interface IUserInput {
  _id?: string;
  email?: string;
  username: string;
  avatar?:string;
  name?:string;
  githubid?:string;
  role?:string;
  githubaccestoken?:string;
  githubrefreshtoken?:string;
  billing?: any;
  prototype?: any;
}

export interface IUser extends Document {
  email: string;
  username: string;
  avatar:string;
  name:string;
  githubid:string;
  role:string;
  githubaccestoken?:string;
  githubrefreshtoken?:string;
  billing?: any;
}

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  githubid: {
    type: String,
    required: true,
  },
  githubaccestoken: {
    type: String,
  },
  githubrefreshtoken: {
    type: String,
  },
  role: {
    type: String,
    default: 'backer',
  },
  billing: {
    type: Schema.Types.Mixed,
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
