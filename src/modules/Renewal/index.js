import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { BrokerRenewal } from './Broker/broker.renewal.main';

export default function RenewalSwitchExchange({ myModule }) {

  let { userType } = useParams();
  switch (userType) {
    case 'broker':
      return <BrokerRenewal canWrite={myModule?.canwrite} />;
    case 'admin':
      return <BrokerRenewal canWrite={myModule?.canwrite} admin />;
    default:
      return <Redirect to='/404' />
  }
}
