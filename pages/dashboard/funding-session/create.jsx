import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Error from '../../../components/Error';
import Layout from '../../../components/layout';
import FundingSessionForm from '../../../components/fundingSession/FundingSessionForm';
import middleware from '../../../middleware/all';
import ServerProps from '../../../lib/serverProps';

const CreateSessionPage = ({ state }) => {
  if (!state.user?._id) {
    return <Error statusCode={401} />;
  }
  if (state.user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" state={state}>
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
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return { props: {state } };
}

export default CreateSessionPage;
