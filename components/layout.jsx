import React from 'react';
import Head from 'next/head';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import AuthLinks from './auth/AuthLinks';
import CartButton from './cart/CartButton';
import Cart from './cart/Cart';
import Logo from './Logo';
import Footer from './Footer';
import Icons from './icons';
import Qf from '../utils/qf';

const Layout = ({
  children, title = 'This is the default title', user, hidefooter, cart, predicted,
}) => {
  if (predicted) {
    Qf.init(
      predicted.average, 
      predicted.match,
      predicted.fudge,
      predicted.symetric,
      predicted.exp,
    ); 
  }
  if (user) Cart.previousDonations = user.donations;

  return (
    <div id="main" style={{ display: 'none' }}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Navbar bg="light" expand="lg" fixed="top">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Brand href="/"><Logo /></Navbar.Brand>
          <Navbar.Collapse id="primary-nav">
            <Nav className="mr-auto">
              
              <Nav.Link href="https://blog.opencollective.com/fundoss-faqv1/"><Icons.Question size={20} /> FAQ</Nav.Link>
              <Nav.Link href="/democratic-funding"><Icons.Buoy size={20} /> How democratic funding works</Nav.Link>
              <Nav.Link href="/upcoming"><Icons.Award size={20} /> Upcoming</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          { cart ? <CartButton className="btn-cart" itemCount={cart?.length} /> : null }
          <Nav className="auth">
            <AuthLinks user={user} />
          </Nav>
        </Navbar>
      </header>
      {children}
      <Footer minimal={hidefooter} />
      { cart ? <Cart cart={cart} user={user} /> : null }
    </div>
  ); 
};

export default Layout;
