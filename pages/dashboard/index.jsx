import React from 'react';
import { withRouter } from 'next/router';
import Error from 'next/error';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Layout from '../../components/layout';
import FundingSessionsList from '../../components/fundingSession/FundungSessionList';
import DashboardNav from '../../components/dashboard/DashboardNav';
import PaymentsTable from '../../components/payment/PaymentsTable';
import FundingSessions from '../../lib/fundingSession/fundingSessionController';
import Payments from '../../lib/payment/paymentController';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';

const DashboardPage = ({ user, sessions, payments }) => {
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" user={user} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
 
        <p style={{ marginTop: '30px' }}>Hi {user.name || user.username}        <Button href="dashboard/funding-session/create" variant="link">Create a new sesion</Button></p>
        <FundingSessionsList sessions={sessions} />
        <br />
        <h4>Latest Payments</h4>
        <PaymentsTable payments={payments} />
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const sessions = await FundingSessions.getAll();
  const payments = await Payments.get();
  return {
    props: {
      user: serializable(req.user),
      sessions: serializable(sessions),
      payments: serializable(payments),
    },
  };
}

export default withRouter(DashboardPage);
