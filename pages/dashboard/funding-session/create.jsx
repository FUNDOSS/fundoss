import React from 'react';
import { withRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Error from '../../../components/Error';
import Layout from '../../../components/layout';
import FundingSessionForm from '../../../components/fundingSession/FundingSessionForm';
import middleware from '../../../middleware/all';
import serializable from '../../../lib/serializable';

const EditSessionPage = ({ user }) => {
  if (!user._id) {
    return <Error statusCode={401} />;
  }
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" user={user}>
      <Container style={{ paddingTop: '40px' }}>
        <h1>Create Session</h1>
        <Row>
          <Col md={{ offset: 2, span: 8 }}>
            <FundingSessionForm />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  return { props: { user: serializable(req.user) } };
}

export default withRouter(EditSessionPage);
