import React, { useEffect } from 'react';
import { useHistory } from "react-router";

import { useSelector } from 'react-redux';
import { Loader } from '../../../components'

export const Home = () => {

  const history = useHistory();

  const { userType } = useSelector(state => state.login);
  useEffect(() => {
    if (userType) {
      switch (userType) {
        case "Super Admin": history.push('/admin/home');
          break;
        case "Broker": history.push('/broker/home');
          break;
        case "Employer": history.push('/employer/home');
          break;
        case "Employee": history.push('/employee/home');
          break;
        case "IC": history.push('/insurer/home');
          break;
          case "Customer": history.push('/customer/home');
          break;
        default: history.push('/login');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

  return (<Loader />)
}


//Broker Employer Employee Super Admin
