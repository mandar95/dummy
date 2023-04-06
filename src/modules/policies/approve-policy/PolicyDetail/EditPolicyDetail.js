import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import * as yup from 'yup';
import { addDays, subMonths } from 'date-fns';
import swal from 'sweetalert';

import { Input, Button, Select as DropDown, Error, Marker, Typography, Chip } from "components";
import { Row, Col, Form, Button as Btn, Table } from 'react-bootstrap';
import { BenefitList } from '../../steps/additional-details/styles';
import Select from "modules/user-management/Onboard/Select/Select";
import { Switch } from "../../../user-management/AssignRole/switch/switch";
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from '../style';
import { CustomControl } from "modules/user-management/AssignRole/option/style";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { editPolicy, approvePolicy } from '../approve-policy.slice';
import { clearData, loadChildCompanys, selectUsersData } from 'modules/user-management/user.slice';
import {
  validateTopup, clear_check_topup, clear_masterPolicy, loadTopPoliciesByBase
} from '../../policy-config.slice';
import { TextInput } from '../../../RFQ/plan-configuration/style';
import { IsIciciTPA } from '../../steps/basic-details';
import { TableDiv } from '../../steps/premium-details/styles';
import { EmployeeEligibleOptions, ShowInEmployeeTab, TopUpMapBase } from '../../helper';
import { Checkbox, SelectComponent } from '../../../../components';
import { ModuleControl } from '../../../../config/module-control';


const style = { zoom: '0.9' }

// let Units = [
//   { id: 1, name: "Days", value: 1 },
//   { id: 2, name: "Month", value: 2 },
//   { id: 3, name: "Year", value: 3 },
// ]

export const EditPolicyDetail = ({ options, policyData }) => {
  const validationSchema = yup.object().shape({
    policy_number: yup.string()
      .matches(/^[a-zA-Z0-9-/\s]+$/, {
        message: 'Alphanumeric characters, hyphen(-) & frontslash(/) only',
        excludeEmptyString: true,
      })
      // .test('len', 'Must be 40 digits', val => val.length <= 40)
      .required('Policy No required'),
    policy_name: yup.string().required('Policy Name required'),
    broker_commision: yup.string().matches(/^(?:100(?:\.00?)?|\d?\d(?:\.\d\d?)?)$/, { message: 'Only number within 0-100 (upto 2 decimal)', excludeEmptyString: true }).min(0, 'Min limit 0')
      .notRequired().nullable(true),
    co_oprate_buffer: yup.string().matches(/^[0-9]+$/, { message: 'Only number', excludeEmptyString: true }).min(0).max(8, 'Max limit 99999999')
      .notRequired().nullable(true),
    description: yup.string()
      .notRequired().nullable(true)
      .max(2000, `Maximum ${2000} character available`),
    ...policyData?.broker_branch_id && {
      broker_branch_id: yup.object().shape({
        id: yup.string().required('Branches Name Required'),
      })
    }
  });
  const dispatch = useDispatch();
  const { check_topup, masterPolicy, brokerBranches } = useSelector(state => state.policyConfig);
  const { broker_id } = useSelector(approvePolicy);
  const [subPolicyTypes, setSubPolicyTypes] = useState([]);
  const [policyType, setPolicyType] = useState(policyData?.policy_type_id || '');
  const [employer, setEmployer] = useState(policyData?.employer_id || '');
  const [policy_sub_type, setPolicy_sub_type] = useState(policyData?.policy_sub_type_id || '');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(policyData?.employer_childs.map(({ employer_child_company_id, company_name, ...rest }) => ({ ...rest, name: company_name, id: employer_child_company_id })) || []);
  const userData = useSelector(selectUsersData);
  const { userType } = useSelector(state => state.login);
  const [co_insurer_array, set_co_insurer] = useState(policyData?.coinsurer?.map(({ co_insurer_id, co_insurer_name, co_insurer_percentage }) => ({ id: co_insurer_id, name: co_insurer_name, percentage: co_insurer_percentage })) || []);
  const [topupPoliciesMappedWithBase, setTopupPoliciesMappedWithBase] = useState([])

  const { control, errors, reset, handleSubmit, watch, setValue, register } = useForm({
    defaultValues: policyData && {
      ...policyData,
      ...policyData?.broker_branch_id && {
        broker_branch_id: {
          id: policyData?.broker_branch_id,
          label: policyData?.broker_branch_name,
          value: policyData?.broker_branch_id,
        }
      },
      employer_id: { label: policyData?.employer, id: policyData?.employer_id, value: policyData?.employer_id },
      broker_commision: policyData?.broker_commision || '0',
      co_oprate_buffer: policyData?.co_operate_buffer || '0',
      enrollement_days: policyData?.enrollement_days || '0',
      ...policyData?.policy_type_id && { topup_compulsion_flag: String(policyData?.topup_compulsion_flag || 0) }
    },
    validationSchema
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

  // const [startDate, setStartDate] = useState(policyData.start_date)
  // const [endDate, setEndDate] = useState(policyData.end_date)
  const branch = Number(watch('branch'));
  const tpa = Number(watch('tpa_id')) || '';
  const topup_master_policy_ids = watch('topup_master_policy_ids') || [];
  const enrollement_type = Number(watch('enrollement_type') || '');
  const enrollement_status = watch('enrollement_status')


  // const isLockIN = watch('has_lock_in');
  // const isSILockIN = watch('has_suminsured_lock_in');
  const enrollement_start_date = watch('enrollement_start_date');
  const enrollement_end_date = watch('enrollement_end_date');
  const start_date = watch('start_date');
  const end_date = watch('end_date');
  const policyDescription = watch("description") || '';
  const insurer = Number(watch('insurer')) || '';
  const topup_compulsion_flag = watch('topup_compulsion_flag');

  useEffect(() => {
    setValue('co_insurer', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insurer])

  useEffect(() => {
    if (policyData?.topup_master_policy_ids.length) {
      loadTopPoliciesByBase(policyData?.topup_master_policy_ids, setTopupPoliciesMappedWithBase)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyData?.topup_master_policy_ids])

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
  // validate topup
  useEffect(() => {
    if (employer && (Number(policy_sub_type) > 3) && Number(policyType) === 2) {
      dispatch(validateTopup({
        employer: employer,
        policy_sub_type: policy_sub_type,
        ...(broker_id && { broker_id }),
        policy_id: policyData.id
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer, policy_sub_type, policyType, broker_id]);

  useEffect(() => {
    setSubPolicyType(policyData?.policy_type_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (check_topup) {
      swal("Alert", check_topup || "", "info");
      setValue([
        { policy_type_id: String(policyData?.policy_type_id) },
        { policy_sub_type_id: String(policyData?.policy_sub_type_id) },
        { employer_id: { label: policyData?.employer, id: policyData?.employer_id, value: policyData?.employer_id } },
        { topup_master_policy_id: String(policyData?.topup_master_policy_id) }
      ])
    }

    return () => { dispatch(clear_check_topup()); dispatch(clear_masterPolicy()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [check_topup]);


  useEffect(() => {
    if (!(_.isEmpty(policyData))) {
      reset({
        ...policyData,
        ...policyData?.broker_branch_id && {
          broker_branch_id: {
            id: policyData?.broker_branch_id,
            label: policyData?.broker_branch_name,
            value: policyData?.broker_branch_id,
          }
        },
        employer_id: { label: policyData?.employer, id: policyData?.employer_id, value: policyData?.employer_id },
        broker_commision: policyData?.broker_commision || '0',
        enrollement_days: policyData?.enrollement_days || '0',
        ...policyData?.policy_type_id && { topup_compulsion_flag: String(policyData?.topup_compulsion_flag || 0) },
        display_in_benefit_summary: policyData?.display_in_benefit_summary || '0'
      })
    }
  }, [reset, policyData])

  useEffect(() => {
    if (employer)
      dispatch(loadChildCompanys({ employer_id: employer }));
    else {
      dispatch(clearData())
    }
    return () => { dispatch(clearData()) };
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

  const setSubPolicyType = (policyType) => {
    setPolicyType(policyType)
    if (policyType) {
      const newData = options?.policy_sub_types
        .filter(item => item.master_policy_id === Number(policyType))
        .map(item => ({
          id: item.id,
          name: item.name,
          value: item.id
        }));
      setSubPolicyTypes(prevOptions => newData);
      return policyType
    } else {
      return null;
    }
  };

  const noGMPolicy = [2, 3, 5, 6].includes(Number(policy_sub_type));

  const onSubmit = ({ branch, tpa_id,
    icici_imid_number,
    icici_cdbg_number,
    icici_customer_id,
    topup_master_policy_ids,
    topup_compulsion_flag,
    enrollement_status,
    broker_branch_id,
    co_insurer,
    co_insurer_per,
    enrollment_window_close_mail_effective_date,
    ...data }) => {
    let _data = data.description ? data : _.omit(data, 'description');

    if (Number(policyType) === 1 || (Number(policy_sub_type) > 3 && Number(policyType) === 2 && +topup_compulsion_flag !== 3)) {
      _data = _.omit(_data, 'top_up_policy_ids');
      data.employee_eligibility = 0;
    }

    data = {
      ..._data,
      description: data.description || '',
      employer_id: data.employer_id?.id,
      ...broker_branch_id?.id && { broker_branch_id: broker_branch_id.id },
      //description: data.description ? data.description : "",
      enrollement_days: Number(data.enrollement_type) !== 3 ? data.enrollement_days : 0,
      ...(enrollment_window_close_mail_effective_date && { enrollment_window_close_mail_effective_date }),
      ...(tpa_id && { tpa_id: tpa_id }),
      ...(icici_imid_number && { icici_imid_number: icici_imid_number }),
      ...(icici_cdbg_number && { icici_cdbg_number: icici_cdbg_number }),
      ...(icici_customer_id && { icici_customer_id: icici_customer_id }),
      co_oprate_buffer: data.co_oprate_buffer || 0,
      broker_commision: data.broker_commision || 0,
      employer_child_companies: selectedMembers.map((elem) =>
      ({
        ...elem,
        cd_amount: elem.cd_amount || policyData.cd_value || selectedMembers[0].cd_amount || 0,
        cd_threshold: elem.cd_threshold || policyData.cd_threshold_value || selectedMembers[0].cd_threshold || 0
      })),
      ...(data.has_lock_in && {
        member_addition_lock_in: Number(data.member_addition_lock_in),
        member_addition_lock_in_unit: Number(data.member_addition_lock_in_unit),
        member_removal_lock_in: Number(data.member_removal_lock_in),
        member_removal_lock_in_unit: Number(data.member_removal_lock_in_unit),
        member_addition_lock_in_type: Number(data.member_addition_lock_in_type),
        member_removal_lock_in_type: Number(data.member_removal_lock_in_type)
      }),
      ...(data.has_suminsured_lock_in && {
        suminsured_lock_in: Number(data.suminsured_lock_in),
        suminsured_lock_in_unit: Number(data.suminsured_lock_in_unit),
      }),
      enrollement_status: enrollement_status,
      ...((topup_compulsion_flag && Number(data.policy_type_id) === 2) && {
        topup_compulsion_flag
      }),
      coinsurer: co_insurer_array.map(({ id, percentage }) => ({ co_insurer_id: id, co_insurer_percentage: percentage })),
      ..._data.top_up_policy_ids?.length && { top_up_policy_ids: _data.top_up_policy_ids.map(({ id }) => id) }
    }

    // topup mapping
    if (topup_master_policy_ids?.length) {
      topup_master_policy_ids.forEach(({ policy_id }, index) => {
        data[TopUpMapBase[index].input] = policy_id;
      })
    }

    dispatch(editPolicy({
      ...data,
      user_type_name: userType,
      step: 1,
      _method: 'PATCH',
      policy_id: policyData.id
    }, policyData.id))

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
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Marker />
      <Typography>{'\u00A0'} Basic Details</Typography>
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Policy No" maxLength={40} placeholder="Enter Policy No" required />}
            name="policy_number"
            error={errors && errors.policy_number}
            control={control}
          />
          {!!errors.policy_number && <Error>
            {errors.policy_number.message}
          </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Policy Name" maxLength={40} placeholder="Enter Policy Name" required />}
            name="policy_name"
            error={errors && errors.policy_name}
            control={control}
          />
          {!!errors.policy_name && <Error>
            {errors.policy_name.message}
          </Error>}
        </Col>
        <Col xl={3} lg={4} md={6} sm={12}>
          <Controller
            as={
              <DropDown
                label="Policy Type"
                placeholder="Select Policy Type"
                required
                options={options?.policy_types?.map(item => (
                  {
                    id: item.id,
                    name: item.name,
                    value: item.id
                  }
                ))}
              />
            }
            onChange={([selected]) => {
              setSubPolicyType(selected.target.value)
              return selected;
            }}
            name="policy_type_id"
            control={control}
          />
        </Col>
        {/* <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Select
                label="Policy Type"
                option={options?.policy_types}
                valueName="name"
                id="policy_type"
                selected={policyData?.policy_type_id || ""}
                required
              />}
              onChange={([selected]) => {
                setPolicyType(selected)
                return selected;
              }}
              name="policy_type_id"
              control={control}
            />
          </Col> */}

        <Col xl={3} lg={4} md={6} sm={12}>
          <Controller
            as={
              <DropDown
                label="Policy SubType"
                placeholder="Select Policy SubType"
                required
                options={subPolicyTypes}
              />
            }
            onChange={([selected]) => {
              setPolicy_sub_type(selected.target.value);
              return selected;
            }}
            control={control}
            name="policy_sub_type_id"
          />
        </Col>
        {/* <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Select
                label="Policy Subtype"
                option={options?.policy_sub_types}
                valueName="name"
                id="policy_sub_types"
                selected={policyData.policy_sub_type_id || ""}
                required
              />}
              onChange={([selected]) => {
                setPolicy_sub_type(selected);
                return selected;
              }}
              name="policy_sub_type_id"
              control={control}
            />
          </Col> */}
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Select
              label="Insurer"
              option={options?.insurers?.filter(({ id }) => !co_insurer_array?.some(item => item.id === id))}
              valueName="name"
              id="insurers"
              selected={policyData.insurer_id || ""}
              required
            />}
            name="insurer_id"
            control={control}
          />
        </Col>
        <Col xl={3} lg={4} md={6} sm={12}>
          <Controller
            as={
              <Select
                label="TPA"
                required={!noGMPolicy}
                option={options?.tpa}
                valueName="name"
                selected={policyData?.tpa_id || ""}
              />
            }
            control={control}
            name="tpa_id"
          />
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Policy Start Date" type="date" required />}
            name="start_date"
            min={'1000-01-01'}
            max={'9999-12-31'}
            onChange={([e]) => {
              const oneYear = formatDate(addDays(new Date(e.target.value), 364));
              setValue('end_date', oneYear);
              return e
            }}
            control={control}
          />
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Policy End Date" type="date" required />}
            name="end_date"
            // onChange={([e]) => { setEndDate(e.target.value); return e }}
            min={start_date}
            max={'9999-12-31'}
            control={control}
          />
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <DropDown
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

        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Broker %" type="number" placeholder="Broker Percentage" required={false} />}
            name="broker_commision"
            error={errors && errors.broker_commision}
            control={control}
          />
          {!!errors.broker_commision && <Error>
            {errors.broker_commision.message}
          </Error>}
        </Col>
        <Col xl={3} lg={4} md={6} sm={12}>
          <Controller
            as={<Input label="Corporate Buffer ₹" placeholder="Corporate Buffer" type="number"
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
        {!!brokerBranches?.length && <Col xl={3} lg={4} md={6} sm={12}>
          <Controller
            as={
              <SelectComponent
                label="Broker Branch Name"
                placeholder="Select Broker Branch Name"
                isClearable
                required={!!policyData?.broker_branch_id}
                options={
                  brokerBranches.map(item => ({
                    id: item.id,
                    label: item.branch_name,
                    value: item.id
                  }))
                }
              />
            }
            error={errors && (errors.broker_branch_id || errors.broker_branch_id?.id)}
            control={control}
            name="broker_branch_id"
          />
          {!!(errors.broker_branch_id || errors?.broker_branch_id?.id) && <Error>{errors?.broker_branch_id?.id?.message || 'Branch Required'}</Error>}
        </Col>}
        {!!tpa && IsIciciTPA(tpa, options?.tpa) && <>
          <Col md={6} lg={4} xl={3} sm={12}>
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
          </Col>
          <Col md={6} lg={4} xl={3} sm={12}>
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
          </Col>
          <Col md={6} lg={4} xl={3} sm={12}>
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
          </Col>
        </>}
        <Col md={6} lg={4} xl={3} sm={12}>
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
          <Col md={6} lg={4} xl={3} sm={12}>
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
                  options?.insurers.filter(({ id }) => insurer !== id).map(item => ({
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
          <Btn type="button" onClick={onAddCoInsurer}>
            <i className="ti ti-plus"></i> Add
          </Btn>
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

      <Row className="d-flex mt-3 mb-3 justify-content-center">
        <Col md={12} lg={12} xl={12} sm={12}>
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
              className="form-control"
              placeholder="Enter Content Here..."
            />}
            name="description"
            control={control}
            error={errors && errors.description}
          />
          <label className="form-label">
            <span className="span-label">Policy Description</span>
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

        <Col xl={3} lg={4} md={6} sm={12}>
          <Controller
            as={
              <SelectComponent
                label="Company Name"
                placeholder="Select Company Name"
                required
                options={
                  options?.companys?.map(item => ({
                    id: item.id,
                    label: item.name,
                    value: item.id
                  }))
                }
              />
            }
            onChange={([selected]) => {
              setEmployer(selected?.value);
              return selected;
            }}
            rules={{ required: true }}
            control={control}
            name="employer_id"
          />
        </Col>

        {/* 
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Select
                label="Company Name"
                option={options?.companys}
                valueName="name"
                id="companys"
                selected={policyData?.employer_id || ""}
                required
              />}
              onChange={([selected]) => {
                setEmployer(selected);
                return selected;
              }}
              name="employer_id"
              control={control}
            />
          </Col> */}

        {(!!masterPolicy?.length && Number(policyType) === 2) &&
          <>
            <Col xl={12} lg={12} md={12} sm={12}></Col>
            <TableDiv className='col col-xl-8 col-lg-10 col-md-12 col-sm-12'>
              <Table
                className="text-center rounded text-nowrap"
                style={{ border: "solid 1px #e6e6e6" }}
                responsive>
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
                          <DropDown
                            label={"Master Group Policy No" + (index === 0 ? ' (Primary)' : '')}
                            placeholder="Select Master Group Policy Id"
                            required
                            options={
                              masterPolicy?.filter(({ policy_rater_type_id, id }) => policy_rater_type_id !== 2 &&
                                !((topup_master_policy_ids.filter((_, index2) => index !== index2).map(({ policy_id }) => Number(policy_id))).includes(id))
                              )
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
                        defaultValue={topup_master_policy_ids?.[index]?.policy_id || ''}
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
          <Col xl={3} lg={4} md={6} sm={12}>
            <Controller
              as={
                <DropDown
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
                />
              }
              rules={{ required: true }}
              control={control}
              name="topup_master_policy_id"
            />
          </Col>
        }
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
      </Row>
      <Row>
        {!!(members?.length || selectedMembers.length) && <>
          <Col xl={3} lg={4} md={6} sm={12}>
            <Controller
              as={
                <DropDown
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
        <Col xl={12} lg={12} md={12} sm={12}>
          <TextCard className="pl-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
            {/* Broker */}
            <CustomCheck className="custom-control-checkbox">
              <label className="custom-control-label-check  container-check">
                <span >{'Will broker verify all Enrolment and Endorsement ?'}</span>
                <Controller
                  as={
                    <input
                      name={'broker_verification_needed'}
                      // ref={ref}
                      // {...otherProps}
                      // value="1"
                      type="checkbox"
                      defaultChecked={policyData?.broker_verification_needed}
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
                      defaultChecked={policyData?.employer_verification_needed}
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
                    <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={0} defaultChecked={policyData.topup_compulsion_flag ? Number(policyData.topup_compulsion_flag) === 0 : true} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Mandatory"}</p>
                    <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={1} defaultChecked={Number(policyData.topup_compulsion_flag) === 1 || false} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Optional"}</p>
                    <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={2} defaultChecked={Number(policyData.topup_compulsion_flag) === 2 || false} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Optional-Mandatory"}</p>
                    <input ref={register} name={'topup_compulsion_flag'} type={'radio'} value={3} defaultChecked={Number(policyData.topup_compulsion_flag) === 3 || false} />
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
                          options={topupPoliciesMappedWithBase.filter(({ id }) => id !== policyData?.id) || []}
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
                        <DropDown
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
      <br />
      <Marker />
      <Typography>{'\u00A0'} Enrolment Details</Typography>
      <Row>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <Checkbox
                label="Enrolment Window"
                placeholder="Enrolment Status"
                checked={policyData && policyData.enrollement_status ? true : false}
              />
            }
            control={control}
            name="enrollement_status"
            valueName="checked"
            onChange={([ev]) => {
              // setShowEnrollmentDates(prev => !prev);
              setValue([{ enrollement_start_date: null }, { enrollement_end_date: null }])
              return ev.target.checked ? 1 : 0
            }}
          />
        </Col>
        {!!enrollement_status &&
          <>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Enrolment Start Date" type="date" required />}
                name="enrollement_start_date"
                min={formatDate(subMonths(new Date(start_date), 6))}
                max={end_date || '9999-12-31'}
                control={control}
                required={true}
              />
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Enrolment End Date" type="date" required />}
                name="enrollement_end_date"
                min={formatDate(new Date(enrollement_start_date))}
                max={end_date || '9999-12-31'}
                control={control}
                required={true}
              />
            </Col>
          </>}

        <Col xl={4} lg={5} md={6} sm={12}>
          <Controller
            as={
              <Input
                label="Close Mail Effective Date"
                type="date"
              />
            }
            min={enrollement_end_date || start_date || '2000-01-01'}
            max={end_date || '9999-12-31'}
            control={control}
            name="enrollment_window_close_mail_effective_date"
          />
        </Col>

        <Col xl={5} lg={8} md={12} sm={12}>
          <Controller
            as={
              <DropDown
                label="Enrolment Considered From (Mid Term)"
                placeholder="Select Enrolment Considered From (Mid Term)"
                required
                options={[{ id: 1, value: 1, name: 'Date of Joining' },
                { id: 2, value: 2, name: 'Date of Upload' },
                { id: 3, value: 3, name: 'No Mid Term Enrolment' }]}
                error={errors && errors.enrollement_type}
              />
            }
            control={control}
            name="enrollement_type"
          />
          {!!errors.enrollement_type && <Error>
            {errors.enrollement_type.message}
          </Error>}
        </Col>

        {enrollement_type !== 3 && <Col xl={5} lg={8} md={12} sm={12}>
          <Controller
            as={
              <Input
                label="Enrolment Allowed Days (Mid Term)"
                placeholder="Enter Enrolment Allowed Days (Mid Term)"
                type="number"
                min={1}
                max={999}
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
      <br />
      {/* <Marker />
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
                  <DropDown
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
                  <DropDown
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
                  <DropDown
                    label="Member addition lock in type"
                    placeholder="Select Member addition lock in type"
                    options={[
                      { id: 1, name: "Member date of joining lock in", value: "0" },
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
            </Col>
            <Col xl={6} lg={10} md={12} sm={12}>
              <Controller
                as={
                  <DropDown
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
            </Col>
          </>
        }
      </Row>
      {Number(policyType) === 2 &&
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
                    <DropDown
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
      } */}
      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="submit">
            Update
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
