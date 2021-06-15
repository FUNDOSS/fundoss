import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import Payments from '../../../lib/payment/paymentController';
import Payment from '../../../lib/payment/paymentModel';
import { all } from '../../../middleware/index';
import calculateSybilAttackScore from '../../../lib/payment/sybilAttackScore';

const handler = nextConnect();

handler.use(all);

handler.get(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden ');
  }
  const payments = await Payment.find({ status: 'succeeded' });
  const scores = await payments.map(async (pay) => {
    if (pay.cardFingerprint && pay.browserFingerprint) {
      const score = await calculateSybilAttackScore(pay);
      await Payments.update({ _id: pay._id, sybilAttackScore: score });
    }
    return { _id: pay._id };
  });
  return res.status(200).json(scores);
});

export default handler;
