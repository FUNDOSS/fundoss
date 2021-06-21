import React from 'react';
import {
  Container, ButtonGroup, Button, Pagination, 
} from 'react-bootstrap';
import Error from '../../../components/Error';
import DashboardNav from '../../../components/dashboard/DashboardNav';
import Layout from '../../../components/layout';
import Payments from '../../../lib/payment/paymentController';
import PaymentsTable from '../../../components/payment/PaymentsTable';
import middleware from '../../../middleware/all';
import serializable from '../../../lib/serializable';

const PaymentsPage = ({
  user, payments, count, page, pageSize, query, 
}) => {
  if (!user._id) {
    return <Error statusCode={401} />;
  }
  if (user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  const getQueryString = (obj) => {
    const params = { ...query, ...obj };
    return Object.keys(params).map((p) => `${p}=${encodeURIComponent(params[p])}`, []).join('&');
  };
  const max = Math.ceil(count / pageSize);
  const items = [];
  for (let i = 1; i <= max; i += 1) {
    items.push(
      <Pagination.Item href={`?${getQueryString({ page: i })}`} key={i} active={i === page}>
        {i }
      </Pagination.Item>,
    );
  }

  return (
    <Layout title="FundOSS | Dashboard" user={user} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <h1>{count} Payments</h1>


        <div>
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
          <hr />showing {payments.length} of {count} Payments <br />
          
          {count > page * pageSize ? <Pagination>{items}</Pagination> : null}
          <PaymentsTable payments={payments} />
          {count > page * pageSize ? <Pagination>{items}</Pagination> : null}
        </div>

      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const page = await Payments.getPage(query, 200);
  return {
    props: {
      user: serializable(req.user), 
      payments: serializable(page.payments),
      count: page.count,
      page: page.page,
      pageSize: 200,
      query, 
    }, 
  };
}

export default PaymentsPage;
