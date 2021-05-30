import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Card, Image, Row, Button, Col, Badge,
} from 'react-bootstrap';

const truncate = (input, length) => (input && input?.length > length ? `${input.substring(0, length)}...` : input);

const CartSimilarCollective = ({ collective, addItem }) => (
  <>
    <Card
      style={{ width: '100%' }}
      className="text-center small d-none d-md-block"
    >
      <Card.Header style={{ padding: '10px' }}>
        { collective?.imageUrl ? <Image width="30" height="30" src={collective.imageUrl} roundedCircle fluid /> : null }
        <br />
        <b className="text-fat">
          <Link href={`/collective/${collective.slug}`}>{truncate(collective.name, 20)}</Link>
        </b>
      </Card.Header>
      <Card.Body style={{ padding: '10px' }}>
        <Button block size="sm" variant="outline-primary" onClick={() => addItem(collective)}>
          Add to cart
        </Button>
      </Card.Body>
      <Card.Footer style={{ padding: '10px' }}>
        {truncate(collective.description, 30)}
        <Link href={`/collective/${collective.slug}`}>
          <Button block size="sm" variant="link">
            Read more
          </Button>
        </Link>
      </Card.Footer>
    </Card>
    <Button className="d-md-none d-block" block size="sm" variant="link" onClick={() => addItem(collective)}>
      { collective?.imageUrl ? <Image width="30" height="30" src={collective.imageUrl} roundedCircle fluid /> : null }
      <Badge style={{ margin: '-10px 0 10px 0' }} variant="info round">+</Badge>
      <br />
      <b>{truncate(collective.name, 20)}</b>
    </Button>
  </>
);

const CartSimilar = ({ data, addItem }) => {
  const [similar, setSimilar] = useState();
  useEffect(async () => {
    const res = await fetch(`/api/funding-session/similar?collectives=${ 
      data.map((item) => item.collective._id).join(',')}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    setSimilar(await res.json());
  }, [data]);

  return (similar?.length
    ? (
      <div style={{ padding: '20px 0 0' }}>
        <p className="text-center airy">You might also like these collectives</p>
        <Row>
          {
           similar.map(
             (collective) => (
               <Col key={collective._id} className="d-flex align-items-stretch" sm={4}>
                 <CartSimilarCollective collective={collective} addItem={addItem} />
               </Col>
             ),
           ) 
        }
        </Row>
      </div>
    ) : null 
  );
};

export default CartSimilar;
