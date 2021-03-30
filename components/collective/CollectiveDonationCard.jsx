import React, { useState, useEffect } from 'react';
import Pluralize from 'pluralize';
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
  const { totals } = collective;

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
                      setAmount(amt);
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
              
              {totals.donations ? (
                <p className="text-center">
                <span className="text-fat">{totals.donations}</span> {Pluralize('contributor', totals.donations)}&nbsp;
                have unlocked <span className="text-fat">{formatAmountForDisplay(Qf.calculate(totals.amount/totals.donations) * totals.donations )}</span> in estimated total funding
                </p>
              ) : null }   

              <Form.Control
                style={{ maxWidth: '250px', margin: '0 auto' }}
                size="lg"
                required
                value={amount}
                type="number"
                onChange={(e) => {
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
          <Button block variant="link" href="/quadratic-funding">
            How does Democratic Funding Work?
          </Button>
        ) : (
          <Row>
            <Col xs={7}>
                {inCart != amount ? (
                  <Button block variant="outline-primary" onClick={() =>  Cart.addItem(collective, amount, false)}>
                      <Icons.Cart size={18} /> Update cart
                  </Button>
                ) : (
                  <Button block variant="outline-primary" onClick={() => Cart.show(collective._id)}>
                      <Icons.Check size={18} /> In cart <Badge variant="danger">{formatAmountForDisplay(inCart, 'USD')}</Badge>
                  </Button>
                )}
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
