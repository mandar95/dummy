import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "react-bootstrap";
// import _ from "lodash";
import { CardBlue, Loader } from "../../components";
import {
  getEmployereData,
  selectEmployerResponse,
  getPolicySubTypeData,
  selectPolicySubType,
  getPolicyNumberData,
  selectPolicyNumber,
  // getSumInsured,
  // selectSumInsured,
  // sumInsuredCleanUp,
  loadBroker,
  // getDynamicFile,
  getErrorSheetData,
  setPageData,
  loading as setLoading
} from "./EndorsementRequest.slice.js";
import { useForm } from 'react-hook-form';
import { DataTable } from "modules/user-management";
import { ErrorSheetTableData/* , sumInsuredEndorseSplit */ } from './helper';
import EmdorsmentRequestForm from "./Forms/EndorsmentRequestForm";
import { Prefill } from "../../custom-hooks/prefill";

const BulkMember = ({ userType = '', brokerId, myModule }) => {
  const { control, reset, setValue, watch } = useForm();
  //selectors
  const dispatch = useDispatch();
  const EmployerResponse = useSelector(selectEmployerResponse);
  const PolicyTypeResponse = useSelector(selectPolicySubType);
  const PolicyNumberResponse = useSelector(selectPolicyNumber);
  const { broker, ErrorSheetData, lastPage, firstPage, loading } = useSelector((state) => state.endorsementRequest);
  const { userType: userTypeName } = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(setPageData({
      firstPage: 1,
      lastPage: 1,
    }))

    return () => {
      dispatch(setLoading(false))
    }    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //api call for broker data -----
  useEffect(() => {
    if (userType === 'admin' && userTypeName) {
      dispatch(loadBroker(userTypeName))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName])

  useEffect(() => {
    if (brokerId) {
      const data = { broker_id: brokerId };
      dispatch(getErrorSheetData(data))
      const intervalId = setInterval(() => dispatch(getErrorSheetData(data)), 15000);
      return () => { clearInterval(intervalId); }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brokerId]);

  useEffect(() => {
    if (brokerId) {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(getEmployereData({ broker_id: brokerId }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, brokerId]);

  const employer = watch('employer')?.value || '';
  const policytype = watch('policytype')?.value || '';
  const policyno = watch('policyno')?.value || '';


  useEffect(() => {
    if (employer) {
      getEmployerId(employer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer])

  useEffect(() => {
    if (policytype)
      getPolicyId(policytype)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policytype])

  // Prefill 
  Prefill(EmployerResponse, setValue, 'employer')
  Prefill(PolicyTypeResponse?.data?.data, setValue, 'policytype',)
  Prefill(PolicyNumberResponse?.data?.data, setValue, 'policyno', 'number')


  // selected value -employer id -------
  const getEmployerId = (e) => {
    setValue([
      { 'policytype': undefined },
      { 'policyno': undefined }
    ])
    if (e) {
      // api call for Policy subtype
      dispatch(getPolicySubTypeData({ employer_id: e }));
    }
    return e
  };
  //--------------------------------------

  //selected value (policysubtypeid)------------------
  const getPolicyId = (e) => {
    setValue('policyno', undefined)
    if (e) {
      dispatch(getPolicyNumberData({
        employer_id: employer,
        policy_sub_type_id: e,
        user_type_name: userTypeName
      }));
    }
    return e
  };
  //---------------------------------

  const getAdminEmployer = ([e]) => {
    setValue([
      { 'employer': undefined },
      { 'policytype': undefined },
      { 'policyno': undefined }
    ])
    if (e?.value) {
      dispatch(getEmployereData({ broker_id: e?.value }, 1, 50000));
    }
    return (e)
  }


  return (
    <CardBlue title="Endorsement Request" round>
      <EmdorsmentRequestForm
        userType={userType} broker={broker} getAdminEmployer={getAdminEmployer} control={control} EmployerResponse={EmployerResponse}
        PolicyTypeResponse={PolicyTypeResponse} PolicyNumberResponse={PolicyNumberResponse}
        employerId={employer} myModule={myModule} reset={reset} policyno={policyno}
      />
      {!!ErrorSheetData.length && <>
        <Row style={{
          'borderTop': '1px solid #c9c9c9',
          'padding': '10px 10px',
          'fontSize': '20px',
          'fontWeight': '500'
        }}>
          Endorsement Documents
        </Row>
        <DataTable
          columns={ErrorSheetTableData(true, ErrorSheetData.some(({ source_id }) => source_id === 2)) || []}
          data={ErrorSheetData}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          rowStyle={true}
          autoResetPage={false} />
      </>}
      {loading && <Loader />}
    </CardBlue>
  );
};

export default BulkMember;
