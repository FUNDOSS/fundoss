import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import Logo from './Logo';
import ShareButton from './social/ShareButton';

const Footer = ({ minimal, state }) => (
  <footer>
    {minimal ? (
      <Container>&copy; Fundoss 2021</Container>
    ) : (
      <Container>
        <Logo className="logo" width={240} height={80} />
        <Row>
          <Col lg={{span:3, offset:1}}>
            <h5>Platform</h5>
            <Nav className="flex-column">
              <Nav.Link href="https://blog.opencollective.com/fundoss-faqv1/">FAQ</Nav.Link>
              <Link href="/democratic-funding"><Nav.Link href="/democratic-funding">How democratic funding works</Nav.Link></Link>
              <Nav.Link href="https://opencollective.com/fundoss" target="_blank">FundOSS Collective</Nav.Link>
            </Nav>
            <h5>Social</h5>
            <Nav className="flex-column">
              <Nav.Link href="https://twitter.com/opencollect" target="_blank">OSC Twitter</Nav.Link>
              <Nav.Link href="https://twitter.com/gitcoin" target="_blank">Gitcoin Twitter</Nav.Link>
              <Nav.Link href="https://discord.com/invite/jWUzf7b8Yr" target="_blank">Gitcoin Discord</Nav.Link>
              <Nav.Link href="https://slack.opencollective.com/" target="_blank">OSC Slack</Nav.Link>
            </Nav>
          </Col>
          <Col lg={3}> 
            
            <h5>Join</h5>
            <Nav className="flex-column">
              <Nav.Link href="/api/auth/github">Register to Donate</Nav.Link>
              <Nav.Link href="https://opencollective.com/create" target="_blank">Create A Collective</Nav.Link>
              <Nav.Link href="mailto:support@opencollective.com">Get In Touch</Nav.Link>
            </Nav>
            <h5>Partnership</h5>
            <p>
              FundOSS is a partnership between <a href="https://gitcoin.co" target="_blank">Gitcoin</a>&nbsp;
              and <a href="https://opencollective.com" target="_blank">Open Source Collective</a>
            </p>
          </Col>
          <Col md={6} lg={4}>
            <Button href="https://github.com/humanific/fundoss/issues" block size="lg" variant="outline-light">🐞Submit Bugs or Issues</Button>
            <h5>Share FundOSS.org</h5>
            <ShareButton platform="twitter" variant="link" siteUrl={state.siteUrl} url="/" />
            <ShareButton platform="facebook" variant="link" siteUrl={state.siteUrl} url="/" />
            <ShareButton platform="email" variant="link" siteUrl={state.siteUrl} url="/" />
            <p>Another way you can support the amazing OSC collectives&nbsp;
               hosted here is by getting the word out!
            </p>
            <p>Please consider sharing with your friends and family.</p>
          </Col>
        </Row>
      </Container>
    )}
  </footer>
);

export default Footer;
