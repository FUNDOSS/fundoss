import React from 'react';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import ServerProps from '../../../lib/serverProps';
import Error from '../../../components/Error';
import DashboardNav from '../../../components/dashboard/DashboardNav';
import UserCard from '../../../components/dashboard/UserCard';
import Layout from '../../../components/layout';
import Payments from '../../../lib/payment/paymentController';
import middleware from '../../../middleware/all';
import serializable from '../../../lib/serializable';
import { formatAmountForDisplay } from '../../../utils/currency';
import Dump from '../../../components/dashboard/Dump';
import CancelPayment from '../../../components/payment/CancelPayment';
import VerifyPayment from '../../../components/payment/VerifyPayment';

const PaymentsPage = ({ state, payment }) => {
  if (!state.user._id) {
    return <Error statusCode={401} />;
  }
  if (state.user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  return (
    <Layout title="FundOSS | Dashboard" state={state} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <h1>Payment Detail</h1>
        <VerifyPayment payment={payment} />
        <Row>
          <Col>
            &nbsp;
            <h3>{formatAmountForDisplay(payment.amount)} 
              <small>-{payment.fee} fee</small>
              <Badge variant={payment.status === 'succeeded' ? 'success' : 'danger'}>{payment.status}</Badge>
            </h3>
            {payment.status !== 'error' ? (
              <>
                <div>Sybil attack Score: {payment.sybilAttackScore}</div>
                <div>Stripe risk Score: {payment.stripeRisk}</div>
                { payment.ipAddress 
                  ? <div>IP address: <Link href={`/dashboard/payment?ipAddress=${payment.ipAddress}`}>{payment.ipAddress}</Link></div>
                  : null}
                { payment.cardFingerprint 
                  ? <div>card fingerprint: <Link href={`/dashboard/payment?cardFingerprint=${payment.cardFingerprint}`}>{payment.cardFingerprint}</Link></div>
                  : null}
                { payment.browserFingerprint 
                  ? <div>browser fingerprint: <Link href={`/dashboard/payment?browserFingerprint=${payment.browserFingerprint}`}>{payment.browserFingerprint}</Link></div>
                  : null}
                <h4>{moment(payment.time).format('lll')}</h4>
                <Button href={`/dashboard/payment?session=${payment.session._id}`}>session : {payment.session.name}</Button>
                &nbsp;
                <CancelPayment payment={payment} />
              </>
            ) : null }
          </Col>
          <Col><UserCard user={payment.user} /></Col>
        </Row>
        { payment.status === 'cancelled' && payment.refund ? <Dump data={payment.refund} /> : null }
        { payment.status !== 'error' ? (
          <>{payment.donations.map((don) => (
            <Row key={don.collective.slug} style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}>
              <Col xs={1} className="text-fat">
                {formatAmountForDisplay(don.amount)}
              </Col>
              <Col xs={3} className="text-fat">
                <a href={`/dashboard/payment/?collective=${don.collective._id}`}>
                  <Image src={don.collective.imageUrl} roundedCircle width={20} />&nbsp;
                  {don.collective.name}
                </a>
              </Col>
              <Col>
                {formatAmountForDisplay(don.fee, false)} 
              </Col>
            </Row>
            
          ))}
            <Dump data={payment.confirmation} />
          </>
        ) : <Dump data={payment.error} /> }
        
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const payment = await Payments.findById(query.id);
  const state = await ServerProps.getAppState(req.user, req.session.cart);

  return { props: { state, payment: serializable(payment) } };
}

export default PaymentsPage;
