import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import serializable from '../../../lib/serializable';
import Error from '../../../components/Error';
import Layout from '../../../components/layout';
import middleware from '../../../middleware/all';
import ServerProps from '../../../lib/serverProps';
import FundingSessionController from '../../../lib/fundingSession/fundingSessionController';
import DashboardNav from '../../../components/dashboard/DashboardNav';
import FundingSessionCard from '../../../components/fundingSession/FundingSessionCard';

const CreateSessionPage = ({ state, sessions }) => {
  if (!state.user?._id) {
    return <Error statusCode={401} />;
  }
  if (state.user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" state={state}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <Button variant="link">
          <Link href="/dashboard/funding-session/create">Create a new sesion</Link>
        </Button>
        <Row>
          { sessions.map((session) => (
            <Col md={{ span: 6 }} style={{marginBottom: '20px'}} key={session._id}>
              <FundingSessionCard session={session} predicted={state.current?.predicted} />
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const sessions = serializable(await FundingSessionController.getAll());
  return { props: { state, sessions } };
}

export default CreateSessionPage;
