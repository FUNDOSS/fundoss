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
import middleware from '../../../../middleware/all';
import serializable from '../../../../lib/serializable';
import FundingSessions, { getPredictedAverages } from '../../../../lib/fundingSession/fundingSessionController';
import Payments from '../../../../lib/payment/paymentController';
import DisbursmentsTable from '../../../../components/fundingSession/DisbursmentTable';
import FundingSessionInfo from '../../../../components/fundingSession/FundingSessionInfo';

const EditSessionPage = ({
  user, session, donations, predicted, 
}) => {
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }
  return (
    <Layout title="FundOSS | Dashboard" user={user} session={session} predicted={predicted}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <div className="text-center">
          <h1>Disbursments {session.name}</h1>
          <FundingSessionInfo session={session} predicted={predicted} />
          Predicted {Math.round(predicted.average)} {Math.round(predicted.match)}
        </div>

        <br />
        <Button variant="outline-primary" href={`/dashboard/funding-session/${session.slug}/edit`}>edit</Button>&nbsp;
        <Button variant="outline-primary" className="pull-right" href={`/session/${session.slug}`}>View Session</Button>
        <Button variant="outline-secondary" href={`/api/payment/?session=${session._id}`}>disbursments csv</Button> 
        <hr />
        <Row>
          <Col md={{ offset: 3, span: 6 }}>
            <DisbursmentsTable donations={donations} session={session} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res, query }) {
  await middleware.run(req, res);
  const session = await FundingSessions.getBySlug(query.slug);
  const donations = await Payments.getDonationsBySession(session._id);
  return {
    props: { 
      predicted: serializable(getPredictedAverages(session)),
      user: serializable(req.user), 
      session: serializable(session), 
      donations: serializable(donations), 
    }, 
  };
}

export default withRouter(EditSessionPage);
