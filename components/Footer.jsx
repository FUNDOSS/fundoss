import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import Logo from './Logo';
import ShareButton from './social/ShareButton';

const Footer = ({ minimal }) => (
  <footer>
    {minimal ? (
      <Container>&copy; Fundoss 2021</Container>
    ) : (
      <Container>
        <Logo width={340} height={80} />
        <Row>
          <Col>
            <h5>Platform</h5>
            <Nav className="flex-column">
              <Nav.Link><Link href="/about">About</Link></Nav.Link>
              <Nav.Link href="https://blog.opencollective.com/fundoss-faqv1/">FAQ</Nav.Link>
              <Nav.Link><Link href="/democratic-funding">How democratic funding works</Link></Nav.Link>
            </Nav>
            <h5>Social</h5>
            <Nav className="flex-column">
              <Nav.Link href="https://twitter.com/opencollect" target="_blank">OSC Twitter</Nav.Link>
              <Nav.Link href="https://twitter.com/gitcoin" target="_blank">Gitcoin Twitter</Nav.Link>
              <Nav.Link href="https://discord.com/invite/jWUzf7b8Yr" target="_blank">Gitcoin Discord</Nav.Link>
              <Nav.Link href="https://slack.opencollective.com/" target="_blank">OSC Slack</Nav.Link>
            </Nav>
          </Col>
          <Col> 
            
            <h5>Join</h5>
            <Nav className="flex-column">
              <Nav.Link href="/api/auth/github">Register to Donate</Nav.Link>
              <Nav.Link href="https://opencollective.com/create" target="_blank">Create A Collective</Nav.Link>
              <Nav.Link href="mailto:info@opencollective.com">Get In Touch</Nav.Link>
            </Nav>
            <h5>Partnership</h5>
            <p>
              Fund OSS is a partnership between <b>Gitcoin</b>&nbsp;
              and <b>Open Source Collective</b>
            </p>
          </Col>
          <Col md={6}>
            <Button href="https://github.com/humanific/fundoss/issues" block size="lg" variant="outline-light">🐞Submit Bugs or Issues</Button>
            <h5>Share FundOSS.org</h5>
            <ShareButton platform="twitter" variant="link" url="/" />
            <ShareButton platform="facebook" variant="link" url="/" />
            <ShareButton platform="email" variant="link" url="/" />
            <p>Another way you can suppor the amazing OSS&nbsp;
              projects hosted here is by getting the word out!
            </p>
            <p>Please consider sharing with your friends and family.</p>
          </Col>
        </Row>
      </Container>
    )}
  </footer>
);

export default Footer;
