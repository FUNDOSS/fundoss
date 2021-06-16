import mongoose, { Document, Schema } from 'mongoose';

export interface IUserInput {
  _id?: string;
  email?: string;
  username?: string;
  avatar?:string;
  name?:string;
  githubid?:string;
  githubUser?:any;
  googleid?:string;
  googleUser?:any;
  linkedinid?:string;
  linkedinUser?:any;
  facebookid?:string;
  facebookUser?:any;
  role?:string;
  billing?: any;
  subscribed?:boolean;
  prototype?: any;
}

export interface IUser extends Document {
  email: string;
  username: string;
  avatar:string;
  name:string;
  githubid:string;
  githubUser:any;
  googleid:string;
  googleUser:any;
  facebookid:string;
  facebookUser:any;
  linkedinid:string;
  linkedinUser:any;
  role:string;
  subscribed?:boolean;
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
  subscribed: {
    type: Boolean,
  },
  username: {
    type: String,
  },
  githubid: {
    type: String,
  },
  githubUser: {
    type: Schema.Types.Mixed,
  },
  googleid: {
    type: String,
  },
  googleUser: {
    type: Schema.Types.Mixed,
  },
  facebookid: {
    type: String,
  },
  facebookUser: {
    type: Schema.Types.Mixed,
  },
  linkedinid: {
    type: String,
  },
  linkedinUser: {
    type: Schema.Types.Mixed,
  },
  role: {
    type: String,
    default: 'user',
  },
  billing: {
    type: Schema.Types.Mixed,
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
