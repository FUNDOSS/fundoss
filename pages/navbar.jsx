import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import middleware from '../middleware/all';
import ServerProps from '../lib/serverProps';
import Icons from '../components/icons';
import Logo from '../components/Logo';

const NavBarUI = ({ state }) => (
  <Navbar bg="light" expand="lg" fixed="top">
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Link href="/"><Navbar.Brand href="/"><Logo className="logo" /></Navbar.Brand></Link>
    <Navbar.Collapse id="primary-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/blog/faq" target="top">
          <Icons.Question size={20} /> FAQ
        </Nav.Link>
        <Link href="/democratic-funding" target="top">
          <Nav.Link href="/democratic-funding">
            <Icons.Buoy size={20} /> How democratic funding works
          </Nav.Link>
        </Link>
        <Link href="/blog">
          <Nav.Link href="/blog" target="top">
            <Icons.Globe size={20} /> Blog
          </Nav.Link>
        </Link>
        { state.current && state.upcoming._id ? (
          <Link href="/upcoming" target="top">
            <Nav.Link href="/upcoming">
              <Icons.Award size={20} />Upcoming
            </Nav.Link>
          </Link>
        ) : null }
      </Nav>
    </Navbar.Collapse>
  </Navbar>

);

export async function getServerSideProps({ req, res }) {
  await middleware.run(req, res);
  const state = await ServerProps.getAppState(req.user, req.session.cart);
  return { props: { state } };
}

export default NavBarUI;
