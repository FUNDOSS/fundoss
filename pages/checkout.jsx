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
import Cart, { cartEvents } from '../components/cart/Cart';
import Qf from '../utils/qf';
import { formatAmountForDisplay } from '../utils/currency';

const CheckoutPage = ({
  user, cart, stripekey, cartValue,
}) => {
  const stripePromise = loadStripe(stripekey);
  const [total, setTotal] = useState(cartValue);
  const [totalMatch, setTotalMatch] = useState();
  useEffect(() => {
    const onCartChange = (cart = null) => {
      const totals = (Cart.data || cart).reduce(
        (acc, item) => ({
          amount: acc.amount + Number(item.amount), 
          match: acc.match + Qf.calculate(Number(item.amount)),
        }),
        { amount: 0, match: 0 },
      );
      if (totals) {
        setTotal(totals.amount);
        setTotalMatch(totals.match);
      }
    };
    cartEvents.on('cartChange', onCartChange);
    onCartChange(cart);
  }, []);

  return (
    <Layout title="FundOSS | Checkout" hidefooter={1}>
      <Container style={{ paddingTop: '40px' }} className="content">
        {user._id ? (
          <>
            {total ? (
              <>
                <Row>
                  <Col md={{ offset: 3, span: 6 }}>
                    <Cart display="inline" cart={cart} />
                    <hr />
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
              </>
            ) : (
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
            )}
          </>
        ) : (
          <Row>
            <Col md={{ offset: 3, span: 6 }} className="text-center">
              <h4>Register / Login To Finish Donating</h4>
              <p>
                FundOSS is only allowing sign-ups through Github at this time.
                We apologize for the inconvenience this might cause!
              </p>
              <GithubLoginButton block redirect="/checkout" />
              <p>We’ll save your shopping cart for when you return!</p>
            </Col>
          </Row>
        )}
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const cart = await CartController.get(req.session.cart);
  const cartValue = cart.reduce((acc, item) => acc + item.amount, 0);
  const stripekey = process.env.STRIPE_PUBLISHABLE_KEY;
  return {
    props: {
      user: serializable(req.user), cart: serializable(cart), stripekey, cartValue,
    },
  };
}

export default CheckoutPage;
