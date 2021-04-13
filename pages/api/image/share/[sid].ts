import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';
import Collectives from '../../../../lib/collectives/CollectivesController';
import Images from '../../../../lib/images';
import { all } from '../../../../middleware/index';
import Payments from '../../../../lib/payment/paymentController';

const handler = nextConnect();
handler.use(all);

handler.get(async (req: any, res: any) => {
  const payment = await Payments.getShared(req.query.sid);
  console.log(payment)
  const file = path.resolve('./public/static/share', `${payment.sid}.jpg`);
  const imgUrl = `/static/share/${payment.sid}.jpg`;
  if (fs.existsSync(file)) {
    await Images.create('payment', payment);
    Payments.update({ _id: payment._id, shareImage: imgUrl });
  }
  const stream = fs.createReadStream(file);
  return stream.pipe(res);
});

export default handler;
