import mongoose, { Schema, Document } from 'mongoose';
import { ICollective } from '../collectives/CollectiveModel';
import { IFundingSession } from '../fundingSession/fundingSessionModel';

export interface ICollectiveSessionTotalsInput {
  amount: number;
  donations:Array<number>;
  collective:ICollective;
  session:IFundingSession;
}

export interface ICollectiveSessionTotals extends Document {
  amount: number;
  donations:Array<number>;
  collective:ICollective;
  session:IFundingSession;
}

const CollectiveSessionTotalsSchema = new Schema({
  amount: {
    type: Number,
  },
  donations: [{
    type: Number,
  }],
  collective: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collective',
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundingSession',
  },
});

export default mongoose.models?.CollectiveSessionTotals || mongoose.model('CollectiveSessionTotals', CollectiveSessionTotalsSchema);
