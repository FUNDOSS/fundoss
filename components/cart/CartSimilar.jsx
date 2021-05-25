import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Card, Image, Row, Button, Col, Badge,
} from 'react-bootstrap';

const truncate = (input, length) => (input && input?.length > length ? `${input.substring(0, length)}...` : input);

const CartSimilarCollective = ({ collective, addItem }) => (
  <>
    <Card
      className="text-center small d-none d-md-block"
      style={{
        height: '250px', marginBottom: '10px',  
      }}
    >
      <Card.Header>
        { collective?.imageUrl ? <Image width="30" height="30" src={collective.imageUrl} roundedCircle fluid /> : null }
        <br />
        <b>
          <Link href={`/collective/${collective.slug}`}>{truncate(collective.name, 20)}</Link>
        </b>
      </Card.Header>
      <Card.Body>
        {truncate(collective.description, 30)}
      </Card.Body>
      <Card.Footer>
        <Button block size="sm" variant="outline-primary" onClick={() => addItem(collective)}>
          Add to cart
        </Button>
      </Card.Footer>
    </Card>
    <Button className="d-md-none d-block" block size="sm" variant="link" onClick={() => addItem(collective)}>
      { collective?.imageUrl ? <Image width="30" height="30" src={collective.imageUrl} roundedCircle fluid /> : null }
      <Badge variant="info round">+</Badge>
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
        <p><b>You might like these collectives</b></p>
        <Row>
          {
           similar.map(
             (collective) => (
               <Col key={collective._id}>
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
