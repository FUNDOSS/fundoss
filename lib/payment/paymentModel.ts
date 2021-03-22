import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentInput {
  _id?: string;
  user?: string;
  amount?: number;
  fee?: number;
  status?: string;
  time?: Date;
  intent_id?: string;
  confirmation?: any;
  error?: any;
}

export interface IPayment extends Document {
  _id: string;
  user: string;
  amount: number;
  fee: number;
  status: string;
  time: Date;
  intent_id: string;
  confirmation: any;
  error: any;
}

const PaymentSchema = new Schema({
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
  intent_id: {
    type: String,
  },
  confirmation: {
    type: Schema.Types.Mixed,
  },
  error: {
    type: Schema.Types.Mixed,
  },
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
  }],
  session: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundingSession',
  }],
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
