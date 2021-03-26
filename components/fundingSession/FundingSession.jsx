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
import { Card } from 'react-bootstrap';

const FundingSession = ({ session, featuredCollective }) => {
  const {
    name, description, collectives, start, end, _id,
  } = session;

  const [collectivesList, setCollectivesList] = useState(collectives);
  const [sort, setSort] = useState('desc');
  const [sortOn, setSortOn] = useState('total');
  const [search, setSearch] = useState(null);
  const change = ( filters ) => {
    if(filters.sort) setSort(filters.sort);
    if(filters.sortOn) setSortOn(filters.sortOn);
    if(filters.search) setSearch(filters.search)

    let list = collectives;
    if(filters.search || search){
      const src = filters.search || search;
      list = collectives.filter((col) => col.name.toLowerCase().indexOf(src) > -1
      || col.description?.toLowerCase().indexOf(src) > -1
      || col.longDescription?.toLowerCase().indexOf(src) > -1)
    }
    if(filters.sort || sort){
      const srt = filters.sort || sort;
      list = list.sort((a, b) => {
        return srt == 'asc' ? parseInt(a.totals.amount) - parseInt(b.totals.amount) : parseInt(b.totals.amount) - parseInt(a.totals.amount);
      })
    }


    setCollectivesList(list);
  }
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
        <Card style={{margin: '10px 0', padding: '5px'}}>
          <Row>
            <Col xs={8}>
            <FormControl
              type="text"
              placeholder="Filter by name and description"
              className="mr-sm-2"
              onChange={(e) => {
                change({search: e.target.value.toLowerCase()});
              }}
            />
            </Col>
            <Col>
              <Nav>
                <NavDropdown className={sort === 'asc' ? 'caret-up' : 'caret'}
                  title={sort == 'desc' ? 'most to least funded' : 'least to most funded'}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onClick={() => change({sort:'asc'})} >Least Funded</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => change({sort:'desc'})} >Most Funded</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Col>
          </Row>

        </Card>
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
