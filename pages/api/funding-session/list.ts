import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import FundingSessions from '../../../lib/fundingSession/fundingSessionController';
import { all } from '../../../middleware/index';

const handler = nextConnect();

handler.use(all);

handler.get(async (req:any, res:NextApiResponse) => {
  const sessions = await FundingSessions.getAll();
  return res.status(200).json(sessions);
});

export default handler;
