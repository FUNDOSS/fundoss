import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Pluralize from 'pluralize';
import Cart, { cartEvents } from './Cart';
import Icons from '../icons';

const CartButtonMultiple = ({ items }) => {
  const [inCart, setInCart] = useState(false);
  const isInCart = () => items.reduce((incart, item) => incart && Cart.collectives[item._id], true);
  useEffect(() => {
    setInCart(isInCart());
    cartEvents.on('cartChange', () => setInCart(isInCart()));
  }, []);

  return (
    <>{inCart ? (
      <Button
        block
        variant="outline-primary" 
        size="lg"
        onClick={() => Cart.show()}
      >
        <Icons.Check size="22" /> Show my cart
      </Button>
    ) : (
      <Button
        block
        variant="outline-primary" 
        size="lg"
        onClick={() => {
          Cart.addItems(items.map((item) => ({
            collective: item, 
            amount: 20,
          })));
        }}
      >
        <Icons.Cart size="22" /> Add {Pluralize('collective', items.length, true)} to my cart
      </Button>
    )}
    </>
  );
};

export default CartButtonMultiple;
