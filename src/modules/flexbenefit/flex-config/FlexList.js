import React, { useState } from 'react';

import { Button, IconlessCard, Loader, NoDataFound, sortTypeWithTime } from '../../../components';
import { HeaderDiv } from './helper';
import { Button as BTN } from "react-bootstrap"
import { DataTable } from 'modules/user-management';
import { AuditDetails } from './AuditDetails';
import { Link, useHistory } from 'react-router-dom';
import { Encrypt, randomString } from '../../../utils';
import { deleteFlex, downloadEmployee, updateFlexStatus } from './flex-config.action';
import swal from 'sweetalert';
import { CustomControl, SwitchContainer, SwitchInput } from '../../EndorsementRequest/custom-sheet/components';
import { useSelector } from 'react-redux';


export function FlexList({ loading, setPage, details, dispatch }) {

  const [auditDetails, setAuditDetails] = useState(false);


  const deleteAction = (flex_plan_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          deleteFlex(dispatch, { flex_plan_id })
        }
      })
  }

  return (
    <>
      <IconlessCard isHeder={false} marginTop={'0'}>
        <HeaderDiv>
          <div className='d-flex'>
            <div className='icon'>
              <i className='fas fa-file-invoice' />
            </div>
            <div>
              <p className='title'>Plan View</p>
            </div>
          </div>
          <Button buttonStyle='outline-secondary' onClick={() => setPage('create')}>Create +</Button>
        </HeaderDiv>
        <hr style={{
          borderTop: '2px dashed rgba(0,0,0,.1)',
          margin: '-6px -38px 15px'
        }} />
        {(loading && !details.length) ? <Loader /> : (details.length ?
          <DataTable
            columns={ColumnData(setAuditDetails, deleteAction, dispatch)}
            data={details}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
          /> :
          <NoDataFound />)
        }
      </IconlessCard>
      {!!auditDetails && <AuditDetails show={auditDetails} onHide={setAuditDetails} />}
      {loading && <Loader />}
    </>
  )
}


const _Audit = ({ row }, setAuditDetails) => {
  return <BTN size="sm" className="shadow m-1 rounded-lg" style={{ whiteSpace: 'nowrap' }} variant='outline-dark' onClick={() => setAuditDetails(row.original)}>
    Audit Details <i className='fas fa-file-alt' />
  </BTN>
}

const _viewButton = (cell, deleteAction) => {

  return (
    <>
      <Link className='mr-2' to={`policy-flex-update/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`}>
        <BTN className="strong" variant="outline-info">
          <i className="ti-eye" />
        </BTN>
      </Link>
      <BTN className="strong" variant="outline-danger" onClick={() => deleteAction(cell.row.original.id)}>
        <i className="ti-trash" />
      </BTN>
    </>)
}

const _renderChangeEnrollmentAction = ({ value, row }) => {

  const history = useHistory();
  const { currentUser, userType: currentUserType } = useSelector(state => state.login);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <BTN
        size="sm"
        variant={'outline-secondary'}
        className='shadow-sm'
        onClick={() => history.push(`/broker/policy-flex-users/${randomString()}/${Encrypt(value)}/${randomString()}`)}>
        View Employee <i className="ti-eye" />
      </BTN>
      <BTN
        size="sm"
        variant={'outline-secondary'}
        className='shadow-sm'
        onClick={() => downloadEmployee({
          user_type_name: currentUserType,
          is_super_hr: currentUser.is_super_hr,
          flex_plan_id: row.original.id,
          mode: 1
        }, setLoading)}>
        Download List &nbsp; <i className="ti-download" />
      </BTN>
      {loading && <Loader />}
    </>
  );
};

const ColumnData = (setAuditDetails, deleteAction, dispatchCall) => [
  {
    Header: "Employer Name",
    accessor: "employer_name"
  },
  {
    Header: "Policy Type",
    accessor: "product_type"
  },
  {
    Header: "Policy No.",
    accessor: "policy_number"
  },
  {
    Header: "Policy Name",
    accessor: "policy_name"
  },
  {
    Header: "Plan Name",
    accessor: "plan_name"
  },
  {
    Header: "Created On",
    accessor: "created_at",
    sortType: sortTypeWithTime
  },
  {
    Header: "Employee Opted Flex",
    accessor: "id",
    Cell: _renderChangeEnrollmentAction,
    disableFilters: true,
    disableSortBy: true,
  },
  {
    Header: "Audit",
    accessor: "audit",
    disableFilters: true,
    disableSortBy: true,
    Cell: (e) => _Audit(e, setAuditDetails),
  },
  {
    Header: "Status",
    accessor: "status",
    disableFilters: true,
    // disableSortBy: true,
    Cell: ({ row, value }) => {
      const handleChange = () => {
        updateFlexStatus(dispatchCall, {
          flex_plan_id: row.original.id,
          status: !value,
        });
      };
      return (
        <CustomControl>
          <SwitchContainer>
            <label>
              <SwitchInput
                checked={value}
                onChange={handleChange}
                type="checkbox"
              />
              <div>
                <div></div>
              </div>
            </label>
          </SwitchContainer>
        </CustomControl>
      );
    },
  },
  {
    Header: "Preview",
    accessor: "preview",
    disableFilters: true,
    disableSortBy: true,
    Cell: (e) => _viewButton(e, deleteAction)
  }
]
