import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import GithubLoginButton from './GithubLoginButton';

const AuthLinks = ({ user }) => (
  <>{ user ? (
    <>
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
      )}
        >
          <NavDropdown.Item href="/account">
            Account
          </NavDropdown.Item>
          <NavDropdown.Item href="/api/auth/logout">
            Sign out
          </NavDropdown.Item>
          {user.role === 'admin' ? (
            <NavDropdown.Item href="/dashboard">
              Dashboard
            </NavDropdown.Item>
          ) : null }
        </NavDropdown>
      )}
    </>
  ) : null}
  </>
);

export default AuthLinks;
