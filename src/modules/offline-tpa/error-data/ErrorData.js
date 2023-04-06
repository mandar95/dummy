import React from 'react';

import { Card } from 'components';
import { DataTable } from '../../user-management';
import { Button } from 'react-bootstrap';
import { downloadFile, isValidHttpUrl } from '../../../utils';
import { sortTypeWithTime } from '../../../components';

export function ErrorData({ ErrorSheetData, moduleData, userType }) {
  return (
    !!ErrorSheetData.length && <Card title={moduleData.title + ' Detail'}>
      <DataTable
        columns={
          ErrorSheetTableData(userType) ||
          []
        }
        data={ErrorSheetData}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10]}
        rowStyle
        autoResetPage={false}
      />
    </Card>

  )
}

export const DataTableButtons = {
  _statusBtn: ({ value }) => {
    return (
      <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={value === 'Success' ? "success" : (value === 'Processing' ? "secondary" : 'danger')}>
        {value}
      </Button>
    );
  },
  _downloadBtn: ({ value }) => {
    return value ? (
      <span
        role='button'
        onClick={() => downloadFile(value)}>
        <i className="ti ti-download"></i>
      </span>
    ) : (<span
      role='button'>
      <i className="ti ti-close"></i>
    </span>);
  },
  _downloadBtnError: ({ value, row }) => {

    return value ? (!isValidHttpUrl(value) ? (
      <span>
        {value}
      </span>
    ) : (
      <span
        role='button'
        onClick={() => downloadFile(value)}>
        <i className="ti ti-download"></i>
      </span>
    )) : (<span> -
      {/* <i className="ti ti-close"></i> */}
    </span>);
  },
  _viewStatus: ({ row }) => {
    return (
      <>
        {row.original.total_no_of_employees ? <span
          role='button'
          className='text-primary'>
          <i className="ti ti-user"></i> Total Uploaded :&nbsp;
          {row.original.total_no_of_employees} Row{row.original.total_no_of_employees > 1 && 's'}
        </span> : '-'}
        {!!row.original.no_of_employees_uploaded && <>
          <br />
          <span
            className='text-success'
            role='button'>
            <i className="ti ti-check"></i> Uploaded Successfully :&nbsp;
            {row.original.no_of_employees_uploaded} Row{row.original.no_of_employees_uploaded > 1 && 's'}
          </span>
        </>}
        {!!row.original.no_of_employees_failed_to_upload && <>
          <br />
          <span
            role='button'
            className='text-danger'>
            <i className="ti ti-close"></i> Failed To Upload :&nbsp;
            {row.original.no_of_employees_failed_to_upload} Row{row.original.no_of_employees_failed_to_upload > 1 && 's'}
          </span>
        </>}
      </>
    );
  }
}


export const ErrorSheetTableData = (userType) => [
  ...(userType === 'broker' ? [{
    Header: "Employer Name",
    accessor: "employer_name",
  }] : []),
  {
    Header: "Policy No.",
    accessor: "policy_number",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Event Type",
    accessor: "master_system_trigger_name",
  },
  {
    Header: "Template",
    accessor: "system_trigger_template_name",
  },
  {
    Header: "Uploaded Status",
    accessor: "policy_name1",
    disableFilters: true,
    disableSortBy: true,
    Cell: DataTableButtons._viewStatus
  },
  {
    Header: "Original Document",
    accessor: "original_document_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: DataTableButtons._downloadBtn
  },
  {
    Header: "Error Document",
    accessor: "error_document_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: DataTableButtons._downloadBtnError
  },
  {
    Header: "Uploaded At",
    accessor: "uploaded_at",
    sortType: sortTypeWithTime
  },
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: DataTableButtons._statusBtn
    // Cell: _renderStatusBtn
  },
];
