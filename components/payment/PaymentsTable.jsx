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
        <td>{moment(payment.time).format('lll')}</td>
        <td>{ payment.donations.map((don, index ) => 
          {
            if(index < 6) 
              return (
                <Badge key={don.collective.slug} variant="light" style={{ marginRight: '3px' }}>
                  ${don.amount} <Image src={don.collective.imageUrl} roundedCircle width={20} />
                </Badge>
                );
            else return (<b>.</b>)
          }
        )}
        </td>
      </tr>
    ))}
  </Table>
);

export default PaymentsTable;
