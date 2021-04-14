import React from 'react';

import Container from 'react-bootstrap/Container';
import { Col, Row, Image } from 'react-bootstrap';
import Layout from '../components/layout';
import Error from '../components/Error';
import Payments from '../lib/payment/paymentController';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Icons from '../components/icons';
import PaymentsList from '../components/payment/PaymentsList';
import ServerProps from '../lib/serverProps';

const AccountPage = ({ payments, state }) => {
  const { user } = state;
  if (!user._id) {
    return <Error statusCode={401} />;
  }

  return (
    <Layout title="FundOSS | My Account" state={state}>
      <div className="bg1">
        <Container style={{ paddingTop: '40px' }} className="content">
          {user._id ? (
            <Row>
              <Col md={3} className="text-center text-md-left"> 
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
                <h2 style={{margin:'30px 0'}} className="text-center text-md-left">Donations History</h2>
                <PaymentsList payments={payments} state={state} />
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
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  if (req.user) {
    const payments = await Payments.getPaymentsByUser(req.user?._id);
    return {
      props: {
        state,
        payments: serializable(payments),
      },
    };
  }
  return {
    props: {
      state,
    },
  };
}

export default AccountPage;
