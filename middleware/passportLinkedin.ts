import { Strategy as LinkedinStrategy } from 'passport-linkedin-oauth2';
import axios from 'axios';
import passport from './passport';
import Users from '../lib/user/usersController';
import { IUser, IUserInput } from '../lib/user/userModel';

passport.use(new LinkedinStrategy({
  clientID: process.env.LINKEDIN_CLIENTID,
  clientSecret: process.env.LINKEDIN_CLIENTSECRET,
  callbackURL: `${process.env.HOSTING_URL}/api/auth/callback/linkedin/`,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser:IUser = await Users.findByOauthId(profile.id, 'linkedin');
    if (existingUser?._id) {
      done(null, existingUser);
    } else {
      const me = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const email = me.data.elements[0]['handle~'].emailAddress;
      const avatar = profile.photos[1] ? profile.photos[1].value : null;
      const userInput:IUserInput = {
        name: profile.displayName,
        avatar,
        linkedinid: profile.id,
        linkedinUser: profile._json,
        role: 'user',
        email,
      };
      if (email) {
        const userFromEmail:IUser = await Users.findByEmail(email);
        if (userFromEmail?._id) {
          Users.update({
            _id: userFromEmail._id,
            linkedinid: profile.id,
            linkedinUser: profile._json,
          });
          done(null, userFromEmail);
        } else {
          const user = await Users.insert(userInput);
          done(null, user);
        }
      } else {
        const user = await Users.insert(userInput);
        done(null, user);
      }
    }
  } catch (e) {
    done(e);
  }
}));

export default passport;
