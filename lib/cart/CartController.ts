import Collectives, { ICollective } from '../collectives/CollectiveModel';
import dbConnect from '../dbConnect';

export async function getCart(sessionCart) {
  if (!sessionCart) return [];
  await dbConnect();
  const ids = Object.keys(sessionCart).reduce(
    (ids, _id) => _id.match(/^[0-9a-fA-F]{24}$/) ? [...ids, _id ] : ids
    , [] );
  const cart:Array<ICollective> = await Collectives.find(
    { _id: { $in: ids} },
  ).select({
    name: 1, imageUrl: 1, slug: 1, description: 1,
  });
  return cart.map((collective) => ({ collective, amount: sessionCart[collective._id] }));
}

export default class Cart {
  static get = getCart
}
