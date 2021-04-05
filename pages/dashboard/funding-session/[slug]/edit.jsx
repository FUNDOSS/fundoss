import React from 'react';
import { withRouter } from 'next/router';
import Error from 'next/error';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import Layout from '../../../../components/layout';
import FundingSessionForm from '../../../../components/fundingSession/FundingSessionForm';
import middleware from '../../../../middleware/all';
import serializable from '../../../../lib/serializable';
import FundingSessions, { getPredictedAverages } from '../../../../lib/fundingSession/fundingSessionController';
import FundingSessionInfo from '../../../../components/fundingSession/FundingSessionInfo';

const EditSessionPage = ({
  user, session, predicted, 
}) => {
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }
  return (
    <Layout title="FundOSS | Dashboard" user={user} session={session} predicted={predicted} >
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <h1>Edit {session.name}</h1>
        <FundingSessionInfo session={session} predicted={predicted} />
        Predicted {Math.round(predicted.average)} {Math.round(predicted.match)}
        <br />
        <Button variant="outline-primary" className="pull-right" href={`/session/${session.slug}`}>View Session</Button>
        <Button variant="outline-secondary" href={`/dashboard/funding-session/${session.slug}/table`}>disbursments</Button> 

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
  return {
    props: { 
      predicted: serializable(getPredictedAverages(session)),
      user: serializable(req.user), 
      session: serializable(session), 
    }, 
  };
}

export default withRouter(EditSessionPage);
