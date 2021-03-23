import React from 'react';
import { withRouter } from 'next/router';
import Error from 'next/error';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Layout from '../../../components/layout';
import FundingSessionForm from '../../../components/fundingSession/FundingSessionForm';
import middleware from '../../../middleware/all';
import serializable from '../../../lib/serializable';
import FundingSessions from '../../../lib/fundingSession/fundingSessionController';

const EditSessionPage = ({ user, session }) => {
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" user={user}>
      <Container style={{ paddingTop: '40px' }}>
        <h1>Edit Session</h1>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
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
  return { props: { user: serializable(req.user), session: serializable(session) } };
}

export default withRouter(EditSessionPage);
