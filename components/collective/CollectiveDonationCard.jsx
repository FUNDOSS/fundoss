import React, { useState, useEffect } from 'react';
import Pluralize from 'pluralize';
import { Badge, Col, Row, InputGroup } from 'react-bootstrap';
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
    setAmount(Cart.collectives[collective._id] || 20);
    setInCart(Cart.collectives[collective._id]);
  };

  useEffect(() => {
    onCartChange();
    cartEvents.on('cartChange', onCartChange);
  }, []);

  return (
    <Card>
      <Card.Body>
      {totals.donations ? (
        <div style={{ margin: '10px 0 20px' }} className="text-center">
          <b>{totals.donations}</b> {Pluralize('donor', totals.donations)} raised
          <Row className="no-gutters text-center align-items-center">
            <Col xs={5} className="text-right">
              <span style={{ fontSize: '1.8rem' }}>
              {formatAmountForDisplay(totals.amount)}
              </span>
              <div className="small">in donations</div>
            </Col>
            <Col>+</Col>
            <Col xs={5} className="text-left">
            <span className="text-fat text-success" style={{ fontSize: '1.8rem' }}>{formatAmountForDisplay(Qf.calculate(totals.amount/totals.donations) * totals.donations )}</span>
            <div className="small">in estimated matches</div>
            </Col>
          </Row>
          </div>
        ) : null }  



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
              
 

              <InputGroup className="cart-amount round text-fat text-success" style={{maxWidth:'150px', margin:'5px auto'}}>
                <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
                <Form.Control
                  size="lg"
                  value={amount}
                  type="number"
                  max={5000}
                  min={1}
                  onChange={(e) => {
                    const amt = e.currentTarget.value > 5000 ? 5000 : e.currentTarget.value;
                    setAmount(amt);
                  }}
                />
              </InputGroup>
              
              + <span style={{ fontSize: '2.3rem' }} className="text-fat text-success">
                {formatAmountForDisplay(Qf.calculate(amount), 'USD')}
              </span>
              <div className="small">estimated match</div>
            </div>
          )}

      </Card.Body>
      <Card.Footer>

        { !inCart && amount == inCart ? (
          <Button block variant="link" href="/quadratic-funding">
            How does Democratic Funding Work?
          </Button>
        ) : (
          <Row className="no-gutters">
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
              <Button block variant="link" href="/checkout/">Checkout</Button>
            </Col>
          </Row>
        )}

      </Card.Footer>
    </Card>
  );
};

export default CollectiveDonationCard;
