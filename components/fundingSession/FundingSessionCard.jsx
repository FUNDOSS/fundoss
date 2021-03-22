import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const FundingSessionCard = ({ session }) => {
  const {
    name, start, end, description, slug,
  } = session;
  return (
    <Card key={slug}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
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
