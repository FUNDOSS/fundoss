import React from 'react';
import moment from 'moment';
import { Badge, Button, Card } from 'react-bootstrap';

const FundingSessionCard = ({ session }) => {
  const {
    name, start, end, description, slug, totals,
  } = session;
  return (
    <Card key={slug}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        {totals?.donations ? <p><Badge variant="info">${totals?.amount} from {totals?.donations} contributors</Badge></p> : null}
        <Card.Text>
          <b>
            {moment(start).format('MMMM Do') || 'no start date yet'}
            &nbsp;to&nbsp;
            {moment(end).format('MMMM Do') || 'no end date yet'}
          </b>
          <p>{description}</p>
        </Card.Text>
        <Button variant="primary" href={`/dashboard/funding-session/${slug}`}>edit</Button>&nbsp;
        <Button variant="primary" href={`/session/${slug}`}>view</Button>
      </Card.Body>
    </Card>
  );
};

export default FundingSessionCard;
