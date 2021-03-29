import React , { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Graph from './graph';
import Qf from '../../utils/qf';


const Calculator = () => {
  const [form , setForm] = useState( {
      matchedFunds:75000,
      averageDonationEst:20,
      numberDonationEst:2000,
    }
    );

  return (
    <Form>
    <Row>
        <Col>
        
          <Form.Group>
            <Form.Label>Matched Funds</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="in USD"
              step={1000}
              min={1000}
              value={form.matchedFunds}
              onChange={(e) => setForm({...form, ...{matchedFunds: e.currentTarget.value} })}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Average donation estimate</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="in USD"
              min={1}
              value={form.averageDonationEst}
              onChange={(e) => setForm({...form, ...{averageDonationEst: e.currentTarget.value} })}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label># donations estimate</Form.Label>
            <Form.Control
              required
              step={100}
              type="number"
              placeholder="in USD"
              min={100}
              value={form.numberDonationEst}
              onChange={(e) => setForm({...form, ...{numberDonationEst: e.currentTarget.value} })}
            />
          </Form.Group>
        </Col>
      </Row>
      <Graph 
        plot={(x) => Qf.calculate(
            x, 
            form.averageDonationEst, 
            form.matchedFunds / form.numberDonationEst
          )} 
        averageDonation={Math.round(form.averageDonationEst)} 
        averageMatch={Math.round(form.matchedFunds / form.numberDonationEst)} 
        width={550}
        height={200}
      /></Form>
)
};


export default Calculator;
