import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert";
import { useParams, useHistory } from "react-router-dom";

import { Card, TabWrapper, Tab, Loader, SelectComponent } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Form, ButtonGroup, Button as Btn, Button } from "react-bootstrap";
// import { ClaimCard } from "./ClaimCard";
import { Encrypt, randomString } from "utils";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEmployer,
  loadEmployee,
  clearEmployee,
  loadPolicyType,
  clear_policy_type,
  loadMembers,
  clearMembers,
  loadPolicyId,
  clear_policy_id,
  overAllClaim,
  clear_claims,
  loadBroker,
  loadBrokerEmployer,
  claim,
  clear,
  set_track_claim,
  exportPortalClaimReport,
  digitalClaimIpdOpdformHandler,
} from "../claims.slice";

import {
  fetchEmployers,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { /* Button, Input,  */NoDataFound, sortType } from "../../../components";
import { DataTable } from "../../user-management";
import { DateFormate } from "../../../utils";
import ExportPortal from "./ExportPortal";
import { Prefill } from "../../../custom-hooks/prefill";
const ClaimType = ["hospitalization", "intimate", "e-cashless"];

export const PortalClaim = () => {
  // const history = useHistory();
  const { currentUser, userType: userTypeName } = useSelector(
    (state) => state.login
  );
  const { userType, policyid } = useParams();
  const dispatch = useDispatch();
  const {
    loading,
    success,
    employee,
    members,
    policy_type,
    policy_id,
    all_claims,
    broker,
  } = useSelector(claim);
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const [trigger, setTrigger] = useState(0);
  const [modalExport, setModalExport] = useState(false);

  const { control, setValue, watch } = useForm();
  const brokerId = (watch("broker_id") || {})?.id;
  const employerId = watch('employer_id')?.value || currentUser.employer_id || '';
  const employeeId = watch('emp_id')?.value || currentUser.employee_id || '';
  const policyNo = watch('policy_type')?.value || '';
  const policyId = watch('policy_id')?.value || '';
  const memberId = watch('member_id')?.value || '';

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);
  useEffect(() => {
    if (userTypeName) {
      if (userType === "admin") {
        dispatch(loadBroker(userTypeName));
      }
    }

    return () => {
      dispatch(clearEmployer());
      dispatch(clearEmployee());
      // setECashlessAllowed(0);
      dispatch(clear_policy_type());
      dispatch(clearMembers());
      dispatch(clear_policy_id());
      dispatch(clear_claims());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, userTypeName]);

  useEffect(() => {
    if (employerId) {
      dispatch(loadPolicyType({ employer_id: employerId }, "GPA"));
      setValue([
        { policy_type: undefined },
        { policy_id: undefined },
        { emp_id: undefined },
        { member_id: undefined }
      ])
      return () => {
        dispatch(clearMembers());
        dispatch(clearEmployee());
        // setECashlessAllowed(0);
        dispatch(clear_policy_type());
        dispatch(clear_policy_id());
        dispatch(clear_claims());
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, employerId]);

  useEffect(() => {
    if (employerId && policyNo) {
      if (Number(policyNo) !== 1) {
        setTrigger(0);
      }
      setValue([
        { policy_id: undefined },
        { emp_id: undefined },
        { member_id: undefined }
      ])
      dispatch(
        loadPolicyId({
          user_type_name: userTypeName,
          employer_id: employerId,
          policy_sub_type_id: policyNo,
          ...(userType === "broker" &&
            currentUser.broker_id && { broker_id: currentUser.broker_id }),
        })
      );
    }
    return () => {
      dispatch(clearEmployee());
      dispatch(clearMembers());
      dispatch(clear_policy_id());
      dispatch(clear_claims());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerId, policyNo]);

  useEffect(() => {
    if (
      (userType === "employer" ||
        userType === "broker" ||
        userType === "admin") &&
      employerId &&
      policyId
    ) {
      setValue([
        { emp_id: undefined },
        { member_id: undefined }
      ])
      dispatch(loadEmployee({ employer_id: employerId, policy_id: policyId }));
    }
    return () => {
      dispatch(clearEmployee());
      dispatch(clearMembers());
      dispatch(clear_claims());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, employerId, policyId]);


  useEffect(() => {
    if (policyId) {
      dispatch(
        overAllClaim({
          policy_id: policyId,
          claim_type: ClaimType[trigger],
          employee_id: employeeId || currentUser?.employee_id /* || employee.find(({ employee_code }) => employee_code === employeeCode)?.employee_id */,
          member_id: memberId || "",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, employeeId, trigger, policyId]);

  useEffect(() => {
    if (policyid && employeeId) {
      dispatch(
        overAllClaim({
          policy_id: policyid,
          claim_type: ClaimType[trigger],
          employee_id: employeeId,
          member_id: memberId || "",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, employeeId, trigger, policyid]);

  useEffect(() => {
    if (employeeId && policyId) {
      setValue([
        { member_id: undefined },
      ])
      dispatch(loadMembers({ employee_id: employeeId, policy_id: policyId }));
    }
    return () => {
      dispatch(clearMembers());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, userType === 'employee' ? [policyId] : [employeeId]);

  useEffect(() => {
    if (!loading && success) {
      swal('Success', success, "success");
    }

    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, loading]);

  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(policy_type, setValue, 'policy_type', 'policy_sub_type_name', 'policy_sub_type_id')
  Prefill(policy_id, setValue, 'policy_id', 'policy_no')
  useEffect(() => {
    if (employee.length === 1)
      setValue('emp_id', { id: employee[0].employee_id, label: employee[0].employee_name + ' : ' + employee[0].employee_code, value: employee[0].employee_id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee])
  Prefill(members, setValue, 'member_id', undefined, 'member_id')

  const getAdminEmployer = ([e]) => {
    if (e?.value) {
      dispatch(loadBrokerEmployer(e.value));

      setValue([
        { employer_id: undefined },
        { policy_type: undefined },
        { policy_id: undefined },
        { emp_id: undefined },
        { member_id: undefined }
      ])
    }
    return e;
  };

  const exportReport = ({ from_date, to_date, claim_type: { value }, employer_id }) => {
    dispatch(exportPortalClaimReport({
      claim_type: value,
      start_date: from_date,
      end_date: to_date,
      ...(employer_id?.value || (currentUser?.employer_id && !(currentUser.is_super_hr && currentUser.child_entities.length))) && { employer_id: employer_id?.value || currentUser?.employer_id }
    }, setModalExport))
  }

  // const getFromEmployeeCode = () => {
  //   if (!policyId) {
  //     return swal('Validation', 'Policy Name Required', 'info')
  //   }
  //   if (!employeeId && !employeeCode) {
  //     return swal('Validation', `Employee Name OR Employee Code Required`, 'info')
  //   }
  //   setMemberId();
  //   setValue('claim_id', null)
  //   const data = {
  //     ...(employeeCode ? {
  //       employee_code: employeeCode
  //     } : {
  //       employee_id: employeeId,
  //     }),
  //     policy_id: policyId,
  //   };
  //   dispatch(loadMembers(data, !!employeeCode));
  // }

  return (
    <>
      <ImageCard
        title={
          <div className="d-flex justify-content-between">
            <span>Portal Claims</span>
            {userType !== 'employee' && <Button onClick={() => setModalExport(true)} variant='dark' size='sm' type='button'><strong> Export <i className="ti-cloud-down"></i></strong></Button>}
          </div>
        } round>
        <Form>
          <Row className="d-flex flex-wrap">
            {userType === "admin" && (
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Broker"
                      placeholder="Select Broker"
                      options={broker.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []}
                      id="id"
                      required
                    />
                  }
                  onChange={getAdminEmployer}
                  name="broker_id"
                  control={control}
                />
              </Col>
            )}
            {(userType === "broker" || userType === "admin") && (
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Employer"
                      placeholder="Select Employer"
                      options={employers.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      }))}
                      id="employer_id"
                      required
                    />
                  }
                  // onChange={getPolicyType}
                  name="employer_id"
                  control={control}
                />
              </Col>
            )}
            {!!(currentUser.is_super_hr && currentUser.child_entities.length) &&
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Employer"
                    placeholder='Select Employer'
                    options={currentUser.child_entities.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                    id="employer_id"
                    required
                  />}
                  defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                  // onChange={getPolicyType}
                  name="employer_id"
                  control={control}
                />
              </Col>}

            {/* {userType !== "employee" && (userType !== "employer" || !!(currentUser.is_super_hr && currentUser.child_entities.length))
              && <Col xs={12} sm={12} md={12} lg={1} xl={1} className='d-flex justify-content-center align-items-center'></Col>} */}


            <Col md={12} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Type"
                    placeholder="Select Policy Type"
                    options={policy_type.map((item) => ({
                      id: item?.policy_sub_type_id,
                      label: item?.policy_sub_type_name,
                      value: item?.policy_sub_type_id,
                    }))}
                    id="policy_type"
                    required
                  />
                }
                // onChange={getPolicyId}
                name="policy_type"
                control={control}
              />
            </Col>
            {/* <Col xs={12} sm={12} md={12} lg={1} xl={1} className='d-flex justify-content-center align-items-center'></Col> */}

            <Col md={12} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Name"
                    placeholder="Select Policy Name"
                    options={policy_id.map((item) => ({
                      id: item?.id,
                      label: item?.policy_no,
                      value: item?.id,
                    }))}
                    id="policy_id"
                    required
                  />
                }
                // onChange={getEmployee}
                name="policy_id"
                control={control}
              />
            </Col>
            {/* </Row>
          <Row className="d-flex flex-wrap"> */}
            {userType !== "employee" && (
              <>
                <Col md={12} lg={4} xl={3} sm={12}>
                  <Controller
                    as={
                      <SelectComponent
                        label="Employee Name : Code"
                        placeholder="Select Employee"
                        options={employee.map((item) => ({
                          id: item?.employee_id,
                          label: item?.employee_name + ' : ' + item.employee_code,
                          value: item?.employee_id,
                        }))}
                        id="emp_id"
                        required
                      />
                    }
                    // onChange={getMember}
                    name="emp_id"
                    control={control}
                  />
                </Col>
                {/* <Col xs={12} sm={12} md={12} lg={1} xl={1} className='d-flex justify-content-center align-items-center'> OR</Col>
                <Col md={12} lg={4} xl={3} sm={12}>
                  <Input name="employee_code" label="Employee Code" value={employeeCode} onChange={(e) => {
                    setEmployeeCode(e.target.value);
                    setValue('employee_id', '');
                  }} placeholder="Employee Code" />
                </Col>
                <Col xs={12} sm={12} md={12} lg={1} xl={1} className='d-flex justify-content-center align-items-center'></Col>
                <Col xs={12} sm={12} md={12} lg={3} xl={3} className="d-flex justify-content-center align-items-center mb-3">
                  <Button type="button" onClick={getFromEmployeeCode}>Submit</Button>
                </Col> */}
              </>
            )}
            {/* </Row>
          <Row className="d-flex flex-wrap"> */}
            <Col md={12} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Member Name"
                    placeholder="Select Member"
                    options={members.map((item) => ({
                      id: item?.member_id,
                      label: item?.name,
                      value: item?.member_id,
                    }))}
                    id="patient_name"
                    required
                    isClearable
                  />
                }
                name="member_id"
                control={control}
              />
            </Col>
          </Row>
        </Form>
      </ImageCard>
      {!!(employee.length || members.length) && (
        <TabWrapper width={"max-content"}>
          <Tab isActive={trigger === 0} onClick={() => setTrigger(0)}>
            Hospitalization
          </Tab>
          {(Number(policyNo) === 1) && <Tab isActive={trigger === 1} onClick={() => setTrigger(1)}>
            Intimation
          </Tab>}
        </TabWrapper>
      )}

      {!!((employee.length || members.length) && !loading) && <><Card
        // containerstyle={{ marginTop: viewType === 0 ? '3rem' : '0' }}
        // style={{ padding: viewType === 0 ? '1.6rem' : '1.6rem 1.6rem 14px' }}
        // hideLine={viewType !== 0}
        title={<div className="d-flex justify-content-between">
          <span>Claim Details</span>

          {/* <TabWrapper className='m-0 p-1' style={{ zoom: '0.6' }} width={"max-content"}>
            <Tab isActive={viewType === 0} onClick={() => setViewType(0)}>
              Table View
            </Tab>
            {(Number(policyNo) === 1) && <Tab isActive={viewType === 1} onClick={() => setViewType(1)}>
              Card View
            </Tab>}
          </TabWrapper> */}
        </div>}>
          
        {/* viewType === 0 &&  */((all_claims.length ? <DataTable
          columns={TableData(trigger)}
          data={all_claims.map((elem) => ({
            ...elem,
            claim_date: DateFormate(elem.claim_date),
            claim_request_date: DateFormate(elem.claim_request_date),
            claim_type: (elem.claim_type?.charAt(0).toUpperCase() + elem.claim_type?.slice(1)) + ((elem.is_opd_claim !== null && elem.claim_type) ? (elem.is_opd_claim ? '-OPD' : '-IPD') : ''),
            claim_sub_type: elem.claim_hospitalization_type || 'Hospitalization',
            claim_reason: elem.claim_disease || elem.claim_reason,
            track_data: {
              employerId,
              policyNo,
              policyId,
              employeeId: elem.employee_id,
              member_id: elem.member_id,
              // claim_hospitalization_type: (elem.claim_hospitalization_type || '').toLowerCase(),
            }
          })) || []}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 15, 20]}
          rowStyle
        // onExport={exportReport}
        /> :
          <NoDataFound text='No Claim Data Found' />))}



      </Card>
        {/* {viewType === 1 &&
          <Rows className="d-flex flex-wrap" style>
            {trigger === 0 &&
              (all_claims.length
                ? all_claims.map((claim, index) => {
                  const {
                    member_name,
                    member_id,
                    claim_id,
                    claim_date,
                    claim_disease,
                    claim_type,
                    claim_reason,
                    claim_amt,
                    is_opd_claim,
                    claim_settled_amount,
                    claim_status,
                    claim_request_date,
                    employee_id,
                    claim_hospitalization_type,
                    id
                  } = claim;
                  return (
                    <Col key={index + "hosp"} md={12} lg={6} xl={5} sm={12}>
                      <ClaimCard
                        trigger={trigger}
                        claimRedirectHandler={() =>
                          history.push(
                            `/${userType}/view-claim/${Encrypt(
                              employerId
                            )}/${randomString()}/${Encrypt(
                              policyNo
                            )}/${randomString()}/${Encrypt(
                              policyId
                            )}/${randomString()}/${Encrypt(
                              employee_id
                            )}/${randomString()}/${trigger === 0 ? "hospitalization" : "intimate"
                            }/${randomString()}/${Encrypt(
                              id
                            )}/${randomString()}/${Encrypt(member_id)}`
                          )
                        }
                        claim_hospitalization_type={claim_hospitalization_type}
                        title={member_name}
                        claimId={claim_id}
                        claimDate={claim_date}
                        claimType={claim_type}
                        claimReason={claim_disease || claim_reason}
                        userType={userType}
                        approvedAmt={claim_settled_amount}
                        claim_status={claim_status}
                        claim_request_date={claim_request_date}
                        calimAmt={claim_amt || 0}
                        is_opd_claim={is_opd_claim}
                        track_data={{
                          employerId,
                          policyNo,
                          policyId,
                          employeeId: employee_id,
                          member_id,
                        }}
                      />
                    </Col>
                  );
                })
                : !!((employee.length || members.length) && !loading) && (
                  <Col xl={12} lg={12} md={12} sm={12}>
                    <h1 className="display-4 text-center">
                      No Hospitalization Detail Found
                    </h1>
                  </Col>
                ))}
            {(trigger === 2 || trigger === 1) &&
              (all_claims.length
                ? all_claims.map((claim, index) => {
                  const {
                    member_name,
                    claim_id,
                    claim_date,
                    claim_type,
                    claim_disease,
                    claim_reason,
                    claim_amt,
                    claim_settled_amount,
                    claim_request_id,
                    claim_status,
                    claim_request_date,
                    claim_deficiency,
                    recommendation_id,
                    claim_hospitalization_type,
                    comment,
                  } = claim;

                  return (
                    <Col key={index + "inti"} md={12} lg={6} xl={5} sm={12}>
                      <ClaimCard
                        title={member_name}
                        claimId={claim_id}
                        claimDate={claim_date}
                        claimType={claim_type}
                        claimReason={claim_disease || claim_reason}
                        userType={userType}
                        claim_status={claim_status}
                        claim_request_date={claim_request_date}
                        approvedAmt={claim_settled_amount}
                        calimAmt={claim_amt || 0}
                        track_data={false}
                        claim_hospitalization_type={claim_hospitalization_type}
                        claim_request_id={claim_request_id}
                        claim_deficiency={claim_deficiency}
                        recommendation_id={recommendation_id}
                        comment={comment}
                      />
                    </Col>
                  );
                })
                : !!((employee.length || members.length) && !loading) && (
                  <Col xl={12} lg={12} md={12} sm={12}>
                    <h1 className="display-4 text-center">
                      No Intimation Detail Found
                    </h1>
                  </Col>
                ))}
          </Rows>
        } */}
      </>}
      <ExportPortal
        show={modalExport}
        onHide={() => setModalExport(false)}
        exportReport={exportReport}
        employers={(userType === "broker" || userType === "admin") ? employers : (currentUser.is_super_hr && currentUser.child_entities.length ? currentUser.child_entities : [])}
      />
      {loading && <Loader />}
    </>
  );
};

const ImageCard = styled(Card)`
  background: url("/assets/images/bg-4.png") no-repeat bottom right;
  background-color: #ffffff;
`;

// const Rows = styled(Row)`
//   margin-left: 0px !important;
//   margin-right: 0px !important;
//   margin-bottom: 15px;
// `;


export const _renderAction = ({ row }) => {
  const original = row.original;
  const history = useHistory();
  const { userType } = useParams();

  const claimRedirectHandler = () =>
    history.push(
      `/${userType}/view-claim/${Encrypt(
        original?.track_data?.employerId
      )}/${randomString()}/${Encrypt(
        original?.track_data?.policyNo
      )}/${randomString()}/${Encrypt(
        original?.track_data?.policyId
      )}/${randomString()}/${Encrypt(
        original?.track_data?.employeeId
      )}/${randomString()}/${/* original?.track_data?.claim_hospitalization_type ||  */"hospitalization"
      }/${randomString()}/${Encrypt(
        original.id
      )}/${randomString()}/${Encrypt(original.member_id)}`
    )

  return Number(original?.track_data?.policyNo) === 1 &&
    <ButtonGroup key={`${row.index}-operations`} size="sm">
      <Btn onClick={claimRedirectHandler} className="strong" variant="outline-primary">
        <i className="far fa-eye"></i>
      </Btn>
    </ButtonGroup >
}

const _trackClaim = ({ row }) => {
  const original = row.original;

  const dispatch = useDispatch();
  const history = useHistory();
  const { userType } = useParams();

  const saveTrack = () => {
    if (original.claim_id) {
      dispatch(set_track_claim({ ...original.track_data, claimId: original.claim_id }))
      history.push(`/${userType}/track-claim`)
    }
    if (original.claim_request_id) {
      history.push(`e-cashless-service?claim_request_id=${original.claim_request_id}`)
    }
  }
  return !!((original.claim_id && original.track_data !== false) || original.claim_request_id) && original.claim_type ?
    <ButtonGroup key={`${row.index}-operations`} size="sm">
      <Btn onClick={saveTrack} className="strong" variant="outline-primary">
        <i className="ti-location-pin" />
      </Btn>
    </ButtonGroup> : '-'
}

const _claimForm = ({ row }) => {
  const original = row.original;
  const dispatch = useDispatch();

  const type = ((original.is_opd_claim !== null && original.claim_type) ? (original.is_opd_claim ? 'opd' : 'ipd') : '');

  const handleForm = () => {
    if (original.claim_id) {
      dispatch(digitalClaimIpdOpdformHandler({ claim_id: original?.claim_id }, type));
    }
  }

  return !!original.claim_id && !!type ?
    <ButtonGroup key={`${row.index}-operations`} size="sm">
      <Btn onClick={handleForm} className="strong" variant="outline-primary">
        <i className="far fa-file-alt"></i>
      </Btn>
    </ButtonGroup> : '-'
}

const TableData = (trigger) => [
  {
    Header: "Claim Id",
    accessor: "claim_id",
  },
  {
    Header: "Member Name",
    accessor: "member_name",
  },
  {
    Header: "Hospitalization Date",
    accessor: "claim_date",
    sortType: sortType
  },
  {
    Header: "Claim Request Date",
    accessor: "claim_request_date",
    sortType: sortType
  },
  {
    Header: "Claim Type",
    accessor: "claim_type"
  },
  {
    Header: "Claim Sub Type",
    accessor: "claim_sub_type",
  },
  {
    Header: "Ailment",
    accessor: "claim_reason",
  },
  {
    Header: "Claim Settled/Approved Amount",
    accessor: "claim_settled_amount",
  },
  {
    Header: "Claim Amount",
    accessor: "claim_amt",
  },
  {
    Header: "Claim Form",
    accessor: "claim_form",
    disableSortBy: true,
    disableFilters: true,
    Cell: _claimForm
  },

  ...trigger === 0 ? [
    {
      Header: "Track Claim",
      accessor: "track",
      disableSortBy: true,
      disableFilters: true,
      Cell: _trackClaim
    },
    {
      Header: "Claim Details",
      accessor: "operations",
      disableSortBy: true,
      disableFilters: true,
      Cell: _renderAction
    }] : [],
];
