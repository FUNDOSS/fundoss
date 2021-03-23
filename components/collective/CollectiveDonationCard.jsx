import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Cart, { cartEvents } from '../cart/Cart';
import Icons from '../icons';

const CollectiveDonationCard = ({ collective }) => {
  const [tab, setTab] = useState('set');
  const [amount, setAmount] = useState(30);
  const [cartAmount, setCartAmount] = useState();

  const onCartChange = () => {
    setAmount(Cart.collectives[collective._id] || 30);
    setCartAmount(Cart.collectives[collective._id]);
  };

  useEffect(() => {
    onCartChange();
    cartEvents.on('cartChange', onCartChange);
  }, []);

  return (
    <Card>
      <Card.Body>
        <h3 className="display-4 text-success text-center">${collective.totals?.amount}</h3>
        <p className="text-center">estimated amount raised from {collective.totals?.donations} contributors</p>
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
            <div style={{ padding: '20px 0' }}>
              <p className="text-center">
                <b>354 contributors</b> have unlocked <span className="text-center">$840.32</span> in estimated total funding
              </p>
              <Form.Control
                required
                value={amount}
                type="number"
                onChange={(e) => setAmount(e.target.value)}
                placeholder="in USD"
                min={2}
                max={10000}
              />
              <h3 className="display-4 text-success text-center">$155</h3>
              <p className="text-center">estimated match</p>
              {
                amount >= 2 ? (
                  <>{cartAmount !== amount ? (
                    <Button
                      variant="primary"
                      onClick={() => Cart.addItem(collective, amount)}
                      block
                    >
                      <Icons.Cart size={18} /> {!cartAmount ? 'Add to Cart' : 'Update Cart'}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => Cart.show()}
                      block
                    >
                      <Icons.Check size={18} /> In cart <Badge variant="danger">${cartAmount}</Badge>
                    </Button>
                  )}
                  </>
                ) : (
                  <Button variant="light" block>Select an amount</Button>
                )
              }
            </div>
          )}

      </Card.Body>
    </Card>
  );
};

export default CollectiveDonationCard;
