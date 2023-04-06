import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Button as Btn, Table, Button } from 'react-bootstrap';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { format, addDays, subMonths } from 'date-fns';
import {
  validateTopup, clear_check_topup,
  getEmployerUserForContactDetails,
  checkEmployerInstallment,
  loadTopPoliciesByBase
} from '../policy-config.slice';
import swal from 'sweetalert';

import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { Input, Checkbox, Select, Error, Marker, Typography, Chip } from 'components';
import { BenefitList } from './additional-details/styles';
import { Switch } from "../../user-management/AssignRole/switch/switch"
import { clearData, loadChildCompanys, selectUsersData } from '../../user-management/user.slice';
import { CustomCheck } from '../approve-policy/style';
import { useParams } from 'react-router';
import { TextInput } from '../../RFQ/plan-configuration/style';
import { TableDiv } from './premium-details/styles';
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import { checkEmployerCdStatement } from '../approve-policy/approve-policy.slice';
import { SelectComponent } from '../../../components';
import { EmployeeEligibleOptions, ShowInEmployeeTab } from '../helper';
import { ModuleControl } from '../../../config/module-control';


const Wrapper = styled.div`
`;

const style = { zoom: '0.9' }

const Title = styled.div`
  margin-bottom: 3rem;
  h4 {
    color: ${({ theme }) => theme.dark ? '#ffffff' : '#000000'};
    text-align: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(19px + ${fontSize - 92}%)` : '19px'};
    
    letter-spacing: 1px;
    z-index: 1;
    span {
      height: 15px;
      width: 15px;
      background-color: #f2c9fb;
      border-radius: 50%;
      display: inline-block;
      margin-bottom: 5px;
      margin-right: -9px;
      opacity: 0.7;
    }
  }
`;

const FormWrapper = styled.div`

`;

const Units = [
  { id: 1, name: "Days", value: 1 },
  { id: 2, name: "Month", value: 2 },
  { id: 3, name: "Year", value: 3 },
]

const BasicDetails = ({ configs, savedConfig, broker_id, formId, onSave, moveNext, renewal }) => {
  const dispatch = useDispatch();
  const { enquiry_id } = useParams();
  const [create, setCreate] = useState(true);
  const [subPolicyTypes, setSubPolicyTypes] = useState([]);
  const [policyType, setPolicyType] = useState(savedConfig?.policy_type || '');
  const [employer, setEmployer] = useState(savedConfig?.employer?.value || '');
  const [policy_sub_type, setPolicy_sub_type] = useState(savedConfig?.policy_sub_type || '');
  const [showEnrollmentDates, setShowEnrollmentDates] = useState(savedConfig?.enrollement_status || false);
  // const [allowAfterEndDate, setAllowAfterEndDate] = useState(savedConfig?.allowed_after_end_date || false);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(savedConfig?.employer_child || []);
  const [startDate, setStartDate] = useState(savedConfig?.policy_start_date || "")
  const [endDate, setEndDate] = useState(savedConfig?.policy_end_date || "")
  const [topupPoliciesMappedWithBase, setTopupPoliciesMappedWithBase] = useState([])
  const policyConfigState = useSelector(state => state.policyConfig);
  const { check_topup, masterPolicy, brokerBranches = [] } = policyConfigState
  const userData = useSelector(selectUsersData);

  const [isLockin, setLockIn] = useState(false);
  const [isSILockin, setSILockIn] = useState(false);
  const [enrolmentType, setEnrolmentType] = useState(savedConfig?.enrollement_type ? Number(savedConfig?.enrollement_type) : '');
  const [co_insurer_array, set_co_insurer] = useState(savedConfig?.co_insurer_array || []);


  const noGMPolicy = [2, 3, 5, 6].includes(Number(policy_sub_type));

  const validationSchema = yup.object().shape({
    policy_no: yup.string()
      .matches(/^[a-zA-Z0-9-/\s]+$/, {
        message: 'Alphanumeric characters, hyphen(-) & frontslash(/) only',
        excludeEmptyString: true,
      })
      .required('Policy No required'),
    policy_name: yup.string().required('Policy Name required'),
    policy_type: yup.string().required('Policy Type required'),
    policy_sub_type: yup.string().required('Policy Sub Type required'),
    display_in_benefit_summary: yup.string().required('Required'),
    insurer: yup.string().required('Insurer required'),
    ...(!noGMPolicy && { tpa: yup.string().required('TPA required') }),
    employer: yup.object().shape({
      id: yup.string().required('Company Name Required'),
    }),
    broker_commission: yup.string().matches(/^(?:100(?:\.00?)?|\d?\d(?:\.\d\d?)?)$/, { message: 'Only number within 0-100 (upto 2 decimal)', excludeEmptyString: true })
      .notRequired().nullable(true),
    co_oprate_buffer: yup.string().matches(/^[0-9]+$/, { message: 'Only number', excludeEmptyString: true }).min(0, 'Min limit 0').max(8, 'Max limit 99999999')
      .notRequired().nullable(true),
    policy_start_date: yup.string().required('Policy Start Date required'),
    policy_end_date: yup.string().required('Policy End Date required'),
    ...(showEnrollmentDates && {
      enrollement_start_date: yup.string().required('Enrolment Start Date required'),
      enrollement_end_date: yup.string().required('Enrolment End Date required'),
    }),
    ...((masterPolicy?.length && Number(policy_sub_type) > 3 && Number(policyType) === 2) && {
      ...false ?
        { topup_master_policy_id: yup.string().required('Master Group Policy required') } :
        {
          topup_master_policy_ids: yup.array().of(
            yup.object().shape({
              policy_id: yup.string().required("Required").nullable(),
            }))
        }
    }),
    ...enrolmentType !== 3 && { enrollement_days: yup.number('Only number').typeError('Enrolment Allowed Days (Mid Term) required').min(1).max(999).required('Enrolment Allowed Days (Mid Term) required').label('Enrolment Allowed Days (Mid Term)') },
    enrollement_type: yup.string().required('Enrolment Considered From (Mid Term) required'),
    ...(isLockin && {
      member_addition_lock_in: yup.number('Only number').typeError('Member addtion lock in value required').required('Member addtion lock in value required'),
      member_addition_lock_in_unit: yup.string().nullable().required('Member Addtion lock in unit required'),
      member_removal_lock_in: yup.number('Only number').typeError('Member removal lock in value required').required('Member removal lock in value required'),
      member_removal_lock_in_unit: yup.string().nullable().required('Member Removal lock in unit required'),
      member_addition_lock_in_type: yup.string().nullable().required('Member addition lock in type required'),
      member_removal_lock_in_type: yup.string().nullable().required('Member removal lock in type required'),
    }),
    ...((isSILockin && Number(policyType) === 2) && {
      suminsured_lock_in: yup.number('Only number').typeError('Sum insured lock in value required').required('Sum insured lock in value required'),
      suminsured_lock_in_unit: yup.string().nullable().required('Sum insured lock in unit required'),
    }),
    enrollment_window_close_mail_effective_date: yup.string()
      .notRequired().nullable(true),
    description: yup.string()
      // .required('Policy Name Required')
      .notRequired().nullable(true)
      .max(2000, `Maximum ${2000} character available`)
  });
  const { control, errors, handleSubmit, watch, setValue, register } = useForm({
    defaultValues: (savedConfig && {
      ...savedConfig,
      broker_commission: savedConfig?.broker_commission || '0',
      co_oprate_buffer: savedConfig?.co_oprate_buffer || '0'
    }) || {},
    validationSchema
    // resolver: yupResolver(validationSchema)
  });

  //-----topup_master_policy_ids------
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'topup_master_policy_ids'
  });

  const onAddCount = () => {
    if (fields?.length === 5) {
      return swal('Validation', 'Limit reached', 'info')
    }
    append({ policy_id: ''/* , is_primary: false  */ });
  }

  const onSubCount = (id) => {
    if (fields?.length === 1) {
      return
    }
    loadTopPoliciesByBase(fields.filter((_, index) => index !== id));
    remove(id);
  }
  // -----end--------


  const isLockIN = watch('has_lock_in');
  const branch = Number(watch('branch'));
  const isSILockIN = watch('has_suminsured_lock_in');
  const policyDescription = watch('description') || '';
  const tpa = Number(watch('tpa')) || '';
  const insurer = Number(watch('insurer')) || '';
  const topup_master_policy_ids = watch('topup_master_policy_ids') || [];
  const topup_compulsion_flag = watch('topup_compulsion_flag');

  useEffect(() => {
    setValue('co_insurer', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insurer])

  useEffect(() => {
    if (isLockIN) {
      setLockIn(true)
    }
    else {
      setLockIn(false)
    }
  }, [isLockIN])

  useEffect(() => {
    if (isSILockIN) {
      setSILockIn(true)
    }
    else {
      setSILockIn(false)
    }
  }, [isSILockIN])

  useEffect(() => {
    if (savedConfig?.topup_master_policy_ids?.length) {
      loadTopPoliciesByBase(savedConfig?.topup_master_policy_ids, setTopupPoliciesMappedWithBase)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig?.topup_master_policy_ids])

  // validate topup
  useEffect(() => {
    if (employer && (Number(policy_sub_type) > 3) && Number(policyType) === 2) {
      dispatch(validateTopup({
        employer: employer,
        policy_sub_type: policy_sub_type,
        ...(broker_id && { broker_id: broker_id })
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer, policy_sub_type, policyType]);



  useEffect(() => {

    if (check_topup) {
      swal("Alert", check_topup || "", "info");
      setPolicyType('');
      setEmployer('');
      setPolicy_sub_type('');
      setValue([
        { policy_type: '' },
        { policy_sub_type: '' },
        { employer: '' }
      ])
    }

    return () => { dispatch(clear_check_topup()); }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [check_topup]);

  useEffect(() => {
    if (savedConfig?.policy_type) {
      setSubPolicyType(savedConfig.policy_type);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig?.policy_type]);

  useEffect(() => {
    const { stepSaved, validEmployerPolicy } = policyConfigState;
    if (stepSaved && stepSaved === formId) {
      moveNext();
    }

    if (validEmployerPolicy) {
      setCreate(prev => validEmployerPolicy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyConfigState]);

  useEffect(() => {
    if (employer) {
      dispatch(loadChildCompanys({ employer_id: employer }));
      dispatch(getEmployerUserForContactDetails(employer));
      dispatch(checkEmployerInstallment({ employer_id: employer }));
      let employer_id = employer
      const employerObj = configs.companys.find(({ id }) => id === Number(employer))
      if (configs.companys.some(({ child_companies }) => child_companies.some(({ name }) => name === employerObj.name))) {
        employer_id = configs.companys.find(({ child_companies }) => child_companies.some(({ name }) => name === employerObj.name))?.id
      }

      dispatch(checkEmployerCdStatement({ employer_id: employer_id }));
    }
    else {
      dispatch(clearData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer])

  useEffect(() => {

    if (userData && userData.data?.length) {
      setMembers(userData.data?.filter(({ id }) => !selectedMembers.some(({ id: otherId }) => otherId === id)))
    }
    else {
      setMembers([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMembers, userData])

  useEffect(() => {
    if (masterPolicy?.length && Number(policyType) === 2 && !fields.length) {
      append({ policy_id: ''/* , is_primary: false */ });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterPolicy, policyType])


  // useEffect(() => {
  //   if (isLockIN)
  // }, [isLockIN])

  const setSubPolicyType = (policyType) => {
    setPolicyType(policyType)
    if (policyType) {
      const options = configs.policy_sub_types
        // eslint-disable-next-line eqeqeq
        .filter(item => String(item.master_policy_id) == policyType)
        .map(item => ({
          id: item.id,
          name: item.name,
          value: item.id
        }));
      setSubPolicyTypes(prevOptions => options);
    } else {
      return null;
    }
  };

  const onSubmit = data => {

    let policy_sDate = new Date(data.policy_start_date);
    let policy_eDate = new Date(data.policy_end_date);

    let enrollment_sDate = new Date(data.enrollement_start_date);
    let enrollment_eDate = new Date(data.enrollement_end_date);

    const policy_sDate_minus6Month = subMonths(policy_sDate, 6)

    if (policy_sDate > policy_eDate) {
      swal("Alert", "Please ensure that the policy End Date is greater than or equal to the policy Start Date.", "warning");
      return false;
    }

    if (enrollment_eDate < policy_sDate_minus6Month || // enrolment end date is before (policy start date - 6 month)
      enrollment_sDate < policy_sDate_minus6Month ||// enrolment start date is before (policy start date - 6 month)
      enrollment_eDate > policy_eDate || // enrolment end date is after policy end date
      enrollment_sDate > policy_eDate // enrolment start date is after policy end date
    ) {
      swal('Validation', `Enrolment window date should be between ${format(policy_sDate_minus6Month, 'dd-MM-yyyy')} and policy end date.`, "warning");
      return false;
    }

    if (enrollment_eDate < enrollment_sDate) {// enrolment end date is before enrolment start date
      swal('Validation', `Enrolment end date should be after enrolment start date.`, "warning");
      return false;
    }

    // Close Mail Effective Date should be after the enrolment end date or(if enrolment date not found) policy start date & policy end date
    if (data.enrollment_window_close_mail_effective) {

      const initial_date = enrollment_eDate || policy_sDate;
      if (initial_date.setHours(0, 0, 0, 0) > new Date(data.enrollment_window_close_mail_effective).setHours(0, 0, 0, 0) ||
        policy_eDate.setHours(0, 0, 0, 0) < new Date(data.enrollment_window_close_mail_effective).setHours(0, 0, 0, 0)) {
        swal('Validation', `Close Mail Effective Date should be between ${enrollment_eDate ? 'Enrolment End' : 'Policy Start'} Date & Policy End Date.`, "warning");
        return
      }
    }

    if (create) {
      data.enrollement_status = data.enrollement_status ? 1 : 0;
      data.enrollement_start_date = data.enrollement_status ? data.enrollement_start_date : ''
      data.enrollement_end_date = data.enrollement_status ? data.enrollement_end_date : ''

      if (!(masterPolicy?.length && Number(policy_sub_type) > 3 && Number(policyType) === 2)) {
        data.topup_master_policy_ids = [];
      }
      // if (false) {
      //   data.topup_master_policy_id = masterPolicy?.length && Number(policy_sub_type) > 3 && Number(policyType) === 2
      //     ? data.topup_master_policy_id : '';
      // }
      if (Number(policyType) === 1 || (Number(policy_sub_type) > 3 && Number(policyType) === 2 && +topup_compulsion_flag !== 3)) {
        data.top_up_policy_ids = null;
        data.employee_eligibility = 0;
      }
      data = {
        ...data,
        // employer:d ata?.employer?.id,
        employer_child: selectedMembers,
        ...{
          member_addition_lock_in: Number(data.member_addition_lock_in),
          member_addition_lock_in_unit: Number(data.member_addition_lock_in_unit),
          member_removal_lock_in: Number(data.member_removal_lock_in),
          member_removal_lock_in_unit: Number(data.member_removal_lock_in_unit),
          member_addition_lock_in_type: Number(data.member_addition_lock_in_type),
          member_removal_lock_in_type: Number(data.member_removal_lock_in_type),
        },

        has_suminsured_lock_in: data.has_suminsured_lock_in || 0,
        suminsured_lock_in: Number(data.suminsured_lock_in) || 0,
        suminsured_lock_in_unit: Number(data.suminsured_lock_in_unit) || 0,
        co_insurer_array
      }

      data.enrollement_days = Number(data.enrollement_type) !== 3 ? data.enrollement_days : 0;
      data.has_lock_in = 0
      // for ICICI TPA
      data.icici_imid_number = (!!tpa && IsIciciTPA(tpa, configs.tpa)) ? data.icici_imid_number : ''
      data.icici_cdbg_number = (!!tpa && IsIciciTPA(tpa, configs.tpa)) ? data.icici_cdbg_number : ''
      data.icici_customer_id = (!!tpa && IsIciciTPA(tpa, configs.tpa)) ? data.icici_customer_id : ''

      if (onSave) onSave({ formId, data });
    }
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  const addPolicyType = () => {
    if (branch && Number(branch)) {
      const flag = userData.data?.find(
        (value) => value?.id === Number(branch)
      );
      const flag2 = selectedMembers.some((value) => value?.id === Number(branch));
      if (flag && !flag2) {
        setSelectedMembers((prev) => [...prev, flag]);
        setValue('branch', '')
      }
    }
  };

  const removePolicyType = (Branch) => {
    const filteredPolicyType = selectedMembers?.filter((item) => item?.id !== Branch);
    setSelectedMembers([...filteredPolicyType]);
  };


  // co insurer
  const co_insurer = watch('co_insurer');
  const co_insurer_per = watch('co_insurer_per');

  const onAddCoInsurer = () => {
    if (Number(co_insurer.id) && Number(co_insurer_per)) {
      const totalPercentage = co_insurer_array.reduce((total, { percentage }) => total + +percentage, 0) + +co_insurer_per;
      if (totalPercentage > 99) {
        swal('Valdation', 'Sum Percentage of Co-Insurer should not exceed 99%')
        return null
      }
      let flag = false;
      if (co_insurer_array.length)
        flag = co_insurer_array.some((elem) => elem.id === co_insurer.id)
      if (!flag) {
        set_co_insurer(prev => [...prev, { id: co_insurer.id, name: co_insurer.label, percentage: co_insurer_per }]);
        setValue('co_insurer', '');
        setValue('co_insurer_per', '');
      } else {
        swal('Already Exist', 'Similar Insurer Added')
      }
    }
    else {
      swal('Validation', "Co-Insurer & It's Percentage Requried")
    }
  }

  const removeCoInsurer = obj => {
    const filteredObj = co_insurer_array.filter(item => +item.id !== +obj);
    set_co_insurer([...filteredObj]);
    setValue('co_insurer', '');
    setValue('co_insurer_per', '');
  }

  return (
    (configs && configs.policy_types && configs.policy_types.length > 0)
      ? <Wrapper>
        <Title>
          <h4>
            <span className="dot-xd"></span>
            Basic Policy Details
          </h4>
        </Title>
        <FormWrapper>
          <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <Marker />
            <Typography>{'\u00A0'} Basic Details</Typography>
            <Row>
              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Policy No"
                      placeholder="Enter Policy #"
                      required
                      maxLength={40}
                      error={errors && errors.policy_no}
                    />
                  }
                  control={control}
                  name="policy_no"
                />
                {!!errors.policy_no && <Error>
                  {errors.policy_no.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Policy Name"
                      placeholder="Enter Policy Name"
                      required
                      maxLength={40}
                      error={errors && errors.policy_name}
                    />
                  }
                  control={control}
                  name="policy_name"
                />
                {!!errors.policy_name && <Error>
                  {errors.policy_name.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Policy Type"
                      placeholder="Select Policy Type"
                      required
                      options={configs.policy_types.map(item => (
                        {
                          id: item.id,
                          name: item.name,
                          value: item.id
                        }
                      ))}
                      error={errors && errors.policy_type}
                    />
                  }
                  onChange={([selected]) => {
                    setSubPolicyType(selected.target.value);
                    return selected;
                  }}
                  control={control}
                  name="policy_type"
                />
                {!!errors.policy_type && <Error>
                  {errors.policy_type.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Policy SubType"
                      placeholder="Select Policy SubType"
                      required
                      options={subPolicyTypes}
                      error={errors && errors.policy_sub_type}
                    />
                  }
                  onChange={([selected]) => {
                    setPolicy_sub_type(selected.target.value);
                    return selected;
                  }}
                  control={control}
                  name="policy_sub_type"
                />
                {!!errors.policy_sub_type && <Error>
                  {errors.policy_sub_type.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Insurer"
                      placeholder="Select Insurer"
                      required
                      options={
                        configs.insurers.filter(({ id }) => !co_insurer_array.some(item => item.id === id)).map(item => ({
                          id: item.id,
                          name: item.name,
                          value: item.id
                        }))
                      }
                      error={errors && errors.insurer}
                    />
                  }
                  control={control}
                  name="insurer"
                />
                {!!errors.insurer && <Error>
                  {errors.insurer.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="TPA"
                      placeholder="Select TPA"
                      required={!noGMPolicy}
                      options={
                        configs.tpa.map(item => ({
                          id: item.id,
                          name: item.name,
                          value: item.id
                        }))
                      }
                      error={errors && errors.tpa}
                    />
                  }
                  rules={{ required: !noGMPolicy }}
                  control={control}
                  name="tpa"
                />
                {!!errors.tpa && <Error>
                  {errors.tpa.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Policy Start Date"
                      placeholder="dd-mm-yyyy"
                      type="date"
                      required
                      error={errors && errors.policy_start_date}
                    />
                  }
                  onChange={([e]) => {
                    setStartDate(e.target.value);
                    const oneYear = formatDate(addDays(new Date(e.target.value), 364));
                    setValue(
                      'policy_end_date', oneYear
                    )
                    setEndDate(oneYear);
                    return e
                  }}
                  min={'1980-01-01'}
                  max={'2999-12-31'}
                  control={control}
                  name="policy_start_date"
                  rules={{ required: true }}
                />
                {!!errors.policy_start_date && <Error>
                  {errors.policy_start_date.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Policy End Date"
                      placeholder="dd-mm-yyyy"
                      type="date"
                      required
                      error={errors && errors.policy_end_date}
                    />
                  }
                  defaultValue
                  onChange={([e]) => { setEndDate(e.target.value); return e }}
                  min={formatDate(addDays(new Date(startDate), 1))}
                  max={'2999-12-31'}
                  control={control}
                  name="policy_end_date"
                  rules={{ required: true }}
                />
                {!!errors.policy_end_date && <Error>
                  {errors.policy_end_date.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Employee Tab View"
                      placeholder="Select Options"
                      required
                      options={ShowInEmployeeTab}
                      error={errors && errors.display_in_benefit_summary}
                    />
                  }
                  defaultValue={'0'}
                  control={control}
                  name="display_in_benefit_summary"
                />
                {!!errors.display_in_benefit_summary && <Error>
                  {errors.display_in_benefit_summary.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Broker %"
                      placeholder="Enter Broker %"
                      type="number"
                      min={0}
                      max={100}
                      required={false}
                      error={errors && errors.broker_commission}
                    />
                  }
                  control={control}
                  name="broker_commission"
                />
                {!!errors.broker_commission && <Error>
                  {errors.broker_commission.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Corporate Buffer ₹"
                      placeholder="Enter Corporate Buffer"
                      type="number"
                      min={0}
                      max={99999999}
                      required={false}
                      error={errors && errors.co_oprate_buffer}
                    />
                  }
                  control={control}
                  name="co_oprate_buffer"
                />
                {!!errors.co_oprate_buffer && <Error>
                  {errors.co_oprate_buffer.message}
                </Error>}
              </Col>

              {!!brokerBranches.length && <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Broker Branch Name"
                      placeholder="Select Broker Branch Name"
                      isClearable
                      options={
                        brokerBranches.map(item => ({
                          id: item.id,
                          label: item.branch_name,
                          value: item.id
                        }))
                      }
                    />
                  }
                  control={control}
                  name="broker_branch_id"
                />
              </Col>}

              {!!tpa && IsIciciTPA(tpa, configs.tpa) && <>
                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="IM ID"
                        placeholder="Enter IM ID"
                        required={false}
                        maxLength={40}
                      // error={errors && errors.policy_name}
                      />
                    }
                    control={control}
                    name="icici_imid_number"
                  />
                  {/* {!!errors.policy_name && <Error>
                    {errors.policy_name.message}
                  </Error>} */}
                </Col>
                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="CDBG Number"
                        placeholder="Enter CDBG Number"
                        required={false}
                        maxLength={40}
                      // error={errors && errors.policy_name}
                      />
                    }
                    control={control}
                    name="icici_cdbg_number"
                  />
                  {/* {!!errors.policy_name && <Error>
                    {errors.policy_name.message}
                  </Error>} */}
                </Col>
                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Customer ID"
                        placeholder="Enter Customer ID"
                        required={false}
                        maxLength={40}
                      // error={errors && errors.policy_name}
                      />
                    }
                    control={control}
                    name="icici_customer_id"
                  />
                  {/* {!!errors.policy_name && <Error>
                    {errors.policy_name.message}
                  </Error>} */}
                </Col>
              </>}
              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={<Switch />}
                  name="show_gst_flag"
                  control={control}
                  defaultValue={1}
                  label={'GST Applicable'}
                />
              </Col>
              {ModuleControl.CustomRelease/* Base + Topup */ &&
                Number(policyType) === 2 &&
                <Col Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={<Switch />}
                    name="sum_with_base_policy"
                    control={control}
                    defaultValue={0}
                    label={'Sum with Base Policy'}
                  />
                </Col>}
            </Row>
            {ModuleControl.inDevelopment/* CoInsurer */ && <Row>
              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Co-Insurer"
                      placeholder="Select Co-Insurer"
                      required
                      options={
                        configs.insurers.filter(({ id }) => insurer !== id).map(item => ({
                          id: item.id,
                          label: item.name,
                          value: item.id
                        }))
                      }
                      error={errors && errors.co_insurer}
                    />
                  }
                  control={control}
                  name="co_insurer"
                />
                {!!errors.co_insurer && <Error>
                  {errors.co_insurer.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={<Input
                    label="Co-Insurer %"
                    placeholder="Enter Co-Insurer %"
                    type="number"
                    min={0}
                    max={99}
                  />}
                  error={errors && errors.co_insurer_per}
                  name={'co_insurer_per'}
                  control={control}
                />
                {!!errors.co_insurer_per && <Error>
                  {errors.co_insurer_per.message}
                </Error>}
              </Col>
              <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
                <Button type="button" onClick={onAddCoInsurer}>
                  <i className="ti ti-plus"></i> Add
                </Button>
              </Col>
              {
                <>
                  <Col md={12} lg={12} xl={12} sm={12}>
                    {co_insurer_array.length
                      ? <BenefitList>
                        {co_insurer_array.map((item, index) =>
                          <Chip
                            key={index + 'co_insurer'}
                            id={item.id}
                            name={<>
                              {item.name} : {item.percentage}%
                            </>}
                            onDelete={removeCoInsurer} />)}
                      </BenefitList>
                      : null}
                  </Col>
                </>
              }
            </Row>}
            <Row className='mt-3 mb-3'>
              <Col md={12} lg={10} xl={12} sm={12}>
                <div style={
                  {
                    position: 'absolute',
                    right: '15px',
                    top: '-20px',
                    background: '#e2e2e2',
                    padding: '0px 5px',
                    borderRadius: '3px'
                  }
                }>
                  {`${policyDescription.length} / 2000`}
                </div>
                <Controller
                  as={<TextInput
                    maxLength={2000}
                    className='form-control'
                    placeholder='Enter Content Here...'
                  />}
                  name='description'
                  control={control}
                  error={errors && errors.description}
                />
                <label className='form-label'>
                  <span className='span-label'>Policy Description</span>
                </label>
                {!!errors.description && <Error top='0'>
                  {errors.description.message}
                </Error>}
              </Col>
            </Row>

            <br />
            <Marker />
            <Typography>{'\u00A0'} Company Details</Typography>
            <Row>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Company Name"
                      placeholder="Select Company Name"
                      required
                      options={
                        configs.companys.map(item => ({
                          id: item.id,
                          label: item.name,
                          value: item.id
                        }))
                      }
                      error={errors && errors.employer}
                      disabled={renewal || !!enquiry_id}
                    />
                  }
                  onChange={([selected]) => {
                    setEmployer(selected.value);
                    dispatch(clearData())
                    setSelectedMembers([])
                    return selected;
                  }}
                  rules={{ required: true }}
                  control={control}
                  name="employer"
                />
                {!!errors.employer && <Error>
                  {errors.employer.message}
                </Error>}
              </Col>

              {(!!masterPolicy?.length && Number(policyType) === 2) &&
                <>
                  <Col xl={12} lg={12} md={12} sm={12}></Col>
                  <TableDiv className='col col-xl-8 col-lg-10 col-md-12 col-sm-12'>
                    <Table
                      className="text-center rounded text-nowrap"
                      style={{ border: "solid 1px #e6e6e6" }}
                      responsive
                    >
                      <thead>
                        <tr>
                          <th style={style} className="align-top">
                            Master Group Policy
                          </th>
                          {/* <th style={style} className="align-top">
                            Is Primary Policy
                          </th> */}
                          {fields.length !== 1 && <th style={style} className="align-top">
                            Remove
                          </th>}
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => <tr key={field.id + 'tr'}>
                          <td className=''>
                            <Controller
                              as={
                                <Select
                                  label={"Master Group Policy No" + (index === 0 ? ' (Primary)' : '')}
                                  placeholder="Select Master Group Policy Id"
                                  required
                                  options={
                                    masterPolicy?.filter(({ policy_rater_type_id, id }) => policy_rater_type_id !== 2 &&
                                      !(topup_master_policy_ids?.filter((_, index2) => index !== index2).map(({ policy_id }) => Number(policy_id)).includes(id)))
                                      .map(item => ({
                                        id: item.id,
                                        name: item.policy_name + ' : ' + item.policy_number,
                                        value: item.id
                                      }))
                                  }
                                  error={errors && errors.topup_master_policy_ids?.[index]?.policy_id}
                                />
                              }
                              onChange={([e]) => {
                                if (e.target.value) {
                                  loadTopPoliciesByBase([...topup_master_policy_ids, { policy_id: e.target.value }], setTopupPoliciesMappedWithBase);
                                }
                                return e;
                              }}
                              rules={{ required: true }}
                              control={control}
                              name={`topup_master_policy_ids[${index}].policy_id`}
                            />
                            {!!errors.topup_master_policy_ids?.[index]?.policy_id && <Error>
                              {errors.topup_master_policy_ids?.[index]?.policy_id.message}
                            </Error>}
                          </td>
                          {/* <td className=''>
                            <Controller
                              as={<Switch />}
                              name={`topup_master_policy_ids[${index}].is_primary`}
                              control={control}
                              defaultValue={0}
                              label={`Is Primary Policy ?`}
                            />
                          </td> */}
                          {fields.length !== 1 && <td className="">
                            <i
                              className="btn ti-trash text-danger"
                              onClick={() => onSubCount(index)}
                            />
                          </td>}
                        </tr>)}
                        {(fields.length < 5) && <tr>
                          <td colSpan={fields.length === 1 ? '2' : '3'}>
                            <i className="btn ti-plus text-success" onClick={onAddCount} />
                          </td>
                        </tr>}
                      </tbody>
                    </Table>
                  </TableDiv>
                  <Col xl={12} lg={12} md={12} sm={12}></Col>
                </>
              }
              {
                (!!masterPolicy?.length && Number(policyType) === 2) &&
                false &&
                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Select
                        label="Master Group Policy No"
                        placeholder="Select Master Group Policy Id"
                        required
                        options={
                          masterPolicy?.filter(({ policy_rater_type_id }) => policy_rater_type_id !== 2).map(item => ({
                            id: item.id,
                            name: item.policy_name + ' : ' + item.policy_number,
                            value: item.id
                          }))
                        }
                        error={errors && errors.topup_master_policy_id}
                      />
                    }
                    rules={{ required: true }}
                    control={control}
                    name="topup_master_policy_id"
                  />
                  {!!errors.topup_master_policy_id && <Error>
                    {errors.topup_master_policy_id.message}
                  </Error>}
                </Col>
              }
            </Row>
            <Row>
              {!!(userData.data?.length) && <>
                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Select
                        label='Sub Entities(Optional)'
                        placeholder='Select Sub Entities'
                        options={members || []}
                        id='id'
                        required={false} />}
                    control={control}
                    name='branch' />
                </Col>

                <Col md={6} lg={2} xl={2} sm={12} className='d-flex align-items-center'>
                  <Btn type='button' onClick={addPolicyType}>
                    <i className='ti ti-plus'></i> Add
                  </Btn>
                </Col>

                {!!selectedMembers.length && (
                  <Col md={12} lg={12} xl={12} sm={12}>
                    <BenefitList>
                      {selectedMembers.map((item, index) =>
                        <Chip
                          key={'branch' + index}
                          id={item?.id}
                          name={item?.name}
                          onDelete={removePolicyType}
                        />)}
                    </BenefitList>
                  </Col>)}
              </>}
              {/* <Col xl={4} lg={5} md={6} sm={12}>
                <div className="p-2">
                  <Controller
                    as={<Switch />}
                    name="employer_verification_needed"
                    control={control}
                    defaultValue={0}
                    label={`Will employer verify all Enrolment and Endorsement ?`}
                    required={false}
                    isRequired={true}
                  />
                </div>
              </Col> */}
              <Col xl={12} lg={12} md={12} sm={12}>
                <TextCard className="pl-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
                  {/* Broker */}
                  <CustomCheck className="custom-control-checkbox">
                    <label className="custom-control-label-check  container-check">
                      <span >{'Will Broker verify all Enrolment and Endorsement ?'}</span>
                      <Controller
                        as={
                          <input
                            name={'broker_verification_needed'}
                            // ref={ref}
                            // {...otherProps}
                            // value="1"
                            type="checkbox"
                            defaultChecked={savedConfig?.broker_verification_needed}
                          />
                        }
                        name={'broker_verification_needed'}
                        onChange={([e]) => e.target.checked ? 1 : 0}
                        control={control}
                        defaultValue={0}
                      />
                      <span className="checkmark-check"></span>
                    </label>
                  </CustomCheck>

                  {/* Employer */}
                  <CustomCheck className="custom-control-checkbox">
                    <label className="custom-control-label-check  container-check">
                      <span >{'Will Employer verify all Enrolment and Endorsement ?'}</span>
                      <Controller
                        as={
                          <input
                            name={'employer_verification_needed'}
                            // ref={ref}
                            // {...otherProps}
                            // value="1"
                            type="checkbox"
                            defaultChecked={savedConfig?.employer_verification_needed}
                          />
                        }
                        name={'employer_verification_needed'}
                        onChange={([e]) => e.target.checked ? 1 : 0}
                        control={control}
                        defaultValue={0}
                      />
                      <span className="checkmark-check"></span>
                    </label>
                  </CustomCheck>

                </TextCard>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12}>
                {/* TopUp */}
                {Number(policyType) === 2 && <TextCard className="pl-3 pr-3 mb-4 mt-4 py-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
                  <Marker />
                  <Typography>
                    {"\u00A0"} Topup Setup{" "}
                  </Typography>
                  <Row>
                    <Col md={6} lg={6} xl={6} sm={12}>
                      {/* <Head className='text-center'>Topup Setup{" "}</Head> */}
                      <div className="d-flex justify-content-around flex-wrap mt-2">
                        <CustomControl className="d-flex mt-4 mr-0">
                          <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Non-Mandatory"}</p>
                          <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={0} defaultChecked={savedConfig.topup_compulsion_flag ? Number(savedConfig.topup_compulsion_flag) === 0 : true} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className="d-flex mt-4 ml-0">
                          <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Mandatory"}</p>
                          <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={1} defaultChecked={Number(savedConfig.topup_compulsion_flag) === 1 || false} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className="d-flex mt-4 ml-0">
                          <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Optional"}</p>
                          <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={2} defaultChecked={Number(savedConfig.topup_compulsion_flag) === 2 || false} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className="d-flex mt-4 ml-0">
                          <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Optional-Mandatory"}</p>
                          <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={3} defaultChecked={Number(savedConfig.topup_compulsion_flag) === 3 || false} />
                          <span></span>
                        </CustomControl>
                      </div>
                    </Col>
                    {/* is Optional-Mandatory */}
                    {+topup_compulsion_flag === 3 &&
                      <>
                        <Col md={6} lg={6} xl={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                labelProps={{ background: 'linear-gradient(#f8f8f8, #ffffff)' }}
                                label="Mandatory If Not Selected Topup Policies"
                                placeholder="Select Policies"
                                options={topupPoliciesMappedWithBase || []}
                                multi={true}
                                closeMenuOnSelect={false}
                                closeMenuOnScroll={false}
                                hideSelectedOptions={true}
                                isClearable={false}
                              />
                            }
                            name="top_up_policy_ids"
                            control={control}
                            error={errors && errors.grade}
                          />
                        </Col>
                        <Col md={6} lg={6} xl={6} sm={12}>
                          <Controller
                            as={
                              <Select
                                labelProps={{ background: '#f8f8f8' }}
                                label="Employee Eligible"
                                placeholder="Select Options"
                                required
                                options={EmployeeEligibleOptions}
                                error={errors && errors.employee_eligibility}
                              />
                            }
                            rules={{ required: true }}
                            control={control}
                            name="employee_eligibility"
                          />
                        </Col>
                      </>
                    }
                  </Row>
                </TextCard>}

              </Col>
            </Row>
            {/* <br />
            <Marker />
            <Typography>{'\u00A0'} Additional Details</Typography>
            <Row> */}




            {/* </Row> */}
            <br />
            <Marker />
            <Typography>{'\u00A0'} Enrolment Details</Typography>
            <Row>

              <Col className='mb-3' xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Checkbox
                      label="Enrolment Window"
                      placeholder="Enrolment Status"
                      checked={savedConfig && savedConfig.enrollement_status ? true : false}
                    />
                  }
                  control={control}
                  name="enrollement_status"
                  valueName="checked"
                  onChange={([ev]) => {
                    setShowEnrollmentDates(prev => !prev);
                    return ev.target.checked
                  }}
                />
              </Col>
              {
                showEnrollmentDates && (
                  <>
                    <Col xl={4} lg={5} md={6} sm={12}>
                      <Controller
                        as={
                          <Input
                            label="Enrolment Start Date"
                            placeholder="dd-mm-yyyy"
                            type="date"
                            required
                            error={errors && errors.enrollement_start_date}
                          />
                        }
                        min={formatDate(subMonths(new Date(startDate), 6))}
                        max={endDate || '2999-12-31'}
                        control={control}
                        name="enrollement_start_date"
                        rules={{ required: true }}
                      />
                      {!!errors.enrollement_start_date && <Error>
                        {errors.enrollement_start_date.message}
                      </Error>}
                    </Col>

                    <Col xl={4} lg={5} md={6} sm={12}>
                      <Controller
                        as={
                          <Input
                            label="Enrolment End Date"
                            placeholder="dd-mm-yyyy"
                            type="date"
                            required
                            error={errors && errors.enrollement_end_date}
                          />
                        }
                        min={formatDate(subMonths(new Date(startDate), 6))}
                        max={endDate || '2999-12-31'}
                        control={control}
                        name="enrollement_end_date"
                        rules={{ required: true }}
                      />
                      {!!errors.enrollement_end_date && <Error>
                        {errors.enrollement_end_date.message}
                      </Error>}
                    </Col>
                  </>
                )
              }
              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Close Mail Effective Date"
                      type="date"
                    />
                  }
                  min={formatDate(subMonths(new Date(startDate), 6))}
                  max={endDate || '2999-12-31'}
                  control={control}
                  name="enrollment_window_close_mail_effective"
                />
              </Col>
            </Row>

            <Row>
              <Col xl={5} lg={8} md={12} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Enrolment Considered From (Mid Term)"
                      placeholder="Select Enrolment Considered From (Mid Term)"
                      required
                      options={[{ id: 1, value: 1, name: 'Date of Joining' },
                      { id: 2, value: 2, name: 'Date of Upload' },
                      { id: 3, value: 3, name: 'No Mid Term Enrolment' }]}
                      error={errors && errors.enrollement_type}
                    />
                  }
                  onChange={([e]) => {
                    setEnrolmentType(Number(e.target.value))
                    return e
                  }}
                  control={control}
                  name="enrollement_type"
                />
                {!!errors.enrollement_type && <Error>
                  {errors.enrollement_type.message}
                </Error>}
              </Col>

              {enrolmentType !== 3 && <Col xl={5} lg={8} md={12} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Enrolment Allowed Days (Mid Term)"
                      placeholder="Enter Enrolment Allowed Days (Mid Term)"
                      type="number"
                      min={0}
                      required
                      error={errors && errors.enrollement_days}
                    />
                  }
                  control={control}
                  name="enrollement_days"
                />
                {!!errors.enrollement_days && <Error>
                  {errors.enrollement_days.message}
                </Error>}
              </Col>}
            </Row>

            <br />
            <Marker />
            <Typography>{'\u00A0'} Flexible Benefits</Typography>
            <Row>
              <Col xl={12} lg={12} md={12} sm={12}>
                <div className="p-2">
                  <Controller
                    as={<Switch />}
                    name="is_flex_policy"
                    control={control}
                    defaultValue={0}
                    label={`Will this policy be as an add on flexible benefit ?`}
                  />
                </div>
              </Col>
            </Row>
            {/* <br />
            <Marker />
            <Typography>{'\u00A0'} Lock-In Details</Typography>
            <Row>
              <Col xl={12} lg={12} md={12} sm={12}>
                <div className="p-2">
                  <Controller
                    as={<Switch />}
                    name="has_lock_in"
                    control={control}
                    defaultValue={0}
                    label={`Will this policy have lock in period ?`}
                  />
                </div>
              </Col>
              {!!isLockIN &&
                <>
                  <Col xl={6} lg={10} md={12} sm={12}>
                    <Controller
                      as={
                        <Input
                          label="Member addition lock in value"
                          placeholder="Enter Member addition lock in value"
                          type="number"
                          min={0}
                          required
                          error={errors && errors.member_addition_lock_in}
                        />
                      }
                      control={control}
                      name="member_addition_lock_in"
                    />
                    {!!errors?.member_addition_lock_in && <Error>{errors?.member_addition_lock_in?.message}</Error>}
                  </Col>
                  <Col xl={6} lg={10} md={12} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Member Addition lock in unit"
                          placeholder="Select Unit"
                          options={Units}
                          required={false}
                          isRequired={true}
                          defaultValue={""}
                        />
                      }
                      name="member_addition_lock_in_unit"
                      error={errors && errors.member_addition_lock_in_unit}
                      control={control}
                    />
                    {!!errors?.member_addition_lock_in_unit && <Error>{errors?.member_addition_lock_in_unit?.message}</Error>}
                  </Col>


                  <Col xl={6} lg={10} md={12} sm={12}>
                    <Controller
                      as={
                        <Input
                          label="Member removal lock in value"
                          placeholder="Enter Member removal lock in value"
                          type="number"
                          min={0}
                          required
                          error={errors && errors.member_removal_lock_in}
                        />
                      }
                      control={control}
                      name="member_removal_lock_in"
                    />
                    {!!errors?.member_removal_lock_in && <Error>{errors?.member_removal_lock_in?.message}</Error>}
                  </Col>
                  <Col xl={6} lg={10} md={12} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Member Removal lock in unit"
                          placeholder="Select Unit"
                          options={Units}
                          required={false}
                          isRequired={true}
                          defaultValue={""}
                        />
                      }
                      name="member_removal_lock_in_unit"
                      error={errors && errors.member_removal_lock_in_unit}
                      control={control}
                    />
                    {!!errors?.member_removal_lock_in_unit && <Error>{errors?.member_removal_lock_in_unit?.message}</Error>}
                  </Col>
                  <Col xl={6} lg={10} md={12} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Member addition lock in type"
                          placeholder="Select Member addition lock in type"
                          options={[
                            { id: 1, name: "Member date joining lock in", value: "0" },
                            { id: 2, name: "Policy start date lock in", value: "1" },
                          ]}
                          required={false}
                          isRequired={true}
                          defaultValue={""}
                        />
                      }
                      name="member_addition_lock_in_type"
                      error={errors && errors.member_addition_lock_in_type}
                      control={control}
                    />
                    {!!errors?.member_addition_lock_in_type && <Error>{errors?.member_addition_lock_in_type?.message}</Error>}
                  </Col>
                  <Col xl={6} lg={10} md={12} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Member removal lock in type"
                          placeholder="Select Member removal lock in type"
                          options={[
                            { id: 1, name: "Member date of removal lock in", value: "0" },
                            { id: 2, name: "Policy end date lock in", value: "1" },
                          ]}
                          required={false}
                          isRequired={true}
                          defaultValue={""}
                        />
                      }
                      name="member_removal_lock_in_type"
                      error={errors && errors.member_removal_lock_in_type}
                      control={control}
                    />
                    {!!errors?.member_removal_lock_in_type && <Error>{errors?.member_removal_lock_in_type?.message}</Error>}
                  </Col>
                </>
              }
            </Row> */}
            {Number(policyType) === 2 && false /* not able to remove below code */ &&
              <Row>
                <Col xl={12} lg={12} md={12} sm={12}>
                  <div className="p-2">
                    <Controller
                      as={<Switch />}
                      name="has_suminsured_lock_in"
                      control={control}
                      defaultValue={0}
                      label={`Will this policy have SI base lock in period ?`}
                    />
                  </div>
                </Col>
                {!!isSILockIN &&
                  <>
                    <Col xl={6} lg={10} md={12} sm={12}>
                      <Controller
                        as={
                          <Input
                            label="SI lock in value"
                            placeholder="Enter SI lock in value"
                            type="number"
                            min={0}
                            required
                            error={errors && errors.suminsured_lock_in}
                          />
                        }
                        control={control}
                        name="suminsured_lock_in"
                      />
                      {!!errors?.suminsured_lock_in && <Error>{errors?.suminsured_lock_in?.message}</Error>}
                    </Col>
                    <Col xl={6} lg={10} md={12} sm={12}>
                      <Controller
                        as={
                          <Select
                            label="SI lock in unit"
                            placeholder="Select Unit"
                            options={Units}
                            required={false}
                            isRequired={true}
                            defaultValue={""}
                          />
                        }
                        name="suminsured_lock_in_unit"
                        error={errors && errors.suminsured_lock_in_unit}
                        control={control}
                      />
                      {!!errors?.suminsured_lock_in_unit && <Error>{errors?.suminsured_lock_in_unit?.message}</Error>}
                    </Col>
                  </>
                }
              </Row>
            }
          </form>
        </FormWrapper>
      </Wrapper >
      : null
  )
}

export default BasicDetails;

export const IsIciciTPA = (tpa = '', option = []) => {
  const ICICI = option.find(({ id }) => id === tpa)
  if (ICICI) {
    const modifyText = String(ICICI.name).toLowerCase()
    if (modifyText.includes('icici')) {
      return true
    }
    else return false
  }
  return false
}
