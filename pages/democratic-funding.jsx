import React from 'react';
import Container from 'react-bootstrap/Container';
import { Card } from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';
import Calculator from '../components/qf/calculator';

const QFPage = ({ state }) => (
  <Layout title="FundOSS | What is democratic Funding ?" state={state}>
    <Container className="content">
      <h1 className="display-2">WTF is Democratic Funding ?</h1>
      <Card style={{ maxWidth: '650px' }}><Card.Body><Calculator /></Card.Body></Card>
    </Container>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return { props: { state } };
}

export default QFPage;
