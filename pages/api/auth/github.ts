import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import appConfig from '../../../lib/appConfig';
import session from '../../../middleware/session';
import passport from '../../../middleware/passportGithub';

const handler = nextConnect();
handler.use(session).use(passport.initialize()).use(passport.session());

handler.get((req: any, res: NextApiResponse) => {
  const { redirect } = req.query;
  const state = redirect || Buffer.from(req.headers.referer || '/').toString('base64');
  return passport.authenticate(
    'github',
    { scope: appConfig.github.scope, state },
  )(req, res);
});

export default handler;
