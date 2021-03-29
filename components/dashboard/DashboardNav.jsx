import React from 'react';
import Nav from 'react-bootstrap/Nav';

const DashboardNav = () => (
  <Nav variant="tabs" fill>
    <Nav.Item>
      <Nav.Link active>Home</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link href="/dashboard/payment">Payments</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link disabled>Collectives</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link disabled>Users</Nav.Link>
    </Nav.Item>
  </Nav>
);

export default DashboardNav;
