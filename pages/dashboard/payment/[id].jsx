import React from 'react';
import Error from 'next/error';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DashboardNav from '../../../components/dashboard/DashboardNav';
import Layout from '../../../components/layout';
import Payments from '../../../lib/payment/paymentController';
import PaymentsTable from '../../../components/payment/PaymentsTable';
import middleware from '../../../middleware/all';
import serializable from '../../../lib/serializable';
// import { formatAmountForDisplay } from '../../../utils/currency';
const PaymentsPage = ({ user, payment }) => {
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" user={user} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <h1>Payments</h1>
        <PaymentsTable payments={[payment]} />
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const payment = await Payments.findById(query.id);
  return { props: { user: serializable(req.user), payment: serializable(payment) } };
}

export default PaymentsPage;
