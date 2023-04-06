import React, { useState, useEffect, useReducer } from "react";

import { Row, Col } from "react-bootstrap";
import ControlledTabs from "./tabs";
import { CardBlue, SelectComponent, Loader } from "../../components";
import { TabContainer, Spacer } from "./style";

import {
  initialState,
  // loadEmployers,
  reducer
} from "./employee-upload.action";
import { ProgressBar } from "../EndorsementRequest/progressbar";
import { DataTable } from "../user-management";
import { DataTableButtons } from "../EndorsementRequest/helper";
import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";


export const EmployerDataUpload = ({ myModule }) => {
  const dispatchRedux = useDispatch();
  const { userType } = useParams()

  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);

  const [{ loading,
    // employers,
    details, uploadLoading }, dispatch] = useReducer(reducer, initialState);
  const [employer_id, set_employer_id] = useState(undefined);


  useEffect(() => {
    // loadEmployers(dispatch);
    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatchRedux(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);
  return (
    <CardBlue title="Employee Upload" round>
      <TabContainer>
        {!!myModule?.canwrite && <Row>
          {userType === 'employer' ?
            !!(currentUser.is_super_hr && currentUser.child_entities.length) && <Col xl={4} lg={4} md={6} sm={12}>

              <SelectComponent
                label="Employer"
                placeholder="Select Employer"
                required
                options={currentUser.child_entities?.map((item) => ({
                  id: item?.id,
                  label: item?.name,
                  value: item?.id,
                })) || []}
                name="employer"
                value={employer_id}

                onChange={e => {
                  set_employer_id(e)
                  return e
                }}
              />
            </Col>
            : <Col xl={4} lg={4} md={6} sm={12}>

              <SelectComponent
                label="Employer"
                placeholder="Select Employer"
                required
                options={employers?.map((item) => ({
                  id: item?.id,
                  label: item?.name,
                  value: item?.id,
                })) || []}
                name="employer"
                value={employer_id}
                onChange={e => {
                  set_employer_id(e)
                  return e
                }}
              />
            </Col>}
        </Row>}

        <Spacer>
          <ControlledTabs
            employer_id={employer_id?.value}
            myModule={myModule}
            set_employer_id={set_employer_id}
            dispatch={dispatch}
            uploadLoading={uploadLoading}
          />
        </Spacer>
      </TabContainer>

      {!!details.length &&
        <DataTable
          columns={ErrorSheetTableData || []}
          data={details}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          rowStyle
          autoResetPage={false}
        />}

      {uploadLoading && <ProgressBar />}
      {loading && <Loader />}
    </CardBlue>
  );
};

// Helper



export const _viewStatus = ({ row }) => {
  return (
    <>
      {row.original.total_no_of_employees ? <span
        role='button'
        className='text-primary'>
        <i className="ti ti-user"></i> Total Uploaded :&nbsp;
        {row.original.total_no_of_employees} Employee{row.original.total_no_of_employees > 1 && 's'}
      </span> : '-'}
      {!!row.original.no_of_employees_uploaded && <>
        <br />
        <span
          className='text-success'
          role='button'>
          <i className="ti ti-check"></i> Processed Successfully :&nbsp;
          {row.original.no_of_employees_uploaded} Employee{row.original.no_of_employees_uploaded > 1 && 's'}
        </span>
      </>}
      {!!row.original.no_of_employees_failed_to_upload && <>
        <br />
        <span
          role='button'
          className='text-danger'>
          <i className="ti ti-close"></i> Failed To Process :&nbsp;
          {row.original.no_of_employees_failed_to_upload} Employee{row.original.no_of_employees_failed_to_upload > 1 && 's'}
        </span>
      </>}
    </>
  );
}

const ErrorSheetTableData = [
  {
    Header: "Employer Name",
    accessor: "employer_name",
  },
  {
    Header: "Uploaded Employee Status",
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
