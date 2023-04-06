import React from 'react';
import PropTypes from 'prop-types';


import { useSelector } from 'react-redux';
import {
  getUsersData, selectUsersData,
  RoleData, selectRoleData,
  createUser, loadInsurer
} from '../user.slice';
import { UserCreate } from './User';

export default function AdminCreateUser({ type }) {
  const Users = useSelector(selectUsersData);
  const Roles = useSelector(selectRoleData);

  return (
    <UserCreate
      type={type}
      Users={Users}
      getUsersData={type === 'Insurer' ? loadInsurer : getUsersData}
      Roles={Roles}
      RoleData={RoleData}
      createUser={createUser} />
  )
}


// default props
AdminCreateUser.defaultProps = {
  type: "Broker"
}

// props types
AdminCreateUser.propTypes = {
  type: PropTypes.string,
};
