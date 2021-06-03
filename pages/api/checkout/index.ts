import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PaymentMethod } from '@stripe/stripe-js';
import { all } from '../../../middleware/index';
import Payment from '../../../lib/payment/paymentController';
import { formatAmountForStripe } from '../../../utils/currency';
import Users from '../../../lib/user/usersController';
import Cart from '../../../lib/cart/CartController';
import FundingSessionController from '../../../lib/fundingSession/fundingSessionController';
import Mail from '../../../lib/mail';
import Ghost from '../../../lib/ghost';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const handler = nextConnect();

handler.use(all);

handler.post(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  const current = await FundingSessionController.getCurrentSessionInfo();
  const config = FundingSessionController.getDonationsConfig();

  if (!current._id) return res.status(500).json({ statusCode: 500, message: 'no active session' });

  if (!req.body.payment) {
    if (req.body.billing_details) {
      Users.update({ _id: req.user._id, billing: req.body.billing_details });
    }
    if (req.body.subscribe) {
      Ghost.subscribe({
        name: req.body.billing_details.name,
        email: req.body.billing_details.email,
        subscribed: true,
      });
    }
    const amount = Object.keys(req.session.cart)
      .map((_id) => req.session.cart[_id])
      .reduce((acc, amt) => acc + Number(amt), 0);

    if (amount < config.min) return res.status(500).json({ statusCode: 500, message: 'amount too low' });
    if (amount > config.max) return res.status(500).json({ statusCode: 500, message: 'amount too high' });

    try {
      const cartData = (await Cart.get(req.session.cart)).reduce((data, item) => ({
        amount: data.amount + Number(item.amount),
        meta: { ...data.meta, [item.collective.slug]: item.amount },
      }), {
        amount: 0,
        meta: {
          user: req.user._id.toString(),
          session: current.slug,
        },
      });
      // Create Stripe paymentIntent
      const params: Stripe.PaymentIntentCreateParams = {
        payment_method_types: ['card'],
        amount: formatAmountForStripe(cartData.amount),
        currency: 'USD',
        description: `${process.env.STRIPE_PAYMENT_DESCRIPTION} ${current.name}`,
        metadata: cartData.meta,
      };
      const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
        params,
      );
      // Save paymentIntent to database
      const payment = await Payment.insert({
        user: req.user._id,
        intentId: paymentIntent.id,
        amount,
      });
      return res.status(200).json({
        paymentId: payment._id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    const { payment } = req.body;
    if (payment.status === 'succeeded') {
      const savedPayment = await Payment.findById(payment.id);
      if (!savedPayment) return res.status(500).json({ statusCode: 500, message: 'invalid payment' });
      try {
        // retrieve stripe intent
        const intent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(
          savedPayment.intentId, {
            expand:
            [
              'charges.data.balance_transaction',
              'payment_method',
            ],
          },
        );
        if (intent.status === 'succeeded') {
          // Create donations for each collective and update payment
          const donations = await Cart.get(req.session.cart);
          const paymentMethod = intent.payment_method;
          const update = {
            sid: savedPayment.sid,
            amount: savedPayment.amount,
            _id: savedPayment._id,
            session: savedPayment.session._id,
            user: savedPayment.user._id,
            status: intent.status,
            cardFingerprint: (paymentMethod as any).card.fingerprint,
            confirmation: intent,
            donations: donations.reduce((data, item) => (
              { ...data, [item.collective._id]: item.amount }
            ), {}),
            browserFingerprint: payment.browserFingerprint,
          };
          await Payment.update(update);
          req.session.cart = {};
          await Mail.paymentConfirmation({
            ...update,
            ...{ user: req.user, donations },
          });
          return res.status(200).json({ status: 'succeeded' });
        }
      } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
      }

      return res.status(500).json({ statusCode: 500, message: 'invalid request' });
    }
    return res.status(500).json({ statusCode: 500, message: 'invalid request' });
  }
});

export default handler;
