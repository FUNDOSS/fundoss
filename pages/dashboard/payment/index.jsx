import React from 'react';
import Error from 'next/error';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Layout from '../../../components/layout';
import Payments from '../../../lib/payment/paymentController';
import PaymentsTable from '../../../components/payment/PaymentsTable';
import middleware from '../../../middleware/all';
import serializable from '../../../lib/serializable';

const PaymentsPage = ({ user, payments }) => {
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" user={user} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }} >
        <h1>Payments</h1>
        <PaymentsTable payments={payments} />
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const payments = await Payments.get();
  return { props: { user: serializable(req.user), payments: serializable(payments), } };
}

export default PaymentsPage;
