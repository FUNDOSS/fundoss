import React from 'react';
import { formatAmountForDisplay } from '../utils/currency';

const Currency = ({ value, floor = false }) => (
  <span className="currency">
    <small>$</small> {formatAmountForDisplay(value, floor, false)}
  </span>
);

export default Currency;
