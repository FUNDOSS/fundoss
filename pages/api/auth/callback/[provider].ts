import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import { all } from '../../../../middleware/index';
import passport from '../../../../middleware/passportGithub';

const handler = nextConnect();

handler.use(all);

handler.get((req: any, res: NextApiResponse) => {
  const { provider, state } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }

  const redirect = Buffer.from(state as string, 'base64').toString();
  return passport.authenticate(provider, {
    failureRedirect: '/',
  })(req, res, () => {
    req.session.user = { user: req.user._id };
    res.redirect(redirect);
  });
});

export default handler;
