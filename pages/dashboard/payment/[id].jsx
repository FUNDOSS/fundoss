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
        <h1>Payments</h1>
        <Row>
          <Col>

            &nbsp;
            <h3>{formatAmountForDisplay(payment.amount)} 
              <small>-{payment.fee} fee</small>
              <Badge variant={payment.status === 'succeeded' ? 'success' : 'danger'}>{payment.status}</Badge>
            </h3>
            <div>Sybil Attack Score: {payment.sybilAttackScore}</div>
            <div>card fingerprint: <Link href={`/dashboard/payment?cardFingerprint=${payment.cardFingerprint}`}>{payment.cardFingerprint}</Link></div>
            <div>browser fingerprint: <Link href={`/dashboard/payment?browserFingerprint=${payment.browserFingerprint}`}>{payment.browserFingerprint}</Link></div>
            <h4>{moment(payment.time).format('lll')}</h4>
            <Button href={`/session/${payment.session.slug}`}>{payment.session.name}</Button>
          </Col>
          <Col><UserCard user={payment.user} /></Col>
        </Row>
        
        {payment.donations.map((don) => (
          <Row key={don.collective.slug} style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}>
            <Col xs={1} className="text-fat">
              {formatAmountForDisplay(don.amount)}
            </Col>
            <Col xs={3} className="text-fat">
              <a href={`/collective${don.collective.slug}`}>
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
