import React from 'react';
import Layout from '../components/layout';
import FundingSessionController, { getPredictedAverages } from '../lib/fundingSession/fundingSessionController';
import FundingSession from '../components/fundingSession/FundingSession';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';
import serializable from '../lib/serializable';
import CartController from '../lib/cart/CartController';

const IndexPage = ({
  session, user, cart, featured, predicted, nominations,
}) => (
  <Layout title="FundOSS | Quadratic funding for open source projects" user={user} cart={cart} predicted={predicted}>
    {session?._id ? (
      <FundingSession 
        session={session} 
        featuredCollective={featured} 
        user={user}
        predicted={predicted}
        nominations={nominations}
      />
    ) : null }
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  let session = await ServerProps.getCurrentSession();
  if (!session) {
    session = await ServerProps.getUpcoming();
  }
  const user = await ServerProps.getUser(req.user, session._id);
  const nominations = await ServerProps.getNominations(session._id, user._id);
  const cart = await ServerProps.getCart(req.session.cart);
  const predicted = await ServerProps.getPredicted(session);
  
  return {
    props: {
      nominations,
      predicted,
      user,
      session,
      cart, 
    },
  };
}

export default IndexPage;
