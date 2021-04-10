import React from 'react';

import Container from 'react-bootstrap/Container';
import { Col, Row, Image } from 'react-bootstrap';
import Layout from '../components/layout';
import Error from '../components/Error';
import Payments from '../lib/payment/paymentController';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Icons from '../components/icons';
import DonationsList from '../components/payment/DonationsList';
import Cart from '../lib/cart/CartController';

const AccountPage = ({ user, donations, cart }) => {
  if (!user._id) {
    return <Error statusCode={401} />;
  }

  return (
    <Layout title="FundOSS | My Account" user={user} cart={cart}>
      <div className="bg1">
        <Container style={{ paddingTop: '40px' }} className="content">
          {user._id ? (
            <Row>
              <Col md={3}>
                <h2>Profile</h2>
                <Image src={user.avatar} roundedCircle width={100} />
                <h5>Name</h5>
                {user.name}
                <h5>
                  <Icons.Github size={20} />
                  {' '}
                  Github Profile
                </h5>
                <a href={`https://github.com/${user.username}`}>https://github.com/{user.username}</a>

              </Col>
              <Col>
                <h2>Donations History</h2>
                <DonationsList donations={donations} />
              </Col>
            </Row>

          ) : null }
        </Container>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  if (req.user) {
    const donations = await Payments.getDonationsByUser(req.user?._id);
    const cart = await Cart.get(req.session.cart);
    return {
      props: {
        user: serializable(req.user),
        donations: serializable(donations),
        cart: serializable(cart),
      },
    };
  }
  return {
    props: {
      user: {},
    },
  };
}

export default AccountPage;
