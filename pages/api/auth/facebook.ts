import nextConnect from 'next-connect';
import { NextApiResponse } from 'next';
import session from '../../../middleware/session';
import passport from '../../../middleware/passportFacebook';

const handler = nextConnect();
handler.use(session).use(passport.initialize()).use(passport.session());

handler.get((req: any, res: NextApiResponse) => {
  const { redirect } = req.query;
  const state = redirect || Buffer.from(req.headers.referer || '/').toString('base64');
  return passport.authenticate(
    'facebook',
    { scope: ['email'], state },
  )(req, res);
});

export default handler;
