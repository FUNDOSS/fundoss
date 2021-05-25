import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import { Form, InputGroup } from 'react-bootstrap';
import { formatAmountForDisplay } from '../../utils/currency';
import Icons from '../icons';
import DonationInput from './DonationInput';

const CartItem = ({
  item, onDelete, onSelect, selectedId, cartAmount, onChange, 
  calculateMatch, config,
}) => {
  const { collective } = item;
  const [amount, setAmount] = useState(cartAmount);
  const [selected, setSelected] = useState(selectedId);
  
  const select = () => {
    const selection = collective._id === selected ? null : collective._id;
    onSelect(selection);
    setSelected(selection);
  };

  return (
    <div className="cart-item">
      <div
        className="header"
        onClick={select}
        onKeyUp={select}
        role="button"
        tabIndex={0}
      >
        <Row className="no-gutters">
          <Col xs={1}>
            <span className={selected === collective._id ? 'with-caret-up' : 'with-caret'} />
            <Image src={collective.imageUrl} width={30} roundedCircle fluid />
          </Col>
          <Col className="text-fat" style={{ fontSize: '1.1rem' }}>
            {collective.name}
          </Col>
          {selected !== collective._id ? (
            <Col xs={4} className="text-right text-nowrap ">
              <Badge className="round" style={{ fontSize: '0.8rem' }} variant="primary">
                {formatAmountForDisplay(amount, 'USD')}
              </Badge> &nbsp;
              <span className="d-none d-sm-inline">
                <small>+est</small>&nbsp;
                <span className="match ">
                  {formatAmountForDisplay(calculateMatch(amount, collective._id), 'USD')}
                </span>
                &nbsp;
                <Button
                  size="sm"
                  style={{ fontSize: '0.6rem', padding: '2px 3px' }} 
                  variant="outline-secondary round"
                  onClick={(e) => { onDelete(collective._id); }}
                ><Icons.Trash size={15} />
                </Button>
              </span>

            </Col>
          ) : (
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
          ) }

        </Row>
      </div>
        
      {selected === collective._id ? (
        <div className="form">
          <Row className="align-items-center">
            <Col xs={5}>
              <DonationInput
                amount={amount}
                max={config.max}
                min={config.min}
                onChange={(amt) => {
                  onChange(amt, collective);
                  setAmount(amt);
                }}
              />
            </Col>
            <Col className="text-center">
              <span className="lead">+</span>
            </Col>
            <Col xs={5} className="text-right">
              <div className="match big">
                {formatAmountForDisplay(calculateMatch(amount, collective._id), 'USD')}
              </div>
              <small>estimated match</small>
            </Col>
            <Col>
              { item.previous ? (
                <div className="previous text-center">
                  <div className="small">Your match is calculated on the sum of your donations.</div>
                  {formatAmountForDisplay(item.previous)} + est.
                  <span className="match">{formatAmountForDisplay(item.previousMatch)}</span> match
                </div>
              ) : null }
            </Col>
            <Col xs={12} style={{ marginTop: '10px' }}>

              {config.choice.map(
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
        </div>
      ) : null }
      
    </div>
  );
};

const CartItemList = ({
  cart, deleteItem, onSelect, selectedId, onChange, calculateMatch, config,
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
        calculateMatch={calculateMatch}
        config={config}
      />
    ),
  )
);

export default CartItemList;
