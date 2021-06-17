import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import Stripe from 'stripe';
import Payments from '../../../lib/payment/paymentController';
import Payment from '../../../lib/payment/paymentModel';
import { all } from '../../../middleware/index';
import calculateSybilAttackScore from '../../../lib/payment/sybilAttackScore';
import donationModel from '../../../lib/payment/donationModel';
import Collectives from '../../../lib/collectives/CollectivesController';
import FundingSessionController from '../../../lib/fundingSession/fundingSessionController';

const handler = nextConnect();

handler.use(all);

handler.get(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden ');
  }
  const { id } = req.query;
  if (id) {
    const payment = await Payment.findById(id);
    if (payment?._id) {
      const stripe = await new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
      });
      const intent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(
        payment.intentId, {
          expand:
          [
            'charges.data.balance_transaction',
            'payment_method',
          ],
        },
      );
      res.status(200).json(intent);
    }
    return res.status(500).json({ statusCode: 500, message: 'no payment found' });
  }
  return res.status(500).json({ statusCode: 500, message: 'invalid request' });
});

handler.post(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden ');
  }
  const { confirm, id } = req.body;
  if (id) {
    const payment = await Payment.findById(id);
    if (payment?._id) {
      const stripe = await new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
      });
      const intent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(
        payment.intentId, {
          expand:
          [
            'charges.data.balance_transaction',
            'payment_method',
          ],
        },
      );

      if (payment.status !== intent.status && intent.status === 'succeeded' && confirm) {
        const paymentUpdates: any = {};
        const fee = intent.charges.data
          .reduce((acc, charge) => acc + (charge.balance_transaction.fee / 100), 0);
        const donations = await Promise.all(Object.keys(intent.metadata)
          .filter((k) => ['user', 'githubHandle', 'githubId', 'session'].indexOf(k) === -1)
          .map((k) => ({
            collective: k,
            amount: Number(intent.metadata[k]),
            fee: Math.ceil((intent.metadata[k] / payment.amount) * fee * 100) / 100,
            session: payment.session,
            user: payment.user,
            payment: payment._id,
          })).map(async (d) => {
            const collectiveId = await Collectives.getIdBySlug(d.collective);
            const donation = await donationModel.create(
              { ...d, ...{ collective: collectiveId } },
            );
            await Collectives.updateTotals([collectiveId], payment.session);
            return donation._id;
          }));
        paymentUpdates.status = intent.status;
        paymentUpdates.donations = donations;
        paymentUpdates.fee = fee;
        paymentUpdates.confirmation = intent;
        paymentUpdates.stripeRisk = intent.charges.data[0].outcome.risk_score;
        await FundingSessionController.updateSessionTotals(payment.session);
        const payUpdate = await Payment.updateOne({ _id: payment._id }, paymentUpdates);

        console.log('create donations', fee, donations, payUpdate);
      }
      return res.status(200).json(intent);
    }
    return res.status(500).json({ statusCode: 500, message: 'no payment found' });
  }
  return res.status(500).json({ statusCode: 500, message: 'invalid request' });
});

export default handler;
