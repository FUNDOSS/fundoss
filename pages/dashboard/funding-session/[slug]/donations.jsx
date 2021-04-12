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
      const user = totals[p.user.username] || { donations: {}, total: 0 };
      user.donations[d.collective.slug] = (user.donations[d.collective.slug] || 0) + d.amount;
      user.total += d.amount;
      return { ...totals, ...{ [p.user.username]: user } };
    },
    totals,
  ), {});

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

  return (
    <Layout title="FundOSS | Dashboard" state={state}>
      <Container style={{ paddingTop: '40px' }}>
        <DashboardNav />
        <div className="text-center">
          <h1>Disbursments {session.name}</h1>
          <FundingSessionInfo session={session} predicted={state.current.predicted} />
          {moment(session.start) < moment() ? (
            <Prediction 
              predicted={session.predicted}
              session={session}
            />
          ) : null }
          
        </div>
        
        <br />
        <AdminLinks session={session} all />
        <hr />
        <Row>
          <Col md={6}>
            <h3>Donations by user</h3>
            <Table size="sm">
              <tr><th>user</th><th>donation</th><th>est match</th></tr>
              {userTable.map((u) => (
                <tr key={u.username}>
                  <td>{u.username}</td>
                  <td>{formatAmountForDisplay(u.total)}</td>
                  <td className="text-fat text-success">
                    {formatAmountForDisplay(Object.keys(u.donations).reduce(
                      (total, slug) => total + cmatch(u.donations[slug]), 
                      0,
                    ))}
                  </td>
                </tr>
              ))}
            </Table>
            {formatAmountForDisplay(userTable.reduce(
              (total, u) => total + Object.keys(u.donations).reduce( 
                (total, slug) => total + cmatch(u.donations[slug]),
                0,
              ),
              0,
            ))}
          </Col>
          <Col md={6}>
            <h3>Donations by collective</h3>
            <Table size="sm">
              <tr><th>collective</th><th>donation</th><th>est match</th></tr>
              {collectiveTable.map((c) => (
                <tr key={c.slug}>
                  <td>{c.slug}</td>
                  <td>{formatAmountForDisplay(c.total)}</td>
                  <td className="text-fat text-success">
                    {formatAmountForDisplay(c.donations.reduce(
                      (total, d) => total + cmatch(d),
                      0,
                    ))}
                  </td>
                </tr>
              ))}
            </Table>
            {formatAmountForDisplay(collectiveTable.reduce(
              (total, c) => total + c.donations.reduce( 
                (total, d) => total + cmatch(d),
                0,
              ),
              0,
            ))}

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
