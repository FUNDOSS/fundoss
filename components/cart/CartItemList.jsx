import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import { Form, InputGroup, Card } from 'react-bootstrap';
import { formatAmountForDisplay } from '../../utils/currency';
import Icons from '../icons';

const CartItem = ({
  item, onDelete, onSelect, selectedId, cartAmount, onChange,
}) => {
  const { collective } = item;
  const [amount, setAmount] = useState(cartAmount);
  const [selected, setSelected] = useState(selectedId);
  
  return (
    <Card className="cart-item">
      <Card.Body>
        <Row
          className="no-gutters"
          onClick={() => {
            const selection = collective._id === selected ? null : collective._id;
            onSelect(selection);
            setSelected(selection);
          }}
        >
          <Col xs={2}>
            <Image src={collective.imageUrl} width={35} roundedCircle fluid />
          </Col>
          <Col xs={6}>
            <h5>
              {collective.name}
            </h5>
          </Col>
          <Col xs={2} className="text-center">
            <Badge variant="primary" className="round" style={{ fontSize: '0.7rem' }}>
              ${amount}
            </Badge>
          </Col>
          <Col xs={2} className="text-right">
            <Button
              size="sm"
              style={{ fontSize: '0.6rem', padding: '2px 3px' }} 
              block
              variant="outline-secondary round"
              onClick={() => { onDelete(collective._id); }}
            ><Icons.Trash size={15} /> Remove
            </Button>
          </Col>
        </Row>
        {selected === collective._id ? (
          <Row>
            <Col xs={12}><hr /></Col>
            <Col>
              <InputGroup className="cart-amount">
                <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
                <Form.Control
                  value={amount}
                  type="number"
                  onChange={(e) => {
                    onChange(e.currentTarget.value, collective);
                    setAmount(e.currentTarget.value);
                  }}
                />
              </InputGroup>
            </Col>
            <Col>
              <span className="lead">+</span>
            </Col>
            <Col>
              <div className="text-fat text-success display-4">{formatAmountForDisplay(amount * 2.10, 'USD')}</div>
              <small>estimated match</small>
            </Col>
            <Col xs={12}>
              {[10, 20, 30, 50, 100].map(
                (amt) => (
                  <Button 
                    className="round"
                    size="sm"
                    style={{ marginRight: '10px' }}
                    key={`btn${amt}`} 
                    onClick={() => {
                      onChange(amt, collective);
                      setAmount(amt);
                    }}
                    variant={amt === amount ? 'primary' : 'outline-primary'}
                  >
                    ${amt}
                  </Button>
                ),
              )}
            </Col>
          </Row>
        ) : null }
        
      </Card.Body>
    </Card>
  );
};

const CartItemList = ({
  cart, deleteItem, onSelect, selectedId, onChange,
}) => (
  cart.map(
    (item) => (
      <CartItem 
        item={item} 
        key={item.collective._id} 
        onDelete={deleteItem} 
        onSelect={onSelect}
        onChange={onChange}
        selectedId={selectedId}
        cartAmount={item.amount}
      />
    ),
  )
);

export default CartItemList;
