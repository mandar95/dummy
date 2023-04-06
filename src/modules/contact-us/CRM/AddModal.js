import React, { useState, useEffect } from 'react';
import * as yup from 'yup';

import { Modal, Row, Col } from 'react-bootstrap';
import { Input, Button, Select, SelectComponent, Error, Head } from '../../../components'
import { CustomControl } from 'modules/user-management/AssignRole/option/style';


import { Controller, useForm } from 'react-hook-form';

import { numOnly, noSpecial } from '../../../utils';
import { addContact, updateContact } from '../contact.us.action';
import { TextInput } from '../../RFQ/plan-configuration/style';
import { common_module } from 'config/validations';
const validation = common_module.user;


const validationSchema = (contact_type, sequenceTab) => yup.object().shape({
  email: yup.string().email('Enter Valid Email Id').required('Email Id required'),
  name: yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
    .max(validation.name.max, `Maximum ${validation.name.max} character available`)
    // eslint-disable-next-line no-useless-escape
    .matches(/^[a-zA-Z0-9-.\/\[\]\{\}\(\)\s]+$/, {
      message: 'Alphanumeric characters,brackets ()[]{}, hyphen(-), dot (.) & frontslash(/) only',
      excludeEmptyString: true,
    }),
  contact: yup.string()
    .required('Mobile No. is required')
    .min(10, 'Mobile No. should be 10 digits')
    .max(10, 'Mobile No. should be 10 digits')
    .matches(validation.contact.regex, 'Not valid number'),
  address: yup.string().required('Address required').min(8, `Minimum ${8} character required`)
    .max(500, `Maximum ${500} character available`),
  ...contact_type === 1 && {
    employer_id: yup.object().shape({
      id: yup.string().required('Employer Required'),
    })
  },
  ...contact_type === 0 && {
    policy_id: yup.object().shape({
      id: yup.string().required('Policy Name Required'),
    })
  },
  ...sequenceTab && {
    sequence: yup.string().required('Sequence Required'),
  },
  level: yup.string().required('Level Required'),

})

const Levels = [
  { id: 1, name: 'Level 1', value: 1 },
  { id: 2, name: 'Level 2', value: 2 },
  { id: 3, name: 'Level 3', value: 3 },
]
const SelectSequence = [
  { id: 1, name: '1', value: 1 },
  { id: 2, name: '2', value: 2 },
  { id: 3, name: '3', value: 3 },
  { id: 4, name: '4', value: 4 },
];
const FilterLevel = (policy_id, employer_id, data, contact_data, contact_type) => {

  if (contact_type) {
    // employer wise
    let levels = [];
    contact_data.forEach((elem) => {
      if (elem.employer_id === employer_id && data.level !== elem.level) {
        levels.push(elem.level)
      }
    })
    return Levels.filter(({ id }) => !levels.includes(id))
  }
  else {
    // policy wise
    let levels = [];
    contact_data.forEach((elem) => {
      if (elem.policy_id === policy_id && data.level !== elem.level) {
        levels.push(elem.level)
      }
    })
    return Levels.filter(({ id }) => !levels.includes(id))
  }
}

export const AddModal = ({ data, contact_data, onHide, show, typeData, dispatch, currentUser, employers, policy_nos }) => {

  const [contact_type, set_contact_type] = useState(data.employer_id ? 1 : 0);
  const [sequenceTab, setSequenceTab] = useState(false);

  const { control, handleSubmit, register, errors, watch, setValue } = useForm({
    defaultValues: data?.id ?
      {
        ...data,
        ...data.employer_id && { employer_id: employers.find(({ id }) => id === Number(data.employer_id)) },
        ...data.policy_id && { policy_id: policy_nos.find(({ id }) => id === Number(data.policy_id)) }
      } : {},
    validationSchema: validationSchema(contact_type, sequenceTab)
  });

  // const contact_type = watch('contact_type') ?? (data.employer_id ? 1 : 0);
  const policy_id = Number(watch('policy_id')?.value);
  const employer_id = Number(watch('employer_id')?.value);

  let selectedLevel = watch("level");
  useEffect(() => {
    if (Number(selectedLevel) === 1) {
      setSequenceTab(true);
    } else {
      setSequenceTab(false);
    }
  }, [selectedLevel]);

  const onSubmit = ({ employer_id, policy_id, ...rest }) => {

    const payload = {
      ...rest,
      ...employer_id && { employer_id: employer_id?.value },
      ...policy_id && { policy_id: policy_id?.value }
    }

    data?.id ? updateContact(dispatch, data?.id, payload, currentUser?.broker_id) :
      addContact(dispatch, payload, currentUser?.broker_id)
  };
  return (
    <Modal
      onHide={onHide}
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="fullscreen-modal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {data?.id ? 'Edit' : 'Add'} {typeData.title} Contact
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className='d-flex justify-content-center' >
            <Col md={6} lg={6} xl={4} sm={12}>
              <Head className='text-center'>Contact Type ?</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Policy Wise"}</p>
                  <input ref={register} onClick={() => {
                    set_contact_type(0);
                    setValue('policy_id', undefined)
                    setValue('employer_id', undefined)

                  }} name={'contact_type'} type={'radio'} value={0} defaultChecked={!data.employer_id ? true : false} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Employer Wise"}</p>
                  <input ref={register} onClick={() => {
                    set_contact_type(1);
                    setValue('policy_id', undefined)
                    setValue('employer_id', undefined)
                  }} name={'contact_type'} type={'radio'} value={1} defaultChecked={data.employer_id ? true : false} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>

            <Col xl={3} lg={6} md={6} sm={12}>
              {!Number(contact_type) ? <>
                <Controller
                  as={
                    <SelectComponent
                      label="Policy Name"
                      placeholder="Select Policy Name"
                      required
                      id='policy_id'
                      options={policy_nos.filter(({ id }) => contact_data.filter(({ policy_id }) => policy_id === id && id !== data.policy_id).length < 3)}
                      error={errors && errors.policy_type} />
                  }
                  error={errors && errors?.policy_id?.id}
                  control={control}
                  name={'policy_id'}
                />
                {!!(errors?.policy_id?.id) && <Error>
                  {errors?.policy_id?.id.message}
                </Error>}
              </>
                :
                <>
                  <Controller
                    as={
                      <SelectComponent
                        label="Employer Name"
                        placeholder="Select Employer Name"
                        required
                        id='employer_id'
                        options={employers.filter(({ id }) => contact_data.filter(({ employer_id }) => +employer_id === +id && +id !== +data.employer_id).length < 3)}
                        error={errors && errors.policy_type} />
                    }
                    error={errors && errors?.employer_id?.id}
                    control={control}
                    name={'employer_id'}
                  />
                  {!!(errors?.employer_id?.id) && <Error>
                    {errors?.employer_id?.id.message}
                  </Error>}
                </>}
            </Col>
            {sequenceTab && <Col xl={3} lg={6} md={6} sm={12}>
              <Controller
                as={
                  <Select
                    label="Sequence"
                    placeholder="Select Sequence"
                    isRequired={false}
                    required={false}
                    options={SelectSequence} />
                }
                error={errors && errors?.sequence}
                control={control}
                name={'sequence'}
              />
              {!!(errors?.sequence) && <Error>
                {errors?.sequence.message}
              </Error>}
            </Col>}
          </Row>

          <Row>

            <Col xl={3} lg={6} md={6} sm={12}>
              <Controller
                as={
                  <Select
                    label="Level"
                    placeholder="Select Level"
                    required={false}
                    isRequired
                    options={FilterLevel(policy_id, employer_id, data, contact_data, Number(contact_type))}
                    error={errors && errors.policy_type} />
                }
                error={errors && errors?.level}
                control={control}
                name={'level'}
              />
              {!!(errors?.level) && <Error>
                {errors?.level.message}
              </Error>}
            </Col>

            <Col xl={3} lg={6} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Name"
                    placeholder="Enter Name"
                    isRequired
                  />
                }
                error={errors && errors?.name}
                control={control}
                name={`name`}
              />
              {!!(errors?.name) && <Error>
                {errors?.name.message}
              </Error>}
            </Col>

            <Col xl={3} lg={6} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Email Id"
                    placeholder="Enter Email Id"
                    isRequired
                  />
                }
                error={errors && errors?.email}
                control={control}
                name={`email`}
              />
              {!!(errors?.email) && <Error>
                {errors?.email.message}
              </Error>}
            </Col>

            <Col xl={3} lg={6} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Mobile No"
                    placeholder="Enter Mobile No"
                    isRequired
                    type='tel'
                    maxLength={10}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                  />
                }
                error={errors && errors?.contact}
                control={control}
                name={`contact`}
              />
              {!!(errors?.contact) && <Error>
                {errors?.contact.message}
              </Error>}
            </Col>

            <Col className='mx-auto' xl={10} lg={10} md={12} sm={12}>
              <Controller
                as={<TextInput
                  maxLength={500}
                  className='form-control'
                  placeholder='Enter Address'
                />}
                error={errors && errors?.address}
                control={control}
                name={`address`}
              />
              <label className='form-label'>
                <span className='span-label'>Address
                  <sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
                </span>
              </label>
              {!!(errors?.address) && <Error top={'7px'}>
                {errors?.address.message}
              </Error>}
            </Col>

            <input ref={register} value={typeData.type} type='hidden'
              name={`type`} />
            <input ref={register} value={currentUser.broker_id} type='hidden'
              name={`broker_id`} />
          </Row>

          {/* </>
          )} */}
          {/* <Row className='mt-3'>
            <Col className="d-flex justify-content-end align-items-center">
              {<Button buttonStyle="warning" type='button' onClick={addCount}>
                <i className="ti ti-plus"></i> Add{'\u00A0'}
              </Button>}
              {Number(count) !== 1 &&
                <Button buttonStyle="danger" type='button' onClick={subCount}>
                  <i className="ti ti-minus"></i> Remove
                </Button>}
            </Col>
          </Row> */}
          <Row>
            <Col>
              <Button
                className="m-3"
                type="button"
                buttonStyle='outline-secondary'
                onClick={onHide}>
                Cancel
              </Button>
              <Button
                className="m-3"
                type="submit">
                {data?.id ? 'Update' : 'Submit'}
              </Button>

            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
}
