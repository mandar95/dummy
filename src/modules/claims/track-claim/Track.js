import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import swal from 'sweetalert';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

import { Card, Head, Loader, Text, SelectComponent } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Form, Popover, OverlayTrigger, Button as BTN } from 'react-bootstrap';
import { Wrapper, ContainerStep, ProgessBarStep, ClaimHead, List } from './style';

import { useDispatch, useSelector } from 'react-redux';
import {
  clearEmployer,
  loadEmployee, clearEmployee,
  loadPolicyType, clear_policy_type,
  trackClaim, clearTrackClaim,
  loadMembers, clearMembers,
  loadPolicyId, clear_policy_id,
  loadClaimId, clear_claim_data,
  loadBroker, loadBrokerEmployer,
  claim, clear, clear_track_claim, getClaimDetails,
  claimDetailsData as setclaimDetailsData
} from '../claims.slice';
import { randomString } from '../../../utils';

import {
  fetchEmployers,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { Prefill } from '../../../custom-hooks/prefill';


export const TrackClaim = () => {
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { userType, claimid, memberid, tpamemberid } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error, success,
    // employer, 
    employee, members, claims, track, policy_type, policy_id, track_claim, broker, claimDetailsData } = useSelector(claim);
  const [gate, setGate] = useState(true);
  const { control, setValue, watch } = useForm();
  const brokerId = (watch("broker_id") || {})?.id;

  const employerId = watch('employer_id')?.value || currentUser.employer_id || '';
  const employeeId = watch('emp_id')?.value || track_claim.employeeId || currentUser.employee_id || '';
  const policyNo = watch('policy_type')?.value || '';
  const policyId = watch('policy_id')?.value || track_claim.policyId || '';
  const memberId = watch('member_id')?.value || '';
  const claimId = watch('claim_id')?.value || track_claim.claimId || '';

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }));
      dispatch(setclaimDetailsData({}));
      dispatch(clearEmployer());
      dispatch(clearEmployee());
      dispatch(clear_policy_type());
      dispatch(clearTrackClaim());
      dispatch(clearMembers());
      dispatch(clear_policy_id());
      dispatch(clear_claim_data());
      dispatch(clear_track_claim());
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
    if (!_.isEmpty(track_claim)) {
      setGate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track_claim]);


  useEffect(() => {
    if (userTypeName && userType === 'admin') {
      dispatch(loadBroker(userTypeName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName])

  useEffect(() => {
    if (employerId) {
      dispatch(loadPolicyType({ employer_id: employerId }, "GPA"));
      setValue([
        { policy_type: undefined },
        { policy_id: undefined },
        { emp_id: undefined },
        { member_id: undefined },
        { claim_id: undefined }
      ])
      return () => {
        dispatch(clearMembers());
        dispatch(clearEmployee());
        dispatch(clear_policy_type());
        dispatch(clear_policy_id());
        dispatch(clear_claim_data());
        dispatch(clear_track_claim());
        dispatch(clearTrackClaim());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerId])

  useEffect(() => {
    if (employerId && policyNo) {
      setValue([
        { policy_id: undefined },
        { emp_id: undefined },
        { member_id: undefined },
        { claim_id: undefined }
      ])
      dispatch(loadPolicyId({
        user_type_name: userTypeName,
        employer_id: employerId, policy_sub_type_id: policyNo,
        ...(userType === "broker" && currentUser.broker_id && { broker_id: currentUser.broker_id })
      }));
      return () => {
        dispatch(clearEmployee());
        dispatch(clearMembers());
        dispatch(clear_policy_id());
        dispatch(clear_claim_data());
        dispatch(clear_track_claim());
        dispatch(clearTrackClaim());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyNo])

  useEffect(() => {
    if ((userType === "employer" || userType === "broker" || userType === 'admin') && employerId && policyId) {
      setValue([
        { emp_id: undefined },
        { member_id: undefined },
        { claim_id: undefined }
      ])
      dispatch(loadEmployee({ employer_id: employerId, policy_id: policyId }));
      return () => {
        dispatch(clearEmployee());
        dispatch(clearMembers());
        dispatch(clear_claim_data());
        // dispatch(clear_track_claim());
        dispatch(clearTrackClaim());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyId])

  useEffect(() => {
    if (((memberId && claimId) || (track_claim.claimId && track_claim.member_id)) && Boolean(members.length)) {
      const memberData = members.find((member) =>
        member.member_id === Number(memberId || track_claim.member_id)
      )
      if (memberData) {
        if (Number(policyNo) === 1 || track_claim.policyNo === 1) {
          dispatch(trackClaim({ tpa_member_id: memberData?.tpa_member_id, claim_id: claimId || track_claim.claimId, member_id: memberId || track_claim.member_id }, memberData));
          dispatch(getClaimDetails({ claim_id: claimId }))
        }
        if (Number(policyNo) === 2 || track_claim.policyNo === 2) {
          dispatch(trackClaim({ id: claimId }, "", "GPA"));
          dispatch(getClaimDetails({ claim_id: claimId }, 'GPA'))
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, claimId, members, track_claim])

  useEffect(() => {
    if (claimid && memberid && tpamemberid && Boolean(members.length)) {
      const memberData = members.find((member) =>
        member.member_id === Number(memberid)
      )
      if (Number(policyNo) === 1) {
        dispatch(trackClaim({ tpa_member_id: tpamemberid, claim_id: claimid, member_id: memberid }, memberData));
        dispatch(getClaimDetails({ claim_id: claimId }))
      }
      if (Number(policyNo) === 2) {
        dispatch(trackClaim({ id: claimId }, "", "GPA"));
        dispatch(getClaimDetails({ claim_id: claimId }, 'GPA'))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimid, memberid, tpamemberid, members])

  useEffect(() => {
    if (memberId) {
      setValue('claim_id', null)
      dispatch(loadClaimId({ member_id: memberId, type: Number(policyNo) }));
      return () => {
        dispatch(clear_claim_data());
        dispatch(clear_track_claim());
        dispatch(clearTrackClaim());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId])

  useEffect(() => {
    if (employeeId && policyId) {
      setValue([
        { member_id: undefined },
        { claim_id: undefined }
      ]);
      dispatch(loadMembers({ employee_id: employeeId, policy_id: policyId, with_trash: true }));
      return () => {
        dispatch(clearMembers());
        dispatch(clear_claim_data());
        dispatch(clearTrackClaim());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, userType === 'employee' ? [policyId] : [employeeId])

  useEffect(() => {
    if (!loading && error) {
      if (!_.isEqual("GPA claim Data Not Found", error)) {
        swal(error, "", "warning");
      }
    };
    if (!loading && success) {
      swal('Success', success, "success");
    };
    if (!loading && !Boolean(track) && !gate && _.isEmpty(track_claim)) {
      setGate(true)
    }

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);


  // Prefill 
  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(policy_type, setValue, 'policy_type', 'policy_sub_type_name', 'policy_sub_type_id')
  Prefill(policy_id, setValue, 'policy_id', 'policy_no')
  useEffect(() => {
    if (employee.length === 1)
      setValue('emp_id', { id: employee[0].id, label: employee[0].employee_name + ' : ' + employee[0].employee_code, value: employee[0].id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee])
  Prefill(members, setValue, 'member_id', undefined, 'member_id')
  useEffect(() => {
    if (claims?.length)
      setValue('claim_id', claims[claims.length - 1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claims])



  const getAdminEmployer = ([e]) => {
    if (e?.value) {
      dispatch(loadBrokerEmployer(e.value));
      setValue([
        { employer_id: undefined },
        { policy_type: undefined },
        { policy_id: undefined },
        { emp_id: undefined },
        { member_id: undefined },
        { claim_id: undefined }
      ])
    }
    return (e)
  }

  // const getFromEmployeeCode = () => {
  //   if (!policyId) {
  //     return swal('Validation', 'Policy Name Required', 'info')
  //   }
  //   if (!employeeId && !employeeCode) {
  //     return swal('Validation', `Employee Name OR Employee Code Required`, 'info')
  //   }
  //   setMemberId();
  //   setClaimId()
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


  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Discrepancy Detail</Popover.Title>
      <Popover.Content>
        <strong>{track?.discripancy_details || "No Details"}</strong>
      </Popover.Content>
    </Popover>
  );

  if (!_.isEmpty(track_claim) && !track) {
    return loading && (<Loader />)
  }

  const ClaimStatusUI = (track, text, _date) => {
    return (
      <List status={"completed"}>
        <ClaimHead>{text}<span>{_date}</span></ClaimHead>
      </List>
    )
  }

  let claim_status = [{ 1: track?.is_claim_rejected }, { 2: track?.is_claim_denied }, { 3: track?.is_claim_cancelled }].find((item, index) => item[index + 1] === 1)

  return (
    <>
      {gate &&
        <ImageCard title="Track Claim" round>
          <Form>
            <Row className="d-flex flex-wrap">
              {(userType === "admin") &&
                <Col md={12} lg={4} xl={3} sm={12}>
                  <Controller
                    as={<SelectComponent
                      label="Broker"
                      placeholder='Select Broker'
                      options={broker.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []}
                      id="id"
                      required
                    />}
                    onChange={getAdminEmployer}
                    name="broker_id"
                    control={control}
                  />
                </Col>}
              {(userType === "broker" || userType === "admin") &&
                <Col md={12} lg={4} xl={3} sm={12}>
                  <Controller
                    as={<SelectComponent
                      label="Employer"
                      placeholder='Select Employer'
                      options={employers.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      }))}
                      id="employer_id"
                      required
                    />}
                    // onChange={getPolicyType}
                    name="employer_id"
                    control={control}
                  />
                </Col>}

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
                  as={<SelectComponent
                    label="Policy Type"
                    placeholder='Select Policy Type'
                    options={policy_type.map((item) => ({
                      id: item?.policy_sub_type_id,
                      label: item?.policy_sub_type_name,
                      value: item?.policy_sub_type_id,
                    }))}
                    id="policy_type"
                    required
                  />}
                  // onChange={getPolicyId}
                  name="policy_type"
                  control={control}
                />
              </Col>
              {/* <Col xs={12} sm={12} md={12} lg={1} xl={1} className='d-flex justify-content-center align-items-center'></Col> */}

              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Policy Name"
                    placeholder='Select Policy Name'
                    options={policy_id.map((item) => ({
                      id: item?.id,
                      label: item?.policy_no,
                      value: item?.id,
                    }))}
                    id="policy_id"
                    required
                  />}
                  // onChange={getEmployee}
                  name="policy_id"
                  control={control}
                />
              </Col>
              {/* </Row>
            <Row className="d-flex flex-wrap"> */}
              {(userType !== "employee") && <>
                <Col md={12} lg={4} xl={3} sm={12}>
                  <Controller
                    as={<SelectComponent
                      label="Employee Name : Code"
                      placeholder='Select Employee'
                      options={employee.map((item) => ({
                        id: item?.employee_id,
                        label: item?.employee_name + ' : ' + item.employee_code,
                        value: item?.employee_id,
                      }))}
                      id="emp_id"
                      required
                    />}
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
              }
              {/* </Row>
            <Row className="d-flex flex-wrap"> */}
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Member Name"
                    placeholder='Select Member'
                    options={members.map((item) => ({
                      id: item?.member_id,
                      label: item?.name + (item.is_trashed ? '(Member Removed)' : ''),
                      value: item?.member_id,
                    }))}
                    id="patient_name"
                    required
                  />}
                  // onChange={getClaim}
                  name="member_id"
                  control={control}
                />
              </Col>
              {/* <Col xs={12} sm={12} md={12} lg={1} xl={1} className='d-flex justify-content-center align-items-center'></Col> */}
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={<SelectComponent
                    label={`Claim ID ${claims?.some(({ admit_date }) => admit_date) ? '[Hospitalization Date]' : ''}`}
                    placeholder={`Select Claim ID ${claims?.some(({ admit_date }) => admit_date) ? '[Hospitalization Date]' : ''}`}
                    options={claims || []}
                    id="claim_id"
                    required
                  />}
                  name="claim_id"
                  control={control}
                />
              </Col>
            </Row>
          </Form>
        </ImageCard>
      }
      {
        track &&
        <Card title="Tracking Detail">
          <Row>
            <Wrapper>
              <ContainerStep>
                <ProgessBarStep>
                  <div className="liner"></div>
                  <List status={(track.claim_register) ? "completed" : "active"}>
                    <ClaimHead>Claim Register<span>{(track.claim_register && track.claim_register !== true) ? (track.claim_register) : ''}</span></ClaimHead>
                  </List>
                  <List status={(!track.document_submited && track.claim_register && !track.discripancy) ? "active" : (track.document_submited) ? "completed" : ""}>
                    <ClaimHead>Document submitted to insurer/TPA<span>{track.document_submited ? (track.document_submited) : ''}</span></ClaimHead>
                  </List>
                  <OverlayTrigger trigger={["hover", "hover"]} placement="top" overlay={popover}>
                    <List status={(track.discripancy && track.document_submited && !track.discripancy_closure && !track.claim_settled) ? "active" : (track.discripancy_closure) ? "completed" : ""}>
                      <ClaimHead>Discrepancy<span>{track.discripancy}</span>
                        {!!(claimDetailsData?.deficiency_upload) &&
                          <BTN size='sm' onClick={() => history.push(`/deficiency-resolution/${randomString()}/${claimId}/${randomString()}/${Number(policyNo) === 2 ? 'GPA' : 'GMC'}`)}>Upload Documents</BTN>}
                      </ClaimHead>
                    </List>
                  </OverlayTrigger>
                  <List status={(false) ? "active" : (track.discripancy_closure) ? "completed" : ""}>
                    <ClaimHead>Discrepancy Closure<span>{track.discripancy_closure}</span></ClaimHead>
                  </List>
                  {(claim_status && Number(Object.keys(claim_status)[0]) === 1) &&
                    ClaimStatusUI(track, 'Claim Rejected', track.claim_rejected_date)
                  }
                  {(claim_status && Number(Object.keys(claim_status)[0]) === 2) &&
                    ClaimStatusUI(track, 'Claim Denied', track.claim_denied_date)
                  }
                  {(claim_status && Number(Object.keys(claim_status)[0]) === 3) &&
                    ClaimStatusUI(track, 'Claim Cancelled', track.claim_cancelled_date)
                  }
                  {[track?.is_claim_rejected, track?.is_claim_denied, track?.is_claim_cancelled].every((item) => item === 0) &&
                    <>
                      <List status={(!track.claim_accepted && track.discripancy_closure && !track.claim_settled) ? "active" : (track.claim_accepted || track.claim_settled) ? "completed" : ""}>
                        <ClaimHead>Claim Accepted<span>{track.claim_accepted}</span></ClaimHead>
                      </List>
                      <List status={(!track.claim_settled && track.claim_accepted) ? "active" : (track.claim_settled ? 'completed' : '')}>
                        <ClaimHead>Claim Settled<span>{(track.claim_settled)}</span></ClaimHead>
                      </List>
                    </>
                  }
                  {/* <List status={(!track.claim_accepted && track.discripancy_closure && !track.claim_settled) ? "active" : (track.claim_accepted || track.claim_settled) ? "completed" : ""}>
                    <ClaimHead>Claim Accepted/Rejected<span>{track.claim_accepted}</span></ClaimHead>
                  </List>
                  <List status={(!track.claim_settled && track.claim_accepted) ? "active" : (track.claim_settled ? 'completed' : '')}>
                    <ClaimHead>Claim Settled/Rejected<span>{DateFormate(track.claim_settled)}</span></ClaimHead>
                  </List> */}
                </ProgessBarStep>
              </ContainerStep>
            </Wrapper>
          </Row>

          <Row className="d-flex flex-wrap" >
            {!!track.employee_name && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Employee Name</Head>
              <Text>{track.employee_name || "-"}</Text>
            </Col>}
            {!!track.email && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Employee Email</Head>
              <Text>{track.email || "-"}</Text>
            </Col>}
            {!!track.mobile_no && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Employee Mobile No</Head>
              <Text>{track.mobile_no || "-"}</Text>
            </Col>}
            {!!track.member_name && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Member Name</Head>
              <Text>{track.member_name || "-"}</Text>
            </Col>}
            {!!track.relation && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Relation</Head>
              <Text>{track.relation || "-"}</Text>
            </Col>}
            {!!track.member_dob && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Date Of Birth</Head>
              <Text>{track.member_dob || "-"}</Text>
            </Col>}
            {!!track.claim_id && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Claim ID</Head>
              <Text>{track.claim_id || "-"}</Text>
            </Col>}
            {!!(track.claim_register && track.claim_register !== true) && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Claim Date</Head>
              <Text>{track.claim_register || "-"}</Text>
            </Col>}
            {!!track.claimed_amount && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Claim Amount</Head>
              <Text>{track.claimed_amount || "-"}</Text>
            </Col>}
            {!!track.Claim_approved_amount && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Claim Approved Amount</Head>
              <Text>{track.Claim_approved_amount || "-"}</Text>
            </Col>}
            {!!track.claim_settled_amount && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Claim Settled Amount</Head>
              <Text>{track.claim_settled_amount || "-"}</Text>
            </Col>}
            {!!track.deduction_amount && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Claim Deduction Amount</Head>
              <Text>{track.deduction_amount || "-"}</Text>
            </Col>}
          </Row>
        </Card>
      }
      {loading && <Loader />}
    </>
  )
}

const ImageCard = styled(Card)`
  background: url("/assets/images/bg-4.png") no-repeat bottom right;
  background-color: #FFFFFF;
`
