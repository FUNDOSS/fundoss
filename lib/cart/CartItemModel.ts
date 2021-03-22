import mongoose, { Document, Schema } from 'mongoose';
import { ICollective } from '../collectives/CollectiveModel';

export interface ICartItem extends Document {
  amount:number,
  collective:ICollective,
}

export interface ICartItemInput {
  amount:number,
  collective:string,
}

const CartItemSchema = new Schema({
  amount: {
    type: Number,
  },
  collective: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collective',
  },
});

export default mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', CartItemSchema);
