import React, { useState, useEffect } from 'react';
import { InputGroup, Form } from 'react-bootstrap';

const DonationInput = ({ amount, min, max, onChange }) => {
  const [value, setValue] = useState(amount);
  useEffect(() => {
    if (value !== amount) {
      setValue(amount);
    }
  }, [amount]);
  return (
    <InputGroup className="cart-amount" style={{ maxWidth: '150px', margin: '5px auto' }}>
      <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
      <Form.Control
        size="lg"
        value={value}
        type="number"
        max={max}
        min={min}
        onChange={(e) => {
          let amt = e.currentTarget.value > max ? max : e.currentTarget.value;
          amt = e.currentTarget.value < min ? min : e.currentTarget.value;
          setValue(amt);
          onChange(amt);
        }}
      />
    </InputGroup>
  );
};

export default DonationInput;
