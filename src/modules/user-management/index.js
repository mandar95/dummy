import { lazy } from 'react';


import UpdateRoleForEmployee from "./AssignRole/EditRoleEmployee";
import UserManagmentEmployee from "./UserManagmentEmployee";
import { ZoneMapping } from './CreateZone/ZoneMapping';
import { RegionMapping } from './CreateRegion/RegionMapping';
import AdminModule from './adminModule/AdminModule';
import { LivesDependent } from './Live&Dependent/Lives&Dependent';
import { AllUsers } from './Users/Users';
import EmployeeDelete from "./EmployeeDelete";


const UserManagement = lazy(() => import(/* webpackChunkName: "userManagement" */'./UserManagment'));
const CreateAdmin = lazy(() => import(/* webpackChunkName: "userManagement" */'./CreateUser/Admin'));
const AdminCreateUser = lazy(() => import(/* webpackChunkName: "userManagement" */'./CreateUser/AdminCreateUser'));
const BrokerCreateUser = lazy(() => import(/* webpackChunkName: "userManagement" */'./CreateUser/BrokerCreateUser'));
const EmployerCreateUser = lazy(() => import(/* webpackChunkName: "userManagement" */'./CreateUser/EmployerCreateUser'));

const RoleForm = lazy(() => import(/* webpackChunkName: "userManagement" */'./AssignRole/RoleForm'));
const UpdateRole = lazy(() => import(/* webpackChunkName: "userManagement" */'./AssignRole/EditRole'));

const CreateModule = lazy(() => import(/* webpackChunkName: "userManagement" */'./CreateModule/CreateModule'));
const UpdateModule = lazy(() => import(/* webpackChunkName: "userManagement" */'./CreateModule/EditModule'));

const OnBoard = lazy(() => import(/* webpackChunkName: "userManagement" */'./Onboard/OnBoard'));

const BrokerView = lazy(() => import(/* webpackChunkName: "userManagement" */'./View/BrokerView'));
const EmployerView = lazy(() => import(/* webpackChunkName: "userManagement" */'./View/EmployerView'));
const EmployeeView = lazy(() => import(/* webpackChunkName: "userManagement" */'./View/EmployeeView'));

const DataTable = lazy(() => import(/* webpackChunkName: "dataTable" */'./DataTable/DataTable'));


export {
  UserManagement,

  CreateAdmin,
  AdminCreateUser,
  BrokerCreateUser,
  EmployerCreateUser,
  // InsurerCreateUser,
  // EmployerBranches,

  RoleForm,
  UpdateRole,

  CreateModule,
  UpdateModule,

  OnBoard,
  // OnBoardTpa,

  BrokerView,
  EmployerView,
  EmployeeView,
  // InsurerView,

  DataTable,

  UpdateRoleForEmployee,
  UserManagmentEmployee,
  ZoneMapping,
  RegionMapping,
  AdminModule,
  LivesDependent,
  AllUsers,
  EmployeeDelete
}
