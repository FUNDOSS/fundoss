import React from 'react';
import moment from 'moment';
import {
  Image, Badge, Row, Col, 
} from 'react-bootstrap';

const PaymentsList = ({ payments }) => (
  <div>
    {payments.map((payment) => (
      <Row key={payment._id}>
        <Col xs={2}>
          <Badge variant={payment.status === 'succeeded' ? 'success' : 'danger'}>{payment.status}</Badge>&nbsp;
          <h5>$ {payment.amount} </h5>
        </Col>
        <Col xs={2}>{moment(payment.time).format('MMMM Do YYYY')}</Col>
        <Col>{payment.donations.map((don) => (
          <Badge key={don.collective.slug} variant="info" style={{ marginRight: '3px' }}>
            ${don.amount} <Image src={don.collective.imageUrl} roundedCircle width={20} />
          </Badge>
        ))}
        </Col>
      </Row>
    ))}
  </div>
);

export default PaymentsList;
