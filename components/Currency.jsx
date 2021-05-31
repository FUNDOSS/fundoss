import React from 'react';
import { formatAmountForDisplay } from '../utils/currency';

const Currency = ({ value, floor  }) => (
  <span>
    <small>$</small> {formatAmountForDisplay(value, true, false)}
  </span>
);

export default Currency;
