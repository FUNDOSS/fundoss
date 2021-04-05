import React from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import FundingSessionCard from './FundingSessionCard';

const FundingSessionsList = ({ sessions, predicted }) => {
  const fundingSessionCards = sessions.map(
    (session) => <FundingSessionCard session={session} predicted={predicted} key={session._id} />,
  );

  return (
    <>
      <CardDeck>{fundingSessionCards}</CardDeck>
    </>
  );
};

export default FundingSessionsList;
