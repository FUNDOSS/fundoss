import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import Qf from '../../utils/qf';
import { formatAmountForDisplay } from '../../utils/currency';

const DisbursmentsTable = ({ session }) => {
  const totals = Object.keys(session.disbursments).reduce(
    (t, slug) => ({
      donation: t.donation + session.disbursments[slug].donation,
      matched: t.matched + session.disbursments[slug].matched,
      fee: t.fee + session.disbursments[slug].fee,
    }), 
    {donation:0, matched:0, fee:0}
  );
  return (
    <div>
      <Table size="sm">
        <tr><th>collective</th><th>donations</th><th>matched</th><th>fee</th></tr>
        {Object.keys(session.disbursments).map((slug) => (
          <tr key={slug}>
            <td>{slug}</td>
            <td>{formatAmountForDisplay(session.disbursments[slug].donation, false)}</td>
            <td>{formatAmountForDisplay(session.disbursments[slug].matched, false)}</td>
            <td>{formatAmountForDisplay(session.disbursments[slug].fee, false)}</td>
          </tr>
        ))}
        <tr className="lead text-fat">
          <td />
          <td>{formatAmountForDisplay(totals.donation, false)}</td>
          <td>{formatAmountForDisplay(totals.matched, false)}</td>
          <td>{formatAmountForDisplay(totals.fee, false)}</td>
        </tr>
      </Table>
    </div>
  ); 
};

export default DisbursmentsTable;
