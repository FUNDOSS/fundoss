import nc from 'next-connect';
import passport from './passport';
import session from './session';

const all = nc();

all.use(session).use(passport.initialize()).use(passport.session());

export default all;
