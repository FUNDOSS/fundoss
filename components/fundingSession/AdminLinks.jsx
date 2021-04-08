import React from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';

const AdminLinks = ({
  session, view, edit, disbursments, 
}) => {
  const {
    start, slug,
  } = session;

  return (
    <>
      {edit ? <Button variant="outline-primary" href={`/dashboard/funding-session/${slug}/edit`}>edit</Button> : null }
      {view ? <Button variant="outline-secondary" href={`/session/${slug}`}>view</Button> : null }
      {disbursments && moment(start) < moment() ? (
        <Button variant="outline-secondary" href={`/dashboard/funding-session/${slug}/table`}>disbursments</Button>
      ) : null}
    </>
  );
};

export default AdminLinks;
