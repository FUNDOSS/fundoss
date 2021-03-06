import React, { useState, useEffect } from 'react';
import Pluralize from 'pluralize';
import {
  Badge, Col, Row,  
} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Cart, {
  cartEvents, calculateMatch, getPreviousDonation, getPreviousMatch, 
} from '../cart/Cart';
import Icons from '../icons';
import { formatAmountForDisplay } from '../../utils/currency';
import Qf from '../../utils/qf';
import Graph from '../qf/graph';
import DonationInput from '../cart/DonationInput';

const CollectiveDonationCard = ({ collective, session }) => {
  const {
    min, max, def, choice, 
  } = session.donateConfig;
  const [tab, setTab] = useState('set');
  const [amount, setAmount] = useState(def);
  const [inCart, setInCart] = useState(false);
  const { totals } = collective;
  const previousDonation = getPreviousDonation(collective._id);
  const onCartChange = () => {
    setAmount(Cart.collectives[collective._id] || def);
    setInCart(Cart.collectives[collective._id]);
  };
  useEffect(() => {
    onCartChange();
    cartEvents.on('cartChange', onCartChange);
  }, [collective]);

  return (
    <Card className="donation-card">
      <Card.Body>
        {totals?.donations && totals?.donations.length ? (
          <div style={{ margin: '10px 0 20px' }} className="text-center">
            <b>{totals.donations.length}</b> {Pluralize('donor', totals.donations.length)} raised
            <Row className="no-gutters text-center align-items-center">
              <Col xs={4} lg={5} className="text-right donations">
                <span className="donation">{formatAmountForDisplay(totals.amount)}</span>
                <div className="small">in donations</div>
              </Col>
              <Col>+</Col>
              <Col xs={6} lg={5} className="text-left matches">
                <span className="match">{formatAmountForDisplay(totals.donations.reduce((total, amount) => total + Qf.calculate(amount), 0))}</span>
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
              {choice.map(
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
                    ${amt} for a estimated <span className="text-fat">{formatAmountForDisplay(calculateMatch(amt, collective._id))}</span>
                    &nbsp;match
                  </Button>
                ),
              )}
            </div>
          )
          : (
            <div style={{ padding: '20px 0' }} className="text-center">
              <Row className="no-gutters">
                <Col>
                  <DonationInput 
                    amount={amount}
                    max={max}
                    min={min}
                    onChange={(amt) => setAmount(amt)}
                  />
                </Col>
                <Col>
                  + 
                  <span className="match big">
                    {formatAmountForDisplay(calculateMatch(Number(amount), collective._id))}
                  </span>
                  <div className="small">estimated match</div>
                </Col>
              </Row>
              <Graph
                amount={amount}
                width={350}
                height={150}
                minimal
                click={(amount) => setAmount(amount)}
                plot={(x) => calculateMatch(x, collective._id)}
              />
            </div>
          )}

      </Card.Body>
      <Card.Footer>

        { previousDonation ? (
          <div className="previous text-center" style={{ margin: '-10px 0 10px' }}>
            <div className="small">Your previous donations are taken into account for calculating this match</div>
            {formatAmountForDisplay(previousDonation)} + est.
            <span className="match">{formatAmountForDisplay(getPreviousMatch(collective._id))}</span> match
          </div>
        ) : null }

        { !inCart && amount == inCart ? (
          <Button block variant="link" href="/democratic-funding">
            How does Democratic Funding Work?
          </Button>
        ) : (
          <Row className="no-gutters">
            <Col xs={7}>
              {inCart != amount ? (
                <Button block variant="outline-primary" onClick={() => Cart.addItem(collective, amount, false)}>
                  <Icons.Cart size={18} /> Add to cart
                </Button>
              ) : (
                <Button block variant="outline-primary" onClick={() => Cart.show(collective._id)}>
                  <Badge className="round" variant="danger">{formatAmountForDisplay(inCart)}</Badge>&nbsp;
                  <span className="d-none d-sm-inline">Open</span> <Icons.Cart size={18} /> 
                </Button>
              )}
            </Col>
            <Col>
              {inCart ? <Link href="/checkout/"><Button block variant="link">Checkout</Button></Link> : null}
            </Col>
          </Row>
        )}

      </Card.Footer>
    </Card>
  );
};

export default CollectiveDonationCard;
