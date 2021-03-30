import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CartItemList from './CartItemList';
import { formatAmountForDisplay } from '../../utils/currency';
import Qf from '../../utils/qf';

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

export const getCartTotals = (data = Cart.data || []) => data.reduce(
  (acc, item) => ({
    amount:Number(item.amount) + acc.amount, 
    match:(Math.floor(Qf.calculate(item.amount) * 100)/100) + acc.match,
  }), {amount:0, match:0});

export const getCollectives = (cart = Cart.data || []) => cart.reduce((acc, item) => {
  const { _id } = item.collective;
  return { ...acc, [_id]: item.amount };
}, {})

const Cart = ({ cart, display }) => {
  const [cartData, setCartData] = useState(cart);
  
  const [collectives, setCollectives] = useState();
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const handleClose = () => setShow(false);

  Cart.show = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  Cart.collectives = getCollectives;
  Cart.data = cart;
  
  Cart.getTotals = getCartTotals;

  const [totals, setTotals] = useState(Cart.getTotals(cart));


  const changeCart = (data) => {
    Cart.data = data;
    setCartData(data);
    const newtotals = getCartTotals(data);
    setTotals(newtotals);
    Cart.totals = newtotals;
    setCollectives(Cart.collectives);
    cartEvents.dispatch('cartChange', { data });
  };

  Cart.addItem = (collective, amount, open = false) => {
    saveCart([{collective:collective._id, amount}]);
    Cart.addItems([{collective, amount}], open)
  };

  Cart.addItems = (items, open = false) => {
    
    const collectiveIds = items.reduce((ids, item) => [...ids, item.collective._id], [])
    console.log(collectiveIds)
    saveCart(items.reduce(
      (items, item) => [...items, {collective:item.collective._id, amount:item.amount}], 
      []));
    const data = cartData.filter((item) => collectiveIds.indexOf(item.collective._id) === -1);
    items.map(item => data.unshift(item)) ;
    changeCart(data);
    if (open) Cart.show();
  };

  const saveCart = (items) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
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
        saveCart([{collective:collective._id, amount}]);
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
    <Modal id="cart" show={show} onHide={handleClose} scrollable size="md">
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
        {cartData.length ? <Button block variant="primary" href="/checkout">Total {formatAmountForDisplay(totals.amount, 'USD')} | Checkout</Button> : null}
      </Modal.Footer>
    </Modal>
  );
};

export default Cart;
