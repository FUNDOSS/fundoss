import React from 'react';
import {
  Container, Button, Col, Image, Row, 
} from 'react-bootstrap';
import Pluralize from 'pluralize';
import Layout from '../../components/layout';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import Payments from '../../lib/payment/paymentController';
import CartController from '../../lib/cart/CartController';
import FundingSessions from '../../lib/fundingSession/fundingSessionController'; 
import Qf from '../../utils/qf';
import AddMultipleToCartButton from '../../components/cart/AddMultipleToCartButton';
import Sponsors from '../../components/fundingSession/Sponsors';
import { formatAmountForDisplay } from '../../utils/currency';

const SharePage = ({
  user, payment, session, cart, 
}) => (
  <Layout title="FundOSS | Donations cart" user={user} cart={cart} session={session} style={{ background: '#0E0C4D' }}>
    <Container style={{ paddingTop: '40px', margin: '-60px 0' }} fluid>
      <Row className="no-gutter  row-eq-height">
        <Col md={6} className="illu-hand">
          <div style={{ padding: '40px 0', margin: '300px 0 0 -30px', background: '#0e0c4da6' }} className="content">
            <Sponsors sponsors={payment.session.sponsors} />
          </div>
        </Col>
        <Col md={{ span: 4, offset: 1 }} className="text-center">
          <div style={{ maxWidth: '550px', margin: '70px auto' }}>
            <Image src={payment.user.avatar} roundedCircle width={100} />
            <h2 style={{ margin: '20px 0' }}>
              {payment.user.name} has backed<br /> {Pluralize('awesome collective', payment.donations.length, true)}
            </h2>
            <p className="lead">And unlocked 
              <span className="match">{
                formatAmountForDisplay(payment.donations.reduce(
                  (total, donation) => total + Qf.calculate(donation.amount),
                  0,
                ))
}
              </span> in estimated matched funding
            </p>
            <Row className="justify-content-md-center" style={{ maxWidth: '550px', margin: '10px auto' }}>
              {payment.donations.map(
                (donation) => (
                  <Col xs={4} key={donation._id}>
                    <a className="black text-fat" href={`/collective/${donation.collective.slug}`}>
                      <Image src={donation.collective.imageUrl} roundedCircle fluid width={45} />
                      <br />
                      {donation.collective.name}
                    </a>
                  </Col>
                ),
              )}
            </Row>

            {session._id === payment.session._id ? (
              <AddMultipleToCartButton items={payment.donations.map((d) => d.collective)} />
            ) : null }
            <Button variant="outline-primary" size="lg" block href="/">More collectives on FundOSS.org</Button>
          </div>
        </Col>
      </Row>
    </Container>
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const payment = await Payments.getShared(query.sid);
  const session = await FundingSessions.getCurrentSessionInfo();
  const cart = await CartController.get(req.session.cart);
  return {
    props: { 
      user: serializable(req.user), 
      payment: serializable(payment),
      cart: serializable(cart), 
      session: serializable(session), 
    }, 
  };
}

export default SharePage;
