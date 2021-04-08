import React from 'react';
import FundingSessions from '../../lib/fundingSession/fundingSessionController';
import Layout from '../../components/layout';
import FundingSession from '../../components/fundingSession/FundingSession';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import ServerProps from '../../lib/serverProps';

const IndexPage = ({
  session, user, cart, featured, predicted, nominations, current,
}) => (
  <Layout title={`FundOSS | ${session.name}`} user={user} cart={cart} current={current} session={session} predicted={predicted}>
    {session._id ? (
      <FundingSession 
        session={session} 
        featured={featured} 
        predicted={predicted}
        user={user}
        nominations={nominations}
      />
    ) : null }
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);

  const current = await ServerProps.getCurrentSessionInfo();
  const user = await ServerProps.getUser(req.user, current?._id);
  let predicted = {}; 
  let cart = false;
  
  if (current) {
    predicted = await ServerProps.getPredicted(current);
    cart = await ServerProps.getCart(req.session.cart);
  }
  
  const session = await FundingSessions.getBySlug(query.slug);
  const featured = serializable(session.collectives[Math.floor(Math.random() * session.collectives.length)]);
  const nominations = await ServerProps.getNominations(session._id, user._id);

  return {
    props: {
      current,
      nominations,
      user,
      predicted,
      session: serializable(session),
      cart,
      featured,
    },
  };
}

export default IndexPage;
