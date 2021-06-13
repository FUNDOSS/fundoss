import React from 'react';

import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Badge, Table } from 'react-bootstrap';
import ServerProps from '../../../../lib/serverProps';
import Error from '../../../../components/Error';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import Layout from '../../../../components/layout';
import middleware from '../../../../middleware/all';
import serializable from '../../../../lib/serializable';
import FundingSessions, { getPredictedAverages } from '../../../../lib/fundingSession/fundingSessionController';
import Payments from '../../../../lib/payment/paymentController';
import FundingSessionInfo from '../../../../components/fundingSession/FundingSessionInfo';
import Prediction from '../../../../components/fundingSession/Prediction';
import AdminLinks from '../../../../components/fundingSession/AdminLinks';
import Qf from '../../../../utils/qf';
import PaymentsTable from '../../../../components/payment/PaymentsTable';
import Dump from '../../../../components/dashboard/Dump';
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
    state.current.predicted.average, 
    state.current.predicted.match,
    session.matchingCurve.exp,
    state.current.predicted.fudge,
    session.matchingCurve.symetric,
  );

  const userTotals = payments.reduce((totals, p) => p.donations.reduce(
    (totals, d) => {
      const user = totals[p.user.username] || { donations: {}, total: 0, donationCount: 0 };
      user.donations[d.collective.slug] = (user.donations[d.collective.slug] || 0) + d.amount;
      user.donationCount += 1;
      user.total += d.amount;
      return { ...totals, ...{ [p.user.username]: user } };
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
  ).sort((a, b) => b.total - a.total);

  const userTable = Object.keys(userTotals).map(
    (username) => ({ ...userTotals[username], ...{ username } }),
  ).sort((a, b) => b.total - a.total);
  const stats = {
    totalMatch: totals.donations.reduce((m, d) => m + cmatch(d), 0),
    payments: payments.length,
    users: userTable.length,
    medianUserDonationCount: median(Object.keys(userTotals).map((u) => userTotals[u].donationCount)),
    medianCollectiveDonations: median(collectiveTable.map((c) => c.total)),
  };

  return (
    <Layout title="FundOSS | Dashboard" state={state}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <div className="text-center">
          <h1>Donations Summary</h1>
          <FundingSessionInfo session={session} predicted={state.current.predicted} />
        </div>
        <AdminLinks session={session} all />
        <hr />
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
            avg match/collective : {Math.round(totals.amount * 100 / collectiveTable.length) / 100}<br />
            median donation per collective : {stats.medianCollectiveDonations}
            
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={6}>
            <h3>Donations by user</h3>
            <Table size="sm">
              <tr><th>user</th><th>donation</th><th>est match</th></tr>
              {userTable.map((u) => (
                <tr key={u.username}>
                  <td>{u.username}</td>
                  <td className="text-fat">{formatAmountForDisplay(u.total)}</td>
                  <td className="text-fat text-success">
                    {formatAmountForDisplay(Object.keys(u.donations).reduce(
                      (total, slug) => total + cmatch(u.donations[slug]), 
                      0,
                    ))}
                  </td>
                </tr>
              ))}
            </Table>
          </Col>
          <Col md={6}>
            <h3>Donations by collective</h3>
            <Table size="sm">
              <tr><th>collective</th><th>donation</th><th>est match</th></tr>
              {collectiveTable.map((c) => (
                <tr key={c.slug}>
                  <td>{c.slug}</td>
                  <td className="text-fat">{formatAmountForDisplay(c.total)}</td>
                  <td className="text-fat text-success">
                    {formatAmountForDisplay(c.donations.reduce(
                      (total, d) => total + cmatch(d),
                      0,
                    ))}
                  </td>
                </tr>
              ))}
            </Table>
          </Col>
        </Row>
        <h3>All payments for this session</h3>
        <PaymentsTable payments={payments} />

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
  return {
    props: { 
      state, 
      totals,
      session: { ...serializable(session), ...{ predicted: state.current.predicted } }, 
      payments: serializable(payments), 
    }, 
  };
}
export default DonationsBySessionPage;
