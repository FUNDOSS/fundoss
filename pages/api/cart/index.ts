import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../middleware/index';
import Cart from '../../../lib/cart/CartController';

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
  const newCart = req.body.reduce((cart, item) => ({...cart, [item.collective] : item.amount}), cart)
  req.session.cart = newCart;
  return res.status(200).json(newCart);
});

handler.delete(async (req:any, res:NextApiResponse) => {
  const cart = req.session.cart || {};
  delete cart[req.body.collective];
  req.session.cart = cart;
  return res.status(200).json(cart);
});

export default handler;
