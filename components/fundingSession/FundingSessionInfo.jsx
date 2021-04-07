import React from 'react';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
import Qf from '../../utils/qf';
import { formatAmountForDisplay } from '../../utils/currency';

const FundingSessionInfo = ({ session, predicted }) => {
  const {
    start, end, totals,
  } = session;

  const started = moment() > moment(start);
  const ended = moment() > moment(end);

  const totalMatches = (totals?.donations || [0]).reduce(
    (total, d) => total + Qf.calculate(
      d, 
      predicted.average, 
      predicted.match, 
      session.matchingCurve.exp,
      predicted.fudge,
      session.matchingCurve.inout,
    ),
  );

  return (
    <div className="session-info">
      {started && ended ? (<h2><small>Ended</small> {moment(end).format('MMMM Do YYYY')}</h2>) : null}
      {!started && !ended ? (
        <>
          <span className="info-span">
            <span className="lead text-fat">
              from {moment(start).format('MMMM Do')} <br />
              to {moment(end).format('MMMM Do YYYY')}
            </span> 
          </span>
          <span className="info-span">
            in matched funding<br />
            <span className="display-3 match">
              {formatAmountForDisplay(session.matchedFunds, 'USD')}
            </span>
          </span>
        </>
      ) : null}
      {started ? (
        <div>
          <span className="info-span text-center">
            {totals?.donations.length} donors<br />
            <span className="display-3">{formatAmountForDisplay(totals?.amount || 0)}</span>
          </span>
          <span className="display-4">+</span>
          <span className="info-span text-center">
            Estimated match<br />
            <span className="text-fat display-3 text-success">
              {formatAmountForDisplay(Math.round(totalMatches), 'USD')}
            </span>
          </span>&nbsp;&nbsp;
          <span className="info-span text-center">
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
    </div>
  );
};

export default FundingSessionInfo;
