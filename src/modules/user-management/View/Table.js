import React from 'react';

import { columnUser, columnBroker, columnEmployee, columnEmployer, columnEmployeeForEmployer } from '../DataTable';

import { Card } from 'components';

import { useSelector } from 'react-redux';
import { selectUsersStatus } from '../user.slice';
import { DataTable } from '../index';


export const UserManagement = (props) => {
  const userCount = useSelector(selectUsersStatus);
  // const { userType } = useSelector(state => state.login);
  const column = (props?.users && columnUser(props.canwrite)) ||
    (props?.broker && columnBroker) ||
    (props?.employer && columnEmployer(props.canwrite)) ||
    (props?.employee && columnEmployee) ||
    (props?.employeeEmployer && columnEmployeeForEmployer(!props.canwrite, props.canwrite));

  const type = (props?.users && "User") ||
    (props?.broker && "Broker") ||
    (props?.employer && "Employer") ||
    ((props?.employee || props?.employeeEmployer) && "Employee");

  return (
    <Card title={type[0].toUpperCase() + type.slice(1)}>
      {props.data && <DataTable
        columns={column}
        data={props.data || []}
        count={userCount}
        type={'Password'}
        noStatus
        EditFlag={props.canwrite}
        EditFunc={props.EditUser}
      />}
    </Card>
  );
}
