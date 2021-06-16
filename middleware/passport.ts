import passport from 'passport';
import Users from '../lib/user/usersController';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((req, id, done) => {
  Users.findById(id).then((user) => done(null, user), (err) => done(err));
});

export default passport;
