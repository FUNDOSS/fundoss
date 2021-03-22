import { Strategy as GithubStrategy } from 'passport-github';
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
    const userInput:IUserInput = {
      email: githubProfile.emails?.[0].value,
      name: githubProfile.displayName,
      username: githubProfile.username,
      avatar: githubProfile.photos?.[0].value,
      githubid: githubProfile.id,
      githubaccestoken: accessToken,
      githubrefreshtoken: refreshToken,
      role: process.env.ADMINS.split(',').indexOf(githubProfile.username) !== -1 ? 'admin' : 'user',
    };

    const existingUser:IUser = await Users.findByGithubId(githubProfile.id);
    if (existingUser) {
      userInput._id = existingUser._id;
      await Users.update(userInput);
      cb(null, userInput);
    } else {
      const user = await Users.insert(userInput);
      cb(null, user);
    }
  },
));

export default passport;
