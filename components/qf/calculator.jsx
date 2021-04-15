import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Graph from './graph';
import Qf from '../../utils/qf';

const Calculator = ({ exp, fudge, symetric, avg = null, number = null, funds = null }) => {
  const [form, setForm] = useState({
    matchedFunds: funds || 10000,
    averageDonationEst: avg || 20,
    numberDonationEst: number || 500,
  });

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
              onChange={(e) => setForm({ ...form, ...{ matchedFunds: e.currentTarget.value } })}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Average donation</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="in USD"
              min={1}
              value={form.averageDonationEst}
              onChange={(e) => setForm(
                { ...form, ...{ averageDonationEst: e.currentTarget.value } },
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>number donations</Form.Label>
            <Form.Control
              required
              step={100}
              type="number"
              placeholder="in USD"
              min={100}
              value={form.numberDonationEst}
              onChange={(e) => setForm(
                { ...form, ...{ numberDonationEst: e.currentTarget.value } },
              )}
            />
          </Form.Group>
        </Col>
      </Row>
      <Graph 
        plot={(x) => Qf.calculate(
          x, 
          form.averageDonationEst, 
          form.matchedFunds / form.numberDonationEst,
          exp, 
          1, 
          symetric,
        )} 
        minimal
        fudge={fudge} 
        exp={exp}
        averageDonation={Math.round(form.averageDonationEst)} 
        averageMatch={Math.round(form.matchedFunds / form.numberDonationEst)} 
        fudge={1}
        width={450}
        height={200}
      />
    </Form>
  );
};

export default Calculator;
