import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../../middleware/index';
import passport from '../../../../middleware/passportLinkedin';

const handler = nextConnect();

handler.use(all);

handler.get((req: any, res: NextApiResponse) => {
  const { state } = req.query;
  const redirect = Buffer.from(state as string, 'base64').toString();

  return passport.authenticate('linkedin', {
    failureRedirect: '/',
  })(req, res, () => {
    req.session.user = { user: req.user?._id };
    return res.redirect(redirect);
  });
});

export default handler;
