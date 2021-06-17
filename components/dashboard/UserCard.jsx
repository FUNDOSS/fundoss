import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Dump from './Dump';

const fields = ['name', 'email', 'username', 'githubid', 'facebookid', 'linkedinid', 'googleid'];

const UserCard = ({ user = {} }) => (
  <Card>
    <Card.Body>
      <Image src={user?.avatar} roundedCircle width={30} />
      {user ? fields.map((f) => <div key={f}><b>{f}</b>: {user[f]}</div>) : null}
    </Card.Body>
  </Card>
);

export default UserCard;
