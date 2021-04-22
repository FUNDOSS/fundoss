import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { useRouter } from 'next/router';
import Link from 'next/link';

const DashboardNav = () => {
  const router = useRouter();
  return (
    <Nav variant="tabs" activeKey={router.pathname}>
      <Nav.Item>
        <Nav.Link><Link href="/dashboard">Dashboard</Link></Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link><Link href="/dashboard/payment">Payments</Link></Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link><Link href="/dashboard/funding-session">Sessions</Link></Nav.Link>
      </Nav.Item>
    </Nav>
  ); 
};

export default DashboardNav;
