import React from 'react';
import Container from 'react-bootstrap/Container';
import { Card, Row, Col } from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';
import Calculator from '../components/qf/calculator';

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
        <Col md={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="text-center">
              <h4>A matching pool is raised, and then a crowdfund campaign is matched according to the QF algorithm:</h4>
              <br />
              <br />
              <Calculator avg={10} number={500} /><br /><br />
              <h3>Number of contributors matters more than amount funded.</h3><br />
              <h3>This pushes power to the edges, away from whales & other central power brokers.</h3><br />
              <h3>This creates more democracy in public goods funding decisions! 🦄</h3><br />

            </Card.Body>
            
          </Card>
          <h4>Let’s start with what public goods actually are. </h4>

<p>In economics, a public good is a good that is both non-excludable and non-rivalrous, so individuals cannot be excluded from use, and use by one individual does not reduce availability to others. A public good can also be used simultaneously by more than one person.</p> 

<p>To illustrate the difference between public goods and other goods such as common, private or club goods, let’s have a look at a few examples. </p>

<p>All goods can be classified by their excludability and by their rivalry.</p>
          <img src="/static/public_good_grid.png" alt="public goods grid" className="img-fluid" />

        </Col>
      </Row>
    </Container>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return { props: { state } };
}

export default QFPage;
