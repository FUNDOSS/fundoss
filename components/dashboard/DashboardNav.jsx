import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { useRouter } from 'next/router';

const DashboardNav = () => {
  const router = useRouter();
  return (
    <Nav variant="tabs" activeKey={router.pathname}>
      <Nav.Item>
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/dashboard/payment">Payments</Nav.Link>
      </Nav.Item>
    </Nav>
  ); 
};

export default DashboardNav;
