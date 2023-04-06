import React, { useState } from 'react';

import { Card, Loader } from '../../../components';

import service from './flex-config.service';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Decrypt, randomString } from '../../../utils';
import DataTablePagination from '../../user-management/DataTablePagination/DataTablePagination';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { downloadEmployee, employeeRollBack } from './flex-config.action';
import { Button as BTN } from "react-bootstrap"


export function EmployeeFlexMap({ listId, myModule }) {

  const { currentUser, userType: currentUserType } = useSelector(state => state.login);
  const { flex_plan_id } = useParams()
  const decrypted_flex_plan_id = Decrypt(flex_plan_id)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const deleteAction = (member_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          dispatch(employeeRollBack({ member_id }))
        }
      })
  }

  return !!currentUserType && (
    <Card title={<div className="d-flex justify-content-between">
      <span>Employee Flex Opted</span>
      <BTN
        size="sm"
        variant={'dark'}
        className='shadow-sm'
        onClick={() => downloadEmployee({
          user_type_name: currentUserType,
          is_super_hr: currentUser.is_super_hr,
          flex_plan_id: decrypted_flex_plan_id,
          mode: 1
        }, setLoading)}>
        Download List &nbsp; <i className="ti-download" />
      </BTN>
    </div>}
      round>
      <DataTablePagination
        columns={Column(deleteAction)}
        noStatus
        pageState={{ pageIndex: 0, pageSize: 10 }}
        pageSizeOptions={[10, 20, 25, 50, 100]}
        autoResetPage={false}
        activateSearch
        activateSearchText={'Search By Employee Code'}
        CurrentURL={`${listId}/${randomString()}/${flex_plan_id}/${randomString()}`}
        API={service.loadEmployeOptedFlex}
        ApiPayload={{ user_type_name: currentUserType, is_super_hr: currentUser.is_super_hr, flex_plan_id: decrypted_flex_plan_id }}
      />
      {loading && <Loader />}
    </Card>
  )
}

const _viewButton = (cell, deleteAction) => {

  return (
    <BTN className="strong" variant="outline-danger" onClick={() => deleteAction(cell.row.original.id)}>
      <i className="ti-trash" />
    </BTN>
  )
}


const Column = (deleteAction) => [
  {
    Header: "Name",
    accessor: "employee_name",
  },
  {
    Header: "Employee Code",
    accessor: "employee_code",
    disableFilters: true
  },
  {
    Header: "Benefit Bought",
    accessor: "benefits_consumed",
    Cell: ({ value }) => {
      return value.map((keyword, index) =>
        <Button key={keyword + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
          {keyword}
        </Button>)
    },
    disableSortBy: true,
  },
  {
    Header: "Delete",
    accessor: "preview",
    disableFilters: true,
    disableSortBy: true,
    Cell: (e) => _viewButton(e, deleteAction)
  }
];
