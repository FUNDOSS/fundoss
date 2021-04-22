import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';

const InlineStyle = ({ assetPrefix, file, nonce }) => {
  const cssPath = join(process.cwd(), '.next', file);
  const cssSource = readFileSync(cssPath, 'utf-8');
  const html = { __html: cssSource };
  const id = `${assetPrefix}/_next/${file}`;
  return <style dangerouslySetInnerHTML={html} data-href={id} nonce={nonce} />;
};

export default InlineStyle;
