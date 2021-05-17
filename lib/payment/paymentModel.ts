import mongoose, { Document, Schema } from 'mongoose';
import { IFundingSession } from '../fundingSession/fundingSessionModel';
import nanoid from '../nanoid';
import { IUser } from '../user/userModel';

export interface IPaymentInput {
  _id?: string;
  user?: string;
  amount?: number;
  fee?: number;
  status?: string;
  time?: Date;
  intentId?: string;
  confirmation?: any;
  cardFingerprint?: string;
  browserFingerprint?: string;
  sybilAttackScore?: string;
  error?: any;
}

export interface IPayment extends Document {
  _id: string;
  user: IUser;
  amount: number;
  fee: number;
  status: string;
  time: Date;
  intentId: string;
  confirmation: any;
  error: any;
  shareImage:string;
  session:IFundingSession;
  cardFingerprint: string;
  browserFingerprint: string;
  sybilAttackScore: string;
}

const PaymentSchema = new Schema({
  sid: {
    type: String,
    default: () => nanoid(),
  },
  amount: {
    type: Number,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
  },
  fee: {
    type: String,
  },
  intentId: {
    type: String,
  },
  confirmation: {
    type: Schema.Types.Mixed,
  },
  cardFingerprint: {
    type: String,
  },
  browserFingerprint: {
    type: String,
  },
  sybilAttackScore: {
    type: Number,
  },
  error: {
    type: Schema.Types.Mixed,
  },
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
  }],
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundingSession',
  },
  shareImage: {
    type: String,
  },
});

export default mongoose.models?.Payment || mongoose.model('Payment', PaymentSchema);
