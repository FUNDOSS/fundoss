import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Col, Row, Form, Button, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import CountryCodes from 'countrycodes/countryCodes';
import StripeTestCards from './StripeTestCards';
import { fetchPostJSON } from '../../utils/api-helpers';
import { formatAmountForDisplay } from '../../utils/stripe-helpers';
import Cart, { cartEvents } from '../cart/Cart';
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
    const response = await fetchPostJSON('/api/checkout', { billing_details: values.billing_details });
    const { payment, intent } = response;
    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      intent.client_secret,
      {
        payment_method: {
          card: cardElement,
          billing_details: values.billing_details,
        },
      },
    );

    if (error) {
      setStatus({ cardError: error.message });
    } else if (paymentIntent) {
      setStatus({ paymentStatus: paymentIntent.status });
      payment.status = paymentIntent.status;
      await fetchPostJSON('/api/checkout', { payment });
      router.push('/thanks');
    }
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
        // eslint-disable-next-line no-shadow
        handleSubmit,
        values,
        status,
        setStatus,
      }) => {
        const [total, setTotal] = useState(Cart.getTotal());

        useEffect(() => {
          setTotal(Cart.getTotal());
          cartEvents.on('cartChange', () => setTotal(Cart.total));
        }, []);

        return (
          <Form noValidate onSubmit={handleSubmit}>
            <h4>Credit/Debit Card Info</h4>
            <hr />
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
                    onChange={() => {
                      setStatus({ cardError: null });
                    }}
                    className={`form-control${status?.cardError ? ' is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{status?.cardError}</div>
                </Form.Group>
              </Col>
            </Row>

            <h4>Billing Info</h4>
            <hr />
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
                {status?.paymentStatus === 'succeeded' ? (
                  <Button block variant="success"><Icons.Check size={16} /> Payment succeeded</Button>
                ) : (
                  <>{ isSubmitting ? (
                    <Button block variant="light"><Spinner animation="border" size="sm" /> Processing Payment</Button>
                  ) : (
                    <Button
                      block
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >  Pay {formatAmountForDisplay(total, 'USD')}
                    </Button>
                  )}
                  </>
                )}
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CheckoutForm;
