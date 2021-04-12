import React from 'react';
import moment from 'moment';
import {
  Image, Row, Col, 
} from 'react-bootstrap';

const DonationsList = ({ donations, session }) => {
  const collectives = session.collectives.reduce(
    (cols, col) => ({ 
      ...cols, 
      ...{
        [col._id]: {
          donation: 0, match: 0, fee: 0, name: col.name, imageUrl: col.imageUrl, slug: col.slug,
        }, 
      },
    }),
    {},
  );
  
  return (
    <div>
      {donations.map((donation) => (
        <Row key={donation._id} style={{ margin: '10px 0' }}>
          <Col xs={2} md={1}>
            <Image src={collectives[donation._id.collective].imageUrl} roundedCircle width={40} />
          </Col>
          <Col> &nbsp;
            <a className="text-fat lead black" href={`/collective/${collectives[donation._id.collective].slug}`}>{collectives[donation._id.collective].name}</a><br />
            
          </Col>
          <Col>
            <span className="text-fat lead">... $ {donation.amount} </span>
          </Col>
        </Row>
      ))}
    </div>
  ); 
};

export default DonationsList;
