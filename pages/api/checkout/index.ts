import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import Stripe from 'stripe';
import { all } from '../../../middleware/index';
import Payment from '../../../lib/payment/paymentController';
import { formatAmountForStripe } from '../../../utils/currency';
import Users from '../../../lib/user/usersController';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const handler = nextConnect();

handler.use(all);

handler.post(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (!req.body.payment) {
    try {
      if (req.body.billing_details) {
        Users.update({ _id: req.user._id, billing: req.body.billing_details });
      }
      const amount = Object.keys(req.session.cart)
        .map((_id) => req.session.cart[_id])
        .reduce((acc, amt) => acc + Number(amt), 0);
      const params: Stripe.PaymentIntentCreateParams = {
        payment_method_types: ['card'],
        amount: formatAmountForStripe(amount, 'USD'),
        currency: 'USD',
        description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
      };
      const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
        params,
      );
      const payment = await Payment.insert({
        user: req.user._id,
        intentId: paymentIntent.id,
        amount,
      });
      return res.status(200).json({ payment, intent: paymentIntent });
    } catch (err) {
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    const { payment } = req.body;
    if (payment.status === 'succeeded') {
      const intent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(
        payment.intentId, { expand: ['charges.data.balance_transaction'] },
      );
      payment.status = intent.status;
      payment.confirmation = intent;
      payment.donations = req.session.cart;
      await Payment.update(payment);
      req.session.cart = {};
      return res.status(200).json({ payment, intent });
    }
    return res.status(200).json({ payment });
  }
});

export default handler;
