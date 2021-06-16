import { Strategy as GithubStrategy } from 'passport-github';
import axios from 'axios';
import passport from './passport';
import appConfig from '../lib/appConfig';
import Users from '../lib/user/usersController';
import { IUser, IUserInput } from '../lib/user/userModel';

passport.use(new GithubStrategy(
  appConfig.github,
  async (accessToken, refreshToken, githubProfile: any, done) => {
    try {
      const existingUser:IUser = await Users.findByOauthId(githubProfile.id, 'github');
      if (existingUser?._id) {
        done(null, existingUser);
      } else {
        const userInput:IUserInput = {
          name: githubProfile.displayName,
          username: githubProfile.username,
          avatar: githubProfile.photos?.[0].value,
          githubid: githubProfile.id,
          role: process.env.ADMINS.split(',').indexOf(githubProfile.username) !== -1 ? 'admin' : 'user',
        };
        const emails = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        userInput.email = emails.data
          .filter((email) => email.primary)
          .map((email) => email.email).join();
        const userFromEmail:IUser = await Users.findByEmail(userInput.email);
        if (userFromEmail?._id) {
          Users.update({
            _id: userFromEmail._id,
            githubid: userInput.githubid,
            githubUser: githubProfile,
          });
          done(null, userFromEmail);
        } else {
          const user = await Users.insert(userInput);
          done(null, user);
        }
      }
    } catch (e) {
      done(e);
    }
  },
));

export default passport;
