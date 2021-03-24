/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import CollectiveCard from '../collective/CollectiveCard';
import OscLogo from '../../svg/osc.svg';
import GitcoinLogo from '../../svg/gitcoin.svg';

const FundingSession = ({ session, featuredCollective }) => {
  const {
    name, description, collectives, start, end,
  } = session;

  const [collectivesList, setCollectivesList] = useState(collectives);
  return (
    <>
      <div className="confetti">
        <Container>
          <Row>
            <Col md="5" lg="4" className="d-none d-md-block">
              <CollectiveCard collective={featuredCollective} />
            </Col>
            <Col className="content">
              <h1 className="display-4">{name}</h1>
              <h2>
                {moment(start).format('MMMM Do') || 'no start date yet'}
            &nbsp;to&nbsp;
                {moment(end).format('MMMM Do') || 'no end date yet'}
              </h2>
              <div className="session-description" dangerouslySetInnerHTML={{ __html: description }} />
              <p><Link href="/quadratic-funding">Learn More about Democratic Funding</Link></p>
              <p>Brought to You By</p>
              <Button href="https://www.oscollective.org/" variant="link" target="_blank"><OscLogo /></Button>
              &nbsp;&nbsp;
              <Button href="https://gitcoin.co/" variant="link" target="_blank"><GitcoinLogo /></Button>
            </Col>
          </Row>
          <p style={{ padding: '30px 0' }} className="text-center content">
            👇 Scroll to see the 
            other {collectives.length - 1} amazing 
            collectives we’re sustaining! 👇
          </p>
        </Container>
      </div>
      <Container>
        <Navbar bg="light" expand="lg">
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              onChange={(e) => {
                setCollectivesList(
                  collectives.filter(
                    (collective) => collective.name.toLowerCase().indexOf(e.target.value) > -1,
                  ),
                );
              }}
            />
          </Form>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Filter by" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Least Funded</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Most Funded</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#home">Add Filter</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Row>{
          collectivesList.map(
            (collective) => (
              <Col md={6} lg={4} key={collective.slug}>
                <CollectiveCard collective={collective} />
              </Col>
            ),
          )
        }
        </Row>
      </Container>
    </>
  );
};

export default FundingSession;
