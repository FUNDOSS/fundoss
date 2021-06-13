import React from 'react';

import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import ServerProps from '../../../../lib/serverProps';
import Error from '../../../../components/Error';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import Layout from '../../../../components/layout';
import middleware from '../../../../middleware/all';
import serializable from '../../../../lib/serializable';
import FundingSessions, { getPredictedAverages } from '../../../../lib/fundingSession/fundingSessionController';
import Payments from '../../../../lib/payment/paymentController';
import DisbursmentsTable from '../../../../components/fundingSession/DisbursmentTable';
import FundingSessionInfo from '../../../../components/fundingSession/FundingSessionInfo';
import Prediction from '../../../../components/fundingSession/Prediction';
import AdminLinks from '../../../../components/fundingSession/AdminLinks';

const DisbursmentsTablePage = ({
  state, session, donations,
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
        <div className="text-center">
          <h1>Disbursments</h1>
          <FundingSessionInfo session={session} predicted={state.current?.predicted} />

        </div>

        <br />
        <AdminLinks session={session} all />
        <hr />
        <Button href={`/api/payment?session=${session._id}`}>↓ Download csv</Button>
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
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const donations = await Payments.getDonationsBySession(session._id);
  return {
    props: { 
      state, 
      session: { ...serializable(session), ...{ predicted: getPredictedAverages(session) } }, 
      donations: serializable(donations), 
    }, 
  };
}
export default DisbursmentsTablePage;
