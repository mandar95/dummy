import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ControlledTabs from "./tab";
import { Row, Col } from "react-bootstrap";
// import _ from "lodash";
import { CardBlue, Head, Select } from "../../components";
import { TabContainer, Spacer } from "../EndorsementRequest/style";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';


import {
  getEmployereData,
  selectEmployerResponse,
  getPolicySubTypeData,
  selectPolicySubType,
  getPolicyNumberData,
  selectPolicyNumber,
  // getSumInsured,
  selectSumInsured,
  // sumInsuredCleanUp,
  loadBroker,
  // getDynamicFile,
  getErrorSheetDataTPA
} from "../EndorsementRequest/EndorsementRequest.slice";
import { useForm, Controller } from 'react-hook-form';
import { DataTable } from "modules/user-management";
import { ErrorSheetTableDataTPA, /*sumInsuredEndorseSplit*/ } from '../EndorsementRequest/helper';

const BulkMember = ({ userType = '', brokerId, myModule }) => {
  const { control, reset, register, watch } = useForm();

  const to_override = watch('to_override') || '0';
  //selectors
  const dispatch = useDispatch();
  const EmployerResponse = useSelector(selectEmployerResponse);
  let PolicyTypeResponse = useSelector(selectPolicySubType);
  const PolicyNumberResponse = useSelector(selectPolicyNumber);
  const { broker, ErrorSheetDataTPA } = useSelector((state) => state.endorsementRequest);
  const { userType: userTypeName } = useSelector((state) => state.login);
  // const { userType = '' } = props
  const sumInsuredResp = useSelector(selectSumInsured);
  //states
  const [employerId, setEmployerId] = useState(null);
  const [getPolicyNumberObject, setPolicyNumberObject] = useState({});

  //api call for broker data -----
  useEffect(() => {
    if (userType === 'admin' && userTypeName) {
      dispatch(loadBroker(userTypeName))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName])

  useEffect(() => {
    const data = { broker_id: brokerId };
    if (brokerId) {
      dispatch(getEmployereData(data));
      dispatch(getErrorSheetDataTPA(data))
      const intervalId = setInterval(() => dispatch(getErrorSheetDataTPA(data)), 15000);
      return () => { clearInterval(intervalId); }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brokerId]);

  // selected value -employer id -------
  const getEmployerId = ([e]) => {
    reset({
      'policytype': '',
      'policyno': '',
    })
    setPolicyNumberObject({})
    if (e.target.value) {
      setEmployerId(e.target.value);
      // api call for Policy subtype
      const data = {
        employer_id: e.target.value
      };
      dispatch(getPolicySubTypeData(data));
    }
  };
  //--------------------------------------

  //selected value (policysubtypeid)------------------
  const getPolicyId = ([e]) => {
    reset({
      'policyno': ''
    })
    setPolicyNumberObject({})
    if (e.target.value) {
      // policy no api --
      const data = {
        employer_id: employerId,
        policy_sub_type_id: e.target.value,
      };
      dispatch(getPolicyNumberData(data));
    }
  };
  //---------------------------------

  //selected value (policyNumberId)------------------
  const getPolicyNumberId = ([e]) => {
    setPolicyNumberObject({})
    if (e.target.value) {
      setPolicyNumberObject({ id: e.target.value });
    }
  };
  //-----------------------------

  // //Sum Insured Display----------
  // useEffect(() => {
  //   dispatch(sumInsuredCleanUp())
  //   if (!_.isEmpty(getPolicyNumberObject)) {
  //     const data = getPolicyNumberObject?.id
  //     dispatch(getSumInsured(data))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getPolicyNumberObject])
  //-----------------------------

  const getAdminEmployer = ([e]) => {
    setPolicyNumberObject({})
    setEmployerId();
    reset({
      'employer': '',
      'policyno': '',
      'policytype': '',
    })
    if (e?.target?.value) {
      dispatch(getEmployereData({ broker_id: e.target.value }));
    }
    return (e)
  }


  return (
    <CardBlue title="Member Upload" round>
      <TabContainer>
        <Row>
          {(userType === "admin") &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Select
                    label="Broker"
                    placeholder="Select Broker"
                    required
                    options={broker.map(item => (
                      {
                        id: item.id,
                        name: item.name,
                        value: item.id
                      }
                    )) || []}
                  />
                }
                onChange={getAdminEmployer}
                control={control}
                name="broker"
              />
            </Col>
          }
          <Col xl={4} lg={4} md={6} sm={12}>
            <Controller
              as={
                <Select
                  label="Employer"
                  placeholder="Select Employer"
                  required
                  options={EmployerResponse?.data?.data?.map(item => (
                    {
                      id: item.id,
                      name: item.name,
                      value: item.id
                    }
                  )) || []}
                />
              }
              onChange={getEmployerId}
              control={control}
              name="employer"
            />
          </Col>
          <Col xl={4} lg={4} md={6} sm={12}>
            <Controller
              as={
                <Select
                  label="Policy Type"
                  placeholder="Select Policy Type"
                  required
                  options={PolicyTypeResponse?.data?.data?.filter(({ id }) => id === 1).map(item => (
                    {
                      id: item.id,
                      name: item.name,
                      value: item.id
                    }
                  )) || []}
                />
              }
              onChange={getPolicyId}
              control={control}
              name="policytype"
            />
          </Col>
          <Col xl={4} lg={4} md={6} sm={12}>
            <Controller
              as={
                <Select
                  label="Policy Number"
                  placeholder="Select Policy Number"
                  required
                  options={PolicyNumberResponse?.data?.data?.map(item => (
                    {
                      id: item.id,
                      name: item.number,
                      value: item.id
                    }
                  )) || []}
                />
              }
              onChange={getPolicyNumberId}
              control={control}
              name="policyno"
            />
          </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Head className='text-center'>Should Overwrite ?</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                <input ref={register} name={'to_override'} type={'radio'} value={0} defaultChecked={true} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                <input ref={register} name={'to_override'} type={'radio'} value={1} />
                <span></span>
              </CustomControl>
            </div>
          </Col>
        </Row>
        <Spacer>
          <ControlledTabs
            policyNumberData={getPolicyNumberObject}
            employerId={employerId}
            myModule={myModule}
            is_opd={!!sumInsuredResp?.data?.opd_suminsured}
            to_override={to_override}
          />
        </Spacer>
      </TabContainer>
      {!!ErrorSheetDataTPA.length && <>
        <Row style={{
          'borderTop': '1px solid #c9c9c9',
          'padding': '10px 10px',
          'fontSize': '20px',
          'fontWeight': '500'
        }}>
          Member Upload Documents
        </Row>
        <DataTable
          columns={
            ErrorSheetTableDataTPA ||
            []
          }
          data={ErrorSheetDataTPA}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          rowStyle
          autoResetPage={false}
        />
      </>}

    </CardBlue>
  );
};

export default BulkMember;
