import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';

const CancelPayment = ({ payment }) => {
  const router = useRouter();
  const [state, setState] = useState('init');
  const [status, setStatus] = useState(payment.status);
  useEffect(() => {
    setStatus(payment.status);
  }, []);

  const doCancel = async () => {
    setState('canceling');
    await fetch('/api/payment/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment: payment._id }),
    });
    //router.reload();
  };
  return payment.status !== 'error' ? (
    <Button 
      onClick={
       () => (state === 'confirm' ? doCancel() : setState('confirm'))
      }
    > 
      {state === 'init' ? 'Cancel and Refund this payment' : null}
      {state === 'confirm' ? 'Are you sure? this is forever' : null}
      {state === 'canceling' ? 'Canceling' : null}
    </Button>
  ) : null;
};

export default CancelPayment;
