import React from 'react';
import moment from 'moment';
import { Table, Image, Badge } from 'react-bootstrap';

const PaymentsTable = ({ payments }) => (
  <Table>
    {payments.map((payment) => (
      <tr key={payment._id}>
        <td>
          <Badge variant={payment.status === 'succeeded' ? 'success' : 'danger'}>{payment.status}</Badge>&nbsp;
          $ {payment.amount} <small>-{payment.fee} fee</small>
        </td>
        <td>
          <Image src={payment.user.avatar} roundedCircle width={20} />&nbsp;{payment.user.username}
        </td>
        <td>{moment(payment.time).format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td>{payment.donations.map((don) => (
          <Badge key={don.collective.slug} variant="info" style={{ marginRight: '3px' }}>
            ${don.amount} <Image src={don.collective.imageUrl} roundedCircle width={20} />
          </Badge>
        ))}
        </td>
      </tr>
    ))}
  </Table>
);

export default PaymentsTable;
