import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../user/userModel';

interface IPassport extends Document {
  user: IUser
}

export interface ISession extends Document {
    expires: Date;
    session: {
      passport:{
        user: IPassport
      },
    };
}

const SessionSchema = new Schema({
  expires: {
    type: String,
  },
  session: {
    passport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
});

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
