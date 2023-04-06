import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import { _renderModuleIconAction, _renderDefaultStatus, sortType } from "../../../components";
import {  RenderBranches } from "../component.helper";
import { verifyUser } from '../user.slice';


const displayParentModule = ({ data, value }) => {
  const parentData = data.find(({ id }) => value === id);
  return parentData?.moduleName || '-';
}

const displayParentModuleFilter = (rows, id, filterValue) => {
  return rows.filter(({ values }) => {
    if (values[id]) {
      const parentData = rows.find(({ original }) => Number(values[id]) === Number(original.id));
      return (parentData.values?.moduleName || '').toLowerCase().includes(String(filterValue).toLowerCase())
    }
    return false;
  });
}

export const RenderView = ({ value, row }) => {

  const { globalTheme } = useSelector(state => state.theme)
  const dispatch = useDispatch();
  const [state, setState] = useState(false);
  const isVerified = row.original.is_verified || state;

  const swalAlert = () =>
    swal({
      title: "Verify User?",
      text: 'Verify user email id : ' + value,
      icon: "info",
      buttons: true,
      dangerMode: true,
    })
      .then((willVerify) => {
        if (willVerify) {
          dispatch(verifyUser({ email: value }))
          setState(true);
        }
      });

  return value ? (<div className='d-flex justify-content-center align-items-center'>
    {value}&nbsp;&nbsp;
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>
        <strong>{isVerified ? 'User Verified' : 'Verify User'}</strong>
      </Tooltip>}>
      {isVerified ?
        // <Button size="sm" className="shadow rounded-lg align-items-center" variant='light'>
        <i className='fas fa-check-circle text-success' style={{
          fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px',
          paddingRight: '6px'
        }} />
        // </Button>
        :
        <Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={swalAlert}>
          <i className='fas fa-exclamation-triangle text-warning' />
        </Button>
      }
    </OverlayTrigger>
  </div>) : '-'
};


export const columnUser = (write, insurer, last_login_at) => [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Email",
    accessor: "email",
    ...write && { Cell: RenderView }
  },
  {
    Header: "Mobile No.",
    accessor: "mobile_no"
  },
  {
    Header: "Role",
    accessor: "role"
  },
  ...last_login_at ? [{
    Header: "Last Login",
    accessor: "last_login_at"
  }] : [],
  ...(insurer ? [{
    Header: "Role Type",
    accessor: "ic_user_type"
  }] : []),
  ...((write) ? [{
    Header: "Operations",
    accessor: "operations"
  }] : [])
];

export const columnBroker = [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Mobile No.",
    accessor: "contact"
  },
  {
    Header: "Users",
    accessor: "users"
  },
  {
    Header: "Employers",
    accessor: "employers"
  },
  {
    Header: "Operations",
    accessor: "operations"
  }
];

export const columnEmployer = (write, userType, _changeEnrollmentSheet) => [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Entity ID",
    accessor: "id"
  },
  {
    Header: "Mobile No.",
    accessor: "contact"
  },
  {
    Header: "Employees",
    accessor: "users"
  },
  ...(userType === 'admin' ? [{
    Header: "Broker",
    accessor: "broker"
  }] : []),
  ...(userType !== 'employer' ? [{
    Header: "Sub Entities",
    accessor: "child_companies",
    Cell: RenderBranches,
    disableSortBy: true,
    disableFilters: true
  }] : []),
  {
    Header: "Onboarded At",
    accessor: "onboarded_at",
    sortType: sortType,
  },
  ...(userType !== 'employer' ? [{
    Header: "Sheet Mapping",
    accessor: "sheet_data",
    Cell: _changeEnrollmentSheet,
    disableFilters: true,
    disableSortBy: true,
  }] : []),
  ...(write ? [{
    Header: "Operations",
    accessor: "operations"
  }] : [])
];

export const columnEmployee = [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Email",
    accessor: "email",
    Cell: RenderView
  },
  {
    Header: "Mobile No.",
    accessor: "contact",
    // disableFilters: true
  },
  {
    Header: "Members",
    accessor: "member_count",
    // disableFilters: true
  },
  {
    Header: "Employer",
    accessor: "employer",
    // disableFilters: true
  },
  {
    Header: "Operations",
    accessor: "operations"
  }
];

export const columnModules = (isAdmin) => [
  {
    Header: "Module Name",
    accessor: "moduleName"
  },
  {
    Header: "Parent Module Name",
    accessor: "parentId",
    Cell: displayParentModule,
    filter: displayParentModuleFilter
    // disableFilters: true,
    // disableSortBy: true,
  },
  ...isAdmin ? [{
    Header: "Sequence",
    accessor: "sequence",
  },
  {
    Header: "Module URL",
    accessor: "moduleUrl"
  },
  {
    Header: "Module Icon",
    accessor: "moduleIcon",
    Cell: _renderModuleIconAction
  }] : [],
  {
    Header: "Module Content",
    accessor: "moduleContent"
  },
  {
    Header: "Operations",
    accessor: "operations"
  }
];

export const columnRoles = (write, insurer) => [
  {
    Header: "Role Name",
    accessor: "name"
  },
  ...(insurer ? [{
    Header: "Type",
    accessor: "ic_user_type"
  }] : []),
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderDefaultStatus
  },
  ...(write ? [{
    Header: "Operations",
    accessor: "operations"
  }] : [])
];

export const columnEmployeeForEmployer = (read, verify) => [
  {
    Header: "Name",
    accessor: "name",
    // disableFilters: true,
    // disableSortBy: true,
  },
  {
    Header: "Mobile No.",
    accessor: "mobile_no",
    // disableFilters: true,
    // disableSortBy: true,
  },
  {
    Header: "Email",
    accessor: "email",
    ...verify && { Cell: RenderView }
  },
  {
    Header: "Designation",
    accessor: "designation",
    // disableFilters: true,
    // disableSortBy: true,
  },
  ...(read ? [] : [{
    Header: "Operations",
    accessor: "operations"
  }])
];

export const columnInsurer = [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Mobile No.",
    accessor: "contact_no_1"
  },
  {
    Header: "Email",
    accessor: "email",
    Cell: RenderView
  },
  {
    Header: "IRDA Registration No.",
    accessor: "irda_registration_number"
  },
  {
    Header: "CIN No.",
    accessor: "cin_no"
  },
  {
    Header: "Operations",
    accessor: "operations"
  }
];

export const columnTpa = (admin) => [
  {
    Header: "TPA Name",
    accessor: "name"
  },
  ...(admin ? [{
    Header: "Insurer Name",
    accessor: "created_by"
  }] : []),
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderDefaultStatus
  }
];

export const columnLives = () => [
  {
    Header: "Sr. No",
    accessor: "sr_no",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Employee Code",
    accessor: "employee_code",
  },
  {
    Header: "Relation",
    accessor: "relation_name",
  },
  {
    Header: "First Name",
    accessor: "first_name",
  },
  {
    Header: "Last Name",
    accessor: "last_name",
  },
  {
    Header: "Mobile No.",
    accessor: "mobile_no",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "DOB",
    accessor: "dob",
  },
  {
    Header: "Age",
    accessor: "age",
  },
];
