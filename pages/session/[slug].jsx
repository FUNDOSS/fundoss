import React from 'react';
import FundingSessions from '../../lib/fundingSession/fundingSessionController';
import Layout from '../../components/layout';
import FundingSession from '../../components/fundingSession/FundingSession';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import Cart from '../../lib/cart/CartController';

const IndexPage = ({ session, user, cart, featured }) => (
  <Layout title="FundOSS | Quadratic funding for open source projects" user={user} cart={cart}>
    {session._id ? <FundingSession session={session} featuredCollective={featured} /> : null }
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const session = await FundingSessions.getBySlug(query.slug);
  const cart = await Cart.get(req.session.cart);
  return {
    props: {
      user: serializable(req.user),
      session: serializable(session),
      cart: serializable(cart),
      featured: serializable(
        session?.collectives[Math.floor(Math.random() * session.collectives.length)],
      ),
    },
  };
}

export default IndexPage;
