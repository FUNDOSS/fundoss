import React from 'react';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
import Pluralize from 'pluralize';
import Qf from '../../utils/qf';
import Currency from '../Currency';

const FundingSessionInfo = ({ session, predicted, size = 'md' }) => {
  const {
    start, end, totals,
  } = session;

  const p = session.predicted || predicted;

  const started = moment() > moment(start);
  const ended = moment() > moment(end);

  return (
    <div className="session-info">

      <p className="lead name">{session.name}&nbsp;
        {started && !ended ? (
          <span>
            ends <Badge variant="danger"> {moment(end).fromNow()}</Badge>
          </span>
        ) : null}
        {!started ? (
          <span>
            starts <Badge variant="danger"> {moment(start).fromNow()}</Badge>
          </span>
        ) : null}
        {ended ? (
          <span>
            ended <Badge variant="danger"> {moment(end).fromNow()}</Badge>
          </span>
        ) : null}
      </p>
      { size === 'md' ? <h1 className="tagline no-margin">{session.tagline}</h1> : null }
      { size === 'sm' ? <p className="lead no-margin text-fat">{session.tagline}</p> : null }
      {started && ended && totals ? (
        <>
          <h3>Thanks to you, we raised</h3>
          <div className="display-1 final-total text-fat" style={{ marginTop: '-10px' }}>
            <Currency value={session.matchedFunds + totals?.amount} />
          </div>
          <h3>We couldn’t have done it without you.</h3>
        </>
      ) : null}
      {!started && !ended ? (
        <>
          <span className="info-span"> 
            from <span className="lead text-fat">{moment(start).format('MMMM Do')}</span> <br />
            to <span className="lead text-fat">{moment(end).format('MMMM Do YYYY')}</span>
          </span>
          <span className="info-span matched">
            matched funds:
            <div className="display-3 match" style={{ marginTop: '-10px' }}>
              <Currency value={session.matchedFunds} floor />
            </div>
          </span>
        </>
      ) : null}
      {started && !ended ? (
        <div>
          {session.collectives 
            ? (
              <span className="info-span text-center card">
                
                <span className="display-4">
                  {session.collectives.length}
                </span>
                <br />collectives
              </span>
            )
            : null }
          <span className="info-span text-center card">
             
            <span className="display-4"> {totals?.donations.length} </span>
            <br />{Pluralize('donation', totals?.donations.length)}
          </span>
          <span className="info-span text-center">
            total raised<br />
            <span className="current-total text-fat">
              <Currency value={totals?.amount + session.matchedFunds} floor />
            </span>
          </span>
         
        </div>
      ) : null }

    </div>
  );
};

export default FundingSessionInfo;
