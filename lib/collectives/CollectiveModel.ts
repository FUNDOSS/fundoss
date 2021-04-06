import mongoose, { Document, Schema } from 'mongoose';

export interface ICollective extends Document {
  slug:string;
  name:string;
  lastUpdate:Date;
  twitterHandle:string;
  githubHandle:string;
  imageUrl:string;
  backgroundImageUrl:string;
  website:string;
  tags:string;
  description:string;
  longDescription:string;
  membersCount:number;
  members:Array<string>;
  totals:any
}

const CollectiveSchema = new Schema({
  slug: {
    type: String,
  },
  lastUpdate: {
    type: Date,
  },
  name: {
    type: String,
  },
  twitterHandle: {
    type: String,
  },
  githubHandle: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  backgroundImageUrl: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  website: {
    type: String,
  },
  description: {
    type: String,
  },
  longDescription: {
    type: String,
  },
  membersCount: {
    type: Number,
  },
  members: {
    type: Schema.Types.Mixed,
  },
  totals: {
    type: Schema.Types.Mixed,
  },
});

export default mongoose.models?.Collective || mongoose.model<ICollective>('Collective', CollectiveSchema);
