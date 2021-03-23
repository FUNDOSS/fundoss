import mongoose, { Document, Schema } from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
import { ICollective } from '../collectives/CollectiveModel';

export interface IFundingSession extends Document {
  slug: string;
  start: Date;
  end: Date;
  name: string;
  description: string;
  matchedFunds: number;
  collectives: Array<ICollective>;
}

export interface IFundingSessionInput {
  _id?:string;
  start?: Date;
  end?: Date;
  name?: string;
  description?: string;
  matchedFunds?: number;
  collectives?: any;
  protytype?: any;
}

const FundingSessionSchema = new Schema({
  slug: {
    type: String,
  },
  name: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  matchedFunds: {
    type: Number,
  },
  averageDonationEst: {
    type: Number,
  },
  numberDonationEst: {
    type: Number,
  },
  description: {
    type: String,
  },
  collectives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collective',
  }],
  collectiveImportErrors: {
    type: Map,
    of: Schema.Types.Mixed,
  },
});

FundingSessionSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=name%>' });

export default mongoose.models.FundingSession || mongoose.model<IFundingSession>('FundingSession', FundingSessionSchema);
