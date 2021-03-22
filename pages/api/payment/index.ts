import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import Payment from '../../../lib/payment/paymentController';
import { all } from '../../../middleware/index';

const handler = nextConnect();

handler.use(all);

handler.get(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden ');
  }
  const payments = await Payment.get();
  return res.status(200).json(payments);
});

export default handler;
