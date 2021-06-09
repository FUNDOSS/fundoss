import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { all } from '../../../middleware/index';
import Payments from '../../../lib/payment/paymentController';
import donationModel from '../../../lib/payment/donationModel';
import Collectives from '../../../lib/collectives/CollectivesController';
import FundingSessionController from '../../../lib/fundingSession/fundingSessionController';

const handler = nextConnect();

handler.use(all);

handler.post(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden ');
  }
  if (req.body.payment) {
    const payment = await Payments.findById(req.body.payment);
    const stripe = await new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
    /*
    const refund = await stripe.refunds.create({
      payment_intent: payment.intentId,
    });*/
    const up = await Payments.update({ _id: payment._id, status: 'cancelled' });
    const donationsIds = payment.donations.map((d) => mongoose.Types.ObjectId(d._id));
    console.log(donationsIds)
    const donup = await donationModel.updateMany(
      { _id: { $in: donationsIds } },
      { cancelled: true },
    );
    console.log(donup)
    const collectiveIds = payment.donations.map((d) => d.collective._id);
    console.log(collectiveIds);
    const totals = await Collectives.updateTotals(collectiveIds, payment.session._id);
    FundingSessionController.updateSessionTotals(payment.session._id);
    return res.status(200).json({ up, donup, donationsIds });
  }
});

export default handler;
