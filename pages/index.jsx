import React from 'react';
import Layout from '../components/layout';
import FundingSession from '../components/fundingSession/FundingSession';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';

const IndexPage = ({
  session, user, cart, featured, predicted, nominations, current,
}) => (
  <Layout title="FundOSS | Democratic funding for open source projects" current={current} user={user} cart={cart} predicted={predicted}>
    {session?._id ? (
      <FundingSession 
        session={session} 
        featured={featured} 
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
  let user; 
  let featured;
  let current = false;
  let predicted = {}; 
  let cart = false;
  let nominations = { user: [] };
  
  if (!session) {
    session = await ServerProps.getUpcoming();
    user = await ServerProps.getUser(req.user);
    nominations = await ServerProps.getNominations(session._id, user._id);
  } else {
    user = await ServerProps.getUser(req.user, session._id);
    predicted = await ServerProps.getPredicted(session);
    cart = await ServerProps.getCart(req.session.cart);
    featured = session.collectives[Math.floor(Math.random() * session.collectives.length)];
    current = session;
  }
  
  return {
    props: {
      nominations,
      predicted,
      user,
      session,
      cart, 
      current,
      featured
    },
  };
}

export default IndexPage;
