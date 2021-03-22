import React from 'react';
import { Card, Container, Button } from 'react-bootstrap';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import CartController from '../lib/cart/CartController';

const CheckoutPage = ({ user, cart }) => (
  <Layout title="FundOSS | Donations cart" user={user} cart={cart}>
    <div className="confetti" style={{ marginBottom: '-60px' }}>
      <Container style={{ paddingTop: '40px' }}>
        <Card>
          <Card.Body>
            <h1 className="text-center">Thank you for your donation, {user.name || user.username}!</h1>
            <p>A receipt has been emailed to your github email address</p>
            <p>Your donatios go a long way at FundOSS! </p>
            <p>The $20 you donated will be matched with an estimated $146 from the donor pot! </p>
            <p>Not only are you contributing,
              but you’re signaling what projects are most important to you!
            </p>
            <h4>One last thing....</h4>
            <p>Finished sharing? Scroll down to check out a few more businesses
              that need our help and please consider donating to the local small businesses that
              make living in Boulder so amazing.
            </p>
            <Button variant="primary" block href="/">Back to FundOSS.com</Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const cart = await CartController.get(req.session.cart);
  const stripekey = process.env.STRIPE_PUBLISHABLE_KEY;
  return { props: { user: serializable(req.user), cart: serializable(cart), stripekey } };
}

export default CheckoutPage;
