import React from 'react';
import moment from 'moment';
import {
  Image, Badge, Row, Col, 
} from 'react-bootstrap';

const DonationsList = ({ donations }) => (
  <div>
    {donations.map((donation) => (
      <Row key={donation._id}>
        <Col xs={2}>
          <h5><a href={`/collective${donation.collective.slug}`}>{}</a></h5>
          {moment(donation.payment.time).format('MMMM Do YYYY')}
        </Col>
        <Col> <Image src={donation.collective.imageUrl} roundedCircle width={20} /></Col>
        <Col>
          ...<h5> $ {payment.amount} </h5>
        </Col>
        
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

export default DonationsList;
