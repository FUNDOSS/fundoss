import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Image } from 'react-bootstrap';
import ServerProps from '../../../../lib/serverProps';
import Error from '../../../../components/Error';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import Layout from '../../../../components/layout';
import middleware from '../../../../middleware/all';
import serializable from '../../../../lib/serializable';
import FundingSessions from '../../../../lib/fundingSession/fundingSessionController';
import FundingSessionInfo from '../../../../components/fundingSession/FundingSessionInfo';
import AdminLinks from '../../../../components/fundingSession/AdminLinks';

const RegenImages = ({
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
        <div className="text-center">
          <h1>Disbursments</h1>
          <FundingSessionInfo session={session} predicted={state.current?.predicted} />

        </div>

        <br />
        <AdminLinks session={session} all />
        <hr />
        <Row>
          <Col md={{ offset: 3, span: 6 }}>
            {session.collectives.map((col) => <Image fluid key={col.slug} src={`/api/image/collective/${col.slug}?generate=1`} />)}
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
      session: { ...serializable(session) }, 
    }, 
  };
}
export default RegenImages;
