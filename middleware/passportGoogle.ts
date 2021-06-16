import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from './passport';
import Users from '../lib/user/usersController';
import { IUser, IUserInput } from '../lib/user/userModel';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_CLIENTSECRET,
  callbackURL: `${process.env.HOSTING_URL}/api/auth/callback/google/`,
  passReqToCallback: true,
},
async (request, accessToken, refreshToken, profile, done) => {
  try {
    const existingUser:IUser = await Users.findByOauthId(profile.id, 'google');
    if (existingUser?._id) {
      done(null, existingUser);
    } else if (profile.email && profile.email_verified) {
      const userFromEmail:IUser = await Users.findByEmail(profile.email);
      if (userFromEmail?._id) {
        Users.update({ _id: userFromEmail._id, googleid: profile.id, googleUser: profile });
        done(null, userFromEmail);
      } else {
        const userInput:IUserInput = {
          name: profile.displayName,
          avatar: profile.picture,
          googleid: profile.id,
          googleUser: profile,
          email: profile.email,
          role: 'user',
        };
        const user = await Users.insert(userInput);
        done(null, user);
      }
    } else {
      const userInput:IUserInput = {
        name: profile.displayName,
        avatar: profile.picture,
        googleid: profile.id,
        googleUser: profile,
        email: profile.email,
        role: 'user',
      };
      const user = await Users.insert(userInput);
      done(null, user);
    }
  } catch (e) {
    done(e);
  }
}));

export default passport;
