import mongoose, { Schema, Document } from 'mongoose';
import { ICollective } from '../collectives/CollectiveModel';
import { IUser } from '../user/userModel';
import { IPayment } from './paymentModel';

export interface IDonationInput {
  amount?: number;
  collective?:string;
  fee?:number;
  payment?:string;
  user?:string;
}

export interface IDonation extends Document {
  amount: number;
  collective:ICollective;
  fee:number;
  payment:IPayment;
  user:IUser;
}

const DonationSchema = new Schema({
  amount: {
    type: Number,
  },
  fee: {
    type: Number,
  },
  collective: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collective',
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundingSession',
  },
});

export default mongoose.models?.Donation || mongoose.model('Donation', DonationSchema);
