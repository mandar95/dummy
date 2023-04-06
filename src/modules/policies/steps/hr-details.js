import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import _ from 'lodash';

import { Input, Error, Button, Marker, Typography, Select as SelectDropdwon } from 'components';
import Select from './TypeSelect.js'
import { numOnly, noSpecial } from "utils";


import { common_module } from 'config/validations';
import { selectdropdownData } from "modules/user-management/user.slice";
import SelectCreatableComponent from '../../../components/inputs/Select/SelectCreatableComponent.js';

const validation = common_module.user


const Wrapper = styled.div`
`;

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

// unique validation
const uniquePropertyTest = function (value, propertyName, message) {
  if (
    this.parent
      .filter(v => v !== value)
      .some(v => _.get(v, propertyName) === _.get(value, propertyName)) && value.email && value.contact_no
  ) {
    throw this.createError({
      path: `${this.path}.${propertyName}`,
      message
    });
  }

  return true;
};
yup.addMethod(yup.object, 'uniqueProperty', function (propertyName, message) {
  return this.test('unique', message, function (value) {
    return uniquePropertyTest.call(this, value, propertyName, message);
  });
});
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

const validationSchema = yup.object().shape({
  broker: yup.array().of(
    yup.object().uniqueProperties([
      ['contact_no', 'Mobile No must be unique'],
      ['email', 'Email Id must be unique'],
      ['level', 'level must be unique']
    ]).shape({
      designation_id: yup.object().shape({
        label: yup.string().required('Designation Required'),
      }),
      email: yup.string().email('Enter Valid Email Id').required('Email Id required'),
      contact_name: yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
        .max(validation.name.max, `Maximum ${validation.name.max} character available`)
        .matches(validation.name.regex, "Name must contain only alphabets"),
      contact_no: yup.string()
        .required('Mobile No. is required')
        .min(10, 'Mobile No. should be 10 digits')
        .max(10, 'Mobile No. should be 10 digits')
        .matches(validation.contact.regex, 'Not valid number'),
      // contact_address: yup.string().notRequired().nullable().min(8, `Minimum ${8} character required`)
      //   .max(60, `Maximum ${60} character available`)
      level: yup.string().required('Please select level'),
    })),
  employer: yup.array().of(
    yup.object().uniqueProperties([
      ['contact_no', 'Mobile No must be unique'],
      ['email', 'Email Id must be unique'],
      ['level', 'level must be unique']
    ]).shape({
      designation_id: yup.object().shape({
        label: yup.string().required('Designation Required'),
      }),
      email: yup.string().email('Enter Valid Email Id').required('Email Id required'),
      contact_name: yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
        .max(validation.name.max, `Maximum ${validation.name.max} character available`)
        .matches(validation.name.regex, "Name must contain only alphabets"),
      contact_no: yup.string()
        .required('Mobile No. is required')
        .min(10, 'Mobile No. should be 10 digits')
        .max(10, 'Mobile No. should be 10 digits')
        .matches(validation.contact.regex, 'Not valid number'),
      // contact_address: yup.string().notRequired().nullable().min(8, `Minimum ${8} character required`)
      //   .max(60, `Maximum ${60} character available`)
      level: yup.string().required('Please select level'),
    })),
  // tpa: yup.array().of(
  //   yup.object().uniqueProperties([
  //     ['contact_no', 'Mobile No must be unique'],
  //     ['email', 'Email Id must be unique']
  //   ]).shape({
  //     designation_id: yup.string().notRequired().nullable(),
  //     email: yup.string().email('Enter Valid Email Id').notRequired().nullable(),
  //     contact_name: yup.string().notRequired().nullable().min(validation.name.min, `Minimum ${validation.name.min} character required`)
  //       .max(validation.name.max, `Maximum ${validation.name.max} character available`)
  //       .matches(validation.name.regex, { message: "Name must contain only alphabets", excludeEmptyString: true }),
  //     contact_no: yup.string()
  //       .notRequired().nullable()
  //       .min(10, 'Mobile No. should be 10 digits')
  //       .max(10, 'Mobile No. should be 10 digits')
  //       .matches(validation.contact.regex, { message: 'Not valid number', excludeEmptyString: true }),
  //     contact_address: yup.string().notRequired().nullable().min(8, `Minimum ${8} character required`)
  //       .max(60, `Maximum ${60} character available`)
  //   })),
  // insurer: yup.array().of(
  //   yup.object().uniqueProperties([
  //     ['contact_no', 'Mobile No must be unique'],
  //     ['email', 'Email Id must be unique']
  //   ]).shape({
  //     designation_id: yup.string().notRequired().nullable(),
  //     email: yup.string().email('Enter Valid Email Id').notRequired().nullable(),
  //     contact_name: yup.string().notRequired().nullable().min(validation.name.min, `Minimum ${validation.name.min} character required`)
  //       .max(validation.name.max, `Maximum ${validation.name.max} character available`)
  //       .matches(validation.name.regex, { message: "Name must contain only alphabets", excludeEmptyString: true }),
  //     contact_no: yup.string()
  //       .notRequired().nullable()
  //       .min(10, 'Mobile No. should be 10 digits')
  //       .max(10, 'Mobile No. should be 10 digits')
  //       .matches(validation.contact.regex, { message: 'Not valid number', excludeEmptyString: true }),
  //     contact_address: yup.string().notRequired().nullable().min(8, `Minimum ${8} character required`)
  //       .max(60, `Maximum ${60} character available`)
  //   })),
});

const _level = [{ id: 1, name: 'Level 1' }, { id: 2, name: 'Level 2' }, { id: 3, name: 'Level 3' }]

const HRDetails = props => {
  const { formId, savedConfig, onSave, moveNext } = props;
  // filter 
  const employerContact = savedConfig?.contact_details?.filter(contact => contact && Number(contact.type) === 0)
  const brokerContact = savedConfig?.contact_details?.filter(contact => contact && Number(contact.type) !== 0)
  // const tpaContact = savedConfig?.contact_details?.filter(contact => contact && Number(contact.type) === 2)
  // const insurerContact = savedConfig?.contact_details?.filter(contact => contact && Number(contact.type) === 3)

  const [brokerCount, setBrokerCount] = useState(brokerContact?.length || 1)
  const [employerCount, setEmployerCount] = useState(employerContact?.length || 1)
  // const [tpaCount, setTpaCount] = useState(tpaContact?.length || 1)
  // const [insurerCount, setInsurerCount] = useState(insurerContact?.length || 1)
  const { EmployerUserForContactDetails } = useSelector(state => state.policyConfig);
  const dropDown = useSelector(selectdropdownData);

  const { control, handleSubmit, errors, register, watch, setValue } = useForm({
    defaultValues: (savedConfig && {
      broker: brokerContact,
      employer: employerContact,
      // tpa: tpaContact,
      // insurer: insurerContact
    }) || {},
    validationSchema,
    mode: "onBlur",
    reValidateMode: "onBlur"
  });

  const policyConfigState = useSelector(state => state.policyConfig);

  useEffect(() => {
    const { stepSaved } = policyConfigState;
    if (stepSaved && stepSaved === formId) {
      moveNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyConfigState]);

  const InputStructure = {
    broker: {
      setCount: setBrokerCount,
      count: brokerCount,
      // defaultData: employerContact,
      defaultData: brokerContact,
      type_id: 1
    },
    employer: {
      setCount: setEmployerCount,
      count: employerCount,
      // defaultData: brokerContact,
      defaultData: employerContact,
      type_id: 0
    },
    // tpa: {
    //   setCount: setTpaCount,
    //   count: tpaCount,
    //   defaultData: tpaContact,
    //   type_id: 2
    // },
    // insurer: {
    //   setCount: setInsurerCount,
    //   count: insurerCount,
    //   defaultData: insurerContact,
    //   type_id: 3
    // },
  }

  const addCount = (type) => e => {
    if (InputStructure[type].count !== 30) {
      InputStructure[type].setCount(prev => prev ? prev + 1 : 1);
    }
  }

  const subCount = (type) => e => {
    InputStructure[type].setCount(prev => prev === 1 ? 1 : prev - 1);
  }

  const onSubmit = ({
    employer = [], broker = []
    // , tpa = [], insurer = []
  }) => {

    if (onSave) onSave({
      formId, data: {
        contact_details: [
          ...broker, ...employer,
          // ...tpa, ...insurer
        ]
      }
    });
  };


  const FormStructure = (type) => {
    return (
      <>
        {[...Array(Number(InputStructure[type].count))].map((_, index) => {

          const userEmail = watch(`${type}[${index}].email`)
          const userRole = watch(`${type}[${index}].designation_id`)
          const userDetail = (type === "broker" ? dropDown : EmployerUserForContactDetails)?.find(({ email }) => (email === userEmail));
          let roles = (type === "broker" ? dropDown : EmployerUserForContactDetails)
          roles = [...new Set(roles.map(item => item.role))];

          return <><Row className='position-relative' key={'contact_detail-' + index + type}>
            <p style={{
              top: '14px',
              left: index < 9 ? '-2px':'-9px',
              fontSize: '1.1rem',
            }} className='position-absolute left-0'>{index + 1}.</p>

            {/* <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <SelectCreatableComponent
                    label="Role/Designation Type"
                    id='designation_id'
                    placeholder="Enter Role/Designation Type"
                    required
                    isClearable
                    options={roles.map((role) => ({ id: role, label: role }))}
                  />
                }
                // defaultValue={((InputStructure[type].defaultData || [])[index]?.designation_id) ?
                //   InputStructure[type].defaultData[index].designation_id : ''}
                // onChange={([data]) => data?.name || ""}
                error={errors && errors[type] && errors[type][index]?.designation_id}
                control={control}
                name={`${type}[${index}].designation_id`}
              />
              {!!(errors[type] && errors[type][index]?.designation_id) && <Error>
                {errors[type][index]?.designation_id.message}
              </Error>}
            </Col> */}

            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <SelectCreatableComponent
                    label="Role/Designation Type"
                    placeholder="Enter Role/Designation Type"
                    // value={userRole}
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

            {/* <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Select
                    label="Role/Designation Type"
                    id='designation_id'
                    placeholder="Enter Role/Designation Type"
                    required
                    valueName='name'
                    prefix='Add Custom Role/Designation: '
                    options={roles.map((role) => ({ name: role }))}
                  />
                }
                // defaultValue={((InputStructure[type].defaultData || [])[index]?.designation_id) ?
                //   InputStructure[type].defaultData[index].designation_id : ''}
                onChange={([data]) => data?.name || ""}
                error={errors && errors[type] && errors[type][index]?.designation_id}
                control={control}
                name={`${type}[${index}].designation_id`}
              />
              {!!(errors[type] && errors[type][index]?.designation_id) && <Error>
                {errors[type][index]?.designation_id.message}
              </Error>}
            </Col> */}


            {/* <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Email Id"
                    placeholder="Enter Email Id"
                    required
                  />
                }
                error={errors && errors[type] && errors[type][index]?.email}
                control={control}
                name={`${type}[${index}].email`}
              />
              {!!(errors[type] && errors[type][index]?.email) && <Error>
                {errors[type][index]?.email.message}
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
                    options={type === "broker" ? dropDown?.filter(({ role }) => role === userRole?.value || !userRole?.value).map((item) => ({
                      id: item?.id,
                      name: item?.email
                    })) || [] :
                      EmployerUserForContactDetails?.filter(({ role }) => role === userRole?.value || !userRole?.value).map((item) => ({
                        id: item?.id,
                        name: item?.email
                      })) || []
                    }
                  />
                }
                // defaultValue={((InputStructure[type].defaultData || [])[index]?.email) ?
                //   InputStructure[type].defaultData[index].email : ''}
                onChange={([data]) => {
                  const userEmail = data?.name || ""
                  const userDetail = (type === "broker" ? dropDown : EmployerUserForContactDetails)?.find(({ email }) => (email === userEmail));
                  if (userDetail) {
                    const objName = {}
                    objName[`${type}[${index}].contact_name`] = userDetail.name;
                    const objContact = {}
                    objContact[`${type}[${index}].contact_no`] = userDetail.mobile_no || null;
                    const objRole = {}
                    objRole[`${type}[${index}].designation_id`] = { label: userDetail.role, value: userDetail.role };
                    setValue([objName, objContact, ...userDetail.role !== userRole?.value ? [objRole] : []])
                  }

                  return userEmail
                }}
                error={errors && errors[type] && errors[type][index]?.email}
                control={control}
                name={`${type}[${index}].email`}
              />
              {!!(errors[type] && errors[type][index]?.email) && <Error>
                {errors[type][index]?.email.message}
              </Error>}
            </Col>

            <Col xl={4} lg={5} md={6} sm={12}>
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

            <Col xl={4} lg={5} md={6} sm={12}>
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
                error={errors && errors[type] && errors[type][index]?.contact_no}
                control={control}
                name={`${type}[${index}].contact_no`}
              />
              {!!(errors[type] && errors[type][index]?.contact_no) && <Error>
                {errors[type][index]?.contact_no.message}
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
                error={errors && errors[type] && errors[type][index]?.level}
                control={control}
                name={`${type}[${index}].level`}
              />
              {!!(errors[type] && errors[type][index]?.level) && <Error>
                {errors[type][index]?.level.message}
              </Error>}
            </Col>
            {/* <Col xl={12} lg={10} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="Address"
                    placeholder="Enter Address"
                    required
                  />
                }
                error={errors && errors[type] && errors[type][index]?.contact_address}
                control={control}
                name={`${type}[${index}].contact_address`}
              />
              {!!(errors[type] && errors[type][index]?.contact_address) && <Error>
                {errors[type][index]?.contact_address.message}
              </Error>}
            </Col> */}

            <input ref={register} value={InputStructure[type].type_id} type='hidden'
              name={`${type}[${index}].type`} />
          </Row> {index + 1 !== InputStructure[type].count && <hr />}</>
        }
        )}
        <Row className='mt-3'>
          <Col className="d-flex justify-content-end align-items-center">
            <Button buttonStyle="warning" type='button' onClick={addCount(type)}>
              <i className="ti ti-plus"></i> Add{'\u00A0'}
            </Button>
            {Number(InputStructure[type].count) !== 1 &&
              <Button buttonStyle="danger" type='button' onClick={subCount(type)}>
                <i className="ti ti-minus"></i> Remove
              </Button>}
          </Col>
        </Row>
      </>
    )
  }

  return (
    <Wrapper>
      <Title>
        <h4>
          <span className="dot-xd"></span>
          {/* Account Manager &amp; HR Details */}
          Contact Details
        </h4>
      </Title>
      <FormWrapper>
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Marker />
          {/* abhi changes <Typography className='mt-5'>{'\u00A0'} Insurer Organization</Typography> */}
          <Typography className='mt-5'>{'\u00A0'} Broker Organization</Typography>
          {FormStructure('broker')}
          <Marker />
          <Typography className='mt-5'>{'\u00A0'} Employer Organization</Typography>
          {FormStructure('employer')}

          {/* <Marker />
          <Typography className='mt-5'>{'\u00A0'} TPA Organization</Typography>
          {FormStructure('tpa')}

          <Marker />
          <Typography className='mt-5'>{'\u00A0'} Insurer Organization</Typography>
          {FormStructure('insurer')} */}
        </form>
      </FormWrapper>
    </Wrapper>
  )
}

export default HRDetails;
