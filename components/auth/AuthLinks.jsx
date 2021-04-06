import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import GithubLoginButton from './GithubLoginButton';

const AuthLinks = ({ user }) => (
  <>{ user ? (
    <>
      { !user._id ? (
        <>
          <GithubLoginButton variant="link" size="sm" minify />
        </>
      ) : (
        <DropdownButton 
          variant="link"
          menuAlign="right"
          title={(
            <span className="authDropdownLabel">
              <Image width="20" height="20" src={user?.avatar} roundedCircle />
              <span>{` Hi ${user?.name || user?.username}`}</span>
            </span>
      )}
        >
          <Dropdown.Item href="/account">
            Account
          </Dropdown.Item>
          <Dropdown.Item href="/api/auth/logout">
            Sign out
          </Dropdown.Item>
          {user.role === 'admin' ? (
            <Dropdown.Item href="/dashboard">
              Dashboard
            </Dropdown.Item>
          ) : null }
        </DropdownButton>
      )}
    </>
  ) : null}
  </>
);

export default AuthLinks;
