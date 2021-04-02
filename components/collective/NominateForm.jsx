import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card } from 'react-bootstrap';

export const NominateForm = () => {

  const userValidationSchema = Yup.object({
    url: Yup.string()
      .required('Please provide a collective url')
      .url('Invalid url format'),
  });

  const initialValues = {
    url: ''
  };

  const handleSubmit = async (values) => {
    console.log(values);
    return false;
  };

  return (
    <Formik
      validationSchema={userValidationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >{({
      errors, touched, isSubmitting, values, handleChange, handleSubmit
    }) => (
      <Form noValidate onSubmit={handleSubmit}>
        <Card><Card.Body>
          <h3 className="text-center">Nominate a OSC collective to be included in this session</h3>
        <Form.Group controlId="url">
          <p className="text-center">
            Nominate your favorite collective from <a href="https://opencollective.com/" target="_blank" rel="noreferrer">opencollective.com</a> to be included in this session
          </p>
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
        <Button block variant="primary" disabled={isSubmitting} type="submit">Nominate a collective</Button>
        
        </Card.Body>
        <Card.Footer>
        <p className="text-center">Or</p> 
        <Button block variant="outline-primary" href="https://opencollective.com/create" target="_blank">Create your collective</Button>

        </Card.Footer>
        </Card>
      </Form>
    )}
    </Formik>
  );
};

export default NominateForm;
