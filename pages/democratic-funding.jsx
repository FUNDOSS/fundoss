import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Ghost from '../lib/ghost';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';
import Calculator from '../components/qf/calculator';
import FundingSessionInfo from '../components/fundingSession/FundingSessionInfo';
import Sponsors from '../components/fundingSession/Sponsors';

const QFPage = ({ state, page }) => (
  <Layout title="FundOSS | What is democratic Funding ?" state={state}>
    <div className="seamless invert">
      <Container>
        <Row className="align-items-center content">
          <Col xs={12} md={8}>
            <h1 className="display-2">{page.title}</h1>
          </Col>
          <Col>
            <p className="lead">{page.excerpt}</p>
          </Col>
        </Row>
        
      </Container>
    </div>
    <Container className="page-content">
      <Row>
        <Col md={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
          <div className="gh-content" dangerouslySetInnerHTML={{ __html: page.html }} />
          <br />
          <div style={{ margin: '20px auto', width: '500px' }}>
            <Calculator avg={10} number={500} />
          </div><br /><br />

        </Col>
      </Row>
    </Container>
    <div className="seamless" style={{ marginBottom: '-60px' }}>
      <Container className="content text-center">
        {state.current ? (
          <>
            <div className="session-description" dangerouslySetInnerHTML={{ __html: state.current.description }} />
            <FundingSessionInfo session={state.current} />
            <Link href={`/session/${state.current.slug}`}>
              <Button size="lg" variant="outline-light">Find out more</Button>
            </Link>
            <Sponsors sponsors={state.current.sponsors} align="center" />
          </>
        ) : null }
        {state.upcoming._id ? (
          <>
            <div className="session-description" dangerouslySetInnerHTML={{ __html: state.upcoming.description }} />
            <FundingSessionInfo session={state.upcoming} />
            <Link href={`/session/${state.upcoming.slug}`}>
              <Button size="lg" variant="outline-light">Find out more</Button>
            </Link>
            <Sponsors sponsors={state.upcoming.sponsors} align="center" />
          </>
        ) : null }
      </Container>
    </div>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const page = await Ghost.getPage('democratic-funding');
  return { props: { state, page } };
}

export default QFPage;
