import React from 'react';
import FundingSessions from '../../lib/fundingSession/fundingSessionController';
import Layout from '../../components/layout';
import FundingSession from '../../components/fundingSession/FundingSession';
import middleware from '../../middleware/all';
import serializable from '../../lib/serializable';
import ServerProps from '../../lib/serverProps';

const IndexPage = ({
  session, featured, nominations, state,
}) => (
  <Layout title={`FundOSS | ${session.name}`} state={state}>
    {session._id ? (
      <FundingSession 
        state={state}
        session={session} 
        featured={featured} 
        predicted={state.current.predicted}
        user={state.user}
        nominations={nominations}
      />
    ) : null }
  </Layout>
);

export async function getServerSideProps({ query, req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  const session = await FundingSessions.getBySlug(query.slug);
  const featured = serializable(session.collectives[Math.floor(Math.random() * session.collectives.length)]);
  const nominations = await ServerProps.getNominations(session._id, req.user._id);
  return {
    props: {
      nominations,
      session: serializable(session),
      state,
      featured,
    },
  };
}

export default IndexPage;
