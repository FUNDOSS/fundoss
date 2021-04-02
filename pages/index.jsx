import React from 'react';
import Layout from '../components/layout';
import FundingSession from '../components/fundingSession/FundingSession';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';

const IndexPage = ({
  session, user, cart, featured, 
}) => (
  <Layout title="FundOSS | Quadratic funding for open source projects" user={user} cart={cart} session={session}>
    {session._id ? <FundingSession session={session} featuredCollective={featured} user={user} /> : null }
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const session = await ServerProps.getCurrentSession();
  const cart = await ServerProps.getCart(req.session.cart);
  const user = await ServerProps.getUser(req.user);
  console.log(user);
  return {
    props: {
      user,
      session,
      featured: session?.collectives[Math.floor(Math.random() * session.collectives.length)],
      cart
    },
  };
}

export default IndexPage;
