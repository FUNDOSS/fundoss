import React from 'react';

import '../styles/global.scss';

export default function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}
