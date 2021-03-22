import React from 'react';
import Nav from 'react-bootstrap/Nav';

const DashboardNav = () => (
  <Nav variant="tabs" fill>
    <Nav.Item>
      <Nav.Link active>Home</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link>Funding Sessions</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link>Payments</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link>Collectives</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link>Users</Nav.Link>
    </Nav.Item>
  </Nav>
);

export default DashboardNav;
