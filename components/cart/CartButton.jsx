import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Cart, { cartEvents } from './Cart';
import Icons from '../icons';

const CartButton = ({ itemCount }) => {
  const [count, setCount] = useState(itemCount);
  useEffect(() => {
    cartEvents.on('cartChange', (e) => setCount(e.data.length));
  }, []);

  return (
    <Button variant="link" onClick={() => Cart.show()}>
      <Icons.Cart size={22} />
      {count ? <Badge variant="danger" className="round">{count}</Badge> : null}
    </Button>
  );
};

export default CartButton;
