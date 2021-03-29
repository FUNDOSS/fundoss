import React from 'react';
import moment from 'moment';
import {
  Image, Badge, Row, Col, 
} from 'react-bootstrap';

const DonationsList = ({ donations }) => (
  <div>
    {donations.map((donation) => (
      <Row key={donation._id} style={{margin:'10px 0'}}>
        <Col xs={2} md={1}>
        <Image src={donation.collective.imageUrl} roundedCircle width={40} />
        </Col>
        <Col> &nbsp;
        <a className="text-fat lead black" href={`/collective/${donation.collective.slug}`}>{donation.collective.name}</a><br />
        {moment(donation.payment.time).format('MMMM Do YYYY')}
        </Col>
        <Col>
        <span className="text-fat lead">... $ {donation.amount} </span>
        </Col>
      </Row>
    ))}
  </div>
);

export default DonationsList;
