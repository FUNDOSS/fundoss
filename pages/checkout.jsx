import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  Container, Row, Col, Button, 
} from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import CartController from '../lib/cart/CartController';
import CheckoutForm from '../components/checkout/CheckoutForm';
import GithubLoginButton from '../components/auth/GithubLoginButton';
import Cart, { cartEvents, getCartTotals } from '../components/cart/Cart';
import FundingSessions from '../lib/fundingSession/fundingSessionController';
import { formatAmountForDisplay } from '../utils/currency';
import Icons from '../components/icons';

const CheckoutPage = ({
  user, cart, stripekey, cartValue, session
}) => {
  const stripePromise = loadStripe(stripekey);
  const [total, setTotal] = useState(cartValue);
  const [totalMatch, setTotalMatch] = useState();
  useEffect(() => {
    const onCartChange = () => {
        const totals = getCartTotals(Cart.data || cart); 
        setTotal(totals.amount);
        setTotalMatch(totals.match);
    };
    cartEvents.on('cartChange', onCartChange);
    onCartChange(cart);
  }, []);

  return (
    <Layout title="FundOSS | Checkout" hidefooter={1} session={session}>
      
        {user._id ? (
          <>
            {total ? (
                <Container style={{ paddingTop: '40px' }} className="content">
                <Row>
                  <Col md={{ span: 3 }}>
                    <h3 className="text-secondary"> <Icons.Cart size={30} /> Checkout</h3>
                  </Col>
                  <Col md={{ span: 6 }}>
                    <Cart display="inline" cart={cart} />
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={{ offset: 3, span: 6 }}>
                    <Row className="align-items-center text-center">
                      <Col className="lead text-fat">Total: {formatAmountForDisplay(total, 'USD')}</Col>
                      <Col className="lead">+</Col>
                      <Col>
                        <div className="text-success text-fat display-4">
                          {totalMatch ? formatAmountForDisplay(totalMatch, 'USD') : ''}
                        </div>
                        <small>estimated match</small>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Elements stripe={stripePromise}>
                  <CheckoutForm user={user} />
                </Elements>
              </Container>
            ) : (
              <Container style={{ paddingTop: '40px' }} className="content">
                <Row>
                  <Col md={{ offset: 3, span: 6 }} className="text-center">
                    <h4>Oops.. Your cart is empty</h4>
                    <p>
                      Go back and find your favorite OSS projects 
                      to support projects and boost their democratic match!
                    </p>
                    <Button href="/">Go back to the collectives page</Button>
                  </Col>
                </Row>
              </Container>
            )}
          </>
        ) : (
        <Container style={{ paddingTop: '40px' }} className="fluid">
          <Row className="no-gutter align-items-center">
            <Col className="illu-hand" style={{ minHeight: '550px' }}>

            </Col>
            <Col md={{ span: 6 }} className="text-center">
              <h4>Register / Login To Finish Donating</h4>
              <p>
                FundOSS is only allowing sign-ups through Github at this time.
                We apologize for the inconvenience this might cause!
              </p>
              <GithubLoginButton size="lg" block redirect="/checkout" />
              <p>We’ll save your shopping cart for when you return!</p>
            </Col>
          </Row>
        </Container>
        )}
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const cart = await CartController.get(req.session.cart);
  const cartValue = cart.reduce((acc, item) => acc + item.amount, 0);
  const stripekey = process.env.STRIPE_PUBLISHABLE_KEY;
  const session = await FundingSessions.getCurrentSessionInfo();
  return {
    props: {
      user: serializable(req.user), 
      cart: serializable(cart), 
      session: serializable(session), 
      stripekey, 
      cartValue,
    },
  };
}

export default CheckoutPage;
