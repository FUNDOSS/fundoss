import React, { useState, useEffect } from 'react';
import { InputGroup, Form } from 'react-bootstrap';

const DonationInput = ({
  amount, min, max, onChange, 
}) => {
  const [value, setValue] = useState(amount);
  let currentValue = amount;
  let changing = false;
  useEffect(() => {
    if (value !== amount) {
      setValue(amount);
    }
  }, [amount]);
  let changeTimeout;
  const minmax = (v) => {
    let amt = v > max ? max : v;
    amt = amt < min ? min : amt;
    return amt;
  };
  const doChange = (v) => {
    clearTimeout(changeTimeout);
    const val = minmax(v);
    onChange(val);
    changing = false;
  };
  const fieldChange = (e) => {
    clearTimeout(changeTimeout);
    currentValue = e.target.value;
    if (!changing) {
      changeTimeout = setTimeout(() => doChange(e.target?.value || value), 300);
      changing = true;
    }
    
    setValue(currentValue);
  };
  
  return (
    <InputGroup className="cart-amount" style={{ maxWidth: '150px', margin: '5px auto' }}>
      <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
      <Form.Control
        size="lg"
        value={value}
        type="number"
        max={max}
        min={min}
        onChange={fieldChange}
        onKeyUp={fieldChange}
        onBlur={() => doChange(currentValue)}
      />
    </InputGroup>
  );
};

export default DonationInput;
