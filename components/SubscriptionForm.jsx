import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button, Form, Spinner, 
} from 'react-bootstrap';

export const SubscriptionForm = ({ user }) => {
  const userValidationSchema = Yup.object({
    email: Yup.string()
      .required('Please provide a email')
      .email('Please check your email address'),
  });
  const initialValues = {
    email: user?.email,
    name: user?.name || user?.username,
  };

  const handleSubmit = async (values, { setStatus, setValues, setTouched }) => {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, ...{ subscribed: true } }),
    });
    if (res.status === 200) {
      const result = await res.json();
      setValues({ email: '', name: '' });
      setTouched({ email: false, name: false });
      setStatus({ subscribed: 'true' });
    } else {
      setStatus({ error: await res.json() });
    }
    return false;
  };

  return (
    <Formik
      validationSchema={userValidationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >{({
      errors, touched, isSubmitting, values, handleChange, handleSubmit, status,
    }) => (
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Control
            required
            placeholder="Your name"
            value={values.name}
            onChange={handleChange}
            isValid={touched.name && !errors.name}
            isInvalid={touched.name && errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Control
            required
            placeholder="email@domain.com"
            value={values.email}
            onChange={handleChange}
            isValid={touched.email && !errors.email}
            isInvalid={touched.email && errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>
        { status?.subscribed ? (<>Awesome! You will hear from us soon.</>) : null }
        <Button block variant="primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner size="sm" animation="border" /> : null } Subscribe for FundOSS updates
        </Button>
      </Form>
    )}
    </Formik>
  ); 
};

export default SubscriptionForm;
