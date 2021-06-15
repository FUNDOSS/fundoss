import React from 'react';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import Error from '../../../components/Error';
import DashboardNav from '../../../components/dashboard/DashboardNav';
import Layout from '../../../components/layout';
import Payments from '../../../lib/payment/paymentController';
import PaymentsTable from '../../../components/payment/PaymentsTable';
import middleware from '../../../middleware/all';
import serializable from '../../../lib/serializable';

const PaymentsPage = ({ user, payments, query }) => {
  if (!user._id) {
    return <Error statusCode={401} />;
  }
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  const getQueryString = (obj) => Object.keys({ ...query, ...obj }).reduce((a, k) => { a.push(`${k}=${encodeURIComponent(obj[k])}`); return a; }, []).join('&');
  return (
    <Layout title="FundOSS | Dashboard" user={user} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <h1>Payments</h1>
        <ButtonGroup>
          <Button 
            href={`?${getQueryString({ sort: '-sybilAttackScore' })}`}
          >{query.sort === '-sybilAttackScore' ? '↓' : ' '} Sybil
          </Button>
          <Button
            href={`?${getQueryString({ sort: '-amount' })}`}
          >{query.sort === '-amount' ? '↓' : ' '} Funding
          </Button>
          <Button
            href={`?${getQueryString({ sort: '-time' })}`}
          >{query.sort === '-time' ? '↓' : ' '} Time
          </Button>
        </ButtonGroup>
        <PaymentsTable payments={payments} />
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const payments = await Payments.get(query);
  return {
    props: {
      user: serializable(req.user), 
      payments: serializable(payments),
      query, 
    }, 
  };
}

export default PaymentsPage;
