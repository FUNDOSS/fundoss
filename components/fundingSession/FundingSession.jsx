/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import FormControl from 'react-bootstrap/FormControl';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import CollectiveCard from '../collective/CollectiveCard';
import FeaturedCollectiveCard from '../collective/FeaturedCollectiveCard';
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
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState(null);
  const change = ( filters ) => {
    if(filters.sort) setSort(filters.sort);
    if(filters.sortOn) setSortOn(filters.sortOn);
    if(filters.search) setSearch(filters.search)
    if(filters.tags) setTags(filters.tags)
    let list = collectives;
    if(filters.search || search){
      const src = filters.search || search;
      list = collectives.filter((col) => col.name.toLowerCase().indexOf(src) > -1
      || col.description?.toLowerCase().indexOf(src) > -1
      || col.longDescription?.toLowerCase().indexOf(src) > -1)
    }
    if(filters.tags?.length || (tags?.length && !filters.tags) ){
      const tagsFilter = filters.tags || tags;
      console.log(tagsFilter)
      list = collectives.filter(
        (col) => {
          let found = col.tags?.reduce( (found, tag) => tagsFilter.includes(tag) || found, false)
          return found
        }
      )
    }
    if(filters.sort || sort){
      const srt = filters.sort || sort;
      list = list.sort((a, b) => {
        const at = parseInt(a.totals?.amount), bt = parseInt(b.totals?.amount);
        return srt == 'asc' ? at - bt : bt - at;
      })
    }


    setCollectivesList(list);
  }
  return (
    <>
      <div className="confetti trapezoid">
        <Container>
          <Row>
            <Col md="5"  className="d-none d-lg-block">
              <FeaturedCollectiveCard  collective={featuredCollective} />
            </Col>
            <Col className="content">
              <h1 className="display-4" style={{textShadow: '0 0 10px #000000'}}>{name}</h1>
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
              <br />
              <Button href="#" variant="link" target="_blank"><Image src="/sponsors/sustain.svg" /></Button>
              
              <Button href="https://synthetix.io/" variant="link" target="_blank"><Image src="/sponsors/synthetix.svg" /></Button>
              <Button href="#" variant="link" target="_blank"><Image src="/sponsors/OCF.png" /></Button>
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
        <Card style={{margin: '10px 0 28px', padding: '5px'}}>
          <Row  className="no-gutters">
            <Col>
            <FormControl
              type="text"
              placeholder="Filter by name and description"
              className="mr-sm-2"
              onChange={(e) => {
                change({search: e.target.value.toLowerCase()});
              }}
            />
            </Col>
            <Col xs={4} lg={2} className="text-center"><small>Sort by</small>
            <Button 
              style={{margin:'0 10px'}}
              onClick={() => change({sort: sort === 'desc' ? 'asc' : 'desc'})} 
              variant="link">
              {sort === 'asc' ? (
                <><span className="with-caret-up"></span>Least funded</>
              ) : (
                <><span className="with-caret"></span>Most funded</>
              )}
            </Button>
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
