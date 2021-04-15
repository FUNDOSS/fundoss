import React from 'react';
import Container from 'react-bootstrap/Container';
import { Card, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';
import Calculator from '../components/qf/calculator';
import FundingSessionInfo from '../components/fundingSession/FundingSessionInfo';
import Sponsors from '../components/fundingSession/Sponsors';

const QFPage = ({ state }) => (
  <Layout title="FundOSS | What is democratic Funding ?" state={state}>
    <div className="seamless invert">
      <Container>
        <Row className="align-items-center content">
          <Col xs={12} md={8}>
            <h1 className="display-2">What is Democratic Funding ?</h1>
          </Col>
          <Col>
            <p className="lead">Democratic Funding is the mathematically optimal way to fund public goods in a democratic community where the number of contributors matters more than the actual amount funded.</p>
          </Col>
        </Row>
        
      </Container>
    </div>
    <Container className="content">
      <Row>
        <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          <h4>A matching pool is raised, and then a crowdfund campaign is matched according to the QF algorithm:</h4>
          <img
            src="/static/df-formula.svg" 
            style={{ display: 'block', maxWidth: '230px', margin: '10px auto' }}
          />

          <br />

          <h3>Number of contributors matters more than amount funded.</h3><br />
          <h3>This pushes power to the edges, away from whales & other central power brokers.</h3><br />
          <h3>This creates more democracy in public goods funding decisions! 🦄</h3><br />

          <br />
          <Calculator avg={10} number={500} /><br /><br />

        </Col>
      </Row>
    </Container>
    <div className="seamless" style={{ marginBottom: '-60px' }}>
      <Container className="content text-center">
        {state.current ? (
          <><h2><Link href="/"><a>{state.current.name}</a></Link></h2>
            <div className="session-description" dangerouslySetInnerHTML={{ __html: state.current.description }} />
            <FundingSessionInfo session={state.current} />
            <Sponsors sponsors={state.current.sponsors}/>
          </>
        ) : null }
    
      </Container>
    </div>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return { props: { state } };
}

export default QFPage;
