import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import database from '../../../middleware/database';
import appConfig from '../../../lib/appConfig';
import session from '../../../middleware/session';
import passport from '../../../middleware/passportGithub';

const handler = nextConnect();
handler.use(database).use(session).use(passport.initialize()).use(passport.session());

handler.get((req: any, res: NextApiResponse) => {
  const { provider, redirect } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }
  const state = Buffer.from(redirect || req.headers.referer, 'ascii').toString('base64');
  return passport.authenticate(
    provider,
    { scope: appConfig.github.scope, state },
  )(req, res);
});

export default handler;
