import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CartItemList from './CartItemList';

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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  Cart.show = handleShow;
  Cart.collectives = collectives;
  Cart.cartData = cartData;
  Cart.getTotal = () => cart.reduce((acc, item) => acc + Number(item.amount), 0);
  const changeCart = (data) => {
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

  Cart.addItem = (collective, amount) => {
    const body = {
      amount,
      collective: collective._id,
    };
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = cartData.filter((item) => item.collective._id !== collective._id);
    changeCart([...data, { collective, amount }]);
  };

  const items = (
    <CartItemList
      cart={cartData}
      deleteItem={
    async (id) => {
      const body = {
        collective: id,
      };
      fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = cartData.filter((item) => item.collective._id !== id);
      changeCart(data);
    }
  }
    />
  );

  if (display === 'inline') {
    return items;
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{marginTop:'-30px'}}>
        {items}
        {!cartData.length ? (
          <p>Your cart is empty! Click “Add to Cart” on your
            favorite OSS projects to support projects and boost their democratic match!
          </p>
        )
          : null}
      </Modal.Body>
      <Modal.Footer>
        {cartData.length ? <Button block variant="primary" href="/checkout">total : ${total} Checkout</Button> : null}
      </Modal.Footer>
    </Modal>
  );
};

export default Cart;
