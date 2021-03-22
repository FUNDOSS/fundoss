import Collectives, { ICollective } from '../collectives/CollectiveModel';
import dbConnect from '../dbConnect';

export async function getCart(sessionCart) {
  if (!sessionCart) return [];
  await dbConnect();
  const cart:Array<ICollective> = await Collectives.find(
    { _id: { $in: Object.keys(sessionCart).map((_id) => _id) } },
  ).select({
    name: 1, imageUrl: 1, slug: 1, description: 1,
  });
  return cart.map((collective) => ({ collective, amount: sessionCart[collective._id] }));
}

export default class Cart {
  static get = getCart
}
