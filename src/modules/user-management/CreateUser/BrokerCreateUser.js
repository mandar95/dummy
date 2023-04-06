import React from 'react';
import PropTypes from 'prop-types';


import { useSelector } from 'react-redux';
import {
  getUsersData, selectUsersData,
  RoleData, selectRoleData,
  createUser
} from '../user.slice';
import { UserCreate } from './User';

export default function BrokerCreateUser({ type }) {
  const Roles = useSelector(selectRoleData);
  const Users = useSelector(selectUsersData);
  const { currentUser } = useSelector(state => state.login);
  return currentUser?.broker_id ? (
    <UserCreate
      type={type}
      own={(type === "Broker") ? true : false}
      Users={Users}
      getUsersData={getUsersData}
      Roles={Roles}
      RoleData={RoleData}
      createUser={createUser}
      idUser={currentUser?.broker_id}
      isRfq={currentUser?.is_rfq}
    />
  ) : null
}

// default props
BrokerCreateUser.defaultProps = {
  type: "Broker"
}

// props types
BrokerCreateUser.propTypes = {
  type: PropTypes.string,
};
