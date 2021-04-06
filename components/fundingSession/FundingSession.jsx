/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import { Card, Image } from 'react-bootstrap';
import CollectiveCard from '../collective/CollectiveCard';
import FeaturedCollectiveCard from '../collective/FeaturedCollectiveCard';
import Sponsors from './Sponsors';
import Qf from '../../utils/qf';
import FundingSessionInfo from './FundingSessionInfo';
import Nominate from '../collective/NominateForm';

const FundingSession = ({ session, featuredCollective, user, predicted }) => {
  const {
    name, description, collectives, start, end, sponsors, 
  } = session;

  const [collectivesList, setCollectivesList] = useState(collectives);
  const [sort, setSort] = useState('desc');
  const [setSortOn] = useState('total');
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState(null);
  const started = moment() > moment(start);
  const ended = moment() > moment(end);
  const sessionInfo = collectives.reduce(
    (info, c) => ({ 
      match: info.match + (c.totals?.donations?.reduce(
        (total, d) => total + Qf.calculate(d),
        0,
      ) || 0),
      collectives: { ...info.collectives, ...{ [c._id]: c } },
    }),
    { match: 0, collectives: {} },
  );
  
  const totalMatches = sessionInfo.match;
  const userDonations = user.donations ? Object.keys(user.donations).map(
    (key) => ({ collective: sessionInfo.collectives[key], amount: user.donations[key] }), 
  ) : null;

  const change = (filters) => {
    if (filters.sort) setSort(filters.sort);
    if (filters.sortOn) setSortOn(filters.sortOn);
    if (filters.search) setSearch(filters.search);
    if (filters.tags) setTags(filters.tags);
    let list = collectives;
    if (filters.search || search) {
      const src = filters.search || search;
      list = collectives.filter((col) => col.name.toLowerCase().indexOf(src) > -1
      || col.description?.toLowerCase().indexOf(src) > -1
      || col.longDescription?.toLowerCase().indexOf(src) > -1);
    }
    if (filters.tags?.length || (tags?.length && !filters.tags)) {
      const tagsFilter = filters.tags || tags;
      list = collectives.filter(
        (col) => {
          const found = col.tags?.reduce((found, tag) => tagsFilter.includes(tag) || found, false);
          return found;
        },
      );
    }
    if (filters.sort || sort) {
      const srt = filters.sort || sort;
      list = list.sort((a, b) => {
        const at = parseInt(a.totals?.amount, 10); const 
          bt = parseInt(b.totals?.amount, 10);
        return srt === 'asc' ? at - bt : bt - at;
      });
    }

    setCollectivesList(list);
  };
  return (
    <>
      <div className="confetti trapezoid">
        <Container>
          <Row>
            <Col md="5" className="d-none d-lg-block">
              {started ? (
                <FeaturedCollectiveCard 
                  collective={featuredCollective} 
                  active={started && !ended} 
                />
              ) : (
                <Nominate sessionId={session._id} />
              )}
            </Col>
            <Col className="content text-center text-lg-left">
              <h1 className="no-margin" style={{ textShadow: '0 0 10px #000000' }}>{name}</h1>

              <FundingSessionInfo session={session} predicted={predicted} />

              {user.donations?.length 
                ? (
                  <div style={{ margin: '15px 0' }}>Your donnations : <br />{userDonations.map( 
                    (donation) => (
                      <Image 
                        width={30} 
                        height={30} 
                        key={donation.collective._id} 
                        src={donation.collective.imageUrl} 
                        roundedCircle 
                        fluid
                      />
                    ),
                  )}
                  </div>
                ) : (
                  <>
                    <div className="session-description" dangerouslySetInnerHTML={{ __html: description }} />
                    <p><Link href="/democratic-funding">Learn More about Democratic Funding</Link></p>
                  </>
                )}

              <Sponsors sponsors={sponsors} />
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
        <Card style={{ margin: '10px 0 28px', padding: '5px' }}>
          <Row className="no-gutters">
            <Col>
              <FormControl
                type="text"
                placeholder="Filter by name and description"
                className="mr-sm-2"
                onChange={(e) => {
                  change({ search: e.target.value.toLowerCase() });
                }}
              />
            </Col>
            { started ? (
              <Col xs={4} lg={2} className="text-center"><small className="d-none d-md-inline">Sort by</small>
                <Button 
                  style={{ margin: '0 10px' }}
                  onClick={() => change({ sort: sort === 'desc' ? 'asc' : 'desc' })} 
                  variant="link"
                >
                  {sort === 'asc' ? (
                    <><span className="with-caret-up" />Funding</>
                  ) : (
                    <><span className="with-caret" />Funding</>
                  )}
                </Button>
              </Col>
            ) : null}

          </Row>

        </Card>
        <Row>{
          collectivesList.map(
            (collective) => (
              <Col md={6} lg={4} key={collective.slug}>
                <CollectiveCard collective={collective} active={started && !ended} />
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
