/* eslint-disable react/no-danger */
import React from 'react';
import Pluralize from 'pluralize';
import Error from 'next/error';
import {
  Button, Image, Col, Row, Container, Card, 
} from 'react-bootstrap';
import ServerProps from '../../../lib/serverProps';
import Layout from '../../../components/layout';
import collectives from '../../../lib/collectives/CollectivesController';
import FundingSessions from '../../../lib/fundingSession/fundingSessionController';
import serializable from '../../../lib/serializable';
import middleware from '../../../middleware/all';
import CollectiveDonationCard from '../../../components/collective/CollectiveDonationCard';
import Icons from '../../../components/icons';
import CollectiveCard from '../../../components/collective/CollectiveCard';
import ShareButton from '../../../components/social/ShareButton';
import NominateBtn from '../../../components/collective/NominateBtn';
import FundingSessionInfo from '../../../components/fundingSession/FundingSessionInfo';
import Sponsors from '../../../components/fundingSession/Sponsors';

const collectivePage = ({
  collective, user, cart, similar, session, sessions, predicted, hasNominated, upComingSession,
}) => {
  if (!collective) {
    return <Error statusCode={404} />;
  }

  const isInCurrentSession = session ? sessions?.reduce(
    (is, sess) => (sess._id === session._id ? true : is),
    false,
  ) : false;

  const {
    name, longDescription, imageUrl, slug,
    members, website, githubHandle, twitterHandle,
  } = collective;
  return (
    <div className="bg1">
      <Layout title={`FundOSS | ${name}`} user={user} cart={cart} session={session} predicted={predicted}>
      
        <Container>
          <Row style={{ padding: '40px 0' }}>
            <Col md={{ span: 7 }}>
              <Image width={80} src={imageUrl} fluid roundedCircle />
              <h1 className="display-4">{name}</h1>
            
              { website ? (
                <Button className="round" size="sm" variant="outline-secondary" target="_blank" href={website} style={{ marginRight: '10px' }}>
                  <Icons.Globe size={15} />
                </Button>
              ) : null }
              { twitterHandle ? (
                <Button className="round" size="sm" variant="outline-secondary" target="_blank" href={`https://github.com/${twitterHandle}`} style={{ marginRight: '10px' }}>
                  <Icons.Twitter size={15} />
                </Button>
              ) : null }
              <Button className="round" size="sm" variant="outline-secondary" target="_blank" href={`https://github.com/${githubHandle}`}>
                <Icons.Github size={15} />
              </Button>
            &nbsp;
              <span className="lead">Fiscal Host: Open Source Collective 501(c)(6)</span>
              <div className="collective-content" dangerouslySetInnerHTML={{ __html: longDescription }} style={{ padding: '20px 0' }} />
              <h3>Community</h3>
              <div style={{ borderLeft: ' 5px solid #02E2AC', padding: '10px 0 10px 20px' }}>
                <p>{collective.membersCount || members.length} {Pluralize('member', collective.membersCount || members.length)}</p>
                {members.map(
                  (member, index) => (
                    index < 10 ? (
                      <Image 
                        key={index}
                        src={member} 
                        roundedCircle
                        width={35}
                        height={35}
                      />
                    ) : null
                  ),
                )}
              </div>
            </Col>
            <Col>
              {isInCurrentSession ? (
                <CollectiveDonationCard 
                  collective={collective}
                  session={session}
                  predicted={predicted}
                />
              ) : null}
              {!isInCurrentSession ? (
                <Card className="invert">
                  <Card.Header className="text-center content"><h3>Nominate {name}</h3></Card.Header>
                  <Card.Body className="text-center content">
                    <FundingSessionInfo session={sessions[0]} />
                    <Button size="lg" block variant="outline-primary" href={`/session/${upComingSession.slug}`}>{upComingSession.name}</Button>
                    <NominateBtn 
                      size="lg"
                      block
                      variant="outline-light"
                      nominated={hasNominated}
                      collective={collective}
                      session={upComingSession}
                      user={user}
                    />
                  </Card.Body>
                  <Card.Footer className="text-center content">

                    <Sponsors sponsors={upComingSession.sponsors} /> 
                  </Card.Footer>
                </Card>
              ) : null}
              <div style={{ margin: '30px 0', padding: '10px' }}>
                <h3>Share This Project</h3>
                <p>Projects that get social boosts from donors have a higher&nbsp;
                  likelihood of hitting their fundraising needs each year.&nbsp;
                  Please considering lending your voice to suppor these OSS projects!
                </p>
                <ShareButton platform="twitter" variant="link" url={`/collective/${slug}`} />
                <ShareButton platform="facebook" variant="link" url={`/collective/${slug}`} />
                <ShareButton platform="email" variant="link" url={`/collective/${slug}`} />
              </div>

            </Col>
          </Row>
          <Row />
        </Container>
        <div style={{ background: '#E5E5E5', marginBottom: '-70px', padding: '40px 0' }}>
          <Container>
            <h3>Similar Collectives</h3>
            <p>People who’ve backed {name} have also backed these projects...</p>
            <Row>{
          similar.map(
            (collective) => (
              <Col md={12} lg={4} key={collective.slug}>
                <CollectiveCard collective={collective} />
              </Col>
            ),
          )
        }
            </Row>
          </Container>
        </div>
      </Layout>
    </div>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);

  const session = await ServerProps.getCurrentSession();
  const collective = await collectives.findBySlug(query.slug);
  let user;
  let predicted = {}; 
  let cart = false;
  
  if (session) {
    user = await ServerProps.getUser(req.user, session._id);
    predicted = await ServerProps.getPredicted(session);
    cart = await ServerProps.getCart(req.session.cart);
    collective.totals = collective.sessionTotals.reduce(
      (totals, sess) => (sess.session == session._id ? sess : totals),
      { amount: 0, donations: [] },
    );
  } else {
    user = await ServerProps.getUser(req.user);
  }

  const sessions = await FundingSessions.getCollectiveSessions(collective._id);
  const upComingSession = await ServerProps.getUpcoming();
  const similar = await collectives.similar();

  const hasNominated = user._id 
    ? (await collectives.hasNominated(collective._id, upComingSession._id, req.user._id)) > 0
    : false;

  return {
    props: {
      hasNominated,
      predicted,
      user,
      upComingSession,
      cart, 
      collective: serializable(collective),
      similar: serializable(similar),
      sessions: serializable(sessions),
      session,
    },
  };
}

export default collectivePage;
