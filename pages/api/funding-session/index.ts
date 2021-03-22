import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { IFundingSessionInput } from '../../../lib/fundingSession/fundingSessionModel';
import FundingSessions from '../../../lib/fundingSession/fundingSessionController';
import { all } from '../../../middleware/index';

const handler = nextConnect();

handler.use(all);

handler.get(async (req: any, res: NextApiResponse) => {
  const currentSession: IFundingSessionInput = await FundingSessions.getCurrent();
  return res.status(200).json(currentSession);
});

handler.post(async (req: any, res: NextApiResponse) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden ');
  }
  if (req.body._id) {
    const session = await FundingSessions.edit(req.body)
      .catch((e) => {
        console.error(e);
        return res.status(500).json(e);
      });
    return res.status(200).json({ session });
  }
  const session = await FundingSessions.insert(req.body)
    .catch((e) => {
      console.error(e);
      return res.status(500).json(e);
    });
  return res.status(200).json({ session });
});

export default handler;
