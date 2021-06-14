import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import {
  Col, Row, Image, Form, Button, Spinner, 
} from 'react-bootstrap';
import Layout from '../components/layout';
import Error from '../components/Error';
import Payments from '../lib/payment/paymentController';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Icons from '../components/icons';
import PaymentsList from '../components/payment/PaymentsList';
import ServerProps from '../lib/serverProps';
import Ghost from '../lib/ghost';

const AccountPage = ({ payments, state, subscription }) => {
  const { user } = state;
  if (!user._id) {
    return <Error statusCode={401} />;
  }
  const [subscribed, setSubscribed] = useState(subscription?.subscribed);
  const [submitting, setSubmitting] = useState(false);
  const [sub, setSub] = useState(subscription);
  return (
    <Layout title="FundOSS | My Account" state={state}>
      <div className="bg1">
        <Container style={{ paddingTop: '40px' }} className="content">
          {user._id ? (
            <Row>
              <Col md={4} lg={3} className="text-center text-md-left"> 
                <h2>Profile</h2>
                <Image src={user.avatar} roundedCircle width={100} />
                <h5>Name</h5>
                {user.name}
                {user.username ? (
                  <>
                    <h5>
                      <Icons.Github size={20} />
                      {' '}
                      Github Profile
                    </h5>
                    <a href={`https://github.com/${user.username}`}>https://github.com/{user.username}</a>
                  </>
                )
                  : null}
                <h5>Updates</h5>
                { user.email }
                <Form.Check 
                  label="Subscribed for updates" 
                  checked={subscribed} 
                  onChange={async (e) => {
                    setSubscribed(e.target.checked);
                    setSubmitting(true);
                    const result = await fetch('/api/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: user.email,
                        subscribed: e.target.checked,
                      }),
                    });
                    const sub = await result.json();
                    setSub(sub.sub);
                    setSubmitting(false);
                  }}
                />
                { submitting ? <Spinner animation="border" size="sm" /> : null} 
              </Col>
              <Col>
                <h2 style={{ margin: '30px 0' }} className="text-center text-md-left">Donations History</h2>
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
    const subscription = await Ghost.getMember(req.user?.email);
    return {
      props: {
        state,
        payments: serializable(payments),
        subscription,
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
