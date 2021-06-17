import React from 'react';
import Button from 'react-bootstrap/Button';
import Icons from '../icons';

const OAuthLoginButton = ({
  redirect, size = 'md', minify, text = 'Sign in with GitHub', block, provider = 'github', outline,
}) => (
  <Button
    block={block}
    variant={outline ? `outline-${provider}` : provider}
    className={minify ? null : 'btn-oauth'}
    size={size || 'md'}
    href={`/api/auth/${provider}${redirect ? `?redirect=${Buffer.from(redirect).toString('base64')}` : ''}`}
  >
    { provider === 'github' ? <Icons.Github size={{ sm: 18, lg: 25, md: 20 }[size]} /> : null }
    { provider === 'facebook' ? <Icons.Facebook size={{ sm: 18, lg: 25, md: 20 }[size]} /> : null }
    { provider === 'google' ? <Icons.Google size={{ sm: 18, lg: 25, md: 20 }[size]} /> : null }
    { provider === 'linkedin' ? <Icons.Linkedin size={{ sm: 18, lg: 25, md: 20 }[size]} /> : null }
    <span className={minify ? 'd-none d-md-inline' : ''}>&nbsp;{text}</span>
  </Button>
);

export default OAuthLoginButton;
