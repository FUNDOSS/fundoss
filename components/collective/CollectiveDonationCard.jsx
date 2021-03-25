import React, { useState, useEffect } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Cart, { cartEvents } from '../cart/Cart';
import Icons from '../icons';
import { formatAmountForDisplay } from '../../utils/currency';
import Qf from '../../utils/qf';

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
              {[10, 20, 30, 50, 100].map(
                (amt) => (
                  <Button 
                    block
                    style={{ marginRight: '10px' }}
                    key={`btn${amt}`} 
                    onClick={() => {
                      Cart.addItem(collective, amt);
                    }}
                    variant={amt === amount ? 'primary' : 'outline-primary'}
                  >
                    ${amt} for a estimated <span className="text-fat">{formatAmountForDisplay(Qf.calculate(amt), 'USD')}</span>
                    &nbsp;match
                  </Button>
                ),
              )}
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
              <div style={{ fontSize: '2.3rem' }} className="text-fat text-success">
                {formatAmountForDisplay(Qf.calculate(amount), 'USD')}
              </div>
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
