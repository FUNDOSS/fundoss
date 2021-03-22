import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Icons from '../icons';

const CartItem = ({ item, onDelete }) => {
  const { collective, amount } = item;
  return (
    <Card className="cart-item">
      <Card.Body>
        <Row>
          <Col xs={2}>
            <Image src={collective.imageUrl} roundedCircle fluid />
          </Col>
          <Col>
            <Card.Title>
              {collective.name}
            </Card.Title>
          </Col>
          <Col xs={3}>
            <Badge variant="primary">
              $
              {amount}
            </Badge>
            <Button variant="link" onClick={() => { onDelete(collective._id); }}><Icons.Trash size={17} /></Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const CartItemList = ({ cart, deleteItem }) => (
  cart.map((item) => <CartItem item={item} key={item.collective._id} onDelete={deleteItem} />)
);

export default CartItemList;
