import React from 'react';
import Container from 'react-bootstrap/Container';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';

const QFPage = ({ user }) => (
  <Layout title="FundOSS | WTF is Quadratic Funding ?" user={user}>
    <Container className="content">
      <h1 className="display-2">WTF is Quadratic Funding ?</h1>
    </Container>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  return { props: { user: serializable(req.user) } };
}

export default QFPage;
