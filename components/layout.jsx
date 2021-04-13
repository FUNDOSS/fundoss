import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import AuthLinks from './auth/AuthLinks';
import CartButton from './cart/CartButton';
import Cart from './cart/Cart';
import Logo from './Logo';
import Footer from './Footer';
import Icons from './icons';
import Qf from '../utils/qf';

const Layout = ({
  children, meta, title = 'FundOSS | Democratic funding for open-source collectives', hidefooter, 
  state = {
    current: false, upcoming: false, user: {}, cart: [], 
  },
}) => {
  const router = useRouter();
  const {
    user, cart, current, upcoming, 
  } = state;
  if (state && state.current) {
    Qf.init(
      current.predicted.average, 
      current.predicted.match,
      current.predicted.fudge,
      current.matchingCurve.symetric,
      current.matchingCurve.exp,
    ); 
    Cart.previousDonations = user.donations;
  } 

  return (
    <div id="main" style={{ display: 'none' }}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
        <link rel="manifest" href="/static/site.webmanifest" />
        <link rel="mask-icon" href="/static/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/static/favicon.ico" />
        <meta property="og:image" content={meta?.img || `${state.siteUrl}/static/twitter-default.png`} /> 
        <meta property="twitter:image" content={meta?.img || `${state.siteUrl}/static/twitter-default.png`} /> 
        {meta?.url ? <meta property="og:url" /> : null }
        {meta?.description ? <meta property="og:description" content={meta?.description} /> : null }
        {meta?.description ? <meta property="twitter:description" content={meta?.description} /> : null }
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Navbar bg="light" expand="lg" fixed="top">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Link href="/"><Navbar.Brand href="/"><Logo className="logo" /></Navbar.Brand></Link>
          <Navbar.Collapse id="primary-nav">
            <Nav activeKey={router.pathname} className="mr-auto">
              <Nav.Link href="https://blog.opencollective.com/fundoss-faqv1/">
                <Icons.Question size={20} /> FAQ
              </Nav.Link>
              <Link href="/democratic-funding">
                <Nav.Link href="/democratic-funding">
                  <Icons.Buoy size={20} /> How democratic funding works
                </Nav.Link>
              </Link>
  
              { current && upcoming._id ? (
                <Link href="/upcoming">
                  <Nav.Link href="/upcoming">
                    <Icons.Award size={20} />Upcoming
                  </Nav.Link>
                </Link>
              ) : null }
            </Nav>
          </Navbar.Collapse>
          { cart ? <CartButton className="btn-cart" itemCount={cart?.length} /> : null }
          <Nav className="auth">
            <AuthLinks user={user} />
          </Nav>
        </Navbar>
      </header>
      {children}
      <Footer minimal={hidefooter} state={state}/>
      { cart ? <Cart cart={cart} user={user} /> : null }
    </div>
  ); 
};

export default Layout;
