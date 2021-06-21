import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { Table, Image, Badge } from 'react-bootstrap';
import { formatAmountForDisplay } from '../../utils/currency';

const PaymentsTable = ({ payments }) => (
  <Table>
    {payments.map((payment) => (
      <tr key={payment._id}>
        <td>
          <Link href={`/dashboard/payment/${payment._id}`}>
            <a><Image src={payment.user?.avatar} roundedCircle width={20} /> {moment(payment.time).format('lll')}</a>
          </Link> 
          &nbsp;{payment.user?.username}
          <Badge variant={payment.status === 'succeeded' ? 'success' : 'danger'}>{payment.status}</Badge>&nbsp;
          {formatAmountForDisplay(payment.amount)} <small>-{payment.fee} fee</small>
        </td>
        <td>{ payment.donations.map((don, index) => {
          if (index < 6) {
            return (
              <Link href={`/dashboard/payment/?collective=${don.collective._id}`}>
                <a>
                  <Badge key={don.collective.slug} variant="light" style={{ marginRight: '3px' }}>
                    ${don.amount} <Image src={don.collective.imageUrl} roundedCircle width={20} />
                  </Badge>
                </a>
              </Link>
            ); 
          }
          return (<b key={don.collective.slug}>.</b>);
        })}
        </td>
        <td>
          risk sybil {payment.sybilAttackScore} stripe {payment.stripeRisk}
        </td>
      </tr>
    ))}
  </Table>
);

export default PaymentsTable;
