import nc from 'next-connect';
import passport from './passportGithub';
import session from './session';
import Users from '../lib/user/usersController';

async function passportfix(req, res, next) {
  if (req.session.user) {
    req.session.passport = req.session.user;
  }
  if (!req.user) {
    const user = await Users.findById(req.session?.user?.user);
    req.user = user;
  }
  next();
}

const all = nc();

all.use(session).use(passport.initialize()).use(passport.session()).use(passportfix);

export default all;
