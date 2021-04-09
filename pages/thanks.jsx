import React from 'react';
import {
  Card, Container, Button, Col, Image, Row, Form, 
} from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Payments from '../lib/payment/paymentController';
import Qf from '../utils/qf';
import { formatAmountForDisplay } from '../utils/currency';
import Icons from '../components/icons';
import ShareButton from '../components/social/ShareButton';
import Robot from '../components/illustration/Robot';
import ServerProps from '../lib/serverProps';
import FundingSessionInfo from '../components/fundingSession/FundingSessionInfo';

const CheckoutPage = ({ user, payment, session, hostingUrl, upcoming }) => (
  <Layout title="FundOSS | Donations cart" user={user} current={session} style={{ background: '#0E0C4D' }}>
    <div className="confetti" style={{ marginBottom: '-60px', paddingBottom: '70px' }}>
      <Container>
        <Card style={{ maxWidth: '750px', margin: '30px auto' }}>
          <Card.Header className="text-center">
          <h1>Thank you for your<br />
              donation, {user.name || user.username}!
            </h1>
            <div className="text-center">{payment.donations.map(
              (donation) => (
                <Image className="shadow-light" style={{ width: '40px', height: '40px', margin: '0 -5px' }} key={donation._id} src={donation.collective.imageUrl} roundedCircle fluid />
              ),
            )}
            </div>
          </Card.Header>
          <Card.Body className="text-center">

            
            <p className="lead">A receipt has been emailed to your email address</p>
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
                <Form.Control onChange={() => null} value={`${hostingUrl}/share/${payment.sid}`} />
                <ShareButton platform="twitter" variant="link" url={`/share/${payment.sid}`} />
                <ShareButton platform="facebook" variant="link" url={`/share/${payment.sid}`} />
                <ShareButton platform="email" variant="link" url={`/share/${payment.sid}`} />
              </Col>
            </Row>

            <hr />
            <h2>{upcoming.name}</h2>
            <Row className="text-left">
              <Col>
                
                <FundingSessionInfo session={upcoming} size="sm" />
              </Col>
              <Col>
                <div dangerouslySetInnerHTML={{ __html:upcoming.description}}></div>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button href="upcoming" size="lg" block variant="primary">
              <Icons.Award size={25} />nominate for {upcoming.name}
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const payment = await Payments.getLastByUser(req.user._id);
  const session = await ServerProps.getCurrentSessionInfo();
  const upcoming = await ServerProps.getUpcomingInfo();
  const user = await ServerProps.getUser(req.user, session?._id);
  const hostingUrl = process.env.HOSTING_URL;
  return {
    props: { 
      user, 
      payment: serializable(payment),
      session, 
      hostingUrl,
      upcoming,
    }, 
  };
}

export default CheckoutPage;
