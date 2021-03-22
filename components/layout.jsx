import React from 'react';
import Head from 'next/head';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import AuthLinks from './auth/AuthLinks';
import CartButton from './cart/CartButton';
import Cart from './cart/Cart';
import Logo from '../svg/logo.svg';
import Footer from './Footer';

const Layout = ({
  children, title = 'This is the default title', user, hidefooter, cart,
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <Navbar bg="light" expand="lg" fixed="top">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand href="/"><Logo /></Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/faq">FAQ</Nav.Link>
            <Nav.Link href="/quadratic-funding">How democratic funding works</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        { cart ? <CartButton itemCount={cart?.length} /> : null }
        <Nav className="mr-auto">
          <AuthLinks user={user} />
        </Nav>
      </Navbar>
    </header>
    {children}
    <Footer minimal={hidefooter} />
    { cart ? <Cart cart={cart} /> : null }
  </div>
);

export default Layout;
