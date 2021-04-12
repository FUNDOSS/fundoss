import React from 'react';
import Layout from '../components/layout';
import FundingSession from '../components/fundingSession/FundingSession';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';

const IndexPage = ({
  session, nominations, state,
}) => (
  <Layout title="FundOSS | Upcoming funding round nominate your collectives" state={state}>
    {session?._id ? (
      <FundingSession 
        session={session} 
        user={state.user}
        predicted={state.current.predicted}
        nominations={nominations}
        state={state}
      />
    ) : null }
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const session = await ServerProps.getUpcoming();
  const nominations = await ServerProps.getNominations(session._id, state.user._id);

  return {
    props: {
      nominations,
      session,
      state, 
    },
  };
}

export default IndexPage;
