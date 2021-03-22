import nextConnect from 'next-connect';
import { NextApiResponse, NextApiRequest } from 'next';
import database from '../../../../middleware/database';
import session from '../../../../middleware/session';
import passport from '../../../../middleware/passportGithub';

const handler = nextConnect();
handler.use(database).use(session).use(passport.initialize()).use(passport.session());

handler.get((req: NextApiRequest, res: NextApiResponse) => {
  const { provider, state } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }

  const redirect = Buffer.from( state as string , 'base64').toString();
  return passport.authenticate(provider, {
    failureRedirect: '/',
    successRedirect: redirect,
  })(req, res, () => {
    res.status(200).json({ success: true });
    return true;
  });
});

export default handler;
