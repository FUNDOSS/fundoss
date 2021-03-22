import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../../lib/hooks';



export const LoginForm = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const userValidationSchema = Yup.object({
    email: Yup.string()
      .required('Please provide a email')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Please provide a password'),
  })
  
  const initialValues = {
    email: '',
    password: '',
  }
 
  const handleSubmit = async (values, { setFieldError }) => {
    const body = {
      email: values.email,
      password: values.password,
    };
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 200) {
      //Router.push('/')
    } else {
      setFieldError('password', 'Wrong email or password')
    }
  };

  return (
    <Formik
        validationSchema = {userValidationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        >{({ errors, touched, isSubmitting, handleSubmit, values, handleChange}) => (
          <Form noValidate onSubmit={handleSubmit} >
              <Form.Group controlId="email">
                  <Form.Label >Your Email </Form.Label>
                  <Form.Control 
                    required 
                    autoComplete="email"
                    type="email" 
                    placeholder="john.doe@domain.com" 
                    value={values.email}
                    onChange={handleChange}
                    isValid={touched.email && !errors.email}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="password" >
                <Form.Label >Your Password</Form.Label>
                <Form.Control required
                    type="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    isValid={touched.password && !errors.password}
                    isInvalid={touched.password && errors.password}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" disabled={isSubmitting} type="submit">Login</Button>
          </Form>
          )}
        </Formik>
    );
    };

export default LoginForm
