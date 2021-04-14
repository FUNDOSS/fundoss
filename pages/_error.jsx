import React from 'react';
import Error from '../components/Error';

const ErrorPage = ({ statusCode }) => <Error statusCode={statusCode} />;

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err;
  return { statusCode };
};

export default ErrorPage;
