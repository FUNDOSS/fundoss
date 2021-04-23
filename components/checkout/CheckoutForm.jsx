import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Col, Row, Form, Button, Spinner, Badge, 
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import CountryCodes from 'countrycodes/countryCodes';
import StripeTestCards from './StripeTestCards';
import { fetchPostJSON } from '../../utils/api-helpers';
import { formatAmountForDisplay } from '../../utils/currency';
import { cartEvents, getCartTotals } from '../cart/Cart';
import Icons from '../icons';

const CheckoutForm = ({ user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const checkoutValidationSchema = Yup.object({
    cardholderName: Yup.string()
      .required('Please enter the name on your card'),
    billing_details: Yup.object({
      name: Yup.string()
        .required('Please enter a billing name'),
      email: Yup.string().email('Please enter a valid email')
        .required('Please enter a billing email'),
    }),
    tc: Yup.boolean().required('Please agree to our terms and conditions'),
  });
  const router = useRouter();
  const initialValues = {
    cardholderName: user.name || '',
    billing_details: user.billing || {
      name: user.name || '',
      email: user.email || '',
    },
  };

  const handleSubmit = async (values, { setStatus }) => {
    setStatus({ paymentStatus: 'verify' });
    const response = await fetchPostJSON('/api/checkout', { billing_details: values.billing_details });
    const { paymentId, clientSecret } = response;
    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: values.billing_details,
        },
      },
    );

    if (error) {
      setStatus({ cardError: error.message });
      setStatus({ error: 'Please verify your credit/debit card' });
    } else if (paymentIntent) {
      setStatus({ paymentStatus: paymentIntent.status });
      if (paymentIntent.status === 'succeeded') {
        const confirmation = await fetchPostJSON('/api/checkout', { payment: { status: 'succeeded', id: paymentId } });
        if (confirmation.status === 'succeeded') {
          setStatus({ paymentStatus: 'completed' });
          router.push('/thanks');
        } else {
          setStatus({ paymentStatus: 'failed' });
          setStatus({ error: confirmation.message });
        }
      }
    }
  };

  const statusSubmitButton = (status, isSubmitting, total) => {
    if (status === 'completed') {
      return (<Button size="lg" disabled block variant="outline-success"><Icons.Check size={16} /> Payment Completed</Button>);
    } 
    if (status === 'succeeded') {
      return (<Button disabled size="lg" block variant="outline-info"><Spinner animation="border" size="sm" /> Confirming Payment...</Button>);
    } 
    if (status === 'verify') {
      return (<Button disabled size="lg" block variant="outline-info"><Spinner animation="border" size="sm" /> Verifying Payment Data...</Button>);
    } 
    if (isSubmitting) {
      return (<Button disabled size="lg" block variant="outline-info"><Spinner animation="border" size="sm" /> Verifying card...</Button>);
    } 
    return (<Button block size="lg" variant="outline-primary" type="submit"> <small>Complete Checkout :</small> Pay <Badge variant="danger round">{formatAmountForDisplay(total, 'USD')}</Badge></Button>);
  };

  return (
    <Formik
      validationSchema={checkoutValidationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleSubmit,
        values,
        status,
        setStatus,
        setFieldValue,
      }) => {
        const [totals, setTotals] = useState(getCartTotals());
        
        useEffect(() => {
          setTotals(getCartTotals());
          setStatus({ paymentStatus: 'initial' });
          cartEvents.on('cartChange', () => setTotals(getCartTotals()));
        }, []);

        return (
          <Form noValidate onSubmit={handleSubmit}>
            <Row style={{ marginTop: '40px' }}>
              <Col md={3} className="text-fat lead text-center text-md-left">Credit/Debit Card Info</Col>
              <Col><hr /></Col>
            </Row>
            <Row>
              <Col md={{ offset: 3, span: 6 }}>
                <Form.Group controlId="cardholderName">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    value={values.cardholderName}
                    placeholder="Cardholder name"
                    type="Text"
                    onChange={handleChange}
                    isValid={touched.cardholderName && !errors.cardholderName}
                    isInvalid={touched.cardholderName && errors.cardholderName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.cardholderName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <StripeTestCards />
                  <CardElement
                    onChange={({ error, complete, empty }) => {
                      setStatus({
                        cardError: error?.message, 
                        cardValid: complete, 
                        cardEmpty: empty, 
                      });
                    }}
                    className={`form-control ${status?.cardError && !status?.cardValid && !status?.cardEmpty ? 'is-invalid' : ''} ${status?.cardValid ? 'is-valid' : ''}`}
                  />
                  <div className="invalid-feedback">{status?.cardError}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row style={{ marginTop: '40px' }}>
              <Col md={3} className="text-fat lead text-center text-md-left">Billing Info</Col>
              <Col><hr /></Col>
            </Row>
            <Row>
              <Col md={{ offset: 3, span: 6 }}>
                <Form.Group controlId="billing_details.name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    value={values.billing_details.name}
                    placeholder="Full Name"
                    type="Text"
                    onChange={handleChange}
                    isValid={touched.billing_details?.name && !errors.billing_details?.name}
                    isInvalid={touched.billing_details?.name && errors.billing_details?.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.billing_details?.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="billing_details.email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={values.billing_details?.email}
                    placeholder="email"
                    type="Text"
                    onChange={handleChange}
                    isValid={touched.billing_details?.email && !errors.billing_details?.email}
                    isInvalid={touched.billing_details?.email && errors.billing_details?.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.billing_details?.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="billing_details.address.line1">
                  <Form.Label>Billing Address</Form.Label>
                  <Form.Control
                    value={values.billing_details?.address?.line1}
                    type="Text"
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">{errors.billing_details?.address?.line1}</Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group controlId="billing_details.address.city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        value={values.billing_details?.address?.city}
                        type="Text"
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">{errors.billing_details?.address?.city}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="billing_details.address.postal_code">
                      <Form.Label>Zip</Form.Label>
                      <Form.Control
                        value={values.billing_details?.address?.postal_code}
                        type="Text"
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">{errors.billing_details?.address?.postal_code}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="billing_details.address.state">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        value={values.billing_details?.address?.state}
                        type="Text"
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">{errors.billing_details?.address?.state}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col>
                    <Form.Group controlId="billing_details.address.country">
                      <Form.Label>Country</Form.Label>
                      <Form.Control as="select" onChange={handleChange} value={values.billing_details?.address?.country}>
                        <option>Country</option>
                        {CountryCodes.getAll().map(
                          (ct) => (ct.iso2 ? (
                            <option value={ct.iso2} key={ct.iso2}>{ct.countryName}</option>
                          ) : null),
                        )}
                      </Form.Control>

                      <Form.Control.Feedback type="invalid">{errors.billing_details?.address?.country}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="subscribe">
                  <Form.Check 
                    label="I wish to receive updates on future rounds" 
                    value={values.subscribe}
                    onChange={(e) => setFieldValue('subscribe', e.target.checked)} 
                  />
                </Form.Group>
                <Form.Group controlId="tc">
                  <Form.Check 
                    label="I agree to fundoss terms and conditions" 
                    value={values.tc}
                    onChange={(e) => setFieldValue('tc', e.target.checked)}
                    isInvalid={!!errors.tc}
                  />
                  <Form.Control.Feedback type="invalid">{errors.tc}</Form.Control.Feedback>
                </Form.Group>
                {status?.error ? <p className="text-danger text-center">{status.error}</p> : null}
                {statusSubmitButton(status?.paymentStatus, isSubmitting, totals.amount)}
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CheckoutForm;
