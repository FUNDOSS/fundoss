import React, { useState, useEffect } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Cart, { cartEvents } from '../cart/Cart';
import Icons from '../icons';
import { formatAmountForDisplay } from '../../utils/currency';

const CollectiveDonationCard = ({ collective }) => {
  const [tab, setTab] = useState('set');
  const [amount, setAmount] = useState(30);
  const [inCart, setInCart] = useState(false);

  const onCartChange = () => {
    setAmount(Cart.collectives[collective._id] || 30);
    setInCart(Cart.collectives[collective._id]);
  };

  useEffect(() => {
    onCartChange();
    cartEvents.on('cartChange', onCartChange);
  }, []);

  return (
    <Card>
      <Card.Body>
        {collective.totals ? (
          <>
            <h3 className="display-4 text-success text-center">
              {formatAmountForDisplay(collective.totals.amount, 'USD')}
            </h3>
            <p className="text-center">estimated amount raised from {collective.totals?.donations} contributors</p>
          </>
        ) : null}
        
        <Nav variant="tabs" fill activeKey={tab} onSelect={setTab}>
          <Nav.Item>
            <Nav.Link eventKey="set">Set Amount</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="custom">Custom</Nav.Link>
          </Nav.Item>
        </Nav>
        { tab === 'set'
          ? (
            <div style={{ padding: '20px 0' }}>
              <Button variant={amount === 10 ? 'primary' : 'outline-primary'} onClick={() => Cart.addItem(collective, 10)} block>Donate $10 for a $11.4 match</Button>
              <Button variant={amount === 20 ? 'primary' : 'outline-primary'} onClick={() => Cart.addItem(collective, 20)} block>Donate $20 for a $34.2 match</Button>
              <Button variant={amount === 50 ? 'primary' : 'outline-primary'} onClick={() => Cart.addItem(collective, 50)} block>Donate $50 for a $77.4 match</Button>
            </div>
          )
          : (
            <div style={{ padding: '20px 0' }} className="text-center">
              <p className="text-center">
                <b>354 contributors</b> have unlocked <span className="text-center">$840.32</span> in estimated total funding
              </p>
              <Form.Control
                style={{ maxWidth: '250px', margin: '0 auto' }}
                size="lg"
                required
                value={amount}
                type="number"
                onChange={(e) => {
                  Cart.addItem(collective, amount);
                  setAmount(e.target.value);
                }}
                placeholder="in USD"
                min={2}
                max={10000}
              />
              <small>estimated match</small>
              <div style={{ fontSize: '2.3rem' }} className="text-fat text-success">{formatAmountForDisplay(amount * 2.10, 'USD')}</div>
            </div>
          )}

      </Card.Body>
      <Card.Footer>

        { !inCart ? (
          <Button block variant="link" onClick={() => Cart.addItem(collective, 20, true)}>
            How does Democratic Funding Work?
          </Button>
        ) : (
          <Row>
            <Col xs={7}>
              <Button block variant="outline-primary" onClick={() => Cart.show(collective._id)}>
                <Icons.Check size={18} /> In cart <Badge variant="danger">{formatAmountForDisplay(inCart, 'USD')}</Badge>
              </Button>
            </Col>
            <Col>
              <Button block variant="primary" href="/checkout/">Checkout</Button>
            </Col>
          </Row>
        )}

      </Card.Footer>
    </Card>
  );
};

export default CollectiveDonationCard;
