import React from 'react';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
import Qf from '../../utils/qf';
import { formatAmountForDisplay } from '../../utils/currency';

const FundingSessionInfo = ({ session }) => {
  const {
    collectives, start, end, totals,
  } = session;

  const started = moment() > moment(start);
  const ended = moment() > moment(end);

  const totalMatches = totals?.donations.reduce(
    (total, d) => total + Qf.calculate(d),
  ) || 0;

  return (
    <>
      {started && ended ? (<h2><small>Ended</small> {moment(end).format('MMMM Do YYYY')}</h2>) : null}
      {!started && !ended ? (
        <>
          <span style={{ display: 'inline-block' }}>
            <span className="lead  text-fat">
              from {moment(start).format('MMMM Do')} <br />
              to {moment(end).format('MMMM Do YYYY')}
            </span> 
          </span>
          <span style={{ display: 'inline-block' }} className="text-center">
            in matched funding<br />
            <span className="display-2 text-success text-fat">
              {formatAmountForDisplay(session.matchedFunds, 'USD')}
            </span>
          </span>
        </>
      ) : null}
      {started ? (
        <div>
          <span style={{ display: 'inline-block' }} className="text-center">
            {totals?.donations.length} donors<br />
            <span className="display-3">{formatAmountForDisplay(totals.amount)}</span>
          </span>
                  &nbsp;&nbsp;+&nbsp;&nbsp;
          <span style={{ display: 'inline-block' }} className="text-center">
            Estimated match<br />
            <span className="text-fat display-3 text-success">
              {formatAmountForDisplay(Math.round(totalMatches), 'USD')}
            </span>
          </span>&nbsp;&nbsp;
          <span style={{ display: 'inline-block' }} className="text-center">
            Remaining<br />
            <span className="display-3 text-fat">
              {formatAmountForDisplay(Math.round(session.matchedFunds - totalMatches), 'USD')}
            </span>
          </span>
        </div>
                   
      ) : null }

      {started && !ended ? (
        <span className="lead text-fat">
          ends {moment(end).format('MMMM Do')} <Badge variant="danger"> {moment(end).fromNow()}</Badge>
        </span>
      ) : null}
    </>

  );
};

export default FundingSessionInfo;
