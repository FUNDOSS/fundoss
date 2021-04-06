import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Icons from '../icons';

const CartButtonMultiple = ({ nominated, session, collective }) => {
  const [hasNominated, setHasNominated] = useState(nominated);

  return (
    <>{hasNominated ? (
      <><Icons.Check size={22} />You have nominated this collective</>
    ) : (
      <Button 
        onClick={async () => {
          const body = JSON.stringify({ 
            session: session._id, 
            collective: collective._id,
          });
          const res = await fetch('/api/funding-session/nominate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
          if (res.status === 200) {
            setHasNominated(true);
          } 
          return false;
        }}
        block
        variant="outline-primary"
      >
        <Icons.Award /> Nominate {collective.name} for {session.name}
      </Button>
    )}
    </>
  );
};

export default CartButtonMultiple;
