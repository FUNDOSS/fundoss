import React from 'react';

import '../styles/global.scss';

export default function MyApp({ Component, pageProps }) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...pageProps} />
  );
}
