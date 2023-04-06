import React, { useState } from 'react';

import { Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Card, Loader } from '../../../components';
import DataTablePagination from '../DataTablePagination/DataTablePagination';
import { ResetPasswordModal } from '../View/Organization/ResetPassword';

import service from '../users.service';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import {
  verifyUser, unblockUser,/* , employeeWiseStatus */
  userDelete
} from '../user.slice';
import { useHistory, useParams } from 'react-router';
import { ChooseUserType } from './ChooseUserType';
import ExportUsers from './ExportUsers';
import ViewModal from './enrollmentStatusModal';

export function AllUsers({ listId, myModule }) {
  const { currentUser, userType: currentUserType } = useSelector(state => state.login);
  const { loading } = useSelector(state => state.userManagement);
  const [modal, setModal] = useState();
  const [enrollmentModal, setEnrollmentModal] = useState();
  const [modalExport, setModalExport] = useState(false);
  const [show, setShow] = useState();
  const history = useHistory();
  const { userType } = useParams()


  const EditUserData = (data) => {
    setModal(data);
  };

  const SetEnrollmentData = (data) => {
    setEnrollmentModal(data)
  }

  const OnBoard = () => {
    if (userType === 'broker') {
      history.push('/onboard-employer')
    }
    if (userType === 'insurer') {
      history.push('/onboard-broker')
    }
    if (userType === 'admin') {
      setShow(2)
    }
  }

  const AddUser = () => {
    if (userType === 'broker') {
      setShow(1)
    }
    if (userType === 'admin') {
      setShow(3)
    }
    if (userType === 'employer') {
      history.push('/employer-create-user')
    }
  }


  return (
    <Card title={
      <div className="d-flex justify-content-between">
        <span>All Users</span>
        {!!myModule?.canwrite && <div className="d-flex justify-content-end flex-wrap">

          {['admin', 'broker', 'insurer'].includes(userType) && <Button size="sm" className="shadow-sm m-1 rounded-lg" variant="primary" onClick={OnBoard}>
            <strong>Onboard +</strong>
          </Button>}

          <Button size="sm" className="shadow-sm m-1 rounded-lg" variant="primary" onClick={AddUser} >
            <strong>Add User +</strong>
          </Button>
        </div>}
      </div>
    } round>
      <DataTablePagination
        showEmptyMessage={false}
        columns={Column(EditUserData, !!myModule?.canwrite, !!myModule?.candelete, SetEnrollmentData)}
        noStatus
        viewLink={'/employee-view'}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10, 20, 25, 50, 100]}
        autoResetPage={false}
        // disableFilter
        activateSearch
        activateSearchText={'By Employee Code & Email'}
        {...userType === 'broker' && { onExport: () => setModalExport(true) }}
        CurrentURL={listId}
        API={service.loadGenericUser}
        ApiPayload={{ user_type_name: currentUserType, is_super_hr: currentUser.is_super_hr }}
      />

      {!!modal && (
        <ResetPasswordModal
          show={!!modal}
          onHide={() => setModal(null)}
          Data={modal}
        />
      )}

      {!!show && <ChooseUserType history={history} show={show} onHide={() => setShow(false)} />}
      {<ExportUsers
        show={modalExport}
        onHide={() => setModalExport(false)}
        user_type_name={currentUserType}
      />}
      {!!enrollmentModal && (
        <ViewModal
          show={!!enrollmentModal}
          onHide={() => setEnrollmentModal(null)}
          Data={enrollmentModal}
        />
      )}
      {loading && <Loader />}
    </Card>
  )
}

const _Action = ({ row }, EditUserData, canWrite, canDelete) => {

  const dispatch = useDispatch();
  const isVerified = row.original.verification_status,
    isUnblocked = !row.original.block_status,
    email = row.original.email,
    user_id = row.original.id,
    current_user_types = row.original.current_user_types;

  const UserVerify = () =>
    isVerified ? swal('Already Verified', '', 'warning') :
      swal({
        title: "Verify User?",
        text: 'Verify user email id : ' + email,
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
        .then((willVerify) => {
          if (willVerify) {
            dispatch(verifyUser({ email: email }))
          }
        });

  const UserUnblock = () =>
    isUnblocked ? swal('Already Unblocked', '', 'warning') :
      swal({
        title: "Unblock User?",
        text: 'Unblock user email id : ' + email,
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
        .then((willVerify) => {
          if (willVerify) {
            dispatch(unblockUser({ user_id }))
          }
        });

  const UserDelete = () =>
    swal({
      title: "Delete User Account?",
      text: 'Delete user email id : ' + email,
      icon: "info",
      ...(current_user_types.includes('Broker') && current_user_types.includes('Employer')) && { className: 'swal-modal-580' },
      buttons: {
        cancel: "Cancel",
        ...(current_user_types.includes('Broker') && current_user_types.includes('Employer')) && { 'delete-all-user': { text: 'Broker & Employer', className: 'swal-button-danger' } },
        ...current_user_types.includes('Broker') && { 'delete-broker-user': { text: 'Broker', className: 'swal-button-secondary' } },
        ...current_user_types.includes('Employer') && { 'delete-employer-user': { text: 'Employer', className: 'swal-button-secondary' } },
      },
      dangerMode: true,
    })
      .then((type) => {
        let user_delete = null;
        switch (type) {
          case 'delete-all-user':
            user_delete = (current_user_types.includes('Admin') || current_user_types.includes('Employee') || current_user_types.includes('Customer')) ? 0 : 1;
            dispatch(userDelete({
              user_id,
              user_types: [3, 4],
              user_delete,
              ...user_delete === 0 && {
                remaining_user_types:
                  (current_user_types.includes('Admin') ? '1' : '') +
                  (current_user_types.includes('Employee') ? '5' : '') +
                  (current_user_types.includes('Customer') ? '7' : '')
              }
            }))
            break;
          case 'delete-broker-user':
            user_delete = (current_user_types.includes('Admin') || current_user_types.includes('Employer') || current_user_types.includes('Employee') || current_user_types.includes('Customer')) ? 0 : 1;
            dispatch(userDelete({
              user_id,
              user_types: [3],
              user_delete,
              ...user_delete === 0 && {
                remaining_user_types:
                  (current_user_types.includes('Admin') ? '1' : '') +
                  (current_user_types.includes('Employer') ? '4' : '') +
                  (current_user_types.includes('Employee') ? '5' : '') +
                  (current_user_types.includes('Customer') ? '7' : '')
              }
            }))
            break;
          case 'delete-employer-user':
            user_delete = (current_user_types.includes('Admin') || current_user_types.includes('Broker') || current_user_types.includes('Employee') || current_user_types.includes('Customer')) ? 0 : 1;
            dispatch(userDelete({
              user_id,
              user_types: [4],
              user_delete,
              ...user_delete === 0 && {
                remaining_user_types:
                  (current_user_types.includes('Admin') ? '1' : '') +
                  (current_user_types.includes('Broker') ? '3' : '') +
                  (current_user_types.includes('Employee') ? '5' : '') +
                  (current_user_types.includes('Customer') ? '7' : '')
              }
            }))
            break;
          default:
            break;
        }
      });


  return (<ButtonGroup key={`-operations`} size="sm">

    {canWrite && <>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>
          <strong>Reset Password</strong>
        </Tooltip>}>
        <Button className="strong" variant="outline-success"
          onClick={() => EditUserData(row.original.id)}>
          <i className="fas fa-key" />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>
          <strong>Verify User</strong>
        </Tooltip>}>
        <Button className="strong" variant="outline-info"
          onClick={UserVerify}>
          <i className="fas fa-exclamation-triangle" />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>
          <strong>Unblock User</strong>
        </Tooltip>}>
        <Button className="strong" variant="outline-warning"
          onClick={UserUnblock}>
          <i className="fas fa-unlock" />
        </Button>
      </OverlayTrigger>
    </>}
    {canDelete && (current_user_types.includes('Broker') || current_user_types.includes('Employer')) && <OverlayTrigger
      placement="top"
      overlay={<Tooltip>
        <strong>Delete User</strong>
      </Tooltip>}>
      <Button className="strong" variant="outline-danger"
        onClick={UserDelete}>
        <i class="fas fa-trash" />
      </Button>
    </OverlayTrigger>}

  </ButtonGroup>)
}

const _VerificationStatus = ({ value }) => {
  return <Button disabled size="sm" className="strong" variant={(value ? "success" : "danger")}>
    {value ? 'Verified ' : 'Not-Verified '}
    <i className={"fas fa-" + (value ? "check-circle" : "exclamation-triangle")} />
  </Button>
}

const EnrolmentStatus = {
  0: { label: 'Open', color: 'success' },
  1: { label: 'Closed', color: 'danger' },
  2: { label: 'Partially Closed/Open', color: 'secondary' },
}

const _EnrolmentStatus = ({ value, row }, SetEnrollmentData) => {

  const isEmployee = row.original.current_user_types?.includes('Employee') && value !== null;

  return isEmployee ? <Button
    onClick={() => SetEnrollmentData({ Row: row.original, Value: value })}
    size="sm" className="strong" variant={EnrolmentStatus[value]?.color}>
    {EnrolmentStatus[value]?.label}
  </Button> : '-'
}


const _Chip = ({ value }) => {

  const valueArray = (!!value && value?.split(',')) || [];

  return valueArray.map((name, index) =>
  (<Button key={name + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
    {name}
  </Button>))
}

const Column = (EditUserData, canWrite, canDelete, SetEnrollmentData) => [
  {
    Header: "Name",
    accessor: "name",
    disableFilters: true
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Mobile No.",
    accessor: "mobile_no",
    disableFilters: true
  },
  {
    Header: "Employee Code",
    accessor: "employee_code",
  },
  {
    Header: "Company Name",
    accessor: "company_name",
    disableFilters: true,
    Cell: _Chip
  },
  {
    Header: "Profile Type",
    accessor: "current_user_types",
    disableFilters: true,
    Cell: _Chip
  },
  {
    Header: "Enrolment Status",
    accessor: "enrollment_confirmation_status",
    disableFilters: true,
    Cell: (e) => _EnrolmentStatus(e, SetEnrollmentData)
  },
  {
    Header: "Verification Status",
    accessor: "verification_status",
    disableFilters: true,
    Cell: _VerificationStatus
  },
  {
    Header: "View",
    accessor: "operations"
  },
  ...(canWrite || canDelete) ? [{
    Header: "Action",
    accessor: "operation",
    disableFilters: true,
    Cell: (e) => _Action(e, EditUserData, canWrite, canDelete)
  }] : []
];
