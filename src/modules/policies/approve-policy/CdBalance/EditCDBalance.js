import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import * as yup from 'yup';


import { Input, Button, Error, Typography, Marker, TabWrapper, Tab, Select as SelectDropdwon } from "components";
import { Row, Col, Form, Table } from 'react-bootstrap';
import Select from '../../steps/TypeSelect';

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { checkEmployerCdStatement, editPolicy } from '../approve-policy.slice';
import { numOnly, noSpecial, numOnlyWithPoint, toWords } from "utils";

import { common_module } from 'config/validations';
import { Div } from '../../steps/premium-details/styles';
import { Img } from '../../../../components/inputs/input/style';
import swal from 'sweetalert';
import { selectdropdownData } from "modules/user-management/user.slice";
import { clearData, loadChildCompanys, selectUsersData } from '../../../user-management/user.slice';
import SelectCreatableComponent from '../../../../components/inputs/Select/SelectCreatableComponent';


const validation = common_module.user

const cd_account_type = {
  'policy': 1,
  'group': 2,
  'branch': 3,
  1: 'policy',
  2: 'group',
  3: 'branch',
}


// unique validation
const uniquePropertyTest = function (value, propertyName, message) {
  if (
    this.parent
      .filter(v => v !== value)
      .some(v => _.get(v, propertyName) === _.get(value, propertyName)) && value.contact_email && value.contact_number
  ) {
    throw this.createError({
      path: `${this.path}.${propertyName}`,
      message
    });
  }

  return true;
};
// yup.addMethod(yup.object, 'uniqueProperty', function (propertyName, message) {
//   return this.test('unique', message, function (value) {
//     return uniquePropertyTest.call(this, value, propertyName, message);
//   });
// });
yup.addMethod(yup.object, 'uniqueProperties', function (propertyNames) {
  return this.test('unique', '', function (value) {
    const errors = propertyNames.map(([propertyName, message]) => {
      try {
        return uniquePropertyTest.call(this, value, propertyName, message);
      } catch (error) {
        return error;
      }
    }).filter(error => error instanceof yup.ValidationError);

    if (!_.isEmpty(errors)) {
      throw new yup.ValidationError(errors);
    }

    return true;
  });
});

const lessserThanPropertyTest = function (value, propertyName, message) {
  if (!value.cd_threshold) {
    return true
  }
  if (
    Number(value.cd_threshold) >= Number(value.cd_amount)
  ) {
    throw this.createError({
      path: `${this.path}.${propertyName}`,
      message
    });
  }

  return true;
};
yup.addMethod(yup.object, 'lesserThan', function (propertyNames) {
  return this.test('unique', '', function (value) {
    const errors = propertyNames.map(([propertyName, message]) => {
      try {
        return lessserThanPropertyTest.call(this, value, propertyName, message);
      } catch (error) {
        return error;
      }
    }).filter(error => error instanceof yup.ValidationError);

    if (!_.isEmpty(errors)) {
      throw new yup.ValidationError(errors);
    }

    return true;
  });
});



const validationSchema = (tab) => yup.object().shape({
  ...(['policy', 'group', 'branch'].includes(tab) && {
    cd_value: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('Opening CD Balance required')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
    // .required('Opening CD Balance required'),
    cd_threshold_value: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('CD Balance Threshold required')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
    // .required('CD Balance Threshold required'),
    inception_premium: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
    inception_premium_installment: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  }),
  // ...(tab === 'branch' && {
  //   employer_childs: yup.array().of(
  //     yup.object().lesserThan([
  //       ['cd_threshold', 'Must be less than Opening CD Balance']
  //     ]).shape({
  //       cd_amount: yup.number('Only number')
  //         .nullable()
  //         .notRequired()
  //         .typeError('Opening CD Balance required')
  //         .positive('Only +Positive Number')
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  //       // .required('Opening CD Balance required'),
  //       cd_threshold: yup.number('Only number')
  //         .nullable()
  //         .notRequired()
  //         .typeError('CD Balance Threshold required')
  //         .positive('Only +Positive Number')
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  //       // .required('CD Balance Threshold required')
  //       inception_premium: yup.number('Only number')
  //         .nullable()
  //         .notRequired()
  //         .typeError('Opening CD Balance required')
  //         .positive('Only +Positive Number')
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  //       inception_premium_installment: yup.number('Only number')
  //         .nullable()
  //         .notRequired()
  //         .typeError('Opening CD Balance required')
  //         .positive('Only +Positive Number')
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  //     }),
  //   )
  // }),
  broker: yup.array().of(
    yup.object().uniqueProperties([
      ['contact_number', 'Mobile No must be unique'],
      ['contact_email', 'Email Id must be unique'],
      ['level', 'level must be unique']
    ]).shape({
      designation_id: yup.object().shape({
        label: yup.string().required('Designation Required'),
      }),
      contact_email: yup.string().email('Enter Valid Email Id').required('Email Id required'),
      contact_name: yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
        .max(validation.name.max, `Maximum ${validation.name.max} character available`)
        .matches(validation.name.regex, "Name must contain only alphabets"),
      contact_number: yup.string()
        .required('Mobile No. is required')
        .min(10, 'Mobile No. should be 10 digits')
        .max(10, 'Mobile No. should be 10 digits')
        .matches(validation.contact.regex, 'Not valid number'),
      level: yup.string().required('Please select level'),
    })),
  employer: yup.array().of(
    yup.object().uniqueProperties([
      ['contact_number', 'Mobile No must be unique'],
      ['contact_email', 'Email Id must be unique'],
      ['level', 'level must be unique']
    ]).shape({
      designation_id: yup.object().shape({
        label: yup.string().required('Designation Required'),
      }),
      contact_email: yup.string().email('Enter Valid Email Id').required('Email Id required'),
      contact_name: yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
        .max(validation.name.max, `Maximum ${validation.name.max} character available`)
        .matches(validation.name.regex, "Name must contain only alphabets"),
      contact_number: yup.string()
        .required('Mobile No. is required')
        .min(10, 'Mobile No. should be 10 digits')
        .max(10, 'Mobile No. should be 10 digits')
        .matches(validation.contact.regex, 'Not valid number'),
      level: yup.string().required('Please select level'),
    }))
});

const style = { zoom: '0.9', marginTop: '0px' }
const _level = [{ id: 1, name: 'Level 1' }, { id: 2, name: 'Level 2' }, { id: 3, name: 'Level 3' }]

export const EditCDBalance = ({ policyData, options }) => {


  const dispatch = useDispatch();
  const { userType: userTypeName } = useSelector(state => state.login);
  const brokerContact = policyData?.contact_details?.filter(contact => contact && contact.type !== '0').map((elem) => ({ ...elem, designation_id: { label: elem.designation_name, value: elem.designation_name } }))
  const employerContact = policyData?.contact_details?.filter(contact => contact && contact.type === '0').map((elem) => ({ ...elem, designation_id: { label: elem.designation_name, value: elem.designation_name } }))
  const [cdBalance, setCdBalance] = useState(policyData.cd_value)
  const [count, setCount] = useState(brokerContact?.length || 1);
  const [employerCount, setEmployerCount] = useState(employerContact?.length || 1)
  const [tab, setTab] = useState((policyData.cd_account_type && cd_account_type[policyData.cd_account_type]) || "policy");
  const { control, errors, reset, handleSubmit, register, watch, setValue } = useForm({
    defaultValues: (policyData && {
      broker: brokerContact,
      employer: employerContact,
    }) || {},
    validationSchema: validationSchema(tab),
    mode: "onBlur",
    reValidateMode: "onBlur"
  });
  const { EmployerUserForContactDetails } = useSelector(state => state.policyConfig);
  const dropDown = useSelector(selectdropdownData);
  const userData = useSelector(selectUsersData);
  const { employerCdStatement } = useSelector(state => state.approvePolicy)


  const cd_threshold_value = watch('cd_threshold_value');
  const inception_premium = watch('inception_premium');
  const inception_premium_installment = watch('inception_premium_installment');
  const haveSubEntities = userData && !!userData.data?.length

  useEffect(() => {
    if (!(_.isEmpty(policyData))) {
      dispatch(loadChildCompanys({ employer_id: policyData.employer_id }));

      let employerID = policyData.employer_id

      const employerObj = options.companys.find(({ id }) => id === Number(employerID))
      if (options.companys.some(({ child_companies }) => child_companies.some(({ name }) => name === employerObj.name))) {
        employerID = options.companys.find(({ child_companies }) => child_companies.some(({ name }) => name === employerObj.name))?.id
      }
      dispatch(checkEmployerCdStatement({ employer_id: employerID }));
      reset({
        ...policyData,
        broker: brokerContact,
        employer: employerContact,
        cd_value: Number(policyData.cd_value) ? String(policyData.cd_value) : undefined,
        cd_threshold_value: Number(policyData.cd_threshold_value) ? String(policyData.cd_threshold_value) : undefined,
        inception_premium: Number(policyData.inception_premium) ? String(policyData.inception_premium) : undefined,
        inception_premium_installment: Number(policyData.inception_premium_installment) ? String(policyData.inception_premium_installment) : undefined
      })
    }

    return () => { dispatch(clearData()) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyData])

  useEffect(() => {

    if (!employerCdStatement.length || employerCdStatement.every(({ cd_account_type }) => cd_account_type === 1)) {
      setTab('policy')
    } else if (haveSubEntities && employerCdStatement.some(({ cd_account_type }) => cd_account_type === 2)) {
      setTab('group')
    } else {
      employerCdStatement.some(({ cd_account_type }) => cd_account_type === 3) && setTab('branch')
    }
  }, [employerCdStatement, haveSubEntities])

  useEffect(() => {
    if (Number(inception_premium_installment) > 24) {
      swal('Validation', 'Inception Premium Installment Max 24 Allowed', 'info').then(() => {

        setValue('inception_premium_installment', '24')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inception_premium_installment])



  const addCount = (employer) => () => {
    let _count = employer ? employerCount : count
    if (_count !== 30) {
      (employer ? setEmployerCount : setCount)(prev => prev ? prev + 1 : 1);
    }
  }

  const subCount = (employer) => () => {
    (employer ? setEmployerCount : setCount)(prev => prev === 1 ? 1 : prev - 1);
  }

  const onSubmit = (data) => {

    if (data?.inception_premium && data?.installment_amounts &&
      (Number(data?.inception_premium) !== data?.installment_amounts.reduce((total, premium) => total + Number(premium), 0))) {
      return swal('Validation', "Inception Premium & Installment Amounts doesn't match", 'info')
    }
    if (Number(data?.cd_threshold_value) > 0 && !Number(data?.cd_value)) {
      return swal('Validation', "Opening CD balance required when Threshold is added", 'info')
    }
    const { cd_value: opening_balance,
      cd_threshold_value: threshold_value,
      broker, employer,
      inception_premium, inception_premium_installment,
      installment_amounts = [] } = data;

    dispatch(editPolicy({
      ...(['policy', 'group', 'branch'].includes(tab) && {
        opening_balance: opening_balance || 0,
        threshold_value: threshold_value || 0,
        inception_premium: inception_premium || 0,
        inception_premium_installment: inception_premium ? inception_premium_installment || 0 : 0,
        installment_amounts: inception_premium_installment ? installment_amounts : []
      }
      /* :
        {
          employer_child_companies: data.employer_childs.map((elem, index) =>
          ({
            ...policyData.employer_childs[index],
            ...elem,
            id: policyData.employer_childs[index].employer_child_company_id
          }))
        } */),
      cd_account_type: cd_account_type[tab],
      contact_details: [...broker, ...employer].map(({ contact_name, contact_email, contact_number, designation_id, type, level }) => ({
        email: contact_email,
        contact_name: contact_name,
        contact_no: contact_number,
        designation_id: designation_id?.value,
        type,
        level
      })),
      employer_id: policyData.employer_id,
      user_type_name: userTypeName,
      step: 4,
      _method: 'PATCH',
      policy_id: policyData.id
    }, policyData.id))
  }

  const FormStructure = (employer) => {
    const type = employer ? 'employer' : 'broker';
    return (
      <>
        {[...Array(Number(employer ? employerCount : count))].map((_, index) => {

          const userEmail = watch(`${type}[${index}].contact_email`);
          const userDetail = (type === "broker" ? dropDown : EmployerUserForContactDetails)?.find(({ email }) => (email === userEmail));
          const userRole = watch(`${type}[${index}].designation_id`);

          let roles = (type === "broker" ? dropDown : EmployerUserForContactDetails)
          roles = [...new Set(roles.map(item => item.role))];

          return <><Row className='position-relative' key={'contact_detail-' + index + type}>
            <p style={{
              top: '14px',
              left: index < 9 ? '-2px' : '-9px',
              fontSize: '1.1rem',
            }} className='position-absolute left-0'>{index + 1}.</p>

            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <SelectCreatableComponent
                    label="Role/Designation Type"
                    placeholder="Enter Role/Designation Type"
                    required
                    isClearable
                    options={roles.map((role) => ({ label: role, value: role }))}
                    name={`${type}[${index}].designation_id`}
                  />
                }
                defaultValue={""}
                error={errors && errors[type] && (errors[type][index]?.designation_id || errors[type][index]?.designation_id?.label)}
                control={control}
                name={`${type}[${index}].designation_id`}
              />
              {!!(errors[type] && (errors[type][index]?.designation_id || errors[type][index]?.designation_id?.label)) && <Error>
                {errors[type][index]?.designation_id?.label?.message}
              </Error>}
            </Col>

            {/* <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Email Id"
                    placeholder="Enter Email Id"
                    required
                  />
                }
                error={errors && errors[type] && errors[type][index]?.contact_email}
                control={control}
                name={`${type}[${index}].contact_email`}
              />
              {!!(errors[type] && errors[type][index]?.contact_email) && <Error>
                {errors[type][index]?.contact_email.message}
              </Error>}
            </Col> */}
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Select
                    label="Email Id"
                    placeholder="Enter Email Id"
                    id='email'
                    required
                    valueName='name'
                    prefix='Add Custom Email: '
                    options={employer ? EmployerUserForContactDetails?.map((item) => ({
                      id: item?.id,
                      name: item?.email
                    })) || [] :
                      dropDown?.map((item) => ({
                        id: item?.id,
                        name: item?.email
                      })) || []
                    }
                  />
                }
                defaultValue={(((employer ? employerContact : brokerContact) || [])[index]?.contact_email) ?
                  ((employer ? employerContact : brokerContact) || [])[index].contact_email : ''}
                onChange={([data]) => {
                  const userEmail = data?.name || ""

                  const userDetail = (type === "broker" ? dropDown : EmployerUserForContactDetails)?.find(({ email }) => (email === userEmail))

                  if (userDetail) {
                    const objName = {}
                    objName[`${type}[${index}].contact_name`] = userDetail.name;
                    const objContact = {}
                    objContact[`${type}[${index}].contact_number`] = userDetail.mobile_no || null;
                    const objRole = {}
                    objRole[`${type}[${index}].designation_id`] = { label: userDetail.role, value: userDetail.role };
                    setValue([objName, objContact, ...userDetail.role !== userRole?.value ? [objRole] : []])
                  }

                  return userEmail
                }}
                error={errors && errors[type] && errors[type][index]?.contact_email}
                control={control}
                name={`${type}[${index}].contact_email`}
              />
              {!!(errors[type] && errors[type][index]?.contact_email) && <Error>
                {errors[type][index]?.contact_email.message}
              </Error>}
            </Col>

            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Name"
                    placeholder="Enter Name"
                    required
                  />
                }
                labelProps={userDetail?.name && { background: 'linear-gradient(#ffffff, #dadada)' }}
                disabled={userDetail?.name}
                error={errors && errors[type] && errors[type][index]?.contact_name}
                control={control}
                name={`${type}[${index}].contact_name`}
              />
              {!!(errors[type] && errors[type][index]?.contact_name) && <Error>
                {errors[type][index]?.contact_name.message}
              </Error>}
            </Col>

            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Mobile No"
                    placeholder="Enter Mobile No"
                    required
                    type='tel'
                    maxLength={10}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                  />
                }
                labelProps={userDetail?.mobile_no && { background: 'linear-gradient(#ffffff, #dadada)' }}
                disabled={userDetail?.mobile_no}
                error={errors && errors[type] && errors[type][index]?.contact_number}
                control={control}
                name={`${type}[${index}].contact_number`}
              />
              {!!(errors[type] && errors[type][index]?.contact_number) && <Error>
                {errors[type][index]?.contact_number.message}
              </Error>}
            </Col>

            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <SelectDropdwon
                    label="Level"
                    placeholder="Select Level"
                    required={false}
                    isRequired={true}
                    // options={_Events}
                    options={_level.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                  />
                }
                error={errors && errors[type] && errors[type][index]?.level_id}
                control={control}
                name={`${type}[${index}].level`}
              />
              {!!(errors[type] && errors[type][index]?.level) && <Error>
                {errors[type][index]?.level.message}
              </Error>}
            </Col>
            <input ref={register} value={type === 'broker' ? 1 : 0} type='hidden'
              name={`${type}[${index}].type`} />
          </Row>
            {index + 1 !== (employer ? employerCount : count) && <hr />}
          </>
        }
        )}
        <Row className='mt-3'>
          <Col className="d-flex justify-content-end align-items-center">
            <Button buttonStyle="warning" type='button' onClick={addCount(employer)}>
              <i className="ti ti-plus"></i> Add{'\u00A0'}
            </Button>
            {(employer ? employerCount : count) !== 1 &&
              <Button buttonStyle="danger" type='button' onClick={subCount(employer)}>
                <i className="ti ti-minus"></i> Remove
              </Button>
            }
          </Col>
        </Row>
      </>
    )
  }

  const isFirstPolicy = !!employerCdStatement.length && employerCdStatement[0].policy_id === policyData.id

  const DisableInputs = !isFirstPolicy && !!employerCdStatement.length && employerCdStatement.some(({ cd_account_type }) => cd_account_type !== 1)

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <div style={style}>
        <TabWrapper width={'max-content'}>
          {(isFirstPolicy || (!employerCdStatement.length || employerCdStatement.every(({ cd_account_type }) => cd_account_type === 1))) && <Tab
            isActive={Boolean(tab === "policy")}
            onClick={() => setTab("policy")}>
            Policy Wise
          </Tab>}

          {(isFirstPolicy || (!employerCdStatement.length || employerCdStatement.some(({ cd_account_type }) => cd_account_type !== 1))) && <>
            {(isFirstPolicy || employerCdStatement.some(({ cd_account_type }) => cd_account_type === 3)) && <Tab
              isActive={Boolean(tab === "branch")}
              onClick={() => setTab("branch")}>
              Entity Wise
            </Tab>}
            {(haveSubEntities && (isFirstPolicy || employerCdStatement.some(({ cd_account_type }) => cd_account_type === 2))) &&
              <Tab
                isActive={Boolean(tab === "group")}
                onClick={() => setTab("group")}>
                Group Wise<sub>(All Entities)</sub>
              </Tab>
            }
          </>}
        </TabWrapper>
      </div>

      {['policy', 'group', 'branch'].includes(tab) && <>
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={<Input label="Opening CD Balance" type="number" min={0} placeholder={DisableInputs ? '-' : "Opening CD Balance"} required={false} />}
              onChange={([e]) => { setCdBalance(e.target.value); return e }}
              name="cd_value"
              error={errors && errors.cd_value}
              control={control}
              disabled={DisableInputs}
              {...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
            />
            {!!(cdBalance) &&
              <Error top='0' color={'blue'}>{toWords.convert(cdBalance)}</Error>}
            {!!errors.cd_value && <Error>
              {errors.cd_value.message}
            </Error>}
          </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={<Input label="CD Balance Threshold" type="number" min={0} max={cdBalance} placeholder={DisableInputs ? '-' : "CD Balance Threshold"} required={false} />}
              name="cd_threshold_value"
              error={errors && errors.cd_threshold_value}
              control={control}
              disabled={DisableInputs}
              {...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
            />
            {!!(cd_threshold_value) &&
              <Error top='0' color={'blue'}>{toWords.convert(cd_threshold_value)}</Error>}
            {!!errors.cd_threshold_value && <Error>
              {errors.cd_threshold_value.message}
            </Error>}
          </Col>
        </Row>
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={<Input label="Inception Premium" type="number" min={0} placeholder={DisableInputs ? '-' : "Inception Premium"} required={false} />}
              name="inception_premium"
              error={errors && errors.inception_premium}
              control={control}
              disabled={DisableInputs}
              {...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
            />
            {!!(inception_premium) &&
              <Error top='0' color={'blue'}>{toWords.convert(inception_premium)}</Error>}
            {!!errors.inception_premium && <Error>
              {errors.inception_premium.message}
            </Error>}
          </Col>
          {!!inception_premium && Number(inception_premium) > 0 && <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={<Input label="Inception Premium Installment"
                type="tel"
                onKeyDown={numOnly} onKeyPress={noSpecial}
                maxLength={2} placeholder={DisableInputs ? '-' : "Inception Premium Installment"} required={false} />}
              name="inception_premium_installment"
              error={errors && errors.inception_premium_installment}
              control={control}
              disabled={DisableInputs}
              {...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
            />
            {!!errors.inception_premium_installment && <Error>
              {errors.inception_premium_installment.message}
            </Error>}
          </Col>}
        </Row>
        {!!inception_premium_installment && Number(inception_premium_installment) > 0 &&
          !!inception_premium && Number(inception_premium) > 0 &&
          <Div className="text-center" >
            <Table
              className="text-center rounded text-nowrap"
              style={{ border: "solid 1px #e6e6e6" }}
              responsive
            >
              <thead>
                <tr>
                  <th style={style} className="align-top">
                    Installment
                  </th>
                  <th style={style} className="align-top">
                    Installment Amount<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(Number(inception_premium_installment))].map((_, index) =>

                  <tr key={index + 'inception'}>
                    <td>
                      {index + 1} Installment
                    </td>
                    <td>
                      <Controller
                        as={
                          <Form.Control
                            className="rounded-lg"
                            size="ms"
                            type='tel'
                            onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                            required
                            maxLength={9}
                            placeholder="Installment Amount"
                          />
                        }
                        name={`installment_amounts.${index}`}
                        control={control}
                        disabled={DisableInputs}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Div>
        }
      </>}

      {/* {tab === 'branch' && policyData.employer_childs?.map(({ company_name }, index) => (
          <Fragment key={company_name + index}>
            <br />
            <Marker />
            <Typography>{'\u00A0'} {company_name}</Typography>
            <Row>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={<Input
                    label="Opening CD Balance"
                    placeholder="Enter Opening CD Balance"
                    type="number"
                    min={0}
                    required={false} />}
                  error={errors && errors.employer_childs && errors.employer_childs[index] && errors.employer_childs[index].cd_amount}
                  name={`employer_childs[${index}].cd_amount`}
                  control={control} />
                {!!errors && errors.employer_childs && errors.employer_childs[index] && errors.employer_childs[index].cd_amount && <Error>
                  {errors.employer_childs[index].cd_amount.message}
                </Error>}
              </Col>

              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={<Input
                    label="CD Balance Threshold"
                    placeholder="Enter CD Balance Threshold"
                    type="number"
                    min={0}
                    required={false} />}
                  error={errors && errors.employer_childs && errors.employer_childs[index] && errors.employer_childs[index].cd_threshold}
                  name={`employer_childs[${index}].cd_threshold`}
                  control={control} />
                {!!errors && errors.employer_childs && errors.employer_childs[index] && errors.employer_childs[index].cd_threshold && <Error>
                  {errors.employer_childs[index].cd_threshold.message}
                </Error>}
              </Col>
            </Row>
          </Fragment>
        ))} */}

      <br />
      <br />
      <Marker />
      {/* abhi changes <Typography>{'\u00A0'} Contact Details - Insurer Organization</Typography> */}
      <Typography>{'\u00A0'} Contact Details - Broker Organization</Typography>
      {FormStructure(false)}

      <Marker />
      <Typography>{'\u00A0'} Contact Details - Employer Organization</Typography>
      {FormStructure(true)}

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
