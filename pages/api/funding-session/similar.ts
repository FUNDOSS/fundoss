import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../middleware/index';
import Collectives from '../../../lib/collectives/CollectivesController';
import Session from '../../../lib/fundingSession/fundingSessionController';

const handler = nextConnect();

handler.use(all);

handler.get(async (req: any, res: NextApiResponse) => {
  if (req.query.collectives) {
    const sessionId = await Session.getCurrentId();
    const collectives = await Collectives.similar(sessionId, req.query.collectives.split(','));
    console.log('req', sessionId, collectives);
    return res.status(200).json(collectives);
  }
  return res.status(500).json({ statusCode: 500, message: 'no collectives sent' });
});

export default handler;
