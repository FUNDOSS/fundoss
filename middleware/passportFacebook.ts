import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from './passport';
import Users from '../lib/user/usersController';
import { IUser, IUserInput } from '../lib/user/userModel';

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENTID,
  clientSecret: process.env.FACEBOOK_CLIENTSECRET,
  callbackURL: `${process.env.HOSTING_URL}/api/auth/callback/facebook/`,
  profileFields: ['id', 'displayName', 'picture', 'email'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser:IUser = await Users.findByOauthId(profile.id, 'facebook');
    console.log(profile);
    if (existingUser?._id) {
      done(null, existingUser);
    } else if (profile._json.email) {
      const userFromEmail:IUser = await Users.findByEmail(profile._json.email);
      if (userFromEmail?._id) {
        Users.update({ _id: userFromEmail._id, facebookid: profile.id, facebookUser: profile });
        done(null, userFromEmail);
      } else {
        const userInput:IUserInput = {
          name: profile.displayName,
          avatar: profile._json.picture?.data?.url,
          facebookid: profile.id,
          facebookUser: profile,
          email: profile._json.email,
          role: 'user',
        };
        const user = await Users.insert(userInput);
        done(null, user);
      }
    } else {
      const userInput:IUserInput = {
        name: profile.displayName,
        avatar: profile._json.picture?.data?.url,
        facebookid: profile.id,
        facebookUser: profile,
        email: profile._json.email,
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
