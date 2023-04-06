import React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { downloadFile, isValidHttpUrl } from '../../utils';
import { Button as Btn, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { sortTypeWithTime } from '../../components';

const _chooseComponent = (data, { selected, setSelected }) => {
  return (
    <CustomControl className="d-flex">
      <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}></p>
      <input checked={data?.cell?.value === selected}
        onClick={() => data?.cell?.value === selected ? setSelected(0) : setSelected(Number(data?.cell?.value))}
        name={'comm_type'}
        type={'radio'}
        value={0} defaultChecked={false}
      />
      <span></span>
    </CustomControl>
  )
  // return (<Button size="sm"
  //   variant={data?.cell?.value === selected ? 'success' : 'primary'}
  //   type='button' onClick={() => setSelected(Number(data?.cell?.value))}>
  //   {data?.cell?.value === selected ? 'Suggested' : 'Suggest'}
  // </Button>);
}

const _cost = ({ value }) => {
  return value ? (<>
    ₹ {value}
  </>) : '-';
}

export const AlternateHospitalColumn = (stateObject, show) => [
  ...(show ? [{
    Header: "Select",
    accessor: "id",
    Cell: (cell) => _chooseComponent(cell, stateObject),
    disableFilters: true,
    disableSortBy: true,
  }] : []),
  {
    Header: "Hospital Name",
    accessor: "hospital_name"
  },
  {
    Header: "Address",
    accessor: "hospital_address"
  },
  {
    Header: "City",
    accessor: "city_name"
  },
  {
    Header: "Ailment",
    accessor: "ailment_name"
  },
  {
    Header: "Cost",
    accessor: "aliment_cost",
    Cell: _cost
  },
  {
    Header: "Treatment Type",
    accessor: "treatment_type"
  },
  {
    Header: "Room Type",
    accessor: "room_rent_type"
  },
]


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
          {row.original.total_no_of_employees} Hospital{row.original.total_no_of_employees > 1 && 's'} Data
        </span> : '-'}
        {!!row.original.no_of_employees_uploaded && <>
          <br />
          <span
            className='text-success'
            role='button'>
            <i className="ti ti-check"></i> Added Successfully :&nbsp;
            {row.original.no_of_employees_uploaded} Hospital{row.original.no_of_employees_uploaded > 1 && 's'} Data
          </span>
        </>}
        {!!row.original.no_of_employees_failed_to_upload && <>
          <br />
          <span
            role='button'
            className='text-danger'>
            <i className="ti ti-close"></i> Failed To {row.original.document_type} :&nbsp;
            {row.original.no_of_employees_failed_to_upload} Hospital{row.original.no_of_employees_failed_to_upload > 1 && 's'} Data
          </span>
        </>}
      </>
    );
  }
}


export const ErrorSheetColumn = [
  {
    Header: "Policy No",
    accessor: "policy_number",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Uploaded Sheet Status",
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

const _response = ({ value, row }, { userType, setModal }) => {

  return (value || userType === 'tpa') ? value || '-' :
    <Btn size='sm' type='button' onClick={() => setModal(row.original)}>
      Response
    </Btn>
}

const _action = ({ row }, { updateDiscrepancy, dispatch, claim_request_id, setModal, member_id }) => {

  const { response, status, id, remark } = row?.original;


  return (response) ? (status !== 1 ?
    <Btn size='sm' variant='secondary' type='button' disabled>
      {status === 0 ? 'Closed' : 'Rejected'}
    </Btn> :
    <ButtonGroup key={`${id}-operations`} size="sm">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            <strong>Resolved</strong>
          </Tooltip>
        }>
        <Btn className="strong" variant="outline-info" onClick={() => updateDiscrepancy(dispatch, { member_id, type: 3, claim_request_id, log_id: id })}><i className="ti-check" /></Btn>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            <strong>Reject</strong>
          </Tooltip>
        }>
        <Btn className="strong" variant="outline-danger"
          // onClick={() => updateDiscrepancy(dispatch, { type: 4, claim_request_id, log_id: id })}
          onClick={() => setModal({
            id, remark, response,
            type: 4
          })}
        ><i className="ti-close" /></Btn>
      </OverlayTrigger>
    </ButtonGroup>
    //   {/* <Btn size='sm' variant='success' type='button' onClick={() => updateDiscrepancy(dispatch, { type: 3, claim_request_id, log_id: id })}>
    //   Accept Discrepancy
    // </Btn>
    // <Btn size='sm' variant='success' type='button' onClick={() => updateDiscrepancy(dispatch, { type: 3, claim_request_id, log_id: id })}>
    //   Reject Discrepancy
    // </Btn> */}
  ) : '-'
}

const _renderExportPolicyAction = ({ value }) => {
  return (
    value ? <span
      role='button'
      onClick={() => downloadFile(value, false, true)}>
      < i className="ti ti-download" ></i >
    </span > : '-')
};

const _status = ({ value, row }) => {


  return (<Btn size='sm' variant={value === 0 ? 'success' : (value === 1 ? (row?.original?.response ? 'secondary' : 'primary') : 'danger')} type='button' disabled>
    {value === 0 ? 'Resolved' : (value === 1 ? (row?.original?.response ? 'Resubmitted' : 'Open') : 'Rejected')}
  </Btn>)
}
export const DiscrepancyRaisedColumn = (showDocument, showAction, responsePackage, actionPackage) => [
  {
    Header: "Discrepancy Comment",
    accessor: "remark",
  },
  {
    Header: "Response",
    accessor: "response",
    Cell: (cell) => _response(cell, responsePackage),
  },
  ...(showDocument ? [{
    Header: "Document",
    accessor: "other_document",
    Cell: _renderExportPolicyAction,
    disableFilters: true,
    disableSortBy: true,
  }] : []),
  {
    Header: "Status",
    accessor: "status",
    Cell: _status,
    disableFilters: true,
    // disableSortBy: true,
  },
  {
    Header: "Created At",
    accessor: 'created_at'
  },
  ...(showAction ? [{
    Header: "Action",
    accessor: "id",
    Cell: (cell) => _action(cell, actionPackage),
    disableFilters: true,
    disableSortBy: true,
  }] : [])
]

const CustomControl = styled.label`
  
  color: #000 !important;
  
  /* in test */
  text-align: center;
  margin: -8px auto 0;
  margin-left: 40px;
  /* border: 2px solid red; */
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : 'rgb(131, 109, 109)'} !important;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  width: max-content;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  span{
    position: absolute;
    left: 0;
    top: -4px;
    height: 23px;
    width: 23px;
    background-color: rgb(228, 228, 228);
    border-radius: 5px;
    box-sizing: border-box;
  }
  span:after {
    content: "";
    position: absolute;
    display: none;
    }
  &:hover input ~ span{
    background-color: rgb(204, 198, 198);
    transition: all 0.2s;
  }
  input:checked ~ span {
    background-color: rgb(5 129 252)!important;
  }
  input:checked ~ span:after {
    display: block;
  }
  span:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    transition: all 1s;
    border: solid rgb(255, 255, 255);
    border-width: 0 2.5px 2.5px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    }
  p{
    
    padding-left: 27px;
    top: -2px;
    position: absolute;
  }
`
