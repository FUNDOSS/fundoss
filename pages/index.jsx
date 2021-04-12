import React from 'react';
import Layout from '../components/layout';
import FundingSession from '../components/fundingSession/FundingSession';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';

const IndexPage = ({
  session, featured, nominations, state,
}) => (
  <Layout title="FundOSS | Democratic funding for open source projects" state={state}>
    {session?._id ? (
      <FundingSession 
        session={session} 
        featured={featured} 
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
  let session = await ServerProps.getCurrentSession();
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  let nominations = { user: [] };
  if (!session) {
    session = await ServerProps.getUpcoming();
    nominations = await ServerProps.getNominations(session._id, state.user._id);
  } 
  const featured = session.collectives[Math.floor(Math.random() * session.collectives.length)];
  return {
    props: {
      state,
      nominations,
      session,
      featured,
    },
  };
}

export default IndexPage;
