import { Strategy as GithubStrategy } from 'passport-github';
import axios from 'axios';
import passport from 'passport';
import appConfig from '../lib/appConfig';
import Users from '../lib/user/usersController';
import { IUser, IUserInput } from '../lib/user/userModel';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((req, id, done) => {
  Users.findByGithubId(id).then((user) => done(null, user), (err) => done(err));
});

passport.use(new GithubStrategy(
  appConfig.github,
  async (accessToken, refreshToken, githubProfile: any, cb) => {
    console.log('github oauth', githubProfile.username);
    try {
      const existingUser:IUser = await Users.findByGithubId(githubProfile.id);
      if (existingUser?._id) {
        console.log('github login user', existingUser);
        cb(null, existingUser);
      } else {
        const userInput:IUserInput = {
          name: githubProfile.displayName,
          username: githubProfile.username,
          avatar: githubProfile.photos?.[0].value,
          githubid: githubProfile.id,
          githubaccestoken: accessToken,
          githubrefreshtoken: refreshToken,
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
        console.log('github create user', userInput);
        const user = await Users.insert(userInput);
        console.log('login', user);
        cb(null, user);
      }
    } catch (e) {
      console.log('github user error', e);
      cb(e);
    }
  },
));

export default passport;
