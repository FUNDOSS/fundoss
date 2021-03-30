import React from 'react';
import {
  Card, Container, Button, Col, Image, Row, 
} from 'react-bootstrap';
import Layout from '../../components/layout';
import Pluralize from 'pluralize';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import Payments from '../../lib/payment/paymentController';
import CartController from '../../lib/cart/CartController';
import FundingSessions from '../../lib/fundingSession/fundingSessionController'; 
import Qf from '../../utils/qf';
import { formatAmountForDisplay } from '../../utils/currency';
import Cart from '../../components/cart/Cart';

const SharePage = ({ user, payment, session, cart }) => (
  <Layout title="FundOSS | Donations cart" user={user} cart={cart} session={session} style={{background: '#0E0C4D'}}>
    <div className="confetti" style={{ marginBottom: '-60px' , paddingBottom: '70px'}}>
      <Container>
        <Card style={{ maxWidth: '750px', margin: '30px auto' }}>
          <Card.Body className="text-center">
            <Image src={payment.user.avatar} roundedCircle width={100} />
            <h3>
              {payment.user.name} has backed {Pluralize('awesome collective', payment.donations.length, true)}
            </h3>
            <p className="lead">And unlocked <span className="text-fat text-success">{
            formatAmountForDisplay(payment.donations.reduce(
              (total, donation) => total += Qf.calculate(donation.amount),
              0
            ))
            }</span> in estimated matched funding</p>
            <Row className="justify-content-md-center" style={{ maxWidth: '550px', margin: '10px auto' }}>
              {payment.donations.map(
                (donation) => (
                  <Col xs={2}  key={donation._id}>
                    <Image src={donation.collective.imageUrl} roundedCircle fluid />
                  </Col>
                ),
              )}
            </Row>
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={()=>
                {Cart.addItems(payment.donations.map(donation => ({
                  collective:donation.collective, 
                  amount:20
                })))
              }}
            >Add {Pluralize('collective', payment.donations.length, true)} to my cart
            
            </Button><br />
            And unlock <span className="text-fat text-success">{
            formatAmountForDisplay(payment.donations.reduce(
              (total) => total += Qf.calculate(20),
              0
            ))
            }</span> in estimated matches
          </Card.Body>
          <Card.Footer>
            <Button size="lg" variant="primary" block href="/">More collectives on FundOSS.org</Button>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const payment = await Payments.getShared(query.sid);
  const session = await FundingSessions.getCurrentSessionInfo();
  const cart = await CartController.get(req.session.cart);
  return { props: { 
    user: serializable(req.user), 
    payment: serializable(payment),
    cart: serializable(cart), 
    session: serializable(session), 
  } };
}

export default SharePage;
