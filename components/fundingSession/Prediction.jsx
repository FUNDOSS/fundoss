import React from 'react';
import { Badge } from 'react-bootstrap';

const Prediction = ({ session, predicted }) => {
  const {
    start, end, totals,
  } = session;

  return (
    <>
      Predicted avg donation&nbsp;
      <Badge variant="info">{Math.round(predicted.average)}</Badge>&nbsp;
      match&nbsp;
      <Badge variant="info">{Math.round(predicted.match)}</Badge>&nbsp;
      fudge&nbsp;
      <Badge variant="info">{Math.round(predicted.fudge * 100) / 100}</Badge>&nbsp;
    </>
  );
};

export default Prediction;
