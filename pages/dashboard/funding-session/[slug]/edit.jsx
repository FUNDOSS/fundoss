import React from 'react';
import { withRouter } from 'next/router';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import ServerProps from '../../../../lib/serverProps';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import Error from '../../../../components/Error';
import Layout from '../../../../components/layout';
import FundingSessionForm from '../../../../components/fundingSession/FundingSessionForm';
import middleware from '../../../../middleware/all';
import serializable from '../../../../lib/serializable';
import FundingSessions, { getPredictedAverages } from '../../../../lib/fundingSession/fundingSessionController';
import FundingSessionInfo from '../../../../components/fundingSession/FundingSessionInfo';
import Prediction from '../../../../components/fundingSession/Prediction';
import AdminLinks from '../../../../components/fundingSession/AdminLinks';

const EditSessionPage = ({
  state, session, 
}) => {
  if (!state.user._id) {
    return <Error statusCode={401} />;
  }
  if (state.user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }
  return (
    <Layout title="FundOSS | Dashboard" state={state}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <h1>Edit {session.name}</h1>
        <div className="text-center">
          <FundingSessionInfo session={session} />
          {moment(session.start) < moment() ? (
            <Prediction 
              predicted={session.predicted}
              session={session}
            />
          ) : null }
        </div>
        <br />
        <AdminLinks session={session} all/>
         
        <hr />
        <Row>
          <Col md={{ offset: 3, span: 6 }}>
            <FundingSessionForm sessionData={session} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res, query }) {
  await middleware.run(req, res);
  const session = await FundingSessions.getBySlug(query.slug);
  const state = await ServerProps.getAppState(req.user, req.session.cart);

  return {
    props: { 
      state, 
      session: { ...serializable(session), ...{ predicted: getPredictedAverages(session) } }, 
    }, 
  };
}

export default withRouter(EditSessionPage);
