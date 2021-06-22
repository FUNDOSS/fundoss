import React from 'react';
import {
  Container, ButtonGroup, Button, Pagination, Nav, NavItem, 
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
  const sort = query.sort ? {
    on: query.sort.indexOf('-') === 0 ? query.sort.substring(1) : query.sort, 
    dir: query.sort.indexOf('-') === 0 ? -1 : 1, 
  } : { on: 'time', dir: -1 };

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
  const paging = () => (count > pageSize ? <Pagination>{items}</Pagination> : null);
  const sortIcon = (key) => {
    if (sort.on === key) {
      return sort.dir === -1 ? '↓' : '↑';
    }
    return ' ';
  }
  return (
    <Layout title="FundOSS | Dashboard" user={user} hidefooter={1}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <h1> Payments</h1>

        <div>
          <Nav className="float-right sort" activeKey={sort.on}>
            <Nav.Link  
              eventKey="sybilAttackScore" 
              href={`?${getQueryString({ page: 1, sort: sort.dir === -1 ? 'sybilAttackScore' : '-sybilAttackScore' })}`}
            >{sortIcon('sybilAttackScore')} Sybil
            </Nav.Link>
            <Nav.Link
              eventKey="amount" 
              href={`?${getQueryString({ page: 1, sort: sort.dir === -1 ? 'amount' : '-amount' })}`}
            >{sortIcon('amount')} Amount
            </Nav.Link>
            <Nav.Link
              eventKey="time" 
              href={`?${getQueryString({ page: 1, sort: sort.dir === -1 ? 'time' : '-time' })}`}
            >{sortIcon('time')} Time
            </Nav.Link>
          </Nav>
          <hr />showing {payments.length} of {count} Payments <br />
          
          {paging()}
          <PaymentsTable payments={payments} />
          {paging()}
        </div>

      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const pageSize = 10;
  const page = await Payments.getPage(query, pageSize);
  return {
    props: {
      user: serializable(req.user), 
      payments: serializable(page.payments),
      count: page.count,
      page: page.page,
      pageSize,
      query, 
    }, 
  };
}

export default PaymentsPage;
