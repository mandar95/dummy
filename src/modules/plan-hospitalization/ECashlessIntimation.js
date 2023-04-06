import React, { useEffect, useReducer, useState } from 'react';
import * as yup from 'yup';
import { format } from 'date-fns'
import styled from "styled-components";
import swal from 'sweetalert';

import {
  Card, Select, Error, Loader, Button,
  Input, DatePicker, Head, Text, SelectComponent
} from '../../components';
import { Row, Col } from 'react-bootstrap';
import { AttachFile2 } from "modules/core";
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from 'modules/policies/approve-policy/style';
import Typeahead from 'modules/policies/steps/TypeSelect.js';
import { Title } from '../RFQ/data-upload/style';

import { DiscrepancyModal } from "./discrepancy.modal";

import { DateFormate, numOnly, noSpecial, randomString, serializeError } from '../../utils';
import { useForm, Controller } from "react-hook-form";
import { DataTable } from '../user-management';
import { AlternateHospitalColumn, DiscrepancyRaisedColumn } from './plan-hospitalization.helper';
// import { TextInput } from '../RFQ/plan-configuration/style';
import {
  loadPolicyNo, loadPolicyType, saveClaim,
  loadEmployee, loadMembers, loadAilment, loadHospitals,
  // loadStateCity,
  loadState, loadCity, loadClaimData,
  RecommendHospitals, suggestHospital, updateClaimStatus,
  updateProceedWith, updateTPAClaim, updateDiscrepancy,
  getHealthECard,
  loadBalanceSuminsured,
  // loadEmployers, 
  getFlowDetail
} from './plan-hospitalization.action';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { downloadFile } from 'utils';

import { common_module } from 'config/validations'
import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { ModuleControl } from '../../config/module-control';
const validation = common_module.reimb_cashless_claim


// const TPAStatus = {
//   1: 'Approved',
//   4: 'Rejected',
//   2: 'Pending',
//   3: 'Pending'
// }

export const Status = (status, discrepancy) => {
  if (status === 1) {
    return 'Appointment Confirmed'
  }
  if (status === 4) {
    return 'Appointment Rejected'
  }
  if (discrepancy?.length) {
    if (discrepancy.some(({ status }) => status === 1)) {
      return 'Discrepancy Raised'
    }
    if (discrepancy[discrepancy.length - 1]?.status === 2) {
      return 'Discrepancy Rejected'
    }
  }
  return 'Processing'
}

export const SubStatus = (status, discrepancy, recommendation_id, comment) => {
  if (status === 1) {
    return 'Request Processed by TPA'
  }
  if (status === 2) {
    if (discrepancy?.length) {
      if (discrepancy.some(({ status }) => status === 1) && discrepancy.some(({ created_by }) => created_by === 0)) {
        return 'Discrepancy Raised by TPA'
      }
      if ((discrepancy[discrepancy.length - 1]?.status === 2) && discrepancy.some(({ created_by }) => created_by !== 0)) {
        return 'Discrepancy Rejected by TPA'
      }
    }
    if (comment) {
      return 'Alternate Date Suggested by TPA'
    }
    return 'TPA Approval Pending'
  }
  if (status === 3) {
    if (discrepancy?.length) {
      if (discrepancy.some(({ status }) => status === 1) && discrepancy.some(({ created_by }) => created_by !== 0)) {
        return 'Discrepancy Raised by Employer'
      }
      if ((discrepancy[discrepancy.length - 1]?.status === 2) && discrepancy.some(({ created_by }) => created_by !== 0)) {
        return 'Discrepancy Rejected by Employer'
      }
    }
    if (recommendation_id) {
      return 'Employee Confirmation Pending'
    }
    return 'HR Approval Pending'
  }
  if (status === 4) {
    return 'Appointment Rejected by TPA'
  }
  return 'Processing'
}

const initialState = {
  loading: false,
  employers: [],
  policy_types: [],
  policy_nos: [],
  employees: [],
  members: [],
  hospitals: [],
  ailments: [],
  // state_city: [],
  state: [],
  city: [],
  error: false,
  claimData: {},
  recommend_hospitals: [],
  flow_data: {},
  success: false
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}

const validationSchema = (userType) => yup.object().shape({
  ...(userType === 'broker' && {
    employer_id: yup.object().shape({
      id: yup.string().required('Employer Required'),
    })
  }),
  ...(['broker', 'employer'].includes(userType) && {
    employee_id: yup.object().shape({
      id: yup.string().required('Employee Required'),
    })
  }),
  policy_type: yup.object().shape({
    id: yup.string().required('Policy Type Required'),
  }),
  policy_id: yup.object().shape({
    id: yup.string().required('Policy Name Required'),
  }),
  member_id: yup.object().shape({
    id: yup.string().required('Patient Required'),
  }),
  mobile_no: yup.string()
    .required('Mobile No. is required')
    .min(validation.mobile_no.length, "Mobile No. should be 10 digits")
    .max(validation.mobile_no.length, "Mobile No. should be 10 digits")
    .matches(validation.mobile_no.regex, 'Not valid number'),
  email: yup
    .string()
    .email("must be a valid email")
    .required("Email required")
    .min(validation.email.min, `Minimum ${validation.email.min} character required`)
    .max(validation.email.max, `Maximum ${validation.email.max} character available`),
  doctor_name: yup
    .string()
    // .required("Doctor Name required")
    // .min(validation.doctor.min, `Minimum ${validation.doctor.min} character required`)
    .max(validation.doctor.max, `Maximum ${validation.doctor.max} character available`)
    .matches(validation.doctor.regex, { message: 'Name must contain only alphabets & .(dots)', excludeEmptyString: true })
    .notRequired().nullable(),
  reason: yup.string()
    .required("Reason Required")
    .min(validation.admitted_for.min, `Minimum ${validation.admitted_for.min} character required`)
    .max(validation.admitted_for.max, `Maximum ${validation.admitted_for.max} character available`)
    .matches(validation.admitted_for.regex, 'Must contain only alphabets'),
  state: yup.string().required('State required'),
  city: yup.string().required('City required'),
  hospital_name: yup.string().required("Hospital Name required")
    .min(validation.hospital_name.min, `Minimum ${validation.hospital_name.min} character required`)
    .max(validation.hospital_name.max, `Maximum ${validation.hospital_name.max} character available`),
  admission_date: yup.string().required('Admission date required'),
  // discharge_date: yup.string().required('Discharge date required'),
  // claim_amt: yup.string().required('Claim Amount required'),
})

export function ECashlessIntimation() {
  const dispatchRedux = useDispatch();
  const [modal, setModal] = useState(false);
  // const [selectModal, setSelectModal] = useState(false);
  const [selected, setSelected] = useState(0);
  const [patientDetail, setPatientDetail] = useState({});
  const [isVip, setIsVip] = useState(false);
  const [policyEndDate, setPolicyEndDate] = useState('');
  const location = useLocation();
  const history = useHistory();

  const query = new URLSearchParams(location.search);
  const { userType, claim_request_id_another } = useParams()
  const claim_request_id = query.get("claim_request_id") || claim_request_id_another;
  const { currentUser, userType: userTypeName } = useSelector(state => state.login)
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const [{ loading, employees,
    policy_types,
    policy_nos,
    // employers,
    members,
    hospitals,
    ailments,
    // state_city,
    state,
    city,
    claimData,
    recommend_hospitals,
    flow_data,
    success },
    dispatch
  ] = useReducer(reducer, initialState);
  const { control, errors, handleSubmit, register, watch, setValue, reset } = useForm({
    ...(!claim_request_id && { validationSchema: validationSchema(userType) }),
    mode: "onChange",
    reValidateMode: "onChange"
  });


  const employer_id = watch('employer_id')?.value;
  const policy_id = watch('policy_id')?.value;
  const member_id = watch('member_id')?.value;
  const employee_id = watch('employee_id')?.value;
  const appointment_confirmation = watch('appointment_confirmation');
  const city_name = watch('city');
  const reason = watch('reason');
  const balance_co_buffer_amount = watch('balance_co_buffer_amount');


  const admission_date = watch('admission_date') || '';
  const discharge_date = watch('discharge_date') || '';

  useEffect(() => {

    if (success && userType !== 'tpa') {
      history.replace('e-cashless-intimation-detail')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  // initial load
  useEffect(() => {
    if (userType === 'employee') {
      // loadState(dispatch);
    }

    // if (userType === 'broker') {
    //   loadEmployers(dispatch);
    // }

    if (claim_request_id) {
      loadClaimData(dispatch, { claim_request_id })
    }
    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // if (userType !== 'employee' && !claim_request_id) {
    //   setSelectModal(true);
    // }
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
  // load policy type
  useEffect(() => {
    if (currentUser.employer_id || employer_id) {
      if (['employee', 'employer'].includes(userType)) {
        loadPolicyType(dispatch, { employer_id: currentUser.employer_id || employer_id })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employer_id])

  useEffect(() => {
    if ((currentUser.employee_id || employee_id) && policy_id) {
      loadBalanceSuminsured(setValue, {
        employee_id: currentUser.employee_id || employee_id,
        policy_id
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, policy_id, employee_id])

  // populate & set member data
  useEffect(() => {
    if (member_id || claimData?.member_id) {
      const member = members.find(({ id }) => id === Number(member_id || claimData?.member_id));
      if (member) {
        setValue([
          { relation: member?.relation_name },
          { mobile_no: member?.mobile || '' },
          { email: member?.email },
        ])
        setPatientDetail({
          relation: member?.relation_name,
          mobile_no: member?.mobile || '',
          email: member?.email,
          emp_code: member?.emp_code,
          member_id: member_id || claimData?.member_id,
          policy_id,
          tpa_member_id: member?.tpa_member_id || member_id || claimData?.member_id,
          tpa_member_name: member?.tpa_member_name || member?.name,
          ecard_url: member?.ecard_url
        })
      }
      else setValue([
        { relation: '' },
        { mobile_no: '' },
        { email: '' }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, member_id, claimData])

  // populate & set member data
  useEffect(() => {
    if (policy_id || claimData?.policy_id) {
      getFlowDetail(dispatch, policy_id || claimData?.policy_id);
      loadState(dispatch, { policy_id: policy_id || claimData?.policy_id });
      let policy = policy_nos.find(({ id }) => id === Number(policy_id || claimData?.policy_id));
      if (policy) {
        setValue([
          { insurer_name: policy?.insurer_name },
          { tpa_name: policy?.tpa_name },
          { employer_name: policy?.employer_name },
          // { balance_cover: String(policy?.balance_cover || 0) },
          { employee_name: policy?.employee_name },
          // { total_co_buffer_amount: String(policy?.total_co_buffer_amount || '0') },
          // { balance_co_buffer_amount: String(policy?.balance_co_buffer_amount || '0') }
        ])
        setPolicyEndDate(policy?.end_date)

      }
      else {
        setPolicyEndDate('')
        setValue([
          { insurer_name: '' },
          { tpa_name: '' },
          { employer_name: '' },
          // { balance_cover: '' },
          { employee_name: '' },
          // { total_co_buffer_amount: '0' },
          // { balance_co_buffer_amount: '0' }
        ])
      }
    }
    else {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          state: [],
          city: [],
          loading: false
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_nos, policy_id, claimData])

  // load ailment
  useEffect(() => {
    if (policy_id && ['employee', 'employer', 'broker'].includes(userType)) {
      loadAilment(dispatch, { policy_id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_id])

  // populate state city
  // useEffect(() => {
  //   if (state_city.length) {
  //     dispatch({
  //       type: 'GENERIC_UPDATE', payload: {
  //         state: [{
  //           id: state_city[0].state_name,
  //           name: state_city[0].state_name,
  //           value: state_city[0].state_name
  //         }], city: [{
  //           id: state_city[0].city_name,
  //           name: state_city[0].city_name,
  //           value: state_city[0].city_name
  //         }]
  //       }
  //     });
  //   }
  // }, [state_city])

  useEffect(() => {
    if (reason && city_name) {
      let ailment = ailments.find(({ name }) => name === reason)

      loadHospitals(dispatch, { ...(ailment?.id && { ailment_id: ailment.id }), policy_id, city_name: city_name })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reason, city_name])


  // populate data
  useEffect(() => {
    if (claimData.claim_request_id) {
      // loadPolicyType(dispatch, { employer_id: claimData.employer_id });
      // loadPolicyNo(dispatch, { employer_id: claimData.employer_id, policy_sub_type_id: claimData.policy_sub_type_id });
      // loadEmployee(dispatch, { employer_id: claimData.employer_id, policy_id: claimData.policy_id });
      loadMembers(dispatch, { employee_id: claimData.employee_id, policy_id: claimData.policy_id })
      if (userType === 'employer') {
        RecommendHospitals(dispatch, { claim_request_id }, claimData.city_name)
      }
      // loadCity(dispatch, { state_id: claimData.state_id });
      setSelected(claimData.recommendation_id || 0)
      reset({
        ...claimData,
        policy_type: claimData.policy_sub_type_id,
        admission_date: DateFormate(claimData.planned_date || '', { dateFormate: true }) || '',
        discharge_date: DateFormate(claimData.discharge_date || '', { dateFormate: true }) || '',
        state: claimData.state_id,
        city: claimData.city_id,
        amount_from_buffer: claimData.amount_from_buffer || '0',
        total_co_buffer_amount: claimData?.total_co_buffer_amount || '0',
        balance_co_buffer_amount: claimData?.balance_co_buffer_amount || '0'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimData])

  // is VIP
  useEffect(() => {
    if (employee_id && employees.length) {
      setIsVip(!!employees.find(({ id }) => Number(employee_id) === id)?.is_vip || false);
    } else {
      setIsVip(false)
    }
  }, [employee_id, employees])

  // suggest
  // useEffect(() => {
  //   if (selected && selected !== claimData.recommendation_id) {
  //     suggestHospital(dispatch, { claim_request_id, recommendation_id: selected })
  //     // no status message
  //     // updateClaimStatus(dispatch, { status: 2, claim_request_id })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selected])

  const onSubmit = (data) => {
    if (!claim_request_id) {
      const memberData = members.find(
        (member) => member.id === Number(member_id)
      );
      const formData = new FormData();
      formData.append('city_name', data.city)
      formData.append('state_name', data.state)

      formData.append('doctor_prescription', data.doctor_prescription[0])
      formData.append('id_proof', data.id_proof[0])

      formData.append('planned_date', data.admission_date)
      data.discharge_date && formData.append('discharge_date', data.discharge_date)
      data.doctor_name && formData.append('doctor_name', data.doctor_name)
      formData.append('email', data.email)
      formData.append('hospital_name', data.hospital_name)
      formData.append('member_id', data.member_id?.value)
      formData.append('mobile_no', data.mobile_no)
      formData.append('policy_id', data.policy_id?.value)
      formData.append('reason', data.reason)
      formData.append('relation', data.relation)
      formData.append('tpa_member_id', memberData.tpa_member_id || data.member_id?.value)
      formData.append('tpa_member_name', memberData.tpa_member_name || memberData.name)
      formData.append('tpa_emp_id', memberData.tpa_emp_id || employee_id || currentUser.employee_id)

      formData.append('claim_type', 'e-cashless')

      const sendToTPA = (flow_data.employee_validation_by_employer === 0 ||
        ((userType === 'employee' ? currentUser.is_vip : isVip) && flow_data.employee_validation_by_employer === 2));

      formData.append('status', sendToTPA ? 2 : 3)
      saveClaim(dispatch, formData, sendToTPA)

      return null
    }
    else {

      // stop if discrepancy is raised
      if (claimData.claim_deficiency?.length) {

        const employer_raised_descrepancy = claimData.claim_deficiency.filter(({ created_by }) => created_by) || [];
        const tpa_raised_descrepancy = claimData.claim_deficiency.filter(({ created_by }) => !created_by) || [];

        if (claimData?.status === 2 &&
          (tpa_raised_descrepancy.some(({ status }) => status === 1) ||
            tpa_raised_descrepancy[tpa_raised_descrepancy.length - 1]?.status === 2)) {
          return swal('Validation', 'Discrepancy is not resolved', 'warning');
        }

        if (claimData?.status === 3 &&
          (employer_raised_descrepancy.some(({ status }) => status === 1) ||
            employer_raised_descrepancy[employer_raised_descrepancy.length - 1]?.status === 2)) {
          return swal('Validation', 'Discrepancy is not resolved', 'warning');
        }

      }


      if (userType === 'employer') {
        if (Number(data.amount_from_buffer) > Number(balance_co_buffer_amount)) {
          swal('Validation', 'Use Corporate Buffer should be less than Balance Corporate Buffer', 'warning')
          return null
        }
        if (claimData.status === 3 && claimData.recommendation_id && !data.selection_type) {
          updateProceedWith(dispatch, {
            has_gone_with_recommendation: 1,
            hospital_name: claimData.recommendation_data.hospital_name,
            hospital_city: claimData.recommendation_data.hospital_city,
            hospital_state: claimData.recommendation_data.hospital_state,
            // hospital_id: claimData.recommendation_data.hospital_id,
            amount_from_buffer: data.amount_from_buffer,
            path: `tpa/${randomString()}/e-cashless-intimation/${claim_request_id}/${randomString()}`,
            claim_request_id
          }, true)
          updateClaimStatus(dispatch, { status: 2, claim_request_id });
          return null
        } else if (claimData.status === 3 && !selected) {
          updateProceedWith(dispatch, {
            // has_gone_with_recommendation: 1,
            // hospital_name: claimData.recommendation_data.hospital_name,
            // hospital_id: claimData.recommendation_data.hospital_id,
            amount_from_buffer: data.amount_from_buffer,
            path: `tpa/${randomString()}/e-cashless-intimation/${claim_request_id}/${randomString()}`,
            claim_request_id
          }, true)
          updateClaimStatus(dispatch, { status: 2, claim_request_id });
          return null
        } else if (claimData.status === 3) {
          updateProceedWith(dispatch, {
            // has_gone_with_recommendation: 1,
            // hospital_name: claimData.recommendation_data.hospital_name,
            // hospital_id: claimData.recommendation_data.hospital_id,
            amount_from_buffer: data.amount_from_buffer,
            claim_request_id
          }, true)
          suggestHospital(dispatch, { claim_request_id, recommendation_id: selected, member_id: member_id || claimData?.member_id });
          return null
        } else if (claimData.status === 2 && claimData.comment && data.admission_date) {
          updateProceedWith(dispatch, {
            planned_date: data.admission_date,
            ...(data.discharge_date && { discharge_date: data.discharge_date }),
            path: `tpa/${randomString()}/e-cashless-intimation/${claim_request_id}/${randomString()}`,
            claim_request_id
          })
          return null
        }
        return null
      }
      if (userType === 'employee' || userType === 'broker') {

        if (claimData.status === 3 && claimData.recommendation_id && !data.selection_type) {
          updateProceedWith(dispatch, {
            has_gone_with_recommendation: 1,
            hospital_name: claimData.recommendation_data.hospital_name,
            hospital_city: claimData.recommendation_data.hospital_city,
            hospital_state: claimData.recommendation_data.hospital_state,
            // hospital_id: claimData.recommendation_data.hospital_id,
            path: `tpa/${randomString()}/e-cashless-intimation/${claim_request_id}/${randomString()}`,
            claim_request_id
          }, true)
          updateClaimStatus(dispatch, { status: 2, claim_request_id });
          return null
        }
        else if (claimData.status === 3 && claimData.recommendation_id && data.selection_type) {
          // swal('Success', 'Updated', 'success').then(() => {
          updateProceedWith(dispatch, {
            // planned_date: data.admission_date,
            // ...(data.discharge_date && { discharge_date: data.discharge_date }),
            path: `tpa/${randomString()}/e-cashless-intimation/${claim_request_id}/${randomString()}`,
            claim_request_id
          }, true)
          updateClaimStatus(dispatch, { status: 2, claim_request_id });
          // });

        }
        if (claimData.status === 2 && claimData.comment && data.admission_date) {
          updateProceedWith(dispatch, {
            planned_date: data.admission_date,
            ...(data.discharge_date && { discharge_date: data.discharge_date }),
            path: `tpa/${randomString()}/e-cashless-intimation/${claim_request_id}/${randomString()}`,
            claim_request_id
          })
        }
        return null
      }
      if (userType === 'tpa') {
        if (claimData.status === 2) {
          const formData = new FormData();
          formData.append('claim_request_id', claim_request_id);
          data.comment && formData.append('comment', data.comment);
          data.tpa_intimate_no && formData.append('tpa_intimate_no', data.tpa_intimate_no);
          data.tpa_document[0] && formData.append('tpa_document', data.tpa_document[0]);

          updateTPAClaim(dispatch, formData, !appointment_confirmation, claim_request_id)
          !appointment_confirmation && updateClaimStatus(dispatch, { status: 1, claim_request_id, member_id: member_id || claimData?.member_id });
        }
        return null
      }
    }
  }

  const SuggestedHospitalTable = ((userType === 'employer' && !claimData?.recommendation_id) ? recommend_hospitals.length : claimData.recommendation_data) ?
    <>
      <Row>
        <Col md={12} lg={12} xl={12} sm={12}>
          <Title className="mt-3 mb-0" fontSize="1.2rem">Recommended Hospital</Title>
          <hr className="mb-5" />
        </Col>
      </Row>
      <DataTable
        columns={AlternateHospitalColumn({ selected, setSelected }, userType === 'employer' && !claimData?.recommendation_id) || []}
        data={((userType === 'employer' && !claimData?.recommendation_id) ?
          recommend_hospitals : [{ ...claimData.recommendation_data, city_name: claimData.recommendation_data.hospital_city }]) || []}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10, 20]}
        rowStyle
      />
      <br />

    </>
    : null;
  // <Title className="mt-3 mb-5" fontSize="1rem">Cannot find recommendation</Title>

  const ProceedWith = (
    <TextCard className="pl-3 pr-3 mb-4 mt-5" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
      <Title className="mb-0" color='#585858' fontSize="1.1rem">Proceed with</Title><br />
      <div className='d-flex flex-wrap'>
        <CustomCheck>
          <label className="custom-control-label-check  container-check">
            <span >{`${userType === 'employee' ? 'Self' : 'Employee'} Selection`}</span>
            <Controller
              as={
                <input
                  name={'selection_type'}
                  type="radio"
                  defaultChecked={false}
                />
              }
              name={'selection_type'}
              onChange={([e]) => e.target.checked ? 1 : 0}
              control={control}
              value={1}
            />
            <span className="checkmark-check"></span>
          </label>
        </CustomCheck>
        <CustomCheck className="custom-control-checkbox">
          <label className="custom-control-label-check  container-check">
            <span >{'HR Recommended Hospital'}</span>
            <Controller
              as={
                <input
                  name={'selection_type'}
                  type="radio"
                  defaultChecked={true}
                  value={0}
                />
              }
              name={'selection_type'}
              onChange={([e]) => e.target.checked ? 0 : 1}
              control={control}
            />
            <span className="checkmark-check"></span>
          </label>
        </CustomCheck>

      </div>
    </TextCard>
  )

  const AppointmentConfirmation = (
    <TextCard className="pl-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
      <Title className="mb-0" color='#585858' fontSize="1.1rem">Appointment Confirmation</Title><br />
      <div className='d-flex flex-wrap'>
        <CustomCheck className="custom-control-checkbox">
          <label className="custom-control-label-check  container-check">
            <span >{'Yes'}</span>
            <Controller
              as={
                <input
                  name={'appointment_confirmation'}
                  type="radio"
                  defaultChecked={true}
                />
              }
              name={'appointment_confirmation'}
              onChange={([e]) => e.target.checked ? 0 : 1}
              control={control}
              value={0}
            />
            <span className="checkmark-check"></span>
          </label>
        </CustomCheck>
        <CustomCheck>
          <label className="custom-control-label-check  container-check">
            <span >{'No'}</span>
            <Controller
              as={
                <input
                  name={'appointment_confirmation'}
                  type="radio"
                  defaultChecked={false}
                />
              }
              name={'appointment_confirmation'}
              onChange={([e]) => e.target.checked ? 1 : 0}
              control={control}
              value={1}
            />
            <span className="checkmark-check"></span>
          </label>
        </CustomCheck>

        <Col md={12} lg={7} xl={6} sm={12} style={{ marginTop: '-16px' }}>
          <Controller
            as={
              <Input
                label="Comment"
                placeholder="Enter Comment"
                required={appointment_confirmation}
                maxLength={200}
                error={errors && errors.comment}
                labelProps={{ background: '#f8f8f8' }}
              />
            }
            control={control}
            name="comment"
          />
          {!!errors.comment && <Error>
            {errors.comment.message}
          </Error>}
        </Col>

        <Col md={6} lg={4} xl={3} sm={12} style={{ marginTop: '-16px' }}>
          <Controller
            as={
              <Input
                label="Claim ID"
                placeholder="Enter Claim ID"
                required={!appointment_confirmation}
                maxLength={200}
                disabled={claimData?.tpa_intimate_no}
                error={errors && errors.tpa_intimate_no}
                labelProps={{ background: claimData?.tpa_intimate_no ? 'linear-gradient(#f8f8f8, #dadada)' : '#f8f8f8' }}
              />
            }
            control={control}
            name="tpa_intimate_no"
          />
          {!!errors.tpa_intimate_no && <Error>
            {errors.tpa_intimate_no.message}
          </Error>}
        </Col>
        {/* <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <Input
                label="Alternate Date 1"
                required
                type='date'
                error={errors && errors.alternate_date_1}
              />
            }
            control={control}
            name="alternate_date_1"
          />
          {!!errors.alternate_date_1 && <Error>
            {errors.alternate_date_1.message}
          </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <Input
                label="Alternate Date 2"
                required
                type='date'
                error={errors && errors.alternate_date_2}
              />
            }
            control={control}
            name="alternate_date_2"
          />
          {!!errors.alternate_date_2 && <Error>
            {errors.alternate_date_2.message}
          </Error>}
        </Col> */}
      </div>
    </TextCard>
  )

  const AlternativeHospitalDate = (
    <TextCard className="pl-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
      <Title className="mb-0" color='#585858' fontSize="1.1rem">On selected date hospital slot is not available, please select another date</Title><br />
      <br />
      <Title className="mb-0" color='#585858' fontSize="0.9rem">{claimData.comment}</Title><br />

      <br />
      <Col xs={12} sm={12} md={6} lg={4} xl={3}>
        <Controller
          as={
            <DatePicker
              name={'admission_date'}
              minDate={new Date()}
              maxDate={new Date(policyEndDate ? policyEndDate : '2200-01-01')}
              label={'Alternate Admission Date'}
              required={false}
              isRequired
              error={errors && errors.admission_date}
              labelProps={{ background: 'linear-gradient(#f8f8f8, #ffffff)' }}
            />
          }
          onChange={([selected]) => {
            const selectedDate = format(selected, 'dd-MM-yyyy')
            if (selectedDate > discharge_date) {
              setValue('discharge_date', '')
            }
            return selected ? selectedDate : '';
          }}
          name="admission_date"
          control={control}
        />
        {!!errors.admission_date && <Error>
          {errors.admission_date.message}
        </Error>}
      </Col>
      <Col xs={12} sm={12} md={6} lg={4} xl={3}>
        <Controller
          as={
            <DatePicker
              minDate={new Date(DateFormate(admission_date || '', { dateFormate: true }))}
              maxDate={new Date(policyEndDate ? policyEndDate : '2200-01-01')}
              name={'discharge_date'}
              label={'Alternate Discharge Date'}
              required={false}
              // isRequired
              error={errors && errors.discharge_date}
              labelProps={{ background: 'linear-gradient(#f8f8f8, #ffffff)' }}
            />
          }
          onChange={([selected]) => {
            return selected ? format(selected, 'dd-MM-yyyy') : '';
          }}
          name="discharge_date"
          control={control}
        />
        {!!errors.discharge_date && <Error>
          {errors.discharge_date.message}
        </Error>}
      </Col>
      {/* <div className='d-flex flex-wrap'>
        {['17-06-2021', '20-06-2021'].map((item, id) => <CustomCheck className="custom-control-checkbox">
          <label className="custom-control-label-check  container-check">
            <span >{item}</span>
            <Controller
              as={
                <input
                  name={'alternate_hosp_date'}
                  type="radio"
                  defaultChecked={id === 0}
                />
              }
              value={item}
              name={'alternate_hosp_date'}
              onChange={([e]) => e.target.checked ? 1 : 0}
              control={control}
              defaultValue={item}
            />
            <span className="checkmark-check"></span>
          </label>
        </CustomCheck>)}
      </div> */}
    </TextCard>
  )

  const DiscrepancyRaised = (<>
    <Row className="d-flex flex-wrap">
      <Col md={12} lg={12} xl={12} sm={12}>
        <Title className="mt-3 mb-0" fontSize="1.2rem">Discrepancy Raised</Title>
        <hr className="mb-5" />
      </Col>
    </Row>

    <DataTable
      columns={DiscrepancyRaisedColumn(
        claimData?.claim_deficiency?.some(({ other_document }) => other_document),  // show document
        ['employer', 'tpa'].includes(userType) &&
        ((claimData?.status === 2 && userType === 'tpa') || (claimData?.status === 3 && userType === 'employer')), // show action
        { userType, setModal }, // responsePackage
        { updateDiscrepancy, dispatch, claim_request_id, setModal, member_id: member_id || claimData?.member_id } // actionPackage
      ) || []}
      data={(claimData?.claim_deficiency?.map(elem => ({ ...elem, created_at: DateFormate(elem.created_at) })) || []).reverse()}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10, 20]}
      rowStyle
    />

    {/* <Table bordered className="text-center" style={style.Table} responsive>
      <thead >
        <tr style={style.HeadRow}>
          <th style={style.TableHead} scope="col">Discrepancy Comment </th>
          <th style={style.TableHead} scope="col">Response</th>
          {claimData?.claim_deficiency
            ?.some(({ other_document }) => other_document) && <th>
              Document
            </th>}
          <th style={style.TableHead} scope="col">Status</th>
          {['employer', 'tpa'].includes(userType) &&
            ((claimData?.status === 2 && userType === 'tpa') ||
              (claimData?.status === 3 && userType === 'employer')) &&
            <th style={style.TableHead} scope="col">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {claimData?.claim_deficiency
          ?.map(({ id, remark, response, status, other_document }, index) =>
            <tr key={index + 'kdjnd'}>
              <td style={style.td}>
                {remark}
              </td>
              <td style={style.td}>
                {(response || userType !== 'employee') ? response || '-' :
                  <Btn size='sm' type='button' onClick={() => setModal({
                    id, remark, response
                  })}>
                    Reply
                  </Btn>
                }

              </td>
              {claimData?.claim_deficiency
                ?.some(({ other_document }) => other_document) && <td style={style.td}>
                  {other_document ? <span
                    role='button'
                    onClick={() => downloadFile(other_document, false, true)}>
                    <i className="ti ti-download"></i>
                  </span > : '-'}
                </td>}
              <td style={style.td}>
                <Btn size='sm' variant={status === 0 ? 'success' : (status === 1 ? (response ? 'secondary' : 'primary') : 'danger')} type='button' disabled>
                  {status === 0 ? 'Resolved' : (status === 1 ? (response ? 'Resubmitted' : 'Open') : 'Rejected')}
                </Btn>
              </td>
              {['employer', 'tpa'].includes(userType) &&
                ((claimData?.status === 2 && userType === 'tpa') ||
                  (claimData?.status === 3 && userType === 'employer')) && <td style={style.td}>
                  {(response) ? (status !== 1 ?
                    <Btn size='sm' variant='secondary' type='button' disabled>
                      {status === 0 ? 'Closed' : 'Rejected'}
                    </Btn> :
                    <>
                      <ButtonGroup key={`${index}-operations`} size="sm">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              <strong>Resolved</strong>
                            </Tooltip>
                          }>
                          <Btn className="strong" variant="outline-info" onClick={() => updateDiscrepancy(dispatch, { type: 3, claim_request_id, log_id: id })}><i className="ti-check" /></Btn>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              <strong>Reject</strong>
                            </Tooltip>
                          }>
                          <Btn className="strong" variant="outline-danger"
                            onClick={() => setModal({
                              id, remark, response,
                              type: 4
                            })}
                          ><i className="ti-close" /></Btn>
                        </OverlayTrigger>
                      </ButtonGroup>
                    </>
                  ) : '-'}
                </td>}
            </tr>
          )}
      </tbody>
    </Table> */}
  </>)

  const AmountFromBuffer = (
    <Row className="w-100 d-flex flex-wrap">
      <Col md={12} lg={12} xl={12} sm={12}>
        <Title className="mt-3 mb-0" fontSize="1.2rem">Corporate Buffer Detail</Title>
        <hr className="mb-5" />
      </Col>
      <Col md={12} lg={6} xl={3} sm={12}>
        <Controller
          as={
            <Input
              label="Corporate Buffer"
              placeholder="Corporate Buffer"
            />
          }
          name="total_co_buffer_amount"
          disabled
          required={false}
          isRequired
          labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
          control={control}
          defaultValue={'0'}
        />
      </Col>
      <Col md={12} lg={6} xl={3} sm={12}>
        <Controller
          as={
            <Input
              label="Balance Corporate Buffer"
              placeholder="Balance Corporate Buffer"
            />
          }
          name="balance_co_buffer_amount"
          disabled
          required={false}
          isRequired
          labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
          control={control}
          defaultValue={'0'}
        />
      </Col>
      <Col md={12} lg={6} xl={3} sm={12}>
        <Controller
          as={
            <Input
              label="Use Corporate Buffer For This Request"
              type='tel'
              onKeyDown={numOnly} onKeyPress={noSpecial}
              placeholder="Balance Sum Insured"
            />
          }
          name="amount_from_buffer"
          disabled={((claimData?.amount_from_buffer || claimData?.amount_from_buffer === 0) &&
            claimData?.status !== 3) || userType !== 'employer' || balance_co_buffer_amount === '0'}
          required={true}
          // isRequired
          maxLength={(String(balance_co_buffer_amount || '')).length || 9}
          labelProps={{
            background:
              !(((claimData?.amount_from_buffer || claimData?.amount_from_buffer === 0) &&
                claimData?.status !== 3) || userType !== 'employer' || balance_co_buffer_amount === '0')
                ? null : 'linear-gradient(#ffffff, #dadada)'
          }}
          control={control}
          defaultValue={'0'}
        />
      </Col>
    </Row>)

  const downloadHealthCard = () => {
    if (!member_id && !claimData?.member_id) {
      swal("Alert", 'Select Patient to download E-card', 'info');
    } else {
      if (patientDetail.ecard_url) {
        downloadFile(patientDetail.ecard_url, null, true)
      } else if (patientDetail.emp_code &&
        patientDetail.member_id &&
        patientDetail.policy_id &&
        patientDetail.tpa_member_id) {
        getHealthECard(dispatch, {
          employeeCode: patientDetail.emp_code,
          member_id: patientDetail.member_id,
          policy_id: patientDetail.policy_id,
          tpa_member_id: patientDetail.tpa_member_id,
          tpa_member_name: patientDetail.tpa_member_name
        })
      } else {
        swal("Alert", ModuleControl.isHowden ? 'E-cards would be available post issuance of the policy' :'E-card not available', 'info');
      }

    }

  }

  const ViewData = (<Row className="d-flex flex-wrap" >
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Policy Type</Head>
      <Text>{claimData.policy_sub_type_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Policy Name</Head>
      <Text>{claimData.policy_no || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Insurer Name</Head>
      <Text>{claimData.insurer_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>TPA</Head>
      <Text>{claimData.tpa_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Employer Name</Head>
      <Text>{claimData.employer_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Balance Sum Insured</Head>
      <Text>{claimData.balance_cover || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Employee Name</Head>
      <Text>{claimData.employee_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Patient Name</Head>
      <Text>{claimData.patient_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Relation With Employee</Head>
      <Text>{patientDetail.relation || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Mobile Number</Head>
      <Text>{patientDetail.mobile_no || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Email Id</Head>
      <Text>{patientDetail.email || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Ailment</Head>
      <Text>{claimData.reason || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Hospital State</Head>
      <Text>{claimData.state_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Hospital City</Head>
      <Text>{claimData.city_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Hospital Name</Head>
      <Text>{claimData.hospital_name || "-"}</Text>
    </Col>
    {!!claimData.doctor_name && <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Doctor Name</Head>
      <Text>{claimData.doctor_name || "-"}</Text>
    </Col>}
    {/* <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Claim Amount Estimated</Head>
      <Text>{claimData.policy_number || "-"}</Text>
    </Col> */}
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Planned Admission Date</Head>
      <Text>{DateFormate(claimData.planned_date) || "-"}</Text>
    </Col>
    {!!claimData.discharge_date && <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Planned Discharge Date</Head>
      <Text>{DateFormate(claimData.discharge_date) || "-"}</Text>
    </Col>}
    {/* <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Policy Type</Head>
      <Text>{claimData.policy_number || "-"}</Text>
    </Col> */}
  </Row>)

  return ((claimData?.id && claim_request_id) || !claim_request_id) && (
    <Card title='Planned Hospitalization E-Cashless Intimation'>
      <TopDiv>
        <Tags>
          Request ID {!!claim_request_id && ': '}{!!claim_request_id && <span>{claim_request_id}</span>}
        </Tags>
        {/* <div> */}
        <Tags>
          Claim ID {!!claimData?.tpa_intimate_no && ': '}{!!claimData?.tpa_intimate_no && <span>{claimData.tpa_intimate_no}</span>}
        </Tags>
        {/* {userType === 'tpa' && <Tags>
            Claim Status : <span>{TPAStatus[claimData?.status]}</span>
          </Tags>} */}
        {/* </div> */}
      </TopDiv>
      {!!claim_request_id && ViewData}
      <form onSubmit={handleSubmit(onSubmit)}>
        {!claim_request_id &&
          <Row className="d-flex flex-wrap">

            {['broker'].includes(userType) && <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired
                    options={employers?.map((item) => ({
                      id: item.id,
                      name: item.name,
                      label: item.name,
                      value: item.id
                    })) || []}
                    error={errors && errors.employer_id?.id}
                  />
                }
                onChange={([selected]) => {
                  loadPolicyType(dispatch, { employer_id: selected?.value });
                  setValue('policy_type', '');
                  return selected;
                }}
                control={control}
                name="employer_id"
              />
              {!!errors.employer_id?.id && <Error>
                {errors.employer_id?.id.message}
              </Error>}
            </Col>}

            {!!(currentUser.is_super_hr && currentUser.child_entities.length) && <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired
                    options={currentUser.child_entities.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                    error={errors && errors.employer_id?.id}
                  />
                }
                defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                onChange={([selected]) => {
                  loadPolicyType(dispatch, { employer_id: selected?.value });
                  setValue('policy_type', '');
                  return selected;
                }}
                control={control}
                name="employer_id"
              />
              {!!errors.employer_id?.id && <Error>
                {errors.employer_id?.id.message}
              </Error>}
            </Col>}

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Type"
                    placeholder="Select Policy Type"
                    required={false}
                    isRequired
                    options={policy_types}
                    error={errors && errors.policy_type?.id}
                  />
                }
                onChange={([selected]) => {
                  loadPolicyNo(dispatch, {
                    user_type_name: userTypeName,
                    employer_id: employer_id || currentUser.employer_id,
                    policy_sub_type_id: selected?.value
                  }, true)
                  return selected;
                }}
                control={control}
                name="policy_type"
              />
              {!!errors.policy_type?.id && <Error>
                {errors.policy_type?.id.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Name"
                    placeholder="Select Policy Name"
                    required={false}
                    isRequired
                    options={policy_nos}
                    error={errors && errors.policy_id?.id}
                  />
                }
                onChange={([selected]) => {
                  userType !== 'employee' ?
                    loadEmployee(dispatch, { employer_id: employer_id || currentUser.employer_id, policy_id: selected?.value }) :
                    loadMembers(dispatch, { employee_id: employee_id || currentUser.employee_id, policy_id: selected?.value });
                  return selected;
                }}
                control={control}
                name="policy_id"
              />
              {!!errors.policy_id?.id && <Error>
                {errors.policy_id?.id.message}
              </Error>}
            </Col>

            {/* {!!claim_request_id && <> */}
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Insurer Name"
                    placeholder="Insurer Name"
                  />
                }
                name="insurer_name"
                disabled
                required={false}
                isRequired
                labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                control={control}
              />
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="TPA"
                    placeholder="TPA"
                  />
                }
                name="tpa_name"
                disabled
                required={false}
                isRequired
                labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                control={control}
              />
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Employer Name"
                    placeholder="Employer Name"
                  />
                }
                name="employer_name"
                disabled
                required={false}
                isRequired
                labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                control={control}
              />
            </Col>
            {userType === 'employee' && <>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Employee Name"
                      placeholder="Employee Name"
                    />
                  }
                  name="employee_name"
                  disabled
                  required={false}
                  isRequired
                  labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Balance Sum Insured"
                      placeholder="Balance Sum Insured"
                    />
                  }
                  name="balance_cover"
                  disabled
                  required={false}
                  isRequired
                  labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                  control={control}
                />
              </Col>
            </>}
            {/* </>} */}


            {['employer', 'broker'].includes(userType) && <> <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employee Name : Code"
                    placeholder="Select Employee Name"
                    required={false}
                    isRequired
                    options={employees}
                    error={errors && errors.employee_id?.id}
                  />
                }
                onChange={([selected]) => {
                  loadMembers(dispatch, { employee_id: selected?.value, policy_id: policy_id })
                  return selected;
                }}
                control={control}
                name="employee_id"
              />
              {!!errors.employee_id?.id && <Error>
                {errors.employee_id?.id.message}
              </Error>}
            </Col>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Balance Sum Insured"
                      placeholder="Balance Sum Insured"
                    />
                  }
                  name="balance_cover"
                  disabled
                  required={false}
                  isRequired
                  labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                  control={control}
                />
              </Col>
            </>}

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Patient Name"
                    placeholder="Select Patient Name"
                    required={false}
                    isRequired
                    options={members}
                    error={errors && errors.member_id?.id}
                  />
                }
                control={control}
                name="member_id"
              />
              {!!errors.member_id?.id && <Error>
                {errors.member_id?.id.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Relation With Employee"
                    placeholder="Relation With Employee"
                  />
                }
                name="relation"
                disabled
                isRequired
                labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                error={errors && errors.relation}
                control={control}
              />
              {!!errors.relation && <Error>{errors.relation.message}</Error>}
            </Col>

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Mobile Number"
                    type='tel'
                    placeholder="Enter Mobile Number"
                    required={false}
                    isRequired
                    maxLength={validation.mobile_no.length}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                    error={errors && errors.mobile_no}
                  />
                }
                control={control}
                name="mobile_no"
              />
              {!!errors.mobile_no && <Error>
                {errors.mobile_no.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Email Id"
                    placeholder="Enter Email Id"
                    required={false}
                    isRequired
                    type='email'
                    maxLength={validation.email.max}
                    error={errors && errors.email}
                  />
                }
                control={control}
                name="email"
              />
              {!!errors.email && <Error>
                {errors.email.message}
              </Error>}
            </Col>


            <Col md={6} lg={4} xl={3} sm={12}>
              {/* <Controller
            as={
              <Input
                label="Ailment"
                placeholder="Enter Reason for Hospitalization"
                required={false}
                isRequired
                maxLength={40}
                error={errors && errors.reason}
              />
            }
            control={control}
            name="reason"
          />*/}
              <Controller
                as={
                  <Typeahead
                    label={"Ailment"}
                    id="ailment"
                    maxLength={200}
                    valueName="name"
                    options={ailments || []}
                    placeholder={"Ailment"}
                    isRequired={true}
                    required={true}
                    prefix={'Add Ailment Name:'}
                  />
                }
                defaultValue={claimData?.reason ? claimData?.reason : ""}
                onChange={([data]) => {
                  // setValue([{ hospital_name: '' }, { state: '' }, { city: '' }])
                  // loadState(dispatch)

                  return data?.name || '';
                }}
                error={errors && errors.reason}
                name="reason"
                control={control}
              />
              {!!errors.reason && <Error>
                {errors.reason.message}
              </Error>}
            </Col>

            {/* <Controller
            as={
              <Input
                label="Hospital Name"
                placeholder="Enter Hospital Name"
                required={false}
                isRequired
                maxLength={40}
                error={errors && errors.hospital_name}
              />
            }
            control={control}
            name="hospital_name"
          /> */}

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Select
                    label="Hospital State"
                    placeholder="Select Hospital State"
                    required={false}
                    isRequired
                    options={state}
                    error={errors && errors.state}
                  />
                }
                onChange={([selected]) => {
                  loadCity(dispatch, { state_name: selected.target.value, policy_id })
                  return selected;
                }}
                control={control}
                name="state"
              />
              {!!errors.state && <Error>
                {errors.state.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Select
                    label="Hospital City"
                    placeholder="Select Hospital City"
                    required={false}
                    isRequired
                    options={city || []}
                    error={errors && errors.city}
                  />
                }
                onChange={([selected]) => {

                  return selected;
                }}
                control={control}
                name="city"
              />
              {!!errors.city && <Error>
                {errors.city.message}
              </Error>}
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Typeahead
                    label={"Hospital Name"}
                    id="hopitalName"
                    maxLength={200}
                    valueName="name"
                    options={hospitals || []}
                    placeholder={"Hospital Name"}
                    isRequired={true}
                    required={true}
                  />
                }
                defaultValue={claimData?.hospital_name ? claimData?.hospital_name : ""}
                // defaultValue={""}
                onChange={([data]) => {
                  // props.setHospitalData(data);
                  // if (data?.id) {
                  // loadStateCity(dispatch, { policy_id, hospital_id: data?.id })
                  // } 
                  return data?.name || "";
                }}
                error={errors && errors.hospital_name}
                name="hospital_name"
                control={control}
              />
              {!!errors.hospital_name && <Error>
                {errors.hospital_name.message}
              </Error>}
            </Col>


            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Doctor Name"
                    placeholder="Enter Doctor Name"
                    required={false}
                    // isRequired
                    maxLength={validation.doctor.max}
                    error={errors && errors.doctor_name}
                  />
                }
                control={control}
                name="doctor_name"
              />
              {!!errors.doctor_name && <Error>
                {errors.doctor_name.message}
              </Error>}
            </Col>
            {/* <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <Input
                label="Claim Amount Estimated"
                type='tel'
                placeholder="Enter Claim Amount Estimated"
                required={false}
                isRequired
                onKeyDown={numOnly} onKeyPress={noSpecial}
                maxLength={10}
                error={errors && errors.claim_amt}
              />
            }
            control={control}
            name="claim_amt"
          />
          {!!errors.claim_amt && <Error>
            {errors.claim_amt.message}
          </Error>}
        </Col> */}

            <Col xs={12} sm={12} md={6} lg={4} xl={3}>
              <Controller
                as={
                  <DatePicker
                    minDate={new Date()}
                    maxDate={new Date(discharge_date ? DateFormate(discharge_date, { dateFormate: true }) : (policyEndDate || '2200-01-01'))}
                    name={'admission_date'}
                    label={'Planned Admission Date'}
                    required={false}
                    isRequired
                    error={errors && errors.admission_date}
                  />
                }
                onChange={([selected]) => {
                  const selectedDate = format(selected, 'dd-MM-yyyy')
                  if (selectedDate > discharge_date) {
                    setValue('discharge_date', '')
                  }
                  return selected ? selectedDate : '';
                }}
                name="admission_date"
                control={control}
              />
              {!!errors.admission_date && <Error>
                {errors.admission_date.message}
              </Error>}
            </Col>
            <Col xs={12} sm={12} md={6} lg={4} xl={3}>
              <Controller
                as={
                  <DatePicker
                    minDate={new Date(DateFormate(admission_date || format(new Date(), 'dd-MM-yyyy'), { dateFormate: true })) || new Date()}
                    maxDate={new Date(policyEndDate ? policyEndDate : '2200-01-01')}
                    name={'discharge_date'}
                    label={'Planned Discharge Date'}
                    required={false}
                    // isRequired
                    error={errors && errors.discharge_date}
                  />
                }
                onChange={([selected]) => {
                  return selected ? format(selected, 'dd-MM-yyyy') : '';
                }}
                name="discharge_date"
                control={control}
              />
              {!!errors.discharge_date && <Error>
                {errors.discharge_date.message}
              </Error>}
            </Col>
          </Row>
        }

        {/* health e-card */}
        <Row className="d-flex flex-wrap">
          <Col md={12} lg={12} xl={12} sm={12}>
            <Title className="mt-3 mb-0" fontSize="1.2rem">E-Card</Title>
            <hr className="mb-4" />
          </Col>

          <Col md={12} lg={5} xl={4} sm={12} className="h-50 mb-3">
            <img src="/assets/images/e-cash.png" alt="healthCard" width='auto' style={{ cursor: 'pointer' }}
              height='50px' onClick={downloadHealthCard} /> <span className='ml-2'>E-Card</span>
            {/* <Button buttonStyle="outline" type='button' onClick={downloadHealthCard}>
              Health E-Card Document <i className="ti-download" />
            </Button> */}
          </Col>

        </Row>


        {/* other documents */}
        <Row className="d-flex flex-wrap">
          <Col md={12} lg={12} xl={12} sm={12}>
            <Title className="mt-3 mb-0" fontSize="1.2rem">Document Upload</Title>
            <hr className="mb-4" />
          </Col>
          {!claim_request_id ? <>

            {/* <Col md={12} lg={6} xl={4} sm={12} className='mt-3'>
            <AttachFile2
              fileRegister={register}
              name={'health_ecard'}
              title={'Health E-Card'}
              key="file"
              required
              accept={".png,.jpeg,.jpg"}
              description="File Formats: (.png .jpeg .jpg)"
              nameBox
            />
          </Col> */}
            <Col md={12} lg={6} xl={4} sm={12} className='mt-3'>
              <AttachFile2
                fileRegister={register}
                name={'id_proof'}
                title={'ID Proof'}
                key="file"
                required
                accept={".png,.jpeg,.jpg,.pdf"}
                description="File Formats: (.png .jpeg .jpg .pdf)"
                nameBox
              />
            </Col>
            <Col md={12} lg={6} xl={4} sm={12} className='mt-3'>
              <AttachFile2
                fileRegister={register}
                name={'doctor_prescription'}
                title={"Doctor's Prescription"}
                key="file"
                required
                accept={".png,.jpeg,.jpg,.pdf"}
                description="File Formats: (.png .jpeg .jpg .pdf)"
                nameBox
              />
            </Col>
          </> : <>

            {/* <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
              <Head>Health E-Card</Head>
              <Button buttonStyle="outline" type='button'>
                Health E-Card Document <i className="ti-download" />
              </Button>
            </Col> */}
            <Col md={12} lg={5} xl={4} sm={12} className="h-50 mb-3">
              <img src="/assets/images/e-cash.png" alt="healthCard" width='auto' style={{ cursor: 'pointer' }}
                height='50px' onClick={() => claimData.media[1] && downloadFile(claimData.media[1], false, true)} /> <span className='ml-2'>ID Proof</span>
              {/* <Head>ID Proof</Head>
              <Button buttonStyle="outline" type='button' onClick={() => downloadFile(claimData.media[1], false, true)}>
                ID Proof Document <i className="ti-download" />
              </Button> */}
            </Col>
            <Col md={12} lg={5} xl={4} sm={12} className="h-50 mb-3">
              <img src="/assets/images/e-cash.png" alt="healthCard" width='auto' style={{ cursor: 'pointer' }}
                height='50px' onClick={() => claimData.media[0] && downloadFile(claimData.media[0], false, true)} /> <span className='ml-2'>Doctor's Prescription</span>
              {/* <Head>Doctor's Prescription</Head>
              <Button buttonStyle="outline" type='button' onClick={() => downloadFile(claimData.media[0], false, true)}>
                Doctor's Prescription Document <i className="ti-download" />
              </Button> */}
            </Col>
          </>}
          {['tpa'].includes(userType) && claimData.status === 2 && !claimData?.media?.[2] && <Col md={12} lg={6} xl={4} sm={12} className='mt-3'>
            <AttachFile2
              fileRegister={register}
              name={'tpa_document'}
              title={"Appointment Confirmation Document"}
              key="file"
              accept={".png,.jpeg,.jpg,.pdf"}
              description="File Formats: (.png .jpeg .jpg .pdf)"
              required={!appointment_confirmation}
              nameBox
            />
          </Col>}
          {claimData?.media?.[2] &&
            <Col md={12} lg={5} xl={4} sm={12} className="h-50 mb-3">
              <img src="/assets/images/e-cash.png" alt="healthCard" width='auto' style={{ cursor: 'pointer' }}
                height='50px' onClick={() => claimData.media[2] && downloadFile(claimData.media[2], false, true)} /> <span className='ml-2'>Appointment Confirmation Document</span>
            </Col>
          }

        </Row>


        {['tpa'].includes(userType) && AppointmentConfirmation}

        {['employee', 'employer', 'broker'].includes(userType) && !!claim_request_id && claimData.status === 2 && !!claimData.comment && AlternativeHospitalDate}

        {['employer', 'tpa', 'employee', 'broker'].includes(userType) && !!claimData.claim_deficiency?.length && DiscrepancyRaised}

        {['employee', 'employer', 'broker'].includes(userType) && claimData.status === 3 && !!claim_request_id && SuggestedHospitalTable}

        {['employee', 'employer', 'broker'].includes(userType) && !!claim_request_id && claimData.status === 3 && !!claimData.recommendation_data && ProceedWith}

        {['tpa', 'employer', 'broker'].includes(userType) && !!claimData?.status && AmountFromBuffer}

        <Row className="d-flex flex-wrap w-100 m-0 mt-5">
          {!!claim_request_id && <Col md={12} lg={12} xl={12} sm={12} className='mb-4 p-0 d-flex flex-wrap'>
            <Tags fontSize='13.6px' className='mr-2'>
              Status : <span>{Status(claimData?.status, claimData?.claim_deficiency)}</span>
            </Tags>
            <Tags fontSize='13.6px'>
              Sub Status : <span>{SubStatus(claimData?.status, claimData?.claim_deficiency, claimData.recommendation_id, claimData.comment)}</span>
            </Tags>
            {/* <Head>Status</Head>
            <Text>{Status(claimData?.status, claimData?.claim_deficiency)}</Text> */}
          </Col>}
          {/* <Col md={6} lg={3} xl={3} sm={12} className='mb-4'> */}
          {/* <Head>Sub Status</Head>
            <Text>{SubStatus(claimData?.status, claimData?.claim_deficiency, claimData.recommendation_id, claimData.comment)}</Text> */}
          {/* </Col> */}


          <Col md={12} lg={12} xl={12} sm={12} className={"d-flex flex-wrap p-0 " + ((['employer', 'tpa'].includes(userType) && claimData?.status) ? 'justify-content-between' : 'justify-content-end')}>
            {/* {['employer', 'tpa'].includes(userType) && <Button className='mt-2' buttonStyle="warning" type="button" onClick={() => setModal(true)}>
              Raise Discrepancy
            </Button>} */}
            {userType === 'employer' && claimData?.status === 3
              && <Button className='mt-2' buttonStyle="warning" type="button" onClick={() => setModal(true)}>
                Raise Discrepancy
              </Button>
            }
            {userType === 'tpa' && claimData?.status === 2
              && <Button className='mt-2' buttonStyle="warning" type="button" onClick={() => setModal(true)}>
                Raise Discrepancy
              </Button>
            }
            {/* {<Button className='mt-2' buttonStyle="warning" type="button">
              Suggest Hospital
            </Button>} */}
            {/* {['tpa'].includes(userType) && <Button className='mt-2' buttonStyle="danger" type="button" onClick={() => updateClaimStatus(dispatch, { status: 4, claim_request_id })}>
              Reject
            </Button>} */}

            {['employee', 'broker'].includes(userType) && (!claimData?.status || (claimData.status === 3 && claimData.recommendation_id) || (claimData.status === 2 && claimData.comment)) &&
              <Button type='submit' className='mt-2'>
                Submit
              </Button>}

            {userType === 'employer' && (!claimData?.status || claimData.status === 3 || (claimData.status === 2 && claimData.comment)) &&
              <Button type='submit' className='mt-2'>
                Submit
              </Button>}

            {userType === 'tpa' && (claimData.status === 2) &&
              <Button type='submit' className='mt-2'>
                Submit
              </Button>}

          </Col>

        </Row>
      </form>
      {
        !!modal && (
          <DiscrepancyModal
            dispatch={dispatch}
            claim_request_id={claim_request_id}
            show={!!modal}
            onHide={() => setModal(null)}
            Data={modal}
            member_id={member_id || claimData?.member_id}
            userType={userType}
          />
        )
      }
      {/* {!!selectModal &&
        <DiscrepancyModal
          control={control}
          // dispatch={dispatch}
          // claim_request_id={claim_request_id}
          show={!!selectModal}
          onHide={() => setSelectModal(null)}
          // Data={selectModal}
          userType={userType}
        />
      } */}
      {loading && <Loader />}
    </Card >
  )
}

// const style = {

//   Table: { border: "solid 1px #e6e6e6", background: "#00000000" },
//   HeadRow: { background: "#353535", color: "#FFFFFF" },
//   TableHead: {
//     minWidth: "120px",
//   },
//   td: {
//     verticalAlign: 'middle',
//     color: "#666666",
//     backgroundColor: '#f8f8f8'
//   }
// }

export const Tags = styled.div`
border: 1px dashed #2400ff;
border-radius: 10px;
background-color: #fffbde;
color: #3b00a5;
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || "13px"} + ${theme.fontSize - 92}%)` : (fontSize || "13px")};

padding: 2px 9px 1px;
margin: 3px 3px;
/* cursor: pointer; */
width: max-content;
white-space: pre-wrap;
span {
  color: #ff5f5f;
}`

const TopDiv = styled.div`
  margin: -23px -6px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`
