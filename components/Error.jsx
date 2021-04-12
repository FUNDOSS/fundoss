import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import GithubLoginButton from './auth/GithubLoginButton';
import Layout from './layout';

const Error = ({ statusCode }) => (
  <Layout
    title="FundOSS | Oops something went wrong"
  >
    <div className="seamless-hand" style={{ marginBottom: '-60px' }}>
      <Container className="content">
        <Row>
          <Col />
          <Col>
            <h2>oops something went wrong</h2>
            <p style={{fontSize:'10rem'}} className="text-fat text-success">{statusCode}</p>
            {statusCode === 404 ? (
              <p className="lead">
                We could not find what you are looking for
              </p>
            ) : null }
            {statusCode === 401 ? (
              <div>
                <p className="lead">
                  Please sign-in
                </p>
                <GithubLoginButton />
              </div>
            ) : null }
            {statusCode === 403 ? (
              <div>
                <p className="lead">
                  You are not supposed to be here
                </p>
                <GithubLoginButton />
              </div>
            ) : null }
            {statusCode === 500 ? (
              <div>
                <p className="lead">
                  You are not supposed to be here
                  <Button href="https://github.com/humanific/fundoss/issues" block size="lg" variant="outline-light">🐞Submit Bugs or Issues</Button>
                </p>
                <GithubLoginButton />
              </div>
            ) : null }
          </Col>
        </Row>
      </Container>
    </div>
  </Layout>
);

export default Error;
