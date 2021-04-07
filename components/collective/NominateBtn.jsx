import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import GithubLoginButton from '../auth/GithubLoginButton';
import Icons from '../icons';

const NominateBtn = ({
  nominated, session, collective, user, block,
}) => {
  const [hasNominated, setHasNominated] = useState(nominated);

  return (
    <>{hasNominated ? (
      <Alert size="sm" variant="success small"><Icons.Check size={22} />Nominated</Alert>
    ) : (
      <>{ user._id ? (
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
          block={block}
          variant="outline-primary"
        >
          <Icons.Award size={22} /> Nominate
        </Button>
      ) 
        : (
          <GithubLoginButton 
            block={block}
            text="Log in to nominate"
            redirect={`/collective/${collective.slug}`}  
          />
        )}
      </>
    )}
    </>
  );
};

export default NominateBtn;
