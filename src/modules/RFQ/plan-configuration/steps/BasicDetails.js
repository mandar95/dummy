import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import swal from 'sweetalert';

import { Row, Col } from 'react-bootstrap';
import { Title, Wrapper, TextInput } from '../style';
import { Input, Select, Error, Marker, Typography } from 'components';
import Typeahead from './TypeSelect/TypeSelect';
import { AttachFile } from 'modules/core';
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from '../../../policies/approve-policy/style';

import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { saveTempConfig } from '../../rfq.slice';
import { numOnly, noSpecial } from 'utils';
import { insurer } from 'config/validations'

const validation = insurer.plan_config

const validationSchema = (isBroker) => yup.object().shape({
  plan_name: yup.string().required('Plan Name Required')
    .min(validation.plan_name.min, `Minimum ${validation.plan_name.min} character required`)
    .max(validation.plan_name.max, `Maximum ${validation.plan_name.max} character available`)
    .matches(validation.plan_name.regex, 'Must contain only alphabets'),
  policy_sub_type_id: yup.string().required('Policy Sub Type Required'),
  policy_type_id: yup.string().required('Policy Type Required'),
  max_no_of_employee: yup.number().required('Max Employee Live Required')
    .min(validation.max_no_of_employee.min, `Minimum ${validation.max_no_of_employee.min}`)
    .max(validation.max_no_of_employee.max, `Maximum ${validation.max_no_of_employee.max}`)
    .typeError('Max Employee Live Required'),
  min_no_of_employee: yup.number().required('Min Employee Live Required')
    .min(1, `Minimum ${1}`)
    .typeError('Min Employee Live Required'),
  // co_oprate_buffer: yup.number().required('Corporate Buffer Required')
  //   .min(validation.co_oprate_buffer.min, `Minimum ${validation.co_oprate_buffer.min}%`)
  //   .max(validation.co_oprate_buffer.max, `Maximum ${validation.co_oprate_buffer.max}%`)
  //   .typeError('Corporate Buffer Required'),
  // co_pay_percentage: yup.number().required('Co-Pay Required')
  //   .min(validation.co_pay_percentage.min, `Minimum ${validation.co_pay_percentage.min}%`)
  //   .max(validation.co_pay_percentage.max, `Maximum ${validation.co_pay_percentage.max}%`)
  //   .typeError('Co-Pay Required'),
  max_discount: yup.number().required('Max Discount Required')
    .min(validation.max_discount.min, `Minimum ${validation.max_discount.min}%`)
    .max(validation.max_discount.max, `Maximum ${validation.max_discount.max}%`)
    .typeError('Max Discount Required'),
  ...isBroker && {
    ic_name: yup.string().required('IC Name required')
      .min(validation.ic_name.min, `Minimum ${validation.ic_name.min} character required`)
      .max(validation.ic_name.max, `Maximum ${validation.ic_name.max} character available`)
      .matches(validation.ic_name.regex, 'Must contain only alphabets'),
  },
  plan_description: yup.string().required('Plan Name Required')
    .max(validation.plan_description.length, `Maximum ${validation.plan_description.max} character available`)
});

// eslint-disable-next-line no-useless-escape
let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

export const BasicDetails = ({ configs, savedConfig, formId, moveNext, logo, userType }) => {
  const dispatch = useDispatch();
  const [subPolicyTypes, setSubPolicyTypes] = useState([]);
  // const [icName] = useState(savedConfig.industry_ids_mock.length ? savedConfig.ic_name : '');
  const [icLogo, setIcLogo] = useState();

  const isBroker = userType === 'broker'
  const { control, reset, errors, handleSubmit, watch, setValue } = useForm({
    validationSchema: validationSchema(isBroker),
    defaultValues: savedConfig
  })

  const Min_no_of_employee = watch('min_no_of_employee');
  const Max_no_of_employee = watch('max_no_of_employee');

  useEffect(() => {
    if (Min_no_of_employee && Max_no_of_employee) {
      if (Number(Min_no_of_employee) > Number(Max_no_of_employee)) {
        swal('Validtion', 'Min no of employee lives can not be greater than Max employee lives', 'info').then(() => setValue('min_no_of_employee', ''));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Min_no_of_employee, Max_no_of_employee])

  useEffect(() => {
    if (!savedConfig.policy_sub_type_id) {
      reset({
        plan_name: '',
        industry_id: '',
        policy_sub_type_id: '',
        policy_type_id: '',
        max_no_of_employee: '',
        co_oprate_buffer: '',
        co_pay_percentage: '',
        max_discount: '',
        plan_description: '',
        ic_name: ''
      })
    }
    else if (configs.policy_sub_types) {
      reset({
        ...savedConfig,
        co_oprate_buffer: Number(savedConfig?.co_oprate_buffer) === 0 ? String(savedConfig?.co_oprate_buffer) : savedConfig?.co_oprate_buffer || '',
        co_pay_percentage: Number(savedConfig?.co_pay_percentage) === 0 ? String(savedConfig?.co_pay_percentage) : savedConfig?.co_pay_percentage || '',
        max_discount: Number(savedConfig?.max_discount) === 0 ? String(savedConfig?.max_discount) : savedConfig?.max_discount || '',
        max_no_of_employee: Number(savedConfig?.max_no_of_employee) === 0 ? String(savedConfig?.max_no_of_employee) : savedConfig?.max_no_of_employee || ''
      })
      setSubPolicyType(savedConfig?.policy_type_id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig, configs])

  useEffect(() => {
    if (logo.icLogo) {
      setIcLogo(logo.icLogo)
    }
  }, [logo.icLogo])

  const planDescription = watch('plan_description') || '';
  const icName = (watch('ic_name') || '').trim();


  const setSubPolicyType = (policyType) => {
    if (policyType) {
      const options = configs.policy_sub_types
        // eslint-disable-next-line eqeqeq
        .filter(item => String(item.master_policy_id) == policyType)
        .map(item => ({
          id: item.id,
          name: item.name,
          value: item.id
        }));
      setSubPolicyTypes(options);
    } else {
      return null;
    }
  };



  const onSubmit = data => {
    if (isBroker && configs.insurance_compaines.every(({ name }) => name !== icName) && (!logo.icLogo && !icLogo)) {
      swal('Validtion', 'Attach Ic logo to proceed', 'info');
      return
    }

    let ic_response = {};

    if (isBroker) {
      if (configs.insurance_compaines.every(({ name }) => name !== icName)) {
        ic_response = {
          insurer_name: icName,
          is_new_ic: 1
        }
      }
      else {
        ic_response = {
          ic_id: configs.insurance_compaines.find(({ name }) => name === icName).id,
          is_new_ic: 0
        }
      }
    }

    dispatch(saveTempConfig({ ...savedConfig, ...data, ...ic_response }))
    logo.setIcLogo(icLogo)
    moveNext()
  };


  return (
    <Wrapper>
      <Title>
        <h4>
          <span className='dot-xd'></span>
          Basic Details
        </h4>
      </Title>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label='Plan Name'
                  placeholder='Enter Plan Name'
                  required
                  maxLength={validation.plan_name.max}
                  error={errors && errors.plan_name}
                />
              }
              control={control}
              name='plan_name'
            />
            {!!errors.plan_name && <Error>
              {errors.plan_name.message}
            </Error>}
          </Col>

          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Select
                  label='Policy Type'
                  placeholder='Select Policy Type'
                  required
                  options={configs.policy_types ||
                    [{ id: 1, name: 'Group' }, { id: 2, name: 'Topup' }]}
                  error={errors && errors.policy_type_id}
                />
              }
              onChange={([selected]) => {
                setSubPolicyType(selected.target.value);
                return selected;
              }}
              control={control}
              name='policy_type_id'
            />
            {!!errors.policy_type_id && <Error>
              {errors.policy_type_id.message}
            </Error>}
          </Col>

          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Select
                  label='Policy Sub Type'
                  placeholder='Select Policy Sub Type'
                  required
                  options={subPolicyTypes || []}
                  error={errors && errors.policy_sub_type_id}
                />
              }
              control={control}
              name='policy_sub_type_id'
            />
            {!!errors.policy_sub_type_id && <Error>
              {errors.policy_sub_type_id.message}
            </Error>}
          </Col>
          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label='Max Employee Live'
                  placeholder='Enter Max Employee Live'
                  required
                  type='tel'
                  // minLength={2}
                  maxLength={validation.max_no_of_employee.length}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  error={errors && errors.max_no_of_employee}
                />
              }
              control={control}
              name='max_no_of_employee'
            />
            {!!errors.max_no_of_employee && <Error>
              {errors.max_no_of_employee.message}
            </Error>}
          </Col>
          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label='Min Employee Live'
                  placeholder='Enter Min Employee Live'
                  required
                  type='tel'
                  minLength={1}
                  // maxLength={validation.min_no_of_employee.length}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  error={errors && errors.min_no_of_employee}
                />
              }
              control={control}
              name='min_no_of_employee'
            />
            {!!errors.min_no_of_employee && <Error>
              {errors.min_no_of_employee.message}
            </Error>}
          </Col>

          {/* <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label='Corporate Buffer %'
                  placeholder='Enter Corporate Buffer %'
                  type='tel'
                  maxLength={validation.co_oprate_buffer.length}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  required
                  error={errors && errors.co_oprate_buffer}
                />
              }
              control={control}
              name='co_oprate_buffer'
            />
            {!!errors.co_oprate_buffer && <Error>
              {errors.co_oprate_buffer.message}
            </Error>}
          </Col> */}

          {/* <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label='Co-Pay %'
                  placeholder='Enter Co-Pay %'
                  type='tel'
                  maxLength={validation.co_oprate_buffer.length}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  required
                  error={errors && errors.co_pay_percentage}
                />
              }
              control={control}
              name='co_pay_percentage'
            />
            {!!errors.co_pay_percentage && <Error>
              {errors.co_pay_percentage.message}
            </Error>}
          </Col> */}


          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label='Max Discount %'
                  placeholder='Enter Max Discount %'
                  type='tel'
                  maxLength={validation.max_discount.length}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  required
                  error={errors && errors.max_discount}
                />
              }
              control={control}
              name='max_discount'
            />
            {!!errors.max_discount && <Error>
              {errors.max_discount.message}
            </Error>}
          </Col>
          {isBroker && <>
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Typeahead
                    label={'IC Name'}
                    id='ic_name'
                    valueName='name'
                    options={configs.insurance_compaines || []}
                    required
                    value={icName}
                  />
                }
                onChange={([data]) => {
                  return data?.name || '';
                }}
                // defaultValue={configs.insurance_compaines && configs.insurance_compaines[0].name}
                error={errors && errors.ic_name}
                name='ic_name'
                control={control}
              />
              {!!errors.ic_name && <Error>{errors.ic_name.message}</Error>}

            </Col>

            {!!(icName && configs.insurance_compaines.every(({ name }) => name !== icName) && !format.test(icName)) && <Col xl={4} lg={5} md={6} sm={12}>
              <AttachFile
                required
                name={'ic_logo'}
                title={'IC logo'}
                key='premium_file'
                onUpload={setIcLogo}
                defaultFileName={icLogo ? (icLogo && (icLogo[0]?.name || '')) : logo.icLogo && (logo.icLogo[0].name || '')}
                accept='.jpg, .jpeg, .png'
                description='File Formats: jpg, jpeg, png '
                nameBox
              />
            </Col>}
          </>
          }
        </Row>

        <Row>
          <Col xl={12} lg={10} md={12} sm={12}>
            <TextCard className="pl-3 pt-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
              <Marker />
              <Typography>{'\u00A0'} If Renewal journey choosed</Typography>
              <div className='d-flex'>
                <CustomCheck className="custom-control-checkbox">
                  <label className="custom-control-label-check  container-check">
                    <span >{'Should able to view plan?'}</span>
                    <Controller
                      as={
                        <input
                          name={'can_view_plan_for_renewal'}
                          type="checkbox"
                          defaultChecked={savedConfig?.can_view_plan_for_renewal}
                        />
                      }
                      name={'can_view_plan_for_renewal'}
                      onChange={([e]) => e.target.checked ? 1 : 0}
                      control={control}
                      defaultValue={0}
                    />
                    <span className="checkmark-check"></span>
                  </label>
                </CustomCheck>
                <CustomCheck className="custom-control-checkbox">
                  <label className="custom-control-label-check  container-check">
                    <span >{'Should allow payment?'}</span>
                    <Controller
                      as={
                        <input
                          name={'allow_payment_for_renewal'}
                          type="checkbox"
                          defaultChecked={savedConfig?.allow_payment_for_renewal}
                        />
                      }
                      name={'allow_payment_for_renewal'}
                      onChange={([e]) => e.target.checked ? 1 : 0}
                      control={control}
                      defaultValue={0}
                    />
                    <span className="checkmark-check"></span>
                  </label>
                </CustomCheck>
              </div>
            </TextCard>
          </Col>
        </Row>

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
              {`${planDescription.length} / 800`}
            </div>
            <Controller
              as={<TextInput
                maxLength={validation.plan_description.length}
                className='form-control'
                placeholder='Enter Content Here...'
              />}
              name='plan_description'
              control={control}
              error={errors && errors.plan_description}
            />
            <label className='form-label'>
              <span className='span-label'>Plan Description</span>
            </label>
            {!!errors.plan_description && <Error top='0'>
              {errors.plan_description.message}
            </Error>}
          </Col>
        </Row>

      </form>

    </Wrapper>
  )
}
