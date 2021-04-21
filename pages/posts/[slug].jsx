import React from 'react';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Ghost from '../../lib/ghost';
import Layout from '../../components/layout';
import middleware from '../../middleware/all';
import ServerProps from '../../lib/serverProps';

const PostsPage = ({ state, post }) => (
  <Layout title="FundOSS | Blog" state={state}>
    <Container className="page-content">
      <Row>
        <Col className="post-content" md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          <div className="post" key={post.id}><h1>{post.title}</h1>
            <div className="meta">{moment(post.published_at).format('MMMM Do YYYY')} </div>
            <div className="gh-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </Col>
      </Row>
    </Container>
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const post = await Ghost.getPost(query.slug);
  return { props: { state, post } };
}

export default PostsPage;
