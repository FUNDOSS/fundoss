import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import Qf from '../../utils/qf';
import { formatAmountForDisplay } from '../../utils/currency';

const DisbursmentsTable = ({ donations, session }) => {
  const numDonations = donations.length;
  const totalDonations = donations.reduce((total, d) => total + d.amount, 0);
  const averageDonation = totalDonations / numDonations;
  const averageMatch = session.matchedFunds / numDonations;
  const matches = donations.map((d) => ({
    collective: d._id.collective,
    amount: d.amount,
    match: Qf.calculate(
      d.amount, 
      averageDonation, 
      averageMatch, 
      session.matchingCurve.exp, 
      1,
      session.matchingCurve.exp,
    ),
    fee: d.fee,
  }));
  const totalMatches = matches.reduce((total, m) => total + m.match, 0);
  const matchRatio = totalMatches / session.matchedFunds;
  const collectivesTotalsInit = session.collectives.reduce(
    (cols, col) => ({ ...cols, ...{ [col._id]: { donation: 0, match: 0, fee: 0 } } }),
    {},
  );
  const collectiveTotals = matches.reduce((totals, m) => {
    const tot = totals[m.collective] ? totals[m.collective] : { donation: 0, match: 0, fee: 0 };
    const collective = {
      donation: tot.donation + m.amount,
      match: tot.match + (m.match / matchRatio),
      fee: tot.fee + m.fee,
    };
    return { ...totals, ...{ [m.collective]: collective } };
  }, collectivesTotalsInit);
  const disbursments = session.collectives.map((c) => {
    const totals = collectiveTotals[c._id];
    collectiveTotals[c._id].found = true;
    const matched = Math.round(totals.match * 100) / 100;
    const fee = Math.round(totals.fee * 100) / 100;
    const donation = Math.round(totals.donation * 100) / 100;
    return {
      slug: c.slug,
      donation,
      matched,
      fee,
      total: Math.round((donation + matched - fee) * 100) / 100,
    };
  });
  const totals = disbursments.reduce((totals, col) => ({
    donation: totals.donation + col.donation,
    matched: totals.matched + col.matched,
    fee: totals.fee + col.fee,
  }), { donation: 0, matched: 0, fee: 0 });

  return (
    <div>
      {totalMatches} / {matchRatio} = {totalMatches / matchRatio}
      <hr />
      donations <Badge variant="info">{numDonations}</Badge>
      average <Badge variant="info">{formatAmountForDisplay(averageDonation)}</Badge>
      Match <Badge variant="success">{formatAmountForDisplay(averageMatch)}</Badge> 
      fudge <Badge variant="warning">{Math.floor(100 / matchRatio) / 100}</Badge>
      <Table size="sm">
        <tr><th>collective</th><th>donations</th><th>matched</th><th>fee</th></tr>
        {disbursments.map((col) => (
          <tr key={col.slug}>
            <td>{col.slug}</td>
            <td>{col.donation}</td>
            <td>{col.matched}</td>
            <td>{col.fee}</td>
          </tr>
        ))}
        <tr>
          <td />
          <td>{formatAmountForDisplay(totals.donation)}</td>
          <td>{formatAmountForDisplay(totals.matched)}</td>
          <td>{formatAmountForDisplay(totals.fee)}</td>
        </tr>
      </Table>
      {Object.keys(collectiveTotals).map(
        (key) => (!collectiveTotals[key].found ? (
          <b>{key}{collectiveTotals[key].match}</b>
        ) : null), 
      )}
    </div>
  ); 
};

export default DisbursmentsTable;
