import mongoose, { Document, Schema } from 'mongoose';

export interface INominate extends Document {
  user: any;
  collective: any;
  session: any;
}

const NominateSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  collective: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collective',
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundingSession',
  },
});

export default mongoose.models?.Nominate || mongoose.model('Nominate', NominateSchema);
