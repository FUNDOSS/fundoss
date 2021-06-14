import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Icons from '../icons';
import LoginButtons from './LoginButtons';

const LoginModal = () => {
  const [show, setShow] = useState(false);
  LoginModal.show = () => {
    setShow(true);
  };
  const handleClose = () => setShow(false);
  return (
    <Modal id="login" show={show} onHide={handleClose} size="sm" className="text-center">
      <Modal.Header closeButton>
        <Modal.Title className="text-secondary">
          <Icons.Signin size={32} />
        </Modal.Title>
        
      </Modal.Header>
      <Modal.Body>
        <p className="airy">Please sign in through one of these services to start donating.</p>
        <LoginButtons />
        <p className="airy">We’ll save your shopping cart for when you return!</p>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
