import React from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Icons from '../icons';

const ShareButton = ({
  url = null, platform, size, variant, mini = false, siteUrl,
}) => {
  const shareUrl = `${siteUrl}${url || useRouter().asPath}`;
  const platforms = {
    twitter: {
      text: 'Twitter',
      icon: Icons.Twitter,
      url: (url) => (`https://twitter.com/share?text=I just backed these OSS projects on @_FundOSS!&url=${url}&hashtags=FundOss`),
    },
    facebook: {
      text: 'Facebook',
      icon: Icons.Facebook,
      url: (url) => (`https://www.facebook.com/sharer/sharer.php?u=${url}&hashtag=FundOss`),
    },
    email: {
      text: 'Email',
      icon: Icons.Email,
      url: (url) => (`mailto:?subject=${encodeURIComponent('FundOSS democtratic funding for open source projects')}&body=I just backed these OSS projects on FundOSS.org! ${encodeURIComponent(url)}`),
    },
  };
  const Sharer = platforms[platform || 'twitter'];
  return (
    <Button target="_blank" href={Sharer.url(shareUrl)} variant={variant || 'primary'} size={size || 'md'}>
      <Sharer.icon size={18} />
      { !mini ? <span>&nbsp;{Sharer.text}</span> : null}
    </Button>
  );
};

export default ShareButton;
