import React from 'react';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Ghost from '../../lib/ghost';
import Layout from '../../components/layout';
import middleware from '../../middleware/all';
import ServerProps from '../../lib/serverProps';

const PostsPage = ({ state, posts }) => (
  <Layout title="FundOSS | Blog" state={state}>
    <Container className="page-content">
      <Row>
        <Col className="post-list" md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          {posts.map((p) => (
            <div className="post" key={p.id}><h2><Link href={'/posts/'+p.slug}><a>{p.title}</a></Link></h2>
              <div className="meta">{moment(p.published_at).format('MMMM Do YYYY')} </div>
              <div className="gh-content" dangerouslySetInnerHTML={{ __html: p.excerpt }} />
              <Link href={'/posts/'+p.slug}><a>Read more...</a></Link>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const posts = await Ghost.getPosts();
  return { props: { state, posts } };
}

export default PostsPage;
