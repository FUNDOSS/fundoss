import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Router from 'next/router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCurrentUser } from '../../hooks/index';

export const SignupForm = () => {
  const [user, { mutate }] = useCurrentUser();
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    if (user) Router.replace('/');
  }, [user]);

  const userValidationSchema = Yup.object({
    name: Yup.string()
      .required('Please provide a name')
      .min(2, 'Mininum 2 characters')
      .max(20, 'Maximum 20 characters'),
    email: Yup.string()
      .required('Please provide a email')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Please provide a password of minimum 8 characters')
      .min(8, 'Minimum 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], "Passwords don't match"),
    terms: Yup.bool().required().oneOf([true], 'Please accept our terms and conditions'),
  });

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values, { setErrors }) => {
    const body = {
      email: values.email,
      name: values.name,
      password: values.password,
    };

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 201) {
      const userObj = await res.json();
      mutate(userObj);
      Router.replace('/');
    } else {
      const errors = {};
      const serverErrors = await res.json();
      console.log(serverErrors);
      serverErrors.errors.map((error) => {
        errors[error.field] = error.message;
      });
      setErrors(errors);
    }
  };

  return (
    <Formik
      validationSchema={userValidationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {
        (
          {
            errors,
            touched,
            isSubmitting,
            values,
            handleSubmit,
            handleChange,
          },
        ) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Your Name </Form.Label>
              <Form.Control
                type="text"
                value={values.name}
                placeholder="John Doe"
                onChange={handleChange}
                isValid={touched.name && !errors.name}
                isInvalid={touched.name && errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Your Email </Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="john.doe@domain.com"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={touched.email && errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Your Password</Form.Label>
              <Form.Control
                required
                type="password"
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                isInvalid={touched.password && errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                required
                type="password"
                onChange={handleChange}
                isValid={touched.confirmPassword && !errors.confirmPassword}
                isInvalid={touched.confirmPassword && errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Check
                required
                value
                name="terms"
                label="Agree to terms and conditions"
                onChange={handleChange}
                isInvalid={!!errors.terms}
                feedback={errors.terms}
              />
            </Form.Group>
            <Button variant="primary" disabled={isSubmitting} type="submit">Sign up</Button>
          </Form>
        )
}
    </Formik>
  );
};

export default SignupForm;
