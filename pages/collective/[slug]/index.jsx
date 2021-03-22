/* eslint-disable react/no-danger */
import React from 'react';
import Error from 'next/error';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Cart from '../../../lib/cart/CartController';
import Layout from '../../../components/layout';
import collectives from '../../../lib/collectives/CollectivesController';
import serializable from '../../../lib/serializable';
import middleware from '../../../middleware/all';
import CollectiveDonationCard from '../../../components/collective/CollectiveDonationCard';

const collectivePage = ({ collective, user, cart }) => {
  if (!collective) {
    return <Error statusCode={404} />;
  }

  const {
    name, longDescription, imageUrl, backgroundImageUrl,
  } = collective;

  return (
    <Layout title={`FundOSS | ${name}`} user={user} cart={cart}>
      <Container>
        <Row style={{ padding: '40px 0' }}>
          <Col md={{ span: 7 }} className="collective-content">
            <Image src={backgroundImageUrl} fluid />
            <h1 className="display-4">{name}</h1>
            <Image src={imageUrl} fluid />
            <div dangerouslySetInnerHTML={{ __html: longDescription }} />
          </Col>
          <Col>
            <CollectiveDonationCard collective={collective} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const collective = await collectives.findBySlug(query.slug);
  const cart = await Cart.get(req.session.cart);
  return {
    props: {
      user: serializable(req.user),
      cart: serializable(cart),
      collective: serializable(collective),
    },
  };
}

export default collectivePage;
