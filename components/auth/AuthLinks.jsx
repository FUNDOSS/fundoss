import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import OAuthLoginButton from './OAuthLoginButton';
import LoginModal from './LoginModal';
import Icons from '../icons';

const AuthLinks = ({ user }) => (
  <>{ user ? (
    <>
      { !user._id ? (<Button variant="link"  onClick={() => LoginModal.show()}><Icons.Signin size={20} />&nbsp;Sign In</Button>) 
        : (
          <DropdownButton 
            variant="link"
            menuAlign="right"
            title={(
              <span className="authDropdownLabel">
                <Image width="20" height="20" src={user?.avatar} roundedCircle />&nbsp;
                <span>{user?.name || user?.username}</span>
              </span>
      )}
          >
            <Link href="/account">
              <Dropdown.Item href="/account">
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
                <Dropdown.Item href="/dashboard">
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
