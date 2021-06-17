import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal } from 'react-bootstrap';
import Dump from '../dashboard/Dump';

const VerifyPayment = ({ payment }) => {
  const router = useRouter();
  const [state, setState] = useState('init');
  const [intent, setIntent] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const verify = async () => {
    setState('canceling');
    const res = await fetch(`/api/payment/verify?id=${payment._id}`, {
      method: 'GET',
    });
    setIntent(await res.json());
    setShow(true);
  };
  const update = async () => {
    setState('updating');
    await fetch(`/api/payment/verify?id=${payment._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: payment._id, confirm: true }),
    });
    
    router.reload();
  };
  return (
    <>
      <Button 
        variant="outline-info"
        onClick={verify}
      > 
        Check Stripe Intent
      </Button>
      <Modal id="intent" show={show} onHide={handleClose} scrollable size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-secondary">
            Stripe Intent Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dump data={intent} />
        </Modal.Body>
        {payment.status !== 'succeeded' && intent.status === 'succeeded' 
          ? (
            <Modal.Footer>
              <Button 
                onClick={update}
                variant="primary"
              >
                Update payment data
              </Button>
            </Modal.Footer>
          ) : null}
      </Modal>
    </>
  );
};

export default VerifyPayment;
