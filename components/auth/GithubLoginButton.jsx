import React from 'react';
import Button from 'react-bootstrap/Button';
import Icons from '../icons';

const GithubLoginButton = ({ redirect }) => (
  <Button variant="primary" href={`/api/auth/github${redirect ? `?redirect=${redirect}` : ''}`}>
    <Icons.Github size={22} />
    &nbsp;Sign in with GitHub
  </Button>
);

export default GithubLoginButton;
