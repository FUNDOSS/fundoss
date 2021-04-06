import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

const UserCard = ({ user }) => (
  <Card>
    <Card.Body>
      <Image src={user.avatar} roundedCircle width={30} />
      <b> {user.name || user.username}</b>
      <p>{user.email}</p>
    </Card.Body>
  </Card>
);

export default UserCard;
