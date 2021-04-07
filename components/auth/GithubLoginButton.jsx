import React from 'react';
import Button from 'react-bootstrap/Button';
import Icons from '../icons';

const GithubLoginButton = ({
  redirect, variant = 'outline-primary', size = 'md', minify, text = 'Sign in with GitHub', block,
}) => (
  <Button
    block={block}
    variant={variant || 'primary'}
    size={size || 'md'}
    href={`/api/auth/github${redirect ? `?redirect=${redirect}` : ''}`}
  >
    <Icons.Github size={{ sm: 18, lg: 25, md: 20 }[size]} />
    <span className={minify ? 'd-none d-md-inline' : ''}>&nbsp;{text}</span>
  </Button>
);

export default GithubLoginButton;
