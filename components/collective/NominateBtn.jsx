import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import OAuthLoginButton from '../auth/OAuthLoginButton';
import Icons from '../icons';

const NominateBtn = ({
  nominated, session, collective, user, block, variant = 'outline-primary', size = 'md', mini = false,
}) => {
  const [hasNominated, setHasNominated] = useState(nominated);

  return (
    <>{hasNominated ? (
      <Button disabled variant="link small"><Icons.Check size={22} />Nominated</Button>
    ) : (
      <>{ user._id ? (
        <Button 
          size={size}
          variant={variant}
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
        >
          <Icons.Award size={22} /> {mini ? 'Nominate ❤️️' : `Nominate ${collective.name} ❤️️`}
        </Button>
      ) 
        : (
          <OAuthLoginButton 
            size={size}
            block={block}
            variant={variant}
            text={mini ? 'Nominate ❤️️' : 'Log in to nominate ❤️️'}
            redirect={`/api/funding-session/nominate?collective=${collective.slug}&session=${session._id}`}  
          />
        )}
      </>
    )}
    </>
  );
};

export default NominateBtn;
