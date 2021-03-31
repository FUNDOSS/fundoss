import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Logo from './Logo';
import ShareButton from '../components/social/ShareButton';
import { Button } from 'react-bootstrap';

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
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/faq">FAQ</Nav.Link>
              <Nav.Link href="/quadratic-funding">How democratic funding works</Nav.Link>
            </Nav>
            <h5>Social</h5>
            <Nav className="flex-column">
              <Nav.Link>Twitter</Nav.Link>
              <Nav.Link>Facebook</Nav.Link>
              <Nav.Link>Gitcoin Slack</Nav.Link>
              <Nav.Link>OSC Slack</Nav.Link>
            </Nav>
          </Col>
          <Col> 
            
            <h5>Join</h5>
            <Nav className="flex-column">
              <Nav.Link>Register to Donate</Nav.Link>
              <Nav.Link>Create A Collective</Nav.Link>
              <Nav.Link>Get In Touch</Nav.Link>
            </Nav>
            <h5>Partnership</h5>
            <p>Fund OSS is a partnership between <b>Gitcoin</b> and <b>Open Source Collective</b></p>
          </Col>
          <Col md={6}>
          <Button href="https://github.com/humanific/fundoss/issues" block size="lg" variant="outline-light">🐞Submit Bugs or Issues</Button>
          <h5>Share FundOSS.org</h5>
          <ShareButton platform="twitter" variant="link" url={'/'} />
          <ShareButton platform="facebook" variant="link" url={'/'} />
          <ShareButton platform="email" variant="link" url={'/'} />
          <p>Another way you can suppor the amazing OSS projects hosted here is by getting the word out!</p>
          <p>Please consider sharing with your friends and family.</p>
          </Col>
        </Row>
      </Container>
    )}
  </footer>
);

export default Footer;
