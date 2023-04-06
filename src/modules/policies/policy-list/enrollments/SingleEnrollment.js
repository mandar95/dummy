import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';

// import { DataTable } from '../../../user-management'
import { ChangeEnrollmentModal } from '../change-enrollment-modal';
import { Button } from 'react-bootstrap';

import { updateMembersEnrollmentConfirmaton } from '../../approve-policy/approve-policy.slice';
import { DateFormate } from "utils";
import DataTablePagination from '../../../user-management/DataTablePagination/DataTablePagination';
import service from 'modules/policies/approve-policy/approve-policy.service.js';


export default function SingleEnrollment({ dispatch, data = [], success, error, policy_id, policyData }) {

  const [modal, setModal] = useState();

  useEffect(() => {
    setModal()
  }, [success, error])

  const EditMember = (id, data) => {
    setModal(data);
  };

  const employeeConfirmation = ({ value, row }) => {

    const isConfirmed = value === 2;

    const onClick = () => {
      swal(
        {
          title: "Change Confirmation?",
          text: "Change the status of confirmation",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((changeStatus) => {
          if (changeStatus) {
            dispatch(updateMembersEnrollmentConfirmaton({
              ...row.original.id ? { employee_policy_mapping_id: row.original.id } :
                { employee_ids: row.original.employee_id, policy_id },
              confirmation: isConfirmed ? 0 : 1
            }))
          }
        })
    }

    return isConfirmed ?
      <Button type="button" variant="success" size="sm" className='shadow m-1' onClick={onClick}>
        Confirmed
      </Button> :
      <Button type="button" variant="secondary" size="sm" className='shadow m-1' onClick={onClick}>
        Pending
      </Button>
  }

  return <>
    {/* <DataTable
      columns={columnEmployee(employeeConfirmation)}
      data={data ? data.map((elem) => ({
        ...elem,
        employee_enrollement_start_date: DateFormate(elem.employee_enrollement_start_date),
        employee_enrollement_end_date: DateFormate(elem.employee_enrollement_end_date),
        to_allow_actions: elem['employee_enrollement_status'] !== 2
      })) : []}
      noStatus
      EditFlag
      EditFunc={EditMember}
      selectiveEdit
      rowStyle /> */}

    <DataTablePagination
      showEmptyMessage={false}
      columns={columnEmployee(employeeConfirmation)}
      noStatus
      // viewLink={'/employee-view'}
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10, 20, 25, 50, 100]}
      autoResetPage={false}
      EditFlag
      EditFunc={EditMember}
      trimData={(data) => data.map((elem) => ({
        ...elem,
        employee_enrollement_start_date: elem.employee_enrollement_start_date ? elem.employee_enrollement_start_date : DateFormate(elem.employee_enrollement_start_date || policyData.enrollement_start_date),
        employee_enrollement_end_date: elem.employee_enrollement_end_date ? elem.employee_enrollement_end_date : DateFormate(policyData.enrollement_end_date),
        to_allow_actions: elem['employee_enrollement_status'] !== 2
      }))}
      selectiveEdit
      // disableFilter
      activateSearch
      activateSearchText={'Search By Employee Code'}
      // CurrentURL={listId}
      rowStyle
      API={service.loadMembersEnrollePaginated}
      ApiPayload={{ policy_id }}
    />
    {!!modal && <ChangeEnrollmentModal
      policy_id={policy_id}
      show={!!modal}
      onHide={() => setModal(null)}
      data={modal} />}
  </>
}

export const columnEmployee = (employeeConfirmation) => [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Employee Code',
    accessor: 'code'
  },
  {
    Header: 'Enrolment Start Date',
    accessor: 'employee_enrollement_start_date'
  },
  {
    Header: 'Enrolment End Date',
    accessor: 'employee_enrollement_end_date'
  },
  {
    Header: 'Enrolment Confirmation',
    accessor: 'employee_enrollement_status',
    Cell: employeeConfirmation
  },
  {
    Header: 'Operations',
    accessor: 'operations'
  }
];
