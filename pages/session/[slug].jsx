import React from 'react';
import FundingSessions from '../../lib/fundingSession/fundingSessionController';
import Layout from '../../components/layout';
import FundingSession from '../../components/fundingSession/FundingSession';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import ServerProps from '../../lib/serverProps';

const IndexPage = ({
  session, user, cart, featured, predicted, nominations,
}) => (
  <Layout title={`FundOSS | ${session.name}`} user={user} cart={cart} session={session} predicted={predicted}>
    {session._id ? (
      <FundingSession 
        session={session} 
        featuredCollective={featured} 
        predicted={predicted}
        user={user}
        nominations={nominations}
      />
    ) : null }
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);

  const currentSession = await ServerProps.getCurrentSessionInfo();
  const user = await ServerProps.getUser(req.user, currentSession?._id);
  let predicted = {}; 
  let cart = false;
  
  if (currentSession) {
    predicted = await ServerProps.getPredicted(currentSession);
    cart = await ServerProps.getCart(req.session.cart);
  }
  
  const session = await FundingSessions.getBySlug(query.slug);
  const nominations = await ServerProps.getNominations(session._id, user._id);

  return {
    props: {
      nominations,
      user,
      predicted,
      session: serializable(session),
      cart,
      featured: serializable(
        session?.collectives[Math.floor(Math.random() * session.collectives.length)],
      ),
    },
  };
}

export default IndexPage;
