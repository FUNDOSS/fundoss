import React from 'react';
import Error from 'next/error';
import Container from 'react-bootstrap/Container';
import Layout from '../components/layout';
import Payments from '../lib/payment/paymentController';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import { Col, Row, Image } from 'react-bootstrap';
import Icons from '../components/icons';
import PaymentsList from '../components/payment/PaymentsList';
import Cart from '../lib/cart/CartController';

const AccountPage = ({ user, payments, cart }) => {
  if (!user._id) {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | My Account" user={user} cart={cart}>
      <Container style={{ paddingTop: '40px' }}>
        {user._id ? (
        <Row>
        <Col md={3}>
          <h2>Profile</h2>
          <Image src={user.avatar} roundedCircle width={100}/>
          <h4>Name</h4>
          {user.name}
          <h4><Icons.Github size={15} /> Github Profile</h4>
          https://github.com/{user.username}
        </Col>
        <Col>
        <h2>Donations History</h2>
        <PaymentsList payments={payments} />
        </Col>
      </Row>

        ) : null }
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  if(req.user){
    const payments = await Payments.getByUser(req.user?._id);
    const cart = await Cart.get(req.session.cart);
    return {
      props: {
        user: serializable(req.user),
        payments: serializable(payments),
        cart: serializable(cart),
      },
    };
  } else {
    return {
      props: {
        user: {}
      },
    };
  }

}

export default AccountPage;
