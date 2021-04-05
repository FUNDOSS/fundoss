import React from 'react';
import moment from 'moment';
import { Badge, Button, Card } from 'react-bootstrap';
import Graph from '../qf/graph';
import Qf from '../../utils/qf';
import FundingSessionInfo from './FundingSessionInfo';

const FundingSessionCard = ({ session, predicted }) => {
  const {
    name, slug,
  } = session;
  return (
    <Card key={slug}>
      <Card.Body className="text-center">
        <h3>{name}</h3>
        <Card.Text>
          <FundingSessionInfo session={session} predicted={predicted} />
        </Card.Text>
        <Button variant="outline-primary" href={`/dashboard/funding-session/${slug}/edit`}>edit</Button>&nbsp;
        <Button variant="outline-secondary" href={`/session/${slug}`}>view</Button>&nbsp;
        <Button variant="outline-secondary" href={`/dashboard/funding-session/${slug}/table`}>disbursments</Button> 
      </Card.Body>
    </Card>
  );
};

export default FundingSessionCard;
