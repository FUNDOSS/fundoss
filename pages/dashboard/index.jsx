import React from 'react';
import { withRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import Error from '../../components/Error';
import Layout from '../../components/layout';
import FundingSessionsList from '../../components/fundingSession/FundungSessionList';
import DashboardNav from '../../components/dashboard/DashboardNav';
import PaymentsTable from '../../components/payment/PaymentsTable';
import Payments from '../../lib/payment/paymentController';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import ServerProps from '../../lib/serverProps';

const DashboardPage = ({
  state, payments, finished,
}) => {
  if (!state.user._id) {
    return <Error statusCode={401} />;
  }
  if (state.user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }
  const sessions = [];
  if (state.upcoming._id) sessions.push(state.upcoming);
  if (state.current) sessions.push(state.current);
  if (finished?._id !== state.current?._id) sessions.push(finished);
  return (
    <Layout title="FundOSS | Dashboard" state={state} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
 
        <p style={{ marginTop: '30px' }}>Hi {state.user.name || state.user.username}   
          <Button variant="link">
            <Link href="dashboard/funding-session/create">Create a new sesion</Link>
          </Button>
        </p>
        {sessions.length ? (
          <FundingSessionsList 
            sessions={sessions}
            predicted={state.current?.predicted}
          />
        ) : 'No sessions yet. Create a session to start.'}
        <br />
        <h4>Latest Payments</h4>
        <PaymentsTable payments={payments} />
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const payments = await Payments.get({ status: 'succeeded' }, 0, 20);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const finished = await ServerProps.getFinished();
  return {
    props: {
      state,
      payments: serializable(payments),
      finished,
    },
  };
}

export default withRouter(DashboardPage);
