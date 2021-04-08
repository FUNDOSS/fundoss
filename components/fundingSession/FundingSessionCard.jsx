import React from 'react';
import moment from 'moment';
import { Badge, Button, Card } from 'react-bootstrap';
import Graph from '../qf/graph';
import Qf from '../../utils/qf';
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
        <AdminLinks disbursments edit view session={session} />
      </Card.Footer>
    </Card>
  );
};

export default FundingSessionCard;
