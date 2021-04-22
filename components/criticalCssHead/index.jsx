import React from 'react';
import { Head } from 'next/document';
import InlineStyle from './InlineStyle';

class CriticalCssHead extends Head {
  getCssLinks({ allFiles }) {
    // eslint-disable-next-line no-underscore-dangle
    const { assetPrefix } = this.context._documentProps || { assetPrefix: '_ass' };
    const { nonce } = this.props;
    const isCss = (file) => /\.css$/.test(file);
    const renderCss = (file) => (
      <InlineStyle 
        key={file}
        file={file}
        nonce={nonce}
        assetPrefix={assetPrefix}
      />
    );
    return allFiles && allFiles.length > 0 ? allFiles.filter(isCss).map(renderCss) : null;
  }
}

export default CriticalCssHead;
