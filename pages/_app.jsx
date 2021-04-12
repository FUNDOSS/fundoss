import React from 'react';
import '../styles/global.scss';
import NextNprogress from 'nextjs-progressbar';

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <NextNprogress
        color="#6B37FF"
        startPosition={0.3}
        stopDelayMs={200}
        height="1"
        options={{ easing: 'ease', speed: 500, showSpinner: false }}
      />
      <Component {...pageProps} />
    </div>
    
  );
}
