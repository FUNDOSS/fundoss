import { Strategy as GithubStrategy } from 'passport-github';
import appConfig from '../appConfig';
import Users from '../../lib/user/usersController';

const strategy = new GithubStrategy(
  appConfig.github,
  async (accessToken, refreshToken, githubProfile:any, cb) => {
    console.log(accessToken, refreshToken, githubProfile);
    const existingUser = await Users.findByGithubId(githubProfile.id);
    if (existingUser) {
      console.log('user found', existingUser);
      cb(null, existingUser);
    } else {
      const user = await Users.insert({
        email: githubProfile.emails?.[0].value,
        name: githubProfile.displayName,
        username: githubProfile.username,
        avatar: githubProfile.photos?.[0].value,
        githubid: githubProfile.id,
      });
      console.log('create new user', user);
      cb(null, user);
    }
  },
);

export default strategy;
