import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Dump from './Dump';

const UserCard = ({ user }) => (
  <Card>
    <Card.Body>
      <Image src={user.avatar} roundedCircle width={30} />
      <b> {user.name || user.username}</b>
      <Dump data={user} />
    </Card.Body>
  </Card>
);

export default UserCard;
