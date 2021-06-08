import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  Container, Row, Col, Button, Image,
} from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import CheckoutForm from '../components/checkout/CheckoutForm';
import GithubLoginButton from '../components/auth/GithubLoginButton';
import Cart, { cartEvents, getCartTotals } from '../components/cart/Cart';
import ServerProps from '../lib/serverProps';
import { formatAmountForDisplay } from '../utils/currency';
import Icons from '../components/icons';
import Sponsors from '../components/fundingSession/Sponsors';
import Currency from '../components/Currency';

const CheckoutPage = ({
  state, stripekey,
}) => {
  const stripePromise = loadStripe(stripekey);
  const [total, setTotal] = useState(state.cart.reduce((total, item) => total + item.amount, 0));
  const [totalMatch, setTotalMatch] = useState();
  useEffect(() => {
    const onCartChange = () => {
      const totals = getCartTotals(Cart.data || state.cart); 
      setTotal(totals.amount);
      setTotalMatch(totals.match);
    };
    cartEvents.on('cartChange', onCartChange);
    onCartChange(state.cart);
  }, []);

  return (
    <Layout title="FundOSS | Checkout" hidefooter={1} state={state}>
      
      {state.user._id ? (
        <>
          {total ? (
            <Container style={{ paddingTop: '40px' }} className="content">
              <Row>
                <Col md={{ span: 3 }} style={{ marginBottom: '40px' }}>
                  <h3 className="text-secondary text-center text-md-left"> <Icons.Cart size={30} /> Checkout</h3>
                </Col>
                <Col md={{ span: 6 }}>
                  <Cart display="inline" cart={state.cart} user={state.user} donateConfig={state.current.donateConfig} />
                </Col>
              </Row>
              <Row style={{ marginTop: '30px' }}>
                <Col md={{ offset: 3, span: 6 }}>
                  <Row className="align-items-center text-center d-flex align-items-stretch">
                    <Col className="big" lg={4}>
                      <div className="checkout-total text-center" style={{ padding: '20px' }}>
                        <Image className="shadow-light" style={{ width: '40px', height: '40px', margin: '0 -5px' }} src={state.user?.avatar} roundedCircle />
                        <div style={{ minHeight: '30px' }}>
                          You pay only 
                        </div>
                        <span className="big text-primary lead text-fat">
                          <Currency value={total} />
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <div className="checkout-totalmatch seamlesslight text-center shadow-light" style={{ padding: '20px' }}>
                        <Image className="shadow-light" style={{ width: '40px', height: '40px' }} src={state.user?.avatar} roundedCircle />
                        &nbsp;+&nbsp;
                        <Image className="shadow-light" style={{ width: '40px', height: '40px' }} src="/static/favicon.svg" roundedCircle />
                        &nbsp;&nbsp;➜&nbsp;&nbsp;
                        {Cart.data ? Cart.data.map(
                          (item, index) => (
                            index < 6 ? (
                              <Image
                                className="shadow-light" 
                                style={{ width: '40px', height: '40px', margin: '0 -20px 0 0' }} 
                                key={item.collective.slug._id}
                                src={item.collective.imageUrl}
                                roundedCircle
                                fluid
                              />
                            ) : '.' 
                          ),
                        ) : null}
                        <div style={{ minHeight: '30px' }}>Your contribution + FundOSS's estimated match</div>
                        <div className="text-fat text-success big lead">
                          {totalMatch ? <Currency value={totalMatch + total} /> : null}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Elements stripe={stripePromise}>
                <CheckoutForm user={state.user} test={stripekey.indexOf('pk_test') === 0} />
              </Elements>
            </Container>
          ) : (
            <div className="seamless-hand" style={{ marginBottom: '-60px' }}>
              <Container>
                <Row className="no-gutter align-items-center">
                  <Col md={6} />
                  <Col md={{ span: 4, offset: 1 }} className="text-center content">
                    <div style={{ maxWidth: '550px', margin: '250px auto' }}>
                      <h3>Oops.. Your cart is empty</h3>
                      <p>
                        Go back and find your favorite OSS projects 
                        to support projects and boost their democratic match!
                      </p>
                      <Button variant="outline-light" size="lg" href="/">Go back to the collectives page</Button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          )}
        </>
      ) : (
        <div className="seamless-hand" style={{ marginBottom: '-60px' }}>
          <Container>
            <Row className="no-gutter align-items-center">
              <Col md={6}><Sponsors sponsors={state.current.sponsors} /></Col>
              <Col md={{ span: 4, offset: 1 }} className="text-center content">
                <div style={{ maxWidth: '550px', margin: '230px auto' }}>
                  <h3>Register / Login To Finish Donating</h3>
                  <p>
                    FundOSS is only allowing sign-ups through Github at this time.
                    We apologize for the inconvenience this might cause!
                  </p>
                  <GithubLoginButton variant="outline-light" size="lg" block redirect="/checkout" />
                  <p>We’ll save your shopping cart for when you return!</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const stripekey = process.env.STRIPE_PUBLISHABLE_KEY;
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return {
    props: {
      state,
      stripekey,
    },
  };
}

export default CheckoutPage;
