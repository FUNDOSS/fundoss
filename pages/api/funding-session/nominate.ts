import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import FundingSessions from '../../../lib/fundingSession/fundingSessionController';
import { all } from '../../../middleware/index';

const handler = nextConnect();

handler.use(all);

handler.post(async (req: any, res: NextApiResponse) => {
  if (req.body.url) {
    const matches = req.body.url.match(/^https?:\/\/(www\.)?opencollective\.com\/([^\/]+)(\/\w+)*$/);
    const collective = await FundingSessions.nominate(req.body.sessionId, matches[2]);
    return res.status(200).json(collective);
  }
});

export default handler;
