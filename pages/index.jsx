import React from 'react';
import Layout from '../components/layout';
import FundingSession from '../components/fundingSession/FundingSession';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';
import serializable from '../lib/serializable';

const IndexPage = ({
  session, user, cart, featured, predicted,
}) => (
  <Layout title="FundOSS | Quadratic funding for open source projects" user={user} cart={cart} predicted={predicted}  >
    {session._id ? <FundingSession session={session} featuredCollective={featured} user={user} /> : null }
  </Layout>
);


export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const session = await ServerProps.getCurrentSession();
  const cart = await ServerProps.getCart(req.session.cart);
  const user = await ServerProps.getUser(req.user);
  const featured = session?.collectives[Math.floor(Math.random() * session.collectives.length)];
  return {
    props: {
      predicted: session.predicted,
      user,
      session: serializable(session),
      featured: serializable(featured),
      cart,
    },
  };
}

export default IndexPage;
