import React from 'react';
import Container from 'react-bootstrap/Container';
import Layout from '../components/layout';
import middleware from '../middleware/all';
import serializable from '../lib/serializable';
import Graph from '../components/qf/graph';
import Qf from '../utils/qf';

const QFPage = ({ user }) => (
  <Layout title="FundOSS | WTF is Quadratic Funding ?" user={user}>
    <Container className="content">
      <h1 className="display-2">WTF is Quadratic Funding ?</h1>
      {[
        {a: 100, m:50, desc:'Current QF formula'},
        {a: 20, m:100, desc:'Current QF formula'},
      ].map((o, index)=> <div key={index}>
        <h5>{o.desc}</h5>
        <p>Averages (donation: ${o.a}, match: ${o.m})</p>
        <Graph plot={(x) => Qf.calculate(x, o.a, o.m)} averageDonation={o.a} averageMatch={o.m} />
      </div>)}
      
    </Container>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  return { props: { user: serializable(req.user) } };
}

export default QFPage;
