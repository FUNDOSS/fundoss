import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../../middleware/index';
import passport from '../../../../middleware/passportGoogle';

const handler = nextConnect();

handler.use(all);

handler.get((req: any, res: NextApiResponse) => {
  const { state } = req.query;
  const redirect = Buffer.from(state as string, 'base64').toString();
  console.log('resp cb', redirect);

  return passport.authenticate('google', {
    failureRedirect: '/',
  })(req, res, () => {
    console.log('resp next', redirect);
    req.session.user = { user: req.user._id };
    return res.redirect(redirect);
  });
});

export default handler;
