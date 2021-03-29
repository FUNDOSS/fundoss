import React from 'react';
import moment from 'moment';
import { Badge, Button, Card } from 'react-bootstrap';
import Graph from '../qf/graph';
import Qf from '../../utils/qf';

const FundingSessionCard = ({ session }) => {
  const {
    name, start, end, slug, totals,
  } = session;
  return (
    <Card key={slug}>
      <Card.Body>
        <h3>{name}
        {totals?.donations ? (
          <p><Badge variant="info">${totals?.amount}</Badge> from <Badge variant="warning">{totals?.donations}</Badge> contributors</p>
        ) : null}
        </h3>
        <Card.Text>
          <h5>
            {moment(start).format('MMMM Do') || 'no start date yet'}
            &nbsp;to&nbsp;
            {moment(end).format('MMMM Do') || 'no end date yet'}
          </h5>
          <Graph 
            width={320}
            height={240}
            plot={(x) => Qf.calculate(
                x, 
                session.averageDonationEst, 
                session.matchedFunds / session.numberDonationEst
              )} 
            averageDonation={session.averageDonationEst} 
            averageMatch={session.matchedFunds / session.numberDonationEst} 
          />
        </Card.Text>
        <Button variant="outline-primary" href={`/dashboard/funding-session/${slug}`}>edit</Button>&nbsp;
        <Button variant="outline-secondary" href={`/session/${slug}`}>view</Button>&nbsp;
        <Button variant="outline-secondary" href={`/api/payment/${session._id}`}>disbursments csv</Button> 
      </Card.Body>
    </Card>
  );
};

export default FundingSessionCard;
