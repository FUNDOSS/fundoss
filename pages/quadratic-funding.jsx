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
        {a: 80, m:40, p:2, desc:'Different averages make a different curve'},
        {a: 100, m:50, p:1, desc:'We can change the slope by using a different power'},
        {a: 100, m:50, p:1.5, desc:'We can change the slope by using a different power'},
        {a: 66, m:120, p:3, desc:''},
      ].map((o, index)=> <div key={index}>
        <h5>{o.desc}</h5>
        <p>Averages (donation: ${o.a}, match: ${o.a}) curve: {o.p}</p>
        <Graph plot={(x) => Qf.calculate(x, o.a, o.m, o.p)} averageDonation={o.a} averageMatch={o.m} />
      </div>)}
      
    </Container>
  </Layout>
);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  return { props: { user: serializable(req.user) } };
}

export default QFPage;
