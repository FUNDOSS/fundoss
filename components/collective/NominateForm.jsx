import React from 'react';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card } from 'react-bootstrap';
import Icons from '../icons';

export const NominateForm = ({ sessionId }) => {
  const userValidationSchema = Yup.object({
    url: Yup.string()
      .required('Please provide a collective url')
      .matches(/http(?:s)?:\/\/(?:www\.)?opencollective\.com\/([a-zA-Z0-9_]+)/, 'Please only use a opencollective url'),
  });
  const router = useRouter();
  const initialValues = {
    url: '',
  };

  const handleSubmit = async (values) => {
    const body = JSON.stringify({ ...values, ...{ sessionId } });
    const res = await fetch('/api/funding-session/nominate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (res.status === 200) {
      const result = await res.json();
      router.push(`/collective/${result.slug}`);
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
      errors, touched, isSubmitting, values, handleChange, handleSubmit,
    }) => (
      <Form noValidate onSubmit={handleSubmit}>
        Nominate your favorite collective from <a href="https://opencollective.com/" target="_blank" rel="noreferrer">opencollective.com</a> to be included in this session
        <Form.Group controlId="url">
          <Form.Control
            required
            placeholder="https://opencollective.com/slug"
            value={values.url}
            onChange={handleChange}
            isValid={touched.url && !errors.url}
            isInvalid={touched.url && errors.url}
          />
          <Form.Control.Feedback type="invalid">{errors.url}</Form.Control.Feedback>
        </Form.Group>
        <Button block variant="primary" disabled={isSubmitting} type="submit">
          <Icons.Award size={22} /> Nominate a collective
        </Button>

      </Form>
    )}
    </Formik>
  );
};

export default NominateForm;
