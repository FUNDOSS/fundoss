import React, { useState, useEffect } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

const GdprBar = () => {
  const [consent, setConsent] = useState(1);
  useEffect(() => {
    setConsent(Cookies.get('gdprconsent'));
  }, []);
  return (
    <>
      {!(Number(consent) === 1) ? (
        <Navbar bg="light" expand="lg" fixed="bottom" className="justify-content-end">
          <Container>
            <Navbar.Text>
            We use cookies to improve your user experience. <a href="/page/privacy">View Privacy Policy</a>
            </Navbar.Text>
            <div>
              <Button
                onClick={() => {
                  Cookies.set('gdprconsent', 1);
                  setConsent(1);
                }}
                variant="outline-primary"
              >Sure I like 🍪's!
              </Button>
              <Button href="https://opencollective.com/" variant="outline-secundary">Get me out of here</Button>
            </div>
          </Container>
        </Navbar>
      ) : null}
    </>
  );
};

export default GdprBar;
