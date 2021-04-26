/* eslint-disable react/no-danger */
import React from 'react';
import Pluralize from 'pluralize';
import {
  Button, Image, Col, Row, Container, Card, 
} from 'react-bootstrap';
import Link from 'next/link';
import Error from '../../../components/Error';
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
import SubscriptionForm from '../../../components/SubscriptionForm';

const collectivePage = ({
  collective, state, 
  similar, sessions, 
  predicted, hasNominated,
  hostingUrl,
}) => {
  if (!collective) {
    return <Error statusCode={404} />;
  }

  const isInCurrentSession = state.current ? sessions?.reduce(
    (is, sess) => (sess._id === state.current._id ? true : is),
    false,
  ) : false;

  const {
    name, longDescription, imageUrl, slug, description,
    members, website, githubHandle, twitterHandle, shareImage,
  } = collective;

  return (
    <div className="bg1">
      <Layout
        title={`FundOSS | ${!isInCurrentSession ? 'vote for' : 'multiply your donations for'} ${name}`}
        state={state} 
        meta={{ 
          card: 'summary_large_image',
          img: shareImage ? hostingUrl + shareImage : `${hostingUrl}/api/image/collective/${slug}`,
          url: `${hostingUrl}/collective/${slug}`,
          description,
        }}
      >
        <Container>
          <Row style={{ padding: '40px 0' }}>
            <Col lg={{ span: 7 }} className="text-center text-lg-left">
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
            &nbsp;<div className="d-block d-lg-none" />
              <span style={{ padding: '5px 0 0 10px' }} className="lead">Fiscal Host: Open Source Collective 501(c)(6)</span>
              <div className="collective-content" dangerouslySetInnerHTML={{ __html: longDescription }} style={{ padding: '20px 0' }} />
              <h3>Community</h3>
              <div style={{ borderLeft: ' 5px solid #02E2AC', padding: '10px 0 10px 20px', marginBottom: '20px' }}>
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
                  session={state.current}
                  predicted={predicted}
                />
              ) : null}
              {!isInCurrentSession && sessions.length ? (
                <Card className="invert">
                  <Card.Header className="text-center content">
                    <FundingSessionInfo session={state.upcoming} size="sm" />
                    <Link href={`/session/${state.upcoming.slug}`}>
                      <Button size="lg" variant="outline-light">Find out more</Button>
                    </Link>
                  </Card.Header>
                  <Card.Body className="text-center content">
                    {state.upcoming.allowNomination 
                      ? (
                        <NominateBtn 
                          size="lg"
                          block
                          variant="outline-light"
                          nominated={hasNominated}
                          collective={collective}
                          session={state.upcoming}
                          user={state.user}
                        />
                      ) : null}
                    <p>Sign Up to be notified when you can support {name}</p>
                    <SubscriptionForm user={state.user} />
                  </Card.Body>
                  <Card.Footer className="text-center content">

                    <Sponsors sponsors={state.upcoming.sponsors} /> 
                  </Card.Footer>
                </Card>
              ) : null}
              <div style={{ margin: '30px 0', padding: '10px' }}>
                <h3>Share This Project</h3>
                <p>Projects that get social boosts from donors have a higher&nbsp;
                  likelihood of hitting their fundraising needs each year.&nbsp;
                  Please considering lending your voice to suppor these OSS projects!
                </p>
                <ShareButton platform="twitter" variant="link" siteUrl={state.siteUrl} />
                <ShareButton platform="facebook" variant="link" siteUrl={state.siteUrl} />
                <ShareButton platform="email" variant="link" siteUrl={state.siteUrl} />
              </div>

            </Col>
          </Row>
          <Row />
        </Container>
        { similar ? (
          <div className="similar">
            <Container>
              <h3>Similar Collectives</h3>
              <p>People who’ve backed {name} have also backed these projects...</p>
              <Row>
                { 
                  similar.map(
                    (collective) => (
                      <Col md={6} lg={4} key={collective.slug}>
                        <CollectiveCard collective={collective} />
                      </Col>
                    ),
                  )
}
              </Row>
            </Container>
          </div>
        ) : null}
      </Layout>
    </div>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const collective = await collectives.findBySlug(query.slug);
  if (collective) {
    const state = await ServerProps.getAppState(req.user, req.session.cart);
    const sessions = await FundingSessions.getCollectiveSessions(collective._id);

    if (state.current) {
      collective.totals = collective.sessionTotals.filter((t) => t.session == state.current._id)[0];
    }
    const hasNominated = req.user?._id 
      ? (await collectives.hasNominated(collective._id, state.upcoming._id, req.user?._id)) > 0
      : false;
  
    return {
      props: {
        state,
        hasNominated,
        collective: serializable(collective),
        similar: state.current ? serializable(
          await collectives.similar(state.current._id, collective._id),
        ) : false,
        sessions: serializable(sessions),
        hostingUrl: process.env.HOSTING_URL,
      },
    };
  }
  return { props: { collective } };
}

export default collectivePage;
