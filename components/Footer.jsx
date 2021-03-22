import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Logo from '../svg/logo.svg';

const Footer = ({ minimal }) => (
  <footer>
    {minimal ? (
      <Container>&copy; Fundoss 2021</Container>
    ) : (
      <Container>
        <Row>
          <Col>
            <div style={{ padding: '10px 0 20px 17px' }}><Logo /></div>
            <Nav className="flex-column">
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/faq">FAQ</Nav.Link>
              <Nav.Link href="/quadratic-funding">How democratic funding works</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    )}
  </footer>
);

export default Footer;
