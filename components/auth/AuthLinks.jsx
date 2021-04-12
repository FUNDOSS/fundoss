import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
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
          <Link href="/account">
            <Dropdown.Item  href="/account">
              Account
            </Dropdown.Item>
          </Link>
          <Link href="/api/auth/logout">
            <Dropdown.Item href="/api/auth/logout">
              Sign out
            </Dropdown.Item>
          </Link>
          {user.role === 'admin' ? (
            <Link href="/dashboard">
              <Dropdown.Item  href="/dashboard">
                Dashboard
              </Dropdown.Item>
            </Link>
          ) : null }
        </DropdownButton>
      )}
    </>
  ) : null}
  </>
);

export default AuthLinks;
