import React from 'react';
import PropTypes from 'prop-types';


import { useSelector } from 'react-redux';
import {
  getUsersData, selectUsersData,
  RoleData, selectRoleData,
  createUser
} from '../user.slice';
import { UserCreate } from './User';

export default function EmployerCreateUser({ type }) {
  const Roles = useSelector(selectRoleData);
  const Users = useSelector(selectUsersData);
  const { currentUser } = useSelector(state => state.login);

  return currentUser?.employer_id ? (
    <UserCreate
      type={type}
      own
      Users={Users}
      getUsersData={getUsersData}
      Roles={Roles}
      RoleData={RoleData}
      createUser={createUser}
      idUser={currentUser?.employer_id} />
  ) : null
}

// default props
EmployerCreateUser.defaultProps = {
  type: "Employer"
}

// props types
EmployerCreateUser.propTypes = {
  type: PropTypes.string,
};
