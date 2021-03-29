import React from 'react';
import Container from 'react-bootstrap/Container';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Calculator from '../components/qf/calculator';
import { Card } from 'react-bootstrap';

const QFPage = ({ user }) => {
  
  return (
  <Layout title="FundOSS | WTF is Quadratic Funding ?" user={user}>
    <Container className="content">
      <h1 className="display-2">WTF is Democratic Funding ?</h1>
      <Card  style={{maxWidth:'650px'}}><Card.Body><Calculator /></Card.Body></Card>
    </Container>
  </Layout>
)};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  return { props: { user: serializable(req.user) } };
}

export default QFPage;
