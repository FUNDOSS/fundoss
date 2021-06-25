import React from 'react';
import {
  Table, Col, Row, Container, 
} from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
} from 'recharts';
import moment from 'moment';
import ServerProps from '../../../../lib/serverProps';
import Error from '../../../../components/Error';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import Layout from '../../../../components/layout';
import middleware from '../../../../middleware/all';
import serializable from '../../../../lib/serializable';
import FundingSessions from '../../../../lib/fundingSession/fundingSessionController';
import Payments from '../../../../lib/payment/paymentController';
import FundingSessionInfo from '../../../../components/fundingSession/FundingSessionInfo';
import AdminLinks from '../../../../components/fundingSession/AdminLinks';
import Qf from '../../../../utils/qf';
import { formatAmountForDisplay } from '../../../../utils/currency';

const DonationsBySessionPage = ({
  state, session, payments, totals,
}) => {
  if (!state.user._id) {
    return <Error statusCode={401} />;
  }
  if (state.user?.role !== 'admin') {
    return <Error statusCode={403} />;
  }

  const cmatch = (d) => Qf.calculate(
    d,
    session.predicted.average, 
    session.predicted.match,
    session.matchingCurve.exp,
    session.predicted.fudge,
    session.matchingCurve.symetric,
  );

  const userTotals = payments.reduce((totals, p) => p.donations.reduce(
    (totals, d) => {
      const userKey = p.user?._id || 'none';
      const user = totals[userKey] 
      || {
        donations: {}, total: 0, donationCount: 0, match: 0, name: p.user?.username || p.user?.name, _id: p.user?._id,
      };
      user.donations[d.collective.slug] = (user.donations[d.collective.slug] || 0) + d.amount;
      user.donationCount += 1;
      user.total += d.amount;
      user.match += cmatch(d.amount);
      return { ...totals, ...{ [userKey]: user } };
    },
    totals,
  ), {});

  const median = (values) => {
    if (values.length === 0) return 0;
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
  };

  const collectiveTotals = Object.keys(userTotals)
    .reduce((totals, username) => Object.keys(userTotals[username].donations).reduce(
      (totals, slug) => ({
        ...totals,
        ...{
          [slug]: {
            total: (totals[slug] ? totals[slug].total : 0) + userTotals[username].donations[slug],
            match: (totals[slug] ? totals[slug].match : 0) + cmatch(userTotals[username].donations[slug]),
            donations: [
              ...(totals[slug] ? totals[slug].donations : []), 
              ...[userTotals[username].donations[slug]],
            ],
          }, 
        }, 
      }),
      totals,
    ),
    {});

  const collectiveTable = Object.keys(collectiveTotals).map(
    (slug) => ({ ...collectiveTotals[slug], ...{ slug } }),
  ).sort((a, b) => (b.total + b.match) - (a.total + a.match));

  const userTable = Object.keys(userTotals).map(
    (username) => ({ ...userTotals[username], ...{ username } }),
  ).sort((a, b) => (b.total + b.match) - (a.total + a.match));
  const stats = {
    totalMatch: totals.donations.reduce((m, d) => m + cmatch(d), 0),
    payments: payments.length,
    users: userTable.length,
    medianUserDonationCount: median(Object.keys(userTotals).map((u) => userTotals[u].donationCount)),
    medianCollectiveDonations: median(collectiveTable.map((c) => c.total)),
  };

  const cumulativeChart = payments.reduce((data, p) => p.donations.reduce(
    (data, d) => {
      const day = moment(p.time).day();
      const slot = data[day] || {
        donation: 0, match: 0, total: 0, count: 0, 
      };
      const match = Math.round(cmatch(d.amount) * 100) / 100;
      slot.day = `day ${day}`;
      slot.donation += d.amount;
      slot.match += match;
      slot.total += match + d.amount;
      slot.count += 1;
      data[day] = slot;
      return data;
    },
    data,
  ), []);

  console.log(cumulativeChart);

  return (
    <Layout title="FundOSS | Dashboard" state={state}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <div className="text-center">
          <h1>Donations Summary</h1>
          <FundingSessionInfo session={session} predicted={state.current?.predicted || session.predicted} />
        </div>
        <AdminLinks session={session} all />
        <hr />
        <ResponsiveContainer width="100%" height="100%" minHeight={350}>
          <LineChart
            width={500}
            height={350}
            data={cumulativeChart}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#dc3545" />
            <Line type="monotone" dataKey="match" stroke="#02E2AC" />
            <Line type="monotone" dataKey="donation" stroke="#3A00AD" />
          </LineChart>
        </ResponsiveContainer>
        <h3>Statistics</h3>
        <Row>
          <Col md={4}>
            number of donations : {totals.donations.length} <br />
            number of payments : {payments.length}<br />
            avg donations/payment : {Math.round(totals.donations.length * 100 / stats.payments) / 100}<br />
            median donation : {median(totals.donations)}
          </Col>
          <Col md={4}>
            number unique users : {stats.users} <br />
            avg number of donations/user : {Math.round(totals.donations.length * 100 / stats.users) / 100}<br />
            avg total amount/user : {Math.round(totals.amount * 100 / stats.users) / 100}<br />
            median donations per user : {stats.medianUserDonationCount}
          </Col>
          <Col md={4}>
            collectives : {collectiveTable.length} <br />
            avg number of donations/collective : {Math.round(totals.donations.length * 100 / collectiveTable.length) / 100}<br />
            avg match/collective : {Math.round(stats.totalMatch * 100 / collectiveTable.length) / 100}<br />
            median donation per collective : {stats.medianCollectiveDonations}
            
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={6}>
            <h3>Donations by user</h3>
            <Table size="sm">
              <thead>
                <tr><th>user</th><th>donation</th><th>est match</th></tr>
              </thead>
              <tbody>
                {userTable.map((u, i) => (i <= 100 ? (
                  <tr key={u._id}>
                    <td><a href={`/dashboard/payment/?user=${u._id}`}>{u.name}</a></td>
                    <td className="text-fat">{formatAmountForDisplay(u.total, false)}</td>
                    <td className="text-fat text-success">
                      {formatAmountForDisplay(u.match, false)}
                    </td>
                  </tr>
                ) : null))}
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h3>Donations by collective</h3>
            <Table size="sm">
              <thead>
                <tr><th>collective</th><th>donation</th><th>est match</th></tr>
              </thead>
              <tbody>
                {collectiveTable.map((c) => (
                  <tr key={c.slug}>
                    <td>{c.slug}</td>
                    <td className="text-fat">{formatAmountForDisplay(c.total, false)}</td>
                    <td className="text-fat text-success">
                      {formatAmountForDisplay(c.match, false)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ req, res, query }) {
  await middleware.run(req, res);
  const session = await FundingSessions.getBySlug(query.slug);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const totals = await Payments.getSessionTotals(session._id);
  const payments = await Payments.get({ session: session._id, status: 'succeeded' });
  const predicted = state.current ? state.current.predicted : {
    average: session.finalStats.averageDonation, 
    match: session.finalStats.averageMatch, 
    fudge: 1 / session.finalStats.matchRatio,
  };

  return {
    props: { 
      state, 
      totals,
      session: { ...serializable(session), ...{ predicted } }, 
      payments: serializable(payments), 
    }, 
  };
}
export default DonationsBySessionPage;
