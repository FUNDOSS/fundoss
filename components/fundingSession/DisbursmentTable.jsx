import React from 'react';
import { Table } from 'react-bootstrap';

const DisbursmentsTable = ({ session }) => {
  const totals = Object.keys(session.disbursments).reduce(
    (t, slug) => ({
      donation: t.donation + session.disbursments[slug].donation,
      matched: t.matched + session.disbursments[slug].matched,
      fee: t.fee + session.disbursments[slug].fee,
    }), 
    { donation: 0, matched: 0, fee: 0 },
  );
  const numberFormat = new Intl.NumberFormat(['en-US']);
  return (
    <div>
      <Table size="sm">
        <tr><th>collective</th><th>donations</th><th>matched</th><th>fee</th></tr>
        {Object.keys(session.disbursments).map((slug) => (
          <tr key={slug}>
            <td>{slug}</td>
            <td>{numberFormat.format(session.disbursments[slug].donation)}</td>
            <td>{numberFormat.format(session.disbursments[slug].matched)}</td>
            <td>{numberFormat.format(session.disbursments[slug].fee)}</td>
          </tr>
        ))}
        <tr className="lead text-fat">
          <td />
          <td>{numberFormat.format(totals.donation)}</td>
          <td>{numberFormat.format(totals.matched)}</td>
          <td>{numberFormat.format(totals.fee)}</td>
        </tr>
      </Table>
    </div>
  ); 
};

export default DisbursmentsTable;
