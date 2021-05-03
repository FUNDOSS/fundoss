import React from 'react';
import {
  Card, Container, Button, Col, Image, Row, Form, 
} from 'react-bootstrap';
import Link from 'next/link';
import Error from '../components/Error';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Payments from '../lib/payment/paymentController';
import Qf from '../utils/qf';
import { formatAmountForDisplay } from '../utils/currency';
import Icons from '../components/icons';
import ShareButton from '../components/social/ShareButton';
import ServerProps from '../lib/serverProps';
import FundingSessionInfo from '../components/fundingSession/FundingSessionInfo';

const ThanksPage = ({ state, payment }) => {
  if (!state.user._id) {
    return <Error statusCode={401} />;
  }
  return (
    <Layout title="FundOSS | Donations cart" state={state}>
      <div className="confetti" style={{ marginBottom: '-60px', paddingBottom: '70px' }}>
        <Container>
          <Card style={{ maxWidth: '750px', margin: '30px auto' }}>
            <Card.Header className="text-center">
              <h1>Thank you for your<br />
                donation, {state.user.name || state.user.username}!
              </h1>
              <div className="text-center">
                {payment.donations ? payment.donations.map(
                  (donation) => (
                    <Image className="shadow-light" style={{ width: '40px', height: '40px', margin: '0 -5px' }} key={donation._id} src={donation.collective.imageUrl} roundedCircle fluid />
                  ),
                ) : null }
              </div>
            </Card.Header>
            <Card.Body className="text-center">
            
              <p className="lead">A receipt has been emailed to your email address</p>
              <p className="lead">The &nbsp;
                <span className="text-fat ">
                  {formatAmountForDisplay(payment.amount, 'USD')}
                </span> you donated will be matched<br />with an estimated &nbsp;
                <span className="match ">
                  {formatAmountForDisplay(payment.donations ? payment.donations.reduce(
                    (acc, donation) => {
                      const match = Qf.calculate(Number(donation.amount));
                      return acc + match;
                    },
                    0,
                  ) : null, 'USD') }
                
                </span> from the donor pot! 
              </p>
              <Row>
                <Col style={{ height: '220px' }} className="seamless-hand-light">
                 &nbsp;
                </Col>
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
                  <Form.Control onChange={() => null} value={`${state.siteUrl}/share/${payment.sid}`} />
                  <ShareButton platform="twitter" variant="link" siteUrl={state.siteUrl} url={`/share/${payment.sid}`} />
                  <ShareButton platform="facebook" variant="link" siteUrl={state.siteUrl} url={`/share/${payment.sid}`} />
                  <ShareButton platform="email" variant="link" siteUrl={state.siteUrl} url={`/share/${payment.sid}`} />
                </Col>
              </Row>

            </Card.Body>
            {state.upcoming?._id ? (
              <Card.Footer style={{ marginTop: '20px' }}>
                <h2>{state.upcoming.name}</h2>
                <Row className="text-left">
                  <Col>
                
                    <FundingSessionInfo session={state.upcoming} size="sm" />
                  </Col>
                  <Col>
                    <div dangerouslySetInnerHTML={{ __html: state.upcoming.description }} />
                  </Col>
                </Row>
                <Link href="/upcoming">
                  <Button size="lg" block variant="outline-primary">
                    <Icons.Award size={25} /> nominate for {state.upcoming.name}
                  </Button>
                </Link>
              </Card.Footer>
            ) : null }    
            
            {!state.upcoming?._id ? (
              <Card.Footer style={{ marginTop: '20px' }}>
                <Link href="/upcoming">
                  <Button size="lg" block variant="outline-primary">
                    Back to home
                  </Button>
                </Link>
              </Card.Footer>
            ) : null }  


          </Card>
        </Container>
      </div>
    </Layout>
  ); 
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const payment = await Payments.getLastByUser(req.user?._id);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return {
    props: { 
      state,
      payment: serializable(payment),
    }, 
  };
}

export default ThanksPage;
