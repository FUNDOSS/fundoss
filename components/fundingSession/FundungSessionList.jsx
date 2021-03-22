import React from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import FundingSessionCard from './FundingSessionCard';

const FundingSessionsList = ({ sessions }) => {
  const fundingSessionCards = sessions.map(
    (session) => <FundingSessionCard session={session} key={session._id} />,
  );

  return (
    <>
      <CardDeck>{fundingSessionCards}</CardDeck>
    </>
  );
};

export default FundingSessionsList;
