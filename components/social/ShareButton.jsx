import React from 'react';
import Button from 'react-bootstrap/Button';
import Icons from '../icons';

const ShareButton = ({ url, platform, size, variant }) => {
  const shareUrl = 'https://app.fundoss.org' + url;
  const platforms = {
    'twitter':{
      text:'Twitter',
      icon:Icons.Twitter,
      url: (url) => ('https://twitter.com/share?url=' + url + '&hashtags=FundOss')
    },
    'facebook':{
      text:'Facebook',
      icon:Icons.Facebook,
      url: (url) => ('https://www.facebook.com/sharer/sharer.php?u=' + url + '&hashtag=FundOss')
    },
    'email':{
      text:'Email',
      icon:Icons.Email,
      url: (url) => ('mailto:?subject=&body=' + url)
    }
  }
  const Sharer = platforms[platform || 'twitter']
  return (
  <Button target="_blank" href={Sharer.url(shareUrl)} variant={variant ? variant : 'primary'} size={size || 'md'}>
    <Sharer.icon size={22} />
    &nbsp;{Sharer.text}
  </Button>
)};

export default ShareButton;

