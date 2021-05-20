import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Card, Image, Row, Button, Col,
} from 'react-bootstrap';
import Icons from '../icons';

const truncate = (input, length) => (input.length > length ? `${input.substring(0, length)}...` : input);

const CartSimilarCollective = ({ collective }) => (
  <Card className="text-center">
    <Card.Header>
      { collective?.imageUrl ? <Image width="50" height="50" src={collective.imageUrl} roundedCircle fluid /> : null }
      <Card.Title>
        <Link href={`/collective/${collective.slug}`}>{truncate(collective.name, 20)}</Link>
      </Card.Title>
    </Card.Header>
    <Card.Body>
      {truncate(collective.description, 200)}
      <Button block variant="outline-primary" onClick={() => Cart.addItem(collective, 10)}>
        <Icons.Cart size={18} /> Add to cart
      </Button>
    </Card.Body>
  </Card>
);

const CartSimilar = ({ data }) => {
  const [similar, setSimilar] = useState();
  useEffect(async () => {
    // cartEvents.on('cartChange', (e) => console.log('similar', e.data));
    const res = await fetch(`/api/funding-session/similar?collectives=${ 
      data.map((item) => item.collective._id).join(',')}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    setSimilar(await res.json());
  }, [data]);

  return (
    <Row>
      {
    similar?.length ? similar.map(
      (collective) => (
        <Col key={collective._id}>
          <CartSimilarCollective collective={collective} />
        </Col>
      ),
    ) : null 
    }
    </Row>
  );
};

export default CartSimilar;
