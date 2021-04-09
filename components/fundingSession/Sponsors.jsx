import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Sponsors = ({ sponsors = '', align = 'center', col = 4 }) => {
  const sponsorsList = sponsors.split('\n').map((s) => {
    const parts = s.split('|');
    return { name: parts[0], logo: parts[1], url: parts[2] };
  });
  return (
    <div className="content sponsors" >
      <p className={`text-${align}`}>Brought to you with ❤️️ from</p>
      <Row className={`no-gutters align-items-center justify-content-${align}`}>
        <Col xs={col} className={`text-${align}`}><a href="https://www.oscollective.org/" target="_blank"><img src="/sponsors/osc.svg" /></a></Col>
        <Col xs={col} className={`text-${align}`}><a href="https://gitcoin.co/" target="_blank"><img src="/sponsors/gitcoin.svg" /></a></Col>
        {sponsorsList.map((s) => <Col xs={col} className={`text-${align}`} key={s.name}><a target="_blank" href={s.url}><img src={s.logo} /></a></Col>)}
      </Row>
    </div>
  ); 
};

export default Sponsors;
