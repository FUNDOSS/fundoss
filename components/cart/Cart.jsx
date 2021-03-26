import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CartItemList from './CartItemList';
import { formatAmountForDisplay } from '../../utils/currency';

export const cartEvents = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};

const Cart = ({ cart, display }) => {
  const [cartData, setCartData] = useState(cart);
  const [total, setTotal] = useState(cart.reduce((acc, item) => acc + Number(item.amount), 0));
  const [collectives, setCollectives] = useState(cart.reduce((acc, item) => {
    const { _id } = item.collective;
    return { ...acc, [_id]: item.amount };
  }, {}));
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const handleClose = () => setShow(false);

  Cart.show = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  Cart.collectives = collectives;
  Cart.data = cart;
  
  Cart.getTotal = () => cart.reduce((acc, item) => acc + Number(item.amount), 0);

  const changeCart = (data) => {
    Cart.data = data;
    setCartData(data);
    const newtotal = data.reduce((acc, item) => acc + Number(item.amount), 0);
    setTotal(newtotal);
    Cart.total = newtotal;
    Cart.collectives = data.reduce((acc, item) => {
      const { _id } = item.collective;
      return { ...acc, [_id]: item.amount };
    }, {});
    setCollectives(Cart.collectives);
    cartEvents.dispatch('cartChange', { data });
  };

  Cart.addItem = (collective, amount, open = false) => {
    saveCartItem(collective._id, amount);
    const data = cartData.filter((item) => item.collective._id !== collective._id);
    changeCart([{ collective, amount }, ...data]);
    if (open) Cart.show(collective._id);
  };

  const saveCartItem = (collective, amount) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, collective }),
    });
  };

  const items = (
    <CartItemList
      cart={cartData}
      deleteItem={
        async (id) => {
          fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              collective: id,
            }),
          });
          const data = cartData.filter((item) => item.collective._id !== id);
          changeCart(data);
        }
      }
      selectedId={selectedId}
      onSelect={(id) => setSelectedId(id)}
      onChange={(amount, collective) => {
        saveCartItem(collective._id, amount);
        const data = cartData.map(
          (item) => (item.collective._id === collective._id ? { amount, collective } : item),
        );
        changeCart(data);
      }}
    />
  );

  if (display === 'inline') {
    return items;
  }
  return (
    <Modal show={show} onHide={handleClose} scrollable size="md">
      <Modal.Header closeButton>
        <Modal.Title className="text-secondary">
          Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items}
        {!cartData.length ? (
          <p>Your cart is empty! Click “Add to Cart” on your
            favorite OSS projects to support projects and boost their democratic match!
          </p>
        )
          : null}
      </Modal.Body>
      <Modal.Footer>
        {cartData.length ? <Button block variant="primary" href="/checkout">Total {formatAmountForDisplay(total, 'USD')} | Checkout</Button> : null}
      </Modal.Footer>
    </Modal>
  );
};

export default Cart;
