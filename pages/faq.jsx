import React from 'react';
import Container from 'react-bootstrap/Container';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';

const FaqPage = ({ state }) => (
  <Layout title="FundOSS | Frequently asked questions" state={state}>
    <Container className="content">
      <h1 className="display-2">FAQ</h1>
    </Container>
  </Layout>

);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return { props: { state } };
}

export default FaqPage;
