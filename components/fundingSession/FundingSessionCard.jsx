import React from 'react';
import { Card } from 'react-bootstrap';
import FundingSessionInfo from './FundingSessionInfo';
import AdminLinks from './AdminLinks';

const FundingSessionCard = ({ session, predicted }) => {
  const {
    name, slug, start
  } = session;
  return (
    <Card key={slug}>
      <Card.Body className="text-center">
        <h3>{name}</h3>
        <Card.Text>
          <FundingSessionInfo session={session} predicted={predicted} />
        </Card.Text>

      </Card.Body>
      <Card.Footer>
        <AdminLinks disbursments edit view donations session={session} />
      </Card.Footer>
    </Card>
  );
};

export default FundingSessionCard;
