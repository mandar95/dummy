import React, { Fragment, useState } from "react";
import * as yup from "yup";

import { Modal, Row, Col, Button as Btn, Table, Form } from "react-bootstrap";
import { Button, Select, Error, Input } from "components";
import { Head } from "modules/RFQ/plan-configuration/style";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { Controller, useForm } from "react-hook-form";
import { TextInput } from "../../../RFQ/plan-configuration/style";
import { Chip } from "../../../../components";
import { BenefitList } from "./styles";
import { noSpecial, numOnlyWithPoint } from "../../../../utils";
import { CoverType, PremiumType } from "./additional-cover";
import _ from "lodash";
import swal from "sweetalert";

const validationSchema = (type, sumInsuredThere) => yup.object().shape({
  benefit_name: yup.string().required("required"),
  ...(type === 'Plan' && sumInsuredThere && { sum_insured: yup.string().required("required") }),
  features: yup.array().of(
    yup.object().shape({
      name: yup.string()
        .required("required"),
    })),
});

const style = {
  minWidth: '110px'
}


export const CreatePlan = ({ show, onHide, Data = {}, configs, setPlanData, type, savedConfig }) => {

  const [additionalCount, setAdditionalCount] = useState((Data.features?.length) || 1);
  const [cappedSumInsured, setCappedSumInsured] = useState((Data.features?.length && Data.features?.map(
    ({ has_capping_data, capping_data }) => !!Number(has_capping_data) ? capping_data?.length || 1 : 1)) || []);

  const [construct, setMemberRelation] = useState(Data.construct || []);

  const { control, handleSubmit, errors, watch, setValue, register } = useForm({
    validationSchema: validationSchema(type, savedConfig.sum_insured?.length),
    defaultValues: ({
      ...Data, features: Data?.features?.map((elem1) => ({
        ...elem1,
        cover_by: String(elem1?.cover_by),
        premium_by: String(elem1?.premium_by),
        has_capping_data: String(elem1?.has_capping_data),
      }))
    })
  });

  const relation_id = watch('relation_id')

  const onSubmit = ({ benefit_description,
    benefit_name,
    min_enchance_si_limit = 0,
    sum_insured, features }) => {

    if (type === 'Plan' && !construct.length) {
      swal('Add Member Type')
      return null;
    }

    const response = {
      features: features?.map(({
        name,
        description,
        cover_by,
        cover,
        cover_type,
        premium_by,
        premium,
        premium_type,
        has_capping_data,
        capping_data,
        min_enhance_si_limit
      }) => ({
        ...(name && { name }),
        ...(description && { description }),
        ...(cover_by && { cover_by }),
        cover: cover || 0,
        ...(cover_type && { cover_type }),
        ...(premium_by && { premium_by }),
        premium: premium || 0,
        ...(premium_type && { premium_type }),
        has_capping_data: Number(has_capping_data),
        min_enhance_si_limit,
        ...(Number(has_capping_data) && { capping_data })
      })) || [],
      ...(benefit_description && { benefit_description: benefit_description }),
      ...(benefit_name && { benefit_name: benefit_name }),
      min_enchance_si_limit,
      construct: construct,
      ...(sum_insured && { sum_insured: sum_insured })
    }
    Data.benefit_name ?
      setPlanData(prev => {
        let BillCopy = _.cloneDeep(prev);
        BillCopy[Data.i] = response;
        return BillCopy
      })
      : setPlanData(prev => [...prev, response]);
    onHide()
  };

  const AddMember = () => {
    if (relation_id) {
      setMemberRelation(prev => [...prev, relation_id]);
      setValue('relation_id', '');
    }
  }

  const removeMember = member_id => {
    const filteredMembers = construct.filter(item => item !== member_id);
    setMemberRelation([...filteredMembers]);
  }

  const addForm = () => {
    setAdditionalCount(prev => prev + 1);
  };

  const removeBill = () => {
    setAdditionalCount(prev => prev ? prev - 1 : prev);
  }

  const addCapped = (id) => {

    setCappedSumInsured(prev => {
      const prevCopy = [...prev];
      prevCopy[id] += 1;
      return prevCopy
    });
  };

  const removeCapped = (id) => {

    setCappedSumInsured(prev => {
      const prevCopy = [...prev];
      prevCopy[id] -= 1;
      return prevCopy
    });
  }

  const NotSwap = type !== 'Swap';

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen={true}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>
            {Data.benefit_name ? 'Update ' : 'Create '}{type}
          </Head>
        </Modal.Title>
      </Modal.Header>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Modal.Body className="text-center mr-5 ml-5">
        <Row className="d-flex justify-content-center flex-wrap">

          <Col md={6} lg={5} xl={4} sm={12}>
            <Controller
              as={
                <Input
                  label={NotSwap ? `${type} Name` : 'Swap Category'}
                  placeholder={NotSwap ? `Enter ${type} Name` : 'Enter Swap Category'}
                  required
                  maxLength={400}
                  error={errors && errors.benefit_name}
                />
              }
              control={control}
              name="benefit_name"
            />
            {!!errors.benefit_name && <Error>
              {errors.benefit_name.message}
            </Error>}
          </Col>
          {['Plan', 'Swap'].includes(type) && savedConfig.sum_insured?.length && <Col md={6} lg={5} xl={4} sm={12}>
            <Controller
              as={
                <Select
                  label="Sum Insured"
                  placeholder="Select Sum Insured"
                  options={savedConfig.sum_insured
                    ?.map((elem) => ({ id: elem, name: elem, value: elem.id }))}
                  required={type === 'Plan'}
                // error={memberError && (['undefined', 'null', ''].includes(construct[index]) || !construct[index])}
                />
              }
              error={errors && errors.sum_insured}
              control={control}
              name="sum_insured"
            />
            {!!errors.sum_insured && <Error>
              {errors.sum_insured.message}
            </Error>}
            {/* <Controller
                as={
                  <Input
                    label="Sum Insured"
                    placeholder="Enter Sum Insured"
                    required={false}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                    maxLength={9}
                    error={errors && errors.sum_insured}
                  />
                }
                control={control}
                name="sum_insured"
              />
              {!!errors.sum_insured && <Error>
                {errors.sum_insured.message}
              </Error>} */}
          </Col>}
          <Col md={6} lg={5} xl={4} sm={12}>
            <Controller
              as={
                <Input
                  label={'Visible From SI Value'}
                  placeholder={'Enter Sum Insured Value'}
                  required={false}
                  type='tel'
                  maxLength={9}
                  onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                  error={errors && errors.min_enchance_si_limit}
                />
              }
              control={control}
              name="min_enchance_si_limit"
            />
            {!!errors.min_enchance_si_limit && <Error>
              {errors.min_enchance_si_limit.message}
            </Error>}
          </Col>
        </Row>
        <Row className="d-flex justify-content-center flex-wrap">
          {type === 'Plan' && <>
            <Col md={6} lg={5} xl={4} sm={12}>
              <Controller
                as={
                  <Select
                    label="Member Type"
                    placeholder="Select Member Type"
                    options={configs.relations
                      .filter((elem) => (!construct.includes(String(elem.id))))
                      .map((elem) => ({ ...elem, value: elem.id }))}
                    required={false}
                  // error={memberError && (['undefined', 'null', ''].includes(construct[index]) || !construct[index])}
                  />
                }
                name={`relation_id`}
                control={control}
                rules={{ required: true }}
              />
            </Col>
            <Col md={6} lg={5} xl={4} sm={12} className="d-flex align-items-center">
              <Btn type='button' onClick={AddMember}>
                Add +
              </Btn>
            </Col>
            <Col md={12} lg={12} xl={12} sm={12}>
              {construct?.length
                ? <BenefitList>
                  {construct.map((member_id, index) =>
                    <Chip
                      key={index + 'construct'}
                      id={member_id}
                      name={configs.relations?.find(({ id }) => Number(member_id) === id)?.name}
                      onDelete={removeMember} />)}
                </BenefitList>
                : null}
            </Col>
          </>}
          {/* 
            <Col md={6} lg={5} xl={4} sm={12}>
              <Controller
                as={<Select
                  label="User"
                  placeholder="Select User"
                  options={reportingData?.data?.map((item) => ({
                    id: item?.user_id,
                    name: item?.user_name,
                    value: item?.user_id,
                  })) || []}
                  required={false} isRequired={true}
                  id="user_id"
                />}
                name="user_id"
                error={errors && errors.user_id}
                control={control}
              />
              {!!errors.user_id &&
                <Error>
                  {errors.user_id.message}
                </Error>}
            </Col> */}

          <Col md={12} lg={12} xl={12} sm={12} className='mt-3 mb-3'>
            <Controller
              as={
                <TextInput
                  className='form-control'
                  placeholder={NotSwap ? 'Enter Content Here...' : 'Enter Content Here'}
                  error={errors && errors.benefit_description}
                />
              }
              name='benefit_description'
              control={control}
            // defaultValue={feature.content}
            />
            <label className='form-label'>
              <span className='span-label'>{NotSwap ? 'Content' : 'Default Options'}</span>
            </label>
            {!!errors.benefit_description && <Error top='0'>
              {errors.benefit_description.message}
            </Error>}
          </Col>

        </Row>

        {additionalCount < 1 ?
          <Row>
            <Col md={6} lg={5} xl={4} sm={12} className="d-flex align-items-center">
              <Btn type='button' onClick={addForm}>Add Benefits +</Btn>
            </Col>
          </Row>
          : <Table className='text-center rounded text-nowrap' style={{ border: 'solid 1px #e6e6e6' }} responsive>
            <thead>
              <tr>
                <th style={style} className='align-top'>{NotSwap ? 'Benefit ' : 'Swap Option '}Name <sup className='text-danger'>*</sup></th>
                <th style={style} className='align-top'>{NotSwap ? 'Benefit ' : 'Swap Option '}Description</th>
                <th style={style} className='align-top'>Cover By</th>
                <th style={style} className='align-top'>Cover Value</th>
                <th style={style} className='align-top'>Cover Type</th>
                <th style={style} className='align-top'>Premium By</th>
                <th style={style} className='align-top'>Premium Value</th>
                <th style={style} className='align-top'>Premium Type</th>
                <th style={style} className='align-top'>Visible From SI Value</th>
                <th style={style} className='align-top'>Sum Insured Cap</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(Number(additionalCount))]?.map((_, index) => {

                const has_capping_data = watch(`features[${index}].has_capping_data`);

                return (<Fragment key={index + 'modal'}><tr>

                  {/* <td>
                      <Form.Control as="select" name={`additional[${index}].deductible_from`} ref={register}>
                        {siAmounts?.map(value => <option key={value + 'sum'} value={value}>{value}</option>)}
                      </Form.Control>
                    </td> */}
                  <td>
                    <Form.Control className='rounded-lg' size='sm' type='text'
                      maxLength={200}
                      name={`features[${index}].name`}
                      ref={register}
                      error={errors && errors.features && errors.features[index] && errors.features[index].name}
                      placeholder={`${NotSwap ? 'Benefit' : 'Swap Option'} Name`} />
                    {!!errors.features && errors.features[index] && errors.features[index].name && <Error top='0'>
                      {errors.features[index].name.message}
                    </Error>}
                  </td>
                  <td>
                    <Form.Control className='rounded-lg' size='sm' type='text'
                      maxLength={1000}
                      name={`features[${index}].description`}
                      ref={register}
                      placeholder={`${NotSwap ? 'Benefit' : 'Swap Option'} Description`} />
                  </td>
                  <td>
                    <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 0px' }}>
                      <CustomControl className='d-flex mt-4 mr-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Value'}</p>
                        <input name={`features[${index}].cover_by`} ref={register} type={'radio'} value={1} defaultChecked={true} />
                        <span></span>
                      </CustomControl>
                      <CustomControl className='d-flex mt-4 ml-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By SI %'}</p>
                        <input name={`features[${index}].cover_by`} ref={register} type={'radio'} value={2} defaultChecked={!true} />
                        <span></span>
                      </CustomControl>
                    </div>
                  </td>
                  <td>
                    <Form.Control className='rounded-lg' size='sm' type='tel'
                      maxLength={9}
                      onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                      name={`features[${index}].cover`}
                      ref={register}
                      placeholder='Cover Value'
                      defaultValue='0' />
                  </td>

                  <td>
                    <Form.Control as="select" name={`features[${index}].cover_type`} ref={register}>
                      {CoverType.map(({ value, name }) => <option key={value + 'cover_type'} value={value}>{name}</option>)}
                    </Form.Control>
                  </td>

                  {/* Premium */}
                  <td>
                    <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 0px' }}>
                      <CustomControl className='d-flex mt-4 mr-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Value'}</p>
                        <input name={`features[${index}].premium_by`} ref={register} type={'radio'} value={1} defaultChecked={true} />
                        <span></span>
                      </CustomControl>
                      <CustomControl className='d-flex mt-4 ml-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Premium %'}</p>
                        <input name={`features[${index}].premium_by`} ref={register} type={'radio'} value={2} defaultChecked={!true} />
                        <span></span>
                      </CustomControl>
                    </div>
                  </td>
                  <td>
                    <Form.Control className='rounded-lg' size='sm' type='tel'
                      maxLength={9}
                      onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                      name={`features[${index}].premium`}
                      ref={register}
                      placeholder='Premium Value'
                      defaultValue='0' />
                  </td>

                  <td>
                    <Form.Control as="select" name={`features[${index}].premium_type`} ref={register}>
                      {PremiumType.map(({ value, name }) => <option key={value + 'cover_type'} value={value}>{name}</option>)}
                    </Form.Control>
                  </td>

                  <td>
                    <Form.Control className='rounded-lg' size='sm' type='tel'
                      maxLength={9}
                      onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                      name={`features[${index}].min_enhance_si_limit`}
                      ref={register}
                      placeholder='Enter SI Value'
                      defaultValue='0' />
                  </td>


                  <td>
                    <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 0px' }}>
                      <CustomControl className='d-flex mt-4 mr-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'No'}</p>
                        <input name={`features[${index}].has_capping_data`} ref={register} type={'radio'} value={0} defaultChecked={true} />
                        <span></span>
                      </CustomControl>
                      <CustomControl className='d-flex mt-4 ml-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Yes'}</p>
                        <input name={`features[${index}].has_capping_data`} onChange={() => setCappedSumInsured(prev => {
                          const prevCopy = [...prev];
                          prevCopy[index] = 1;
                          return prevCopy
                        })}
                          ref={register} type={'radio'} value={1} defaultChecked={!true} />
                        <span></span>
                      </CustomControl>
                    </div>
                  </td>

                </tr>
                  {!!Number(has_capping_data) && <tr >
                    <td colSpan="2" className='border-top-0'></td>
                    <td colSpan="5" className='border-top-0'>


                      <Table className='text-center rounded text-nowrap' style={{ border: 'solid 1px #e6e6e6' }}>
                        <tr>
                          <th style={style} className='align-top'>Sum Insured</th>
                          <th style={style} className='align-top'>Single Parent Premium</th>
                          <th style={style} className='align-top'>Double Parent Premium</th>
                        </tr>

                        {[...Array(Number(cappedSumInsured[index] || 0))]?.map((_, index2) =>
                          <tr key={index2 + 'capped'}>
                            <td>
                              <Form.Control className='rounded-lg' size='sm' type='tel'
                                maxLength={9}
                                onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                                name={`features[${index}].capping_data[${index2}].sum_insured`}
                                ref={register}
                                placeholder='Sum Insured'
                                defaultValue='0' />
                            </td>
                            <td>
                              <Form.Control className='rounded-lg' size='sm' type='tel'
                                maxLength={9}
                                onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                                name={`features[${index}].capping_data[${index2}].single_parent_premium`}
                                ref={register}
                                placeholder='Single Parent Premium'
                                defaultValue='0' />
                            </td>
                            <td>
                              <Form.Control className='rounded-lg' size='sm' type='tel'
                                maxLength={9}
                                onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                                name={`features[${index}].capping_data[${index2}].double_parent_premium`}
                                ref={register}
                                placeholder='Double Parent Premium'
                                defaultValue='0' />
                            </td>
                          </tr>)}

                        <tr>
                          <td colSpan="9">
                            {cappedSumInsured >= 1 && <i className="btn ti-trash text-danger" onClick={() => removeCapped(index)} />}
                            <i className="btn ti-plus text-success" onClick={() => addCapped(index)} />
                          </td>
                        </tr>
                      </Table>
                    </td>
                    <td colSpan="2" className='border-top-0'></td>
                  </tr>}
                </Fragment>)
              })}

              <tr>
                <td colSpan="9">
                  {additionalCount >= 1 && <i className="btn ti-trash text-danger" onClick={removeBill} />}
                  <i className="btn ti-plus text-success" onClick={addForm} />
                </td>
              </tr>
            </tbody>

          </Table>}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleSubmit(onSubmit)} >{Data.benefit_name ? 'Update' : 'Submit'}</Button>
      </Modal.Footer>
      {/* </form> */}
    </Modal >
  );
};
