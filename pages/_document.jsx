import React from 'react';
import Document, { Main, NextScript } from 'next/document';
import CriticalCssHead from '../components/criticalCssHead';

class ExtendedNextDocument extends Document {
  render() {
    return (
      <html>
        <CriticalCssHead />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default ExtendedNextDocument;
