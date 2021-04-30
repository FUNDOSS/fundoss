import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../middleware/index';
import Cart from '../../../lib/cart/CartController';
import FundingSessionController from '../../../lib/fundingSession/fundingSessionController';

const handler = nextConnect();

handler.use(all);

handler.get(async (req:any, res:NextApiResponse) => {
  if (req.session.cart) {
    const cartItems = await Cart.get(req.session.cart)
      .catch((e) => res.status(500).json(e));
    res.status(200).json(cartItems);
  } else {
    res.status(200).json([]);
  }
});

handler.post(async (req:any, res:NextApiResponse) => {
  const cart = req.session.cart || {};
  const config = FundingSessionController.getDonationsConfig();
  req.session.cart = req.body.reduce(
    (acc, item) => ({
      ...acc,
      [item.collective]: config.min < item.amount ? item.amount : config.min,
    }
    ), cart,
  );
  return res.status(200).json(req.session.cart);
});

handler.delete(async (req:any, res:NextApiResponse) => {
  const cart = req.session.cart || {};
  delete cart[req.body.collective];
  req.session.cart = cart;
  return res.status(200).json(cart);
});

export default handler;
