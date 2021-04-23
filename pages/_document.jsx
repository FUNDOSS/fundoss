import React from 'react';
import Document, { Html, Main, NextScript } from 'next/document';
import CriticalCssHead from '../components/criticalCssHead';

class ExtendedNextDocument extends Document {
  render() {
    return (
      <Html>
        <CriticalCssHead />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default ExtendedNextDocument;
