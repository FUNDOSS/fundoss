import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import Ghost from '../../lib/ghost';
import Layout from '../../components/layout';
import middleware from '../../middleware/all';
import ServerProps from '../../lib/serverProps';
import Error from '../../components/Error';

const GhostPage = ({ state, page }) => {
  if (!page) {
    return <Error statusCode={404} />;
  }
  return (
    <Layout title={`FundOSS | ${page.title}`} state={state}>
      <Container className="page-content">
        <Row>
          <Col className="post-content" md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
            <div className="post" key={page.id}><h1>{page.title}</h1>
              <div className="gh-content" dangerouslySetInnerHTML={{ __html: page.html }} />
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  ); 
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const page = await Ghost.getPage(query.slug);
  return { props: { state, page } };
}

export default GhostPage;
