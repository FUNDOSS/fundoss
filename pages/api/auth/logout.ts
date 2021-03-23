import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../middleware/index';

const handler = nextConnect();
handler.use(all);

handler.get((req: any, res: NextApiResponse) => {
  req.session.user = null;
  req.session.passport = null;
  req.logOut();
  res.redirect('/');
});

export default handler;
