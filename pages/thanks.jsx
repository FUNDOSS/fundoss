import React from 'react';
import {
  Card, Container, Button, Col, Image, Row, Form, 
} from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Payments from '../lib/payment/paymentController';
import FundingSessions from '../lib/fundingSession/fundingSessionController'; 
import Qf from '../utils/qf';
import { formatAmountForDisplay } from '../utils/currency';
import Icons from '../components/icons';
import ShareButton from '../components/social/ShareButton';
import Robot from '../components/illustration/Robot';

const CheckoutPage = ({ user, payment, session }) => (
  <Layout title="FundOSS | Donations cart" user={user} session={session} style={{ background: '#0E0C4D' }}>
    <div className="confetti" style={{ marginBottom: '-60px', paddingBottom: '70px' }}>
      <Container>
        <Card style={{ maxWidth: '750px', margin: '30px auto' }}>
          <Card.Body className="text-center">
            <h1>Thank you for your<br />
              donation, {user.name || user.username}!
            </h1>
            <div className="text-center">{payment.donations.map(
              (donation) => (
                <Image className="shadow-light" style={{ width: '40px', height: '40px', margin: '0 -5px' }} key={donation._id} src={donation.collective.imageUrl} roundedCircle fluid />
              ),
            )}
            </div>
            
            <p>A receipt has been emailed to your email address</p>
            <p className="lead">The &nbsp;
              <span className="text-fat ">
                {formatAmountForDisplay(payment.amount, 'USD')}
              </span> you donated will be matched<br />with an estimated &nbsp;
              <span className="match ">
                {formatAmountForDisplay(payment.donations.reduce(
                  (acc, donation) => {
                    const match = Qf.calculate(Number(donation.amount));
                    return acc + match;
                  },
                  0,
                ), 'USD')}
                
              </span> from the donor pot! 
            </p>
            <Row>
              <Col><Robot width="100%" height={400} /></Col>
              <Col sm={8} className="text-left">
                <p className="text-fat lead">
                  Your donations go a long way at FundOSS!<br /> 
                  Your social shares do too!
                </p>  
                <p>
                  Want to share your cart? Copy/paste the link below,&nbsp;
                  but don’t worry if you close this browser&nbsp;
                  tab. You can also see your shareable cart on your Account page!
                </p>
                <Form.Control onChange={() => null} value={`https://app.fundoss.org/share/${payment.sid}`} />
                <ShareButton platform="twitter" variant="link" url={`/share/${payment.sid}`} />
                <ShareButton platform="facebook" variant="link" url={`/share/${payment.sid}`} />
                <ShareButton platform="email" variant="link" url={`/share/${payment.sid}`} />
              </Col>
            </Row>

            <hr />
            <Row className="text-left">
              <Col>
                <h3>Social</h3>
                <p>Projects that get social boosts from donors have a higher&nbsp;
                  likelihood of hitting their fundraising needs each year.
                </p>
                <p>Please considering lending your voice to support these OSS projects!</p>

                <ShareButton platform="twitter" variant="link" url="/" />
                <ShareButton platform="facebook" variant="link" url="/" />
                <ShareButton platform="email" variant="link" url="/" />
              </Col>
              <Col>
                <h3>FundOSS  Round 2</h3>
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
  const session = await FundingSessions.getCurrentSessionInfo();
  return {
    props: { 
      user: serializable(req.user), 
      payment: serializable(payment),
      session: serializable(session), 
    }, 
  };
}

export default CheckoutPage;
