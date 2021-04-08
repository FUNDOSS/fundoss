import React from 'react';
import Layout from '../components/layout';
import FundingSession from '../components/fundingSession/FundingSession';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';

const IndexPage = ({
  session, user, cart, featured, predicted, nominations,
}) => (
  <Layout title="FundOSS | Upcoming funding round nominate your collectives" user={user} cart={cart} predicted={predicted}>
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
  const session = await ServerProps.getUpcoming();
  const user = await ServerProps.getUser(req.user);
  const predicted = {}; 
  const cart = false;
  const nominations = await ServerProps.getNominations(session._id, user._id);

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