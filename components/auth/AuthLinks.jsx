import React from 'react';
import { withRouter } from 'next/router';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import GithubLoginButton from './GithubLoginButton';

const AuthLinks = ({ user, router }) => {
  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    });
    router.push('/');
  };
  return (
    <>{ user ? (<>
      { !user._id ? (
        <>
          <GithubLoginButton />
        </>
      ) : (
        <NavDropdown
          title={(
            <>
              <Image width="20" height="20" src={user?.avatar} roundedCircle fluid />
              {` Hi ${user?.name || user?.username}`}
            </>
      )}>
          <NavDropdown.Item href="/account">
            Account
          </NavDropdown.Item>
          <NavDropdown.Item onClick={handleLogout}>
            Sign out
          </NavDropdown.Item>
          {user.role === 'admin' ? (
            <NavDropdown.Item href="/dashboard">
              Dashboard
            </NavDropdown.Item>
          ) : null }
        </NavDropdown>
      )}
    </>) :null}</>
  );
};

export default withRouter(AuthLinks);
