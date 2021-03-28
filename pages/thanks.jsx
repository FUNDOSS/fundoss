import React from 'react';
import {
  Card, Container, Button, Col, Image, Row, 
} from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Payments from '../lib/payment/paymentController';
import Qf from '../utils/qf';
import { formatAmountForDisplay } from '../utils/currency';
import Icons from '../components/icons';

const CheckoutPage = ({ user, payment }) => (
  <Layout title="FundOSS | Donations cart" user={user} style={{background: '#0E0C4D'}}>
    <div className="confetti" style={{ marginBottom: '-60px' , paddingBottom: '70px'}}>
      <Container>
        <Card style={{ maxWidth: '750px', margin: '30px auto' }}>
          <Card.Body className="text-center">
            <h1 className="display-3">Thank you for your<br />
              donation, {user.name || user.username}!
            </h1>
            <p className="text-fat lead">Your donations go a long way at FundOSS!</p>
            <p>A receipt has been emailed to your email address</p>
            <p className="lead">The &nbsp;
              <span className="text-fat display-4">
                {formatAmountForDisplay(payment.amount, 'USD')}
              </span> you donated will be matched<br/>with an estimated &nbsp;
              <span className="text-fat text-success display-4">
                {formatAmountForDisplay(payment.donations.reduce(
                  (acc, donation) => {
                    const match = Qf.calculate(Number(donation.amount));
                    console.log(donation.amount, match, donation._id);
                    return acc += match;
                  },
                  0,
                ), 'USD')}
                
              </span> from the donor pot! 
            </p>
            <p>Not only are you contributing,
              but you’re signaling what projects are most important to you!
            </p>
            <Row className="justify-content-md-center" style={{ maxWidth: '550px', margin: '10px auto' }}>
              {payment.donations.map(
                (donation) => (
                  <Col xs={2}  key={donation._id}>
                    <Image src={donation.collective.imageUrl} roundedCircle fluid />
                  </Col>
                ),
              )}
            </Row>
            <hr />
            <Row className="text-left">
              <Col>
                <h4>Social</h4>
                <p>Projects that get social boosts from donors have a higher &nbsp;
                  likelihood of hitting their fundraising needs each year.
                </p>
                <p>Please considering lending your voice to support these OSS projects!</p>
                <Button variant="outline-primary"><Icons.Twitter size={16} /> Twitter</Button>
                <Button variant="outline-primary"><Icons.Twitter size={16} /> Facebook</Button>
                <Button variant="outline-primary"><Icons.Twitter size={16} /> Email</Button>
              </Col>
              <Col>
                <h4>FundOSS  Round 2</h4>
                <p>If there are projects you want to see in Round 2, &nbsp;
                  please consider nominating them for FundOSS, currently set for late Summer 2021.
                </p>
                <Button block variant="outline-primary"><Icons.Award size={15} /> Collectives for round 2</Button>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button size="lg" variant="primary" block href="/">Back to FundOSS.org</Button>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const payment = await Payments.getLastByUser(req.user._id);
  return { props: { user: serializable(req.user), payment: serializable(payment) } };
}

export default CheckoutPage;
