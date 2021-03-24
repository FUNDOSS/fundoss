import React from 'react';
import Button from 'react-bootstrap/Button';
import Icons from '../icons';

const GithubLoginButton = ({ redirect, variant, size }) => (
  <Button variant={variant || 'primary'} size={size || 'md'} href={`/api/auth/github${redirect ? `?redirect=${redirect}` : ''}`}>
    <Icons.Github size={{ sm: 18, lg: 25, md: 20 }[size]} />
    &nbsp;Sign in with GitHub
  </Button>
);

export default GithubLoginButton;
