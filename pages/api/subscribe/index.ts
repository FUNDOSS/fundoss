import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../middleware/index';
import Ghost from '../../../lib/ghost';

const handler = nextConnect();

handler.use(all);

handler.post(async (req: any, res: NextApiResponse) => {
  if (req.body.email) {
    const sub = await Ghost.subscribe(req.body);
    return res.status(200).json({ sub });
  }
  return res.status(500).json({ statusCode: 500, message: 'email not sent' });
});

export default handler;
