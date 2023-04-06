/*
Module: Create Insurer User
User Type: Admin
Commented By: Salman Ahmed
 */

// import React from 'react';
// import PropTypes from 'prop-types';


// import { useSelector } from 'react-redux';
// import {
//   getUsersData, selectUsersData,
//   RoleData, selectRoleData,
//   createUser
// } from '../user.slice';
// import { UserCreate } from './User';


// export const InsurerCreateUser = ({ type }) => {
//   const Roles = useSelector(selectRoleData);
//   const Users = useSelector(selectUsersData);
//   const { currentUser } = useSelector(state => state.login);
//   return currentUser?.ic_id ? (
//     <UserCreate
//       type={type}
//       own
//       Users={Users}
//       getUsersData={getUsersData}
//       Roles={Roles}
//       RoleData={RoleData}
//       createUser={createUser}
//       idUser={currentUser?.ic_id}
//       icID={currentUser?.ic_id}
//     />
//   ) : null
// }


// // default props
// InsurerCreateUser.defaultProps = {
//   type: "Insurer"
// }

// // props types
// InsurerCreateUser.propTypes = {
//   type: PropTypes.string,
// };
