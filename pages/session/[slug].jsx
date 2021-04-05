import React from 'react';
import FundingSessions from '../../lib/fundingSession/fundingSessionController';
import Layout from '../../components/layout';
import FundingSession from '../../components/fundingSession/FundingSession';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import ServerProps from '../../lib/serverProps';

const IndexPage = ({
  session, user, cart, featured, predicted,
}) => (
  <Layout title="FundOSS | Quadratic funding for open source projects" user={user} cart={cart} session={session} predicted={predicted}>
    {session._id ? (
      <FundingSession 
        session={session} 
        featuredCollective={featured} 
        user={user}
      />
    ) : null }
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const session = await FundingSessions.getBySlug(query.slug);
  const currentSession = await ServerProps.getCurrentSessionInfo();
  const cart = await ServerProps.getCart(req.session.cart);
  const user = await ServerProps.getUser(req.user);
  return {
    props: {
      user,
      predicted: ServerProps.predicted,
      session: serializable(session),
      cart,
      featured: serializable(
        session?.collectives[Math.floor(Math.random() * session.collectives.length)],
      ),
    },
  };
}

export default IndexPage;
