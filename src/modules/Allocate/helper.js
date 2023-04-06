import React from 'react';
import { Button } from "react-bootstrap";
import { sortTypeWithTime } from '../../components/data-table-components';
import { isValidHttpUrl } from "../../utils"
// import styled from 'styled-components';


// const Link = styled.a`
// text-decoration: none !important;
//     background: #dbd9d9;
//     padding: 5px 5px;
//     border-radius: 5px;
//     color: #313131;
// `

// const _renderDefaultStatus = ({ value }) => {
//   return (
//     <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={value ? "success" : "secondary"}>
//       {value ? "Done" : "Pending"}
//     </Button>
//   );
// }

// const _renderMemberStatus = ({ value }) => {
//   return (
//     <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={_getVarient[value]}>
//       {value}
//     </Button>
//   );
// }

// const _renderDocuments = (cell) => {
//   return cell.value.map(({ name, document_link }, index) =>
//     <Link key={name + index} target="_blank" href={document_link} className="shadow m-1 rounded-lg" variant='light'>{name}</Link>
//   )
// }

const statusText = {
  'Add': 'Added',
  'Remove': 'Removed',
  'Update': 'Updated'
};

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
        onClick={() => exportPolicy(value)}>
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
        onClick={() => exportPolicy(value)}>
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
          <i className="ti ti-user"></i> Total Allocated :&nbsp;
          {row.original.total_no_of_employees} Member{row.original.total_no_of_employees > 1 && 's'}&nbsp;flex
        </span> : '-'}
        {!!row.original.no_of_employees_uploaded && <>
          <br />
          <span
            className='text-success'
            role='button'>
            <i className="ti ti-check"></i> {statusText[row.original.document_type]} Successfully Allocated :&nbsp;
            {row.original.no_of_employees_uploaded} Member{row.original.no_of_employees_uploaded > 1 && 's'}&nbsp;flex
          </span>
        </>}
        {!!row.original.no_of_employees_failed_to_upload && <>
          <br />
          <span
            role='button'
            className='text-danger'>
            <i className="ti ti-close"></i> Failed To Allocate {row.original.document_type} :&nbsp;
            {row.original.no_of_employees_failed_to_upload} Member{row.original.no_of_employees_failed_to_upload > 1 && 's'}&nbsp;flex
          </span>
        </>}
      </>
    );
  }

}


export const ErrorSheetTableData = (userType, is_super_hr) => [
  // {
  //   Header: "Policy No",
  //   accessor: "policy_number",
  // },
  // {
  //   Header: "Policy Name",
  //   accessor: "policy_name",
  // },
  // {
  //   Header: "Endorsement Type",
  //   accessor: "document_type",
  // },
  ...((userType === "broker" || is_super_hr) ? [{
    Header: "Organization Name",
    accessor: "employer_name",
  }] : []),
  {
    Header: "Uploaded Member Status",
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

export const _getVarient = {
  'New': 'primary',
  'Approved': 'success',
  'Defiency Raised': 'warning',
  'deficiency resolved': 'info',
  'Rejected': 'danger',
}

const exportPolicy = (URL) => {
  if (URL) {
    const link = document.createElement('a');
    link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(URL));
    link.href = URL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
