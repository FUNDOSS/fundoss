import React from 'react';
import OAuthLoginButton from './OAuthLoginButton';

const LoginButtons = ({redirect, outline}) => (
  <div>
    <OAuthLoginButton provider="github" text="Sign in with Github" block redirect={redirect} outline={outline} />
    <OAuthLoginButton provider="google" text="Sign in with Google" block redirect={redirect} outline={outline} />
    <OAuthLoginButton provider="facebook" text="Sign in with Facebook" block redirect={redirect} outline={outline} />
  </div>
);

export default LoginButtons;
