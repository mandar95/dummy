import React from 'react';
import EmployeeFormCenter from './employee.form.center';
import BrokerFormCenter from './broker.form.center';
import { useParams, Redirect } from 'react-router-dom'

export const FormCenter = ({ myModule }) => {

  let { userType } = useParams();
  switch (userType) {
    case "admin":
      return <BrokerFormCenter admin myModule={myModule} />
    case "broker":
      return <BrokerFormCenter myModule={myModule} />
    case "employee":
      return <EmployeeFormCenter />
    case "employer":
      return <EmployeeFormCenter />
    default:
      return <Redirect to='/404' />;
  }
}
