import React from 'react';
import { Button } from "react-bootstrap";
import styled from 'styled-components';
import { LoaderButton, sortTypeWithTime } from '../../components';
import { isValidHttpUrl } from '../../utils';


const Link = styled.a`
text-decoration: none !important;
    background: #dbd9d9;
    padding: 5px 5px;
    border-radius: 5px;
    color: #313131;
`

const _renderDefaultStatus = ({ value }) => {
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={value ? "success" : "secondary"}>
      {value ? "Done" : "Pending"}
    </Button>
  );
}

const _renderMemberStatus = ({ value }) => {
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={_getVarient[value]}>
      {value}
    </Button>
  );
}

const _renderDocuments = (cell) => {
  return cell.value.map(({ name, document_link }, index) =>
    <Link key={name + index} target="_blank" href={document_link} className="shadow m-1 rounded-lg" variant='light'>{name}</Link>
  )
}

export const TableData = (
  _renderAction, myModule
) => [
    {
      Header: "Policy Name",
      accessor: "policy_name",
    },
    {
      Header: "Employee Code",
      accessor: "employee_code",
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
      Header: "Gender",
      accessor: "gender",
    },
    {
      Header: "Relation Name",
      accessor: "relation_name",
    },
    {
      Header: "DOB",
      accessor: "dobFormated",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Mobile No",
      accessor: "mobile_no",
    },
    {
      Header: "Marriage Date",
      accessor: "marriage_date_formated"

    },
    {
      Header: "OPD Suminsured",
      accessor: "opd_suminsured"
    },
    {
      Header: "Sum Insured",
      accessor: "suminsured",
    },
    {
      Header: "Employer Premium",
      accessor: "employer_premium",
    },
    {
      Header: "Employee Premium",
      accessor: "employee_premium",
    },
    {
      Header: "Total Premium",
      accessor: "total_premium",
    },
    {
      Header: "Document",
      accessor: "documents",
      disableSortBy: true,
      filter: (rows, id, filterValue) => {
        return rows.filter(row => {
          const cities = row.values[id];
          return cities.some(({ name }) => String(name)
            .toLowerCase()
            .includes(String(filterValue).trimStart().toLowerCase()))
        });
      },
      Cell: _renderDocuments
    },
    {
      Header: "Enrolment Confirmation Status",
      accessor: "employee_enrollement_confirmation_status",
      Cell: _renderDefaultStatus,
      disableFilters: true,
    },
    // {
    //   Header: "Employer Remark",
    //   accessor: "employer_remark",
    // },
    {
      Header: "Member Status(Employer)",
      accessor: "employer_verification_status",
      Cell: _renderMemberStatus,
    },
    // {
    //   Header: "Broker Remark",
    //   accessor: "broker_remark",
    // },
    {
      Header: "Member Status(Broker)",
      accessor: "broker_verification_status",
      Cell: _renderMemberStatus,
    },
    ...(myModule?.canwrite ? [{
      Header: "Actions",
      accessor: "operations",
      disableSortBy: true,
      disableFilters: true,
      Cell: _renderAction
    }] : []),
  ];

const statusText = {
  'Add': 'Added',
  'Remove': 'Removed',
  'Update': 'Updated'
};

export const DataTableButtons = {
  _statusBtn: ({ value, row }) => {
    return value === 'Processing' ? <LoaderButton percentage={Number(row.original.percentage)} text='Processing' /> : (
      <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={value === 'Success' ? "success" : 'danger'}>
        {value}
      </Button>
    );
  },
  _downloadBtn: ({ value, row }) => {
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
          <i className="ti ti-user"></i> Total Uploaded :&nbsp;
          {row.original.total_no_of_employees} Member{row.original.total_no_of_employees > 1 && 's'}
        </span> : '-'}
        {!!row.original.no_of_employees_uploaded && <>
          <br />
          <span
            className='text-success'
            role='button'>
            <i className="ti ti-check"></i> {statusText[row.original.document_type]} Successfully :&nbsp;
            {row.original.no_of_employees_uploaded} Member{row.original.no_of_employees_uploaded > 1 && 's'}
          </span>
        </>}
        {!!row.original.no_of_employees_failed_to_upload && <>
          <br />
          <span
            role='button'
            className='text-danger'>
            <i className="ti ti-close"></i> Failed To {row.original.document_type} :&nbsp;
            {row.original.no_of_employees_failed_to_upload} Member{row.original.no_of_employees_failed_to_upload > 1 && 's'}
          </span>
        </>}
      </>
    );
  },
  _viewStatusRow: ({ row }) => {
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
            <i className="ti ti-check"></i> {statusText[row.original.document_type]} Successfully :&nbsp;
            {row.original.no_of_employees_uploaded} Row{row.original.no_of_employees_uploaded > 1 && 's'}
          </span>
        </>}
        {!!row.original.no_of_employees_failed_to_upload && <>
          <br />
          <span
            role='button'
            className='text-danger'>
            <i className="ti ti-close"></i> Failed To {row.original.document_type} :&nbsp;
            {row.original.no_of_employees_failed_to_upload} Row{row.original.no_of_employees_failed_to_upload > 1 && 's'}
          </span>
        </>}
      </>
    );
  }
}

export const _colorCode = ({ value, row }) => {
  const color = row.original.source_id === 1 ? '#2c8cb5' : '#eeb02b';
  return (<Button disabled size="sm" className="shadow m-1 rounded-lg" style={{ backgroundColor: color, borderColor: color }}>
    {value}
  </Button>)
}



export const ErrorSheetTableData = (showCompany, fromTPA) => [
  {
    Header: "Policy No",
    accessor: "policy_number",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  ...showCompany ? [{
    Header: "Company Name",
    accessor: "employer_name",
  }] : [],
  ...fromTPA ? [{
    Header: "Source",
    accessor: "source_name",
    Cell: _colorCode
  }] : [],
  {
    Header: "Endorsement Type",
    accessor: "document_type",
  },
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

export const ErrorSheetTableDataTPA = [
  {
    Header: "Policy No",
    accessor: "policy_number",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Document Type",
    accessor: "document_type",
  },
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

export const ErrorSheetTableDataNetworkHospital = [
  {
    Header: "Policy No",
    accessor: "policy_number",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Document Type",
    accessor: "document_type",
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
  const link = document.createElement('a');
  link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(URL));
  link.href = URL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const sumInsuredEndorseSplit = (data = '') => {
  const splitData = data.split(',');

  let response = ''

  for (let i = 0; i < splitData.length; ++i) {
    if (splitData[i]) {
      if (i === 0) {
        response = splitData[i]
      } else if (i + 1 === splitData.length) {
        response = response + ' & ' + splitData[i]
      } else {
        response = response + ', ' + splitData[i]
      }
    }
  }
  return response + '.';
}
