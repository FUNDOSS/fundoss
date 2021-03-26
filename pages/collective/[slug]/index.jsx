/* eslint-disable react/no-danger */
import React from 'react';
import Error from 'next/error';
import {
  Button, Image, Col, Row, Container, 
} from 'react-bootstrap';
import Cart from '../../../lib/cart/CartController';
import Layout from '../../../components/layout';
import collectives from '../../../lib/collectives/CollectivesController';
import serializable from '../../../lib/serializable';
import middleware from '../../../middleware/all';
import CollectiveDonationCard from '../../../components/collective/CollectiveDonationCard';
import Icons from '../../../components/icons';
import CollectiveCard from '../../../components/collective/CollectiveCard';

const collectivePage = ({ collective, user, cart, similar }) => {
  if (!collective) {
    return <Error statusCode={404} />;
  }

  const {
    name, longDescription, imageUrl, 
    backgroundImageUrl, members, website, githubHandle, twitterHandle,
  } = collective;

  return (
    <div style={{background:'url('+backgroundImageUrl+') #fff top center/100% auto no-repeat'}} >
      <div style={{background: 'linear-gradient(180deg, rgba(189, 216, 255, 0.53) 20px, #FCFCFF 180px)'}}>
    <Layout title={`FundOSS | ${name}`} user={user} cart={cart}>
      
      <Container>
        <Row style={{ padding: '40px 0' }}>
          <Col md={{ span: 7 }} className="collective-content">
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
            <span className='lead'>Fiscal Host: Open Source Collective 501(c)(6)</span>
            <div dangerouslySetInnerHTML={{ __html: longDescription }} style={{padding:'20px 0'}} />
            <h5>Community</h5>
            <div style={{borderLeft:' 5px solid #02E2AC', padding:'10px 0 10px 20px'}}>
            <p>{members.length} members</p>
            {members.map(
              (member, index) => (
                index < 10 ? <Image key={member} src={member} roundedCircle width={35} height={35} /> : null
              ),
            )}
            </div>
          </Col>
          <Col>
            <CollectiveDonationCard collective={collective} />
          </Col>
        </Row>
        <Row>
        
        </Row>
      </Container>
      <div style={{background:'#E5E5E5', marginBottom:'-70px', padding:'20px 0 0 0'}}>
        <Container>
          <h5>Similar Collectives</h5>
          <p>People who’ve backed Dark Reader have also backed these projects...</p>
          <Row>{
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
    </Layout>
    </div>
    </div>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const collective = await collectives.findBySlug(query.slug);
  const cart = await Cart.get(req.session.cart);

  const similar = await collectives.similar();
  return {
    props: {
      user: serializable(req.user),
      cart: serializable(cart),
      collective: serializable(collective),
      similar: serializable(similar),
    },
  };
}

export default collectivePage;
