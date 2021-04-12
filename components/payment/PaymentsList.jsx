import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import {
  Image, Badge, Row, Col, Card,
} from 'react-bootstrap';
import { formatAmountForDisplay } from '../../utils/currency';
import ShareButton from '../social/ShareButton';

const PaymentsList = ({ payments }) => (
  <div>
    {payments?.length ? (
      <div className="payments">
        {payments.map((payment) => (
          <Card key={payment._id} className="payment glass">
            <Card.Header>
              <Row>
                <Col xs={3} lg={2}>
                  
                  <span className="lead text-fat">{formatAmountForDisplay(payment.amount)}</span>&nbsp;
                </Col>
                <Col>
                  <Badge variant="info">{moment(payment.timeslug).format('MMMM Do YYYY')}</Badge>&nbsp;
                  <Link href={`/session/${payment.session.slug}`}>
                    <a className="text-fat" >{payment.session.name}</a>
                  </Link>
                </Col>
                <Col className="text-right">
                  Share on :&nbsp;
                  <ShareButton mini size="sm" variant="link" url={`/share/${payment.sid}`} platform="twitter" />
                  <ShareButton mini size="sm" variant="link" url={`/share/${payment.sid}`} platform="facebook" />
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {payment.donations.map((don) => (
                <Row key={don.collective.slug} className="donation">
                  <Col xs={2} className="text-fat">
                    {formatAmountForDisplay(don.amount)}
                  </Col>
                  <Col className="text-fat">
                    <Link href={`/collective/${don.collective.slug}`}>
                      <a><Image src={don.collective.imageUrl} roundedCircle width={20} />&nbsp;
                      {don.collective.name}</a>
                    </Link>
                  </Col>
                  <Col lg={7} className="d-none d-lg-block">
                    {don.collective.description}
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        ))}
      </div>
    ) : (
      <h2>You have no payments yet</h2>
    ) }

  </div>
);

export default PaymentsList;
