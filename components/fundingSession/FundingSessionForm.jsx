import React from 'react';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import {
  Alert, Badge, Col, Row, 
} from 'react-bootstrap';
import Select from 'react-select';
import Graph from '../qf/graph';
import Qf from '../../utils/qf';

const FundingSessionForm = ({ sessionData }) => {
  const userValidationSchema = Yup.object({
    name: Yup.string()
      .required('Please provide a name'),
    description: Yup.string()
      .required('Please provide a description'),
  });
  const router = useRouter();
  const availableTags = () => {
    const tagsMap = sessionData?.collectives.reduce((tags, col) => {
      col.tags?.map((tag) => {
        tags[tag] ? tags[tag] += 1 : tags[tag] = 1;
      });
      return tags;
    }, {}) || {};
    return Object.keys(tagsMap)
      .map((key) => ({ label: key, count: tagsMap[key] }))
      .sort((a, b) => b.count - a.count);
  };

  const tagOptions = availableTags().map(
    (tag) => ({
      label: <>{tag.label} <Badge variant="primary">{tag.count} </Badge></>, 
      value: tag.label,
      isSelected: sessionData?.tags.indexOf(tag.label) > -1,
    }),
  );

  const toFormValues = (session) => ({
    ...session,
    matchedFunds: session?.matchedFunds || 100000,
    averageDonationEst: session?.averageDonationEst || 20,
    numberDonationEst: session?.numberDonationEst || 2000,
    start: moment(session?.start || new Date()).format('YYYY-MM-DD'),
    end: moment(session?.end || new Date()).format('YYYY-MM-DD'),
    collectives: (session?.collectives || []).map((collective) => `https://opencollective.com/${collective.slug}`).join('\n'),
    tags: session?.tags || [],
    matchingCurve: session?.matchingCurve || { exp: 2, symetric: true },
  });

  const initialValues = toFormValues(sessionData);

  const handleSubmit = async (values, { setStatus }) => {
    const body = JSON.stringify(values);
    const res = await fetch('/api/funding-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (res.status === 200) {
      setStatus({ saved: true });
      values._id ? router.reload() : router.push(`/dashboard/funding-session/${session.slug}`);
    } else {
      setStatus({ error: res.json() });
    }
  };

  return (
    <Formik
      validationSchema={userValidationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        isSubmitting,
        values,
        handleChange,
        // eslint-disable-next-line no-shadow
        handleSubmit,
        status,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Session Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Session Title"
              value={values.name}
              onChange={handleChange}
              isValid={touched.name && !errors.name}
              isInvalid={touched.name && errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId="matchedFunds">
                <Form.Label>Matched Funds</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="in USD"
                  step={1000}
                  min={1000}
                  value={values.matchedFunds}
                  onChange={handleChange}
                  isValid={touched.matchedFunds && !errors.matchedFunds}
                  isInvalid={touched.matchedFunds && errors.matchedFunds}
                />
                <Form.Control.Feedback type="invalid">{errors.matchedFunds}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="averageDonationEst">
                <Form.Label>Avg est</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="in USD"
                  value={values.averageDonationEst}
                  min={1}
                  onChange={handleChange}
                  isValid={touched.averageDonationEst && !errors.averageDonationEst}
                  isInvalid={touched.averageDonationEst && errors.averageDonationEst}
                />
                <Form.Control.Feedback type="invalid">{errors.averageDonationEst}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="numberDonationEst">
                <Form.Label># est</Form.Label>
                <Form.Control
                  required
                  step={100}
                  type="number"
                  placeholder="in USD"
                  min={100}
                  value={values.numberDonationEst}
                  onChange={handleChange}
                  isValid={touched.numberDonationEst && !errors.numberDonationEst}
                  isInvalid={touched.numberDonationEst && errors.numberDonationEst}
                />
                <Form.Control.Feedback type="invalid">{errors.numberDonationEst}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="matchingCurve.exp">
                <Form.Label>exp</Form.Label>
                <Form.Control
                  required
                  step={0.1}
                  type="number"
                  min={0.5}
                  max={3}
                  value={values.matchingCurve.exp}
                  onChange={handleChange}
                />
              </Form.Group>

            </Col>
          </Row>
          <Form.Group controlId="matchingCurve.symetric">
            <Form.Check 
              label="symetric curve" 
              checked={values.matchingCurve.symetric}
              onChange={handleChange}
            />
          </Form.Group>
          <Graph 
            plot={(x) => Qf.calculate(
              x, 
              values.averageDonationEst, 
              values.matchedFunds / values.numberDonationEst,
              values.matchingCurve.exp,
              1,
              values.matchingCurve.symetric,
            )} 
            averageDonation={values.averageDonationEst} 
            averageMatch={values.matchedFunds / values.numberDonationEst} 
            fudge={1}
            exp={values.matchingCurve.exp}
            width={520}
            height={300}
          />
          <Form.Group controlId="description">
            <Form.Label>Session description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={values.description}
              onChange={handleChange}
              isValid={touched.description && !errors.description}
              isInvalid={touched.description && errors.description}
            />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="start">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="start"
              placeholder="Start Date"
              value={values.start}
              onChange={handleChange}
              isValid={touched.start && !errors.start}
              isInvalid={touched.start && errors.start}
            />
            <Form.Control.Feedback type="invalid">{errors.start}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="end">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="end"
              placeholder="End Date"
              value={values.end}
              onChange={handleChange}
              isValid={touched.end && !errors.end}
              isInvalid={touched.end && errors.end}
            />
            <Form.Control.Feedback type="invalid">{errors.end}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="collectives">
            <Form.Label>URLS of collectives (https://opencollective.com/slug) seperated by a newline</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={values.collectives}
              onChange={handleChange}
              isValid={touched.collectives && !errors.collectives}
              isInvalid={touched.collectives && errors.collectives}
            />
            <Form.Control.Feedback type="invalid">{errors.collectives}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="sponsors">
            <Form.Label>Html with logos and links for the sponsors</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={values.sponsors}
              onChange={handleChange}
              isValid={touched.sponsors && !errors.sponsors}
              isInvalid={touched.sponsors && errors.sponsors}
            />
            <Form.Control.Feedback type="invalid">{errors.sponsors}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Select tags to filter collectives</Form.Label>
            <Select
              instanceId="tags"
              closeMenuOnSelect={false}
              isMulti
              onChange={(inputValue) => {
                values.tags = inputValue.map((selected) => selected.value);
              }}
              defaultValue={tagOptions.filter((tag) => values.tags.indexOf(tag.value) > -1)}
              options={tagOptions}
            />
          </Form.Group>

          {values.collectiveImportErrors && Object.keys(values.collectiveImportErrors).length ? (
            <Alert variant="danger"><Alert.Heading>Previous Import Errors</Alert.Heading>
              {Object.keys(values.collectiveImportErrors).map(
                (key) => <p key={key}>https://opencollective.com/{key} {values.collectiveImportErrors[key]}</p>, 
              )}
            </Alert>
          ) : null}

          {status?.saved ? (<Alert variant="success">Session saved!</Alert>) : null}
          {status?.error ? (<Alert variant="danger">{status.error.message}</Alert>) : null}
          <Button variant="primary" disabled={isSubmitting} type="submit">{values?._id ? 'Update Session' : 'Create Session'}</Button>
        </Form>

      )}
    </Formik>
  );
};

export default FundingSessionForm;
