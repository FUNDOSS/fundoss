/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
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

const FundingSession = ({
  session, user, predicted, nominations = { user: [] },
}) => {
  const {
    name, description, collectives, start, end, sponsors, 
  } = session;

  const [collectivesList, setCollectivesList] = useState(collectives.map((c) => ({ ...c })));
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
  
  const featuredCollective = collectives[Math.floor(Math.random() * collectives.length)];
  
  const userDonations = user.donations ? Object.keys(user.donations).map(
    (key) => ({ collective: sessionInfo.collectives[key], amount: user.donations[key] }), 
  ) : null;

  let timer;
  const typeInSearch = (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      change({ search: value });
      return () => clearTimeout(timer);
    }, 500);
  };
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
        let av; let bv;
        if (started) {
          av = parseInt(a.totals?.amount, 10); 
          bv = parseInt(b.totals?.amount, 10);
        } else {
          av = nominations[a._id];
          bv = nominations[b._id];
        }

        return srt === 'asc' ? av - bv : bv - av;
      });
    }

    setCollectivesList(list);
  };
  return (
    <>
      <div className="seamless trapezoid">
        <Container>
          <Row>
            <Col md="5" className="d-none d-lg-block">
              <div style={{ maxWidth: '370px', margin: '0 auto' }}>
                {started ? (
                  <FeaturedCollectiveCard 
                    collective={featuredCollective} 
                    active={started && !ended}
                  />
                ) : (
                  <Nominate sessionId={session._id} />
                )}
              </div>
            </Col>
            <Col className="content text-center text-lg-left">
              <h1 className="no-margin" style={{ textShadow: '0 0 10px #000000' }}>{name}</h1>

              <FundingSessionInfo session={session} predicted={predicted} />
              {user.role === 'admin' ? <Button variant="outline-light" href={`/dashboard/funding-session/${session._id}/edit`}>Edit</Button> : null}
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
          { started ? (
            <p style={{ padding: '30px 0' }} className="text-center content">
              👇 Scroll to see the 
              other {collectives.length - 1} amazing 
              collectives we’re sustaining! 👇
            </p>
          ) : null }
          { !started ? (
            <p style={{ padding: '30px 0' }} className="text-center content">
              👇 Nominate your favorite collectives 👇
            </p>
          ) : null }
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
                onChange={(e) => typeInSearch(e.target.value.toLowerCase())}
              />
            </Col>
            { started ? (
              <Col xs={4} lg={2} className="text-center">
                <div className="sort">
                  <small className="d-none d-md-inline">Sort by</small>
                  <Button 
                    size="sm"
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
                </div>
              </Col>
            ) : null}
            { !started ? (
              <Col xs={4} lg={2} className="text-center">
                <div className="sort"><small className="d-none d-md-inline">Sort by</small>
                  <Button 
                    size="sm"
                    style={{ margin: '0 10px' }}
                    onClick={() => change({ sort: sort === 'desc' ? 'asc' : 'desc' })} 
                    variant="link"
                  >
                    {sort === 'asc' ? (
                      <><span className="with-caret-up" />Votes</>
                    ) : (
                      <><span className="with-caret" />Votes</>
                    )}
                  </Button>
                </div>
              </Col>
            ) : null}
          </Row>

        </Card>
        <Row>{
          collectivesList.map(
            (collective) => (
              <Col md={6} lg={4} key={collective.slug}>
                <CollectiveCard 
                  collective={collective}
                  active={started && !ended}
                  nominate={!started}
                  nominations={nominations[collective._id]}
                  nominated={nominations.user.indexOf(collective._id) > -1}
                  session={session}
                  user={user}
                />
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
