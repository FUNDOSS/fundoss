import mongoose, { Document, Schema } from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
import moment from 'moment';
import { ICollective } from '../collectives/CollectiveModel';

export interface IFundingSession extends Document {
  slug: string;
  start: Date;
  end: Date;
  name: string;
  description: string;
  tagline?: string;
  matchedFunds: number;
  tags: Array<string>;
  collectives: Array<ICollective>;
  predictedAverage:number;
  allowNominations:boolean;
  published:boolean;
  predictedDonations:number;
  predicted:any;
  matchingCurve:any;
}

export interface IFundingSessionInput {
  _id?:string;
  start?: Date;
  end?: Date;
  name?: string;
  description?: string;
  tagline?: string;
  matchedFunds?: number;
  collectives?: any;
  allowNominations?:boolean;
  published?:boolean;
  protytype?: any;
  tags: Array<string>;
  matchingCurve:any;
}

const FundingSessionSchema = new Schema({
  slug: {
    type: String,
  },
  name: {
    type: String,
  },
  tagline: {
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
  matchingCurve: {
    type: Schema.Types.Mixed,
  },
  description: {
    type: String,
  },
  sponsors: {
    type: String,
  },
  allowNominations: {
    type: Boolean,
  },
  published: {
    type: Boolean,
  },
  tags: [{
    type: String,
  }],
  collectives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collective',
  }],
  collectiveImportErrors: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  totals: {
    type: Schema.Types.Mixed,
  },
});

FundingSessionSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=name%>' });

export default mongoose.models?.FundingSession || mongoose.model<IFundingSession>('FundingSession', FundingSessionSchema);
