import React, { useState } from 'react';

import { Modal, Table, Form, Row, Col } from 'react-bootstrap';
import { Button, Error } from 'components';
import { Head, TextInput } from '../../style'
import { CustomControl } from 'modules/user-management/AssignRole/option/style';
import { Switch } from "modules/user-management/AssignRole/switch/switch";

import { Controller, useForm } from 'react-hook-form';
import { numOnly, noSpecial, numOnlyWithPoint } from 'utils';
import { insurer } from 'config/validations'

export const PremiumType = [
  { id: 1, value: 1, name: 'Loading' },
  { id: 2, value: 2, name: 'Discount' },
]

const validation = insurer.plan_config

export const EditModal = ({ show, onHide, feature, siAmounts, Data, setFeatures }) => {

  const { register, control, handleSubmit, errors, watch } = useForm({
    defaultValues: Data || {}
  })
  // const [wavier, setWavier] = useState(false);
  const [additionalCount, setAdditionalCount] = useState((Data?.additional?.length) || 1);
  // const durationUnit = watch('additional[0].duration_unit') || '1'
  const Additional = watch('additional') || []

  // useEffect(() => {
  //   Additional.forEach((_, index) => {
  //     if ((feature.product_feature_type_id === 5 &&
  //       !Number(Additional[index]?.wavier))) {
  //       setValue(`additional[${index}].premium`, 0)
  //     }
  //   })
  // }, [Additional])

  const addForm = () => {
    setAdditionalCount(prev => prev + 1);
  };

  const removeBill = (id) => {
    setAdditionalCount(prev => prev ? prev - 1 : prev);
  }

  const onSubmit = (data) => {
    let _data = {
      ...data,
      additional: data?.additional?.map((elem) => ({
        ...elem,
        premium_by: elem.premium_by || '1'
      }))
    }
    setFeatures(prev => {
      const removeCurrentData = prev.filter(({ product_feature_id }) => Number(product_feature_id) !== Number(feature.id))
      return [...removeCurrentData, { ..._data, product_feature_id: feature.id }]
    })
    onHide()
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      dialogClassName='my-modal'>
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          <Head>{feature.name}</Head>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className='text-center mr-5 ml-5'>

          <Table className='text-center rounded text-nowrap' style={{ border: 'solid 1px #e6e6e6' }} responsive>
            <thead>
              <tr>
                {/* {!ExcludeSumIns.includes(Number(feature.id)) && <> */}
                {feature.include_multiple_si === 1 && <>
                  <th style={style} className='align-top'>Deductible From (SI)<sup className='text-danger'>*</sup></th>
                  <th style={style} className='align-top'>Sum Insured Type<sup className='text-danger'></sup></th>
                  <th style={style} className='align-top'>Sum Insured<sup className='text-danger'>*</sup></th>
                </>}
                {feature.product_feature_type_id === 2 && <>
                  <th style={style} className='align-top'>Duration Period<sup className='text-danger'>*</sup></th>
                  <th style={style} className='align-top'>Duration Type<sup className='text-danger'></sup></th>
                  <th style={style} className='align-top'>Duration<sup className='text-danger'>*</sup></th>
                </>}
                {feature.product_feature_type_id === 3 &&
                  <th style={style} className='align-top'>Name<sup className='text-danger'>*</sup></th>
                }
                {feature.product_feature_type_id === 5 &&
                  <th style={style} className='align-top'>Is Covered<sup className='text-danger'></sup></th>
                }
                {/* {((feature.product_feature_type_id === 5 && wavier) || feature.product_feature_type_id !== 5) && */}
                <th style={style} className='align-top'>Premium By<sup className='text-danger'></sup></th>
                <th style={style} className='align-top'>Premium<sup className='text-danger'></sup></th>
                <th style={style} className='align-top'>Premium Type<sup className='text-danger'></sup></th>
                {/* } */}
              </tr>
            </thead>
            <tbody>
              {[...Array(Number(additionalCount))]?.map((_, index) => {

                return (<tr key={index + 'modal'}>
                  {/* <input type='hidden' name={`additional[${index}].deductible_from`} value={sumInsured} ref={register} /> */}
                  <input type='hidden' name={'product_feature_id'} value={feature.id} ref={register} />
                  {/* {!ExcludeSumIns.includes(Number(feature.id)) && <> */}
                  {feature.include_multiple_si === 1 && <>
                    <td>
                      {/* <td>{sumInsured}</td> */}
                      <Form.Control as="select" name={`additional[${index}].deductible_from`} ref={register}>
                        {siAmounts?.map(value => <option key={value + 'sum'} value={value}>{value}</option>)}
                      </Form.Control>
                    </td>
                    <td>
                      <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 28px' }}>
                        <CustomControl className='d-flex mt-4 mr-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Value'}</p>
                          <input name={`additional[${index}].sum_insured_type`} ref={register} type={'radio'} value={1} defaultChecked={true} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className='d-flex mt-4 ml-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By SI %'}</p>
                          <input name={`additional[${index}].sum_insured_type`} ref={register} type={'radio'} value={2} defaultChecked={!true} />
                          <span></span>
                        </CustomControl>
                      </div>
                    </td>
                    <td>
                      <Form.Control className='rounded-lg' size='sm' type='tel'
                        maxLength={validation.sum_prem?.length}
                        onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                        name={`additional[${index}].sum_insured`}
                        ref={register({
                          validate: {
                            ...Additional[index]?.premium && { required: value => !!value },
                            min: value => Number(value) >= 0,
                            max: value => Number(value) <= validation.sum_prem.max,
                          }
                        })}
                        placeholder='Sum Insured' />
                      {!!errors.additional && errors.additional[index] && errors.additional[index].sum_insured && <Error top='0'>
                        {errors.additional[index].sum_insured.type === 'required' && 'Sum Insured Required'}
                        {errors.additional[index].sum_insured.type === 'min' && 'Min Value ' + 0}
                        {errors.additional[index].sum_insured.type === 'max' && 'Max Value ' + validation.sum_prem.max}
                      </Error>}
                    </td>
                  </>}
                  {feature.product_feature_type_id === 2 && <>
                    {/* <input type='hidden' name={`additional[${index}].duration_unit`} value={durationUnit} ref={register} /> */}
                    {/* <input type='hidden' name={`additional[${index}].duration_type`} value={durationType} ref={register} /> */}
                    <td>
                      <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 28px' }}>
                        <CustomControl className='d-flex mt-4 mr-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Days'}</p>
                          <input name={`additional[${index}].duration_unit`} ref={register} type={'radio'} value={1} defaultChecked={true} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className='d-flex mt-4 ml-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Month'}</p>
                          <input name={`additional[${index}].duration_unit`} ref={register} type={'radio'} value={2} defaultChecked={!true} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className='d-flex mt-4 ml-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Year'}</p>
                          <input name={`additional[${index}].duration_unit`} ref={register} type={'radio'} value={3} defaultChecked={!true} />
                          <span></span>
                        </CustomControl>
                      </div>
                    </td>
                    <td>
                      <Form.Control className='rounded-lg' size='sm' type='tel'
                        maxLength={100}
                        // onKeyDown={numOnly} onKeyPress={noSpecial}
                        name={`additional[${index}].duration_type`}
                        ref={register({
                          // validate: {
                          // ...Additional[0]?.premium && { required: value => !!value },
                          // min: value => Number(value) >= 0,
                          // max: value => Number(value) <= validation.sum_prem.max,
                          // }
                        })}
                        placeholder='Duration' />
                      {!!errors.additional && errors.additional[index]?.duration_type && <Error top='0'>
                        {/* {errors.additional[index].duration_type.type === 'required' && 'Duration Required'} */}
                        {/* {errors.additional[index].duration_type.type === 'min' && 'Min Value ' + 0}
                        {errors.additional[index].duration_type.type === 'max' && 'Max Value ' + validation.sum_prem.max} */}
                      </Error>}
                    </td>
                    <td>
                      {/* {Duration} */}
                      {/* <input
                        name={`additional[${index}].duration_value`}
                        type='hidden'
                        ref={register}
                        value={Duration}
                      /> */}
                      <Form.Control className='rounded-lg' size='sm' type='tel'
                        maxLength={validation.sum_prem?.length}
                        onKeyDown={numOnly} onKeyPress={noSpecial}
                        name={`additional[${index}].duration_value`}
                        ref={register({
                          validate: {
                            ...Additional[0]?.premium && { required: value => !!value },
                            min: value => Number(value) >= 0,
                            max: value => Number(value) <= validation.sum_prem.max,
                          }
                        })}
                        placeholder='Duration' />
                      {!!errors.additional && errors.additional[index]?.duration_value && <Error top='0'>
                        {errors.additional[index].duration_value.type === 'required' && 'Duration Required'}
                        {errors.additional[index].duration_value.type === 'min' && 'Min Value ' + 0}
                        {errors.additional[index].duration_value.type === 'max' && 'Max Value ' + validation.sum_prem.max}
                      </Error>}
                      {/* <Form.Control className='rounded-lg' size='sm' type='tel'
                        maxLength={validation.sum_prem?.length}
                        onKeyDown={numOnly} onKeyPress={noSpecial}
                        name={`additional[${index}].duration_value`}
                        ref={register({
                          validate: {
                            ...Additional[index]?.premium && { required: value => !!value },
                            min: value => Number(value) >= 0,
                            max: value => Number(value) <= validation.sum_prem.max,
                          }
                        })}
                        placeholder='Duration' />
                      {!!errors.additional && errors.additional[index] && errors.additional[index].duration_value && <Error top='0'>
                        {errors.additional[index].duration_value.type === 'required' && 'Duration Required'}
                        {errors.additional[index].duration_value.type === 'min' && 'Min Value ' + 0}
                        {errors.additional[index].duration_value.type === 'max' && 'Max Value ' + validation.sum_prem.max}
                      </Error>} */}
                    </td>
                  </>}
                  {feature.product_feature_type_id === 3 &&
                    <td>
                      <Form.Control className='rounded-lg' size='sm' type='text'
                        maxLength={100}
                        name={`additional[${index}].name`}
                        ref={register({
                          validate: {
                            ...Additional[index]?.premium && { required: value => !!value },
                            // min: value => Number(value) >= 0,
                            // max: value => Number(value) <= validation.sum_prem.max,
                          }
                        })}
                        placeholder='Name' />
                      {!!errors.additional && errors.additional[index] && errors.additional[index].name && <Error top='0'>
                        {errors.additional[index].name.type === 'required' && 'Name Required'}
                        {/* {errors.additional[index].name.type === 'min' && 'Min Value ' + 0}
                        {errors.additional[index].name.type === 'max' && 'Max Value ' + validation.sum_prem.max} */}
                      </Error>}
                    </td>
                  }
                  {feature.product_feature_type_id === 5 &&
                    <td>
                      <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 28px' }}>
                        <CustomControl className='d-flex mt-4 mr-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Yes'}</p>
                          <input name={`additional[${index}].wavier`} ref={register} type={'radio'} value={1} defaultChecked={!true} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className='d-flex mt-4 ml-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'No'}</p>
                          <input name={`additional[${index}].wavier`} ref={register} type={'radio'} value={0} defaultChecked={true} />
                          <span></span>
                        </CustomControl>
                      </div>
                      {/* <TabWrapper width='135px'>
                        <Tab onClick={() => setWavier(true)} isActive={wavier}>Yes</Tab>
                        <Tab onClick={() => setWavier(false)} isActive={!wavier}>No</Tab>
                      </TabWrapper>
                      <input type='hidden' name={`additional[${index}].wavier`} value={wavier ? 1 : 0} ref={register} /> */}
                    </td>
                  }
                  {/* {((feature.product_feature_type_id === 5 && wavier) || feature.product_feature_type_id !== 5) && */}
                  <td>
                    <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 28px' }}>
                      <CustomControl className='d-flex mt-4 mr-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Value'}</p>
                        <input name={`additional[${index}].premium_by`} ref={register} type={'radio'} value={1} defaultChecked={true} />
                        <span></span>
                      </CustomControl>
                      <CustomControl className='d-flex mt-4 ml-0'>
                        <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Premium %'}</p>
                        <input name={`additional[${index}].premium_by`} ref={register} type={'radio'} value={2} defaultChecked={!true} />
                        <span></span>
                      </CustomControl>
                    </div>
                  </td>
                  <td>
                    <Form.Control className='rounded-lg' size='sm' type='tel'
                      maxLength={validation.sum_prem?.length}
                      onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                      disabled={!((feature.product_feature_type_id === 5 && Number(Additional[index]?.wavier))
                        || feature.product_feature_type_id !== 5)}
                      name={`additional[${index}].premium`}
                      defaultValue={((feature.product_feature_type_id === 5 && !Number(Additional[index]?.wavier)) && '0') ||
                        (Additional[index]?.premium || '')}
                      ref={register({
                        validate: {
                          // ...Additional[index]?.premium && { required: value => !!value },
                          min: value => Number(value) >= 0,
                          max: value => Number(value) <= validation.sum_prem.max,
                        }
                      })}
                      placeholder={((feature.product_feature_type_id === 5 && Number(Additional[index]?.wavier))
                        || feature.product_feature_type_id !== 5) ? 'Premium' : 'Not Covered'} />
                    {!!errors.additional && errors.additional[index] && errors.additional[index].premium && <Error top='0'>
                      {/* {errors.additional[index].premium.type === 'required' && 'Premium Required'} */}
                      {errors.additional[index].premium.type === 'min' && 'Min Value ' + 0}
                      {errors.additional[index].premium.type === 'max' && 'Max Value ' + validation.sum_prem.max}
                    </Error>}
                  </td>
                  <td>
                    <Form.Control as="select" name={`additional[${index}].premium_type`} ref={register}>
                      {PremiumType.map(({ value, name }) => <option key={value + 'cover_type'} value={value}>{name}</option>)}
                    </Form.Control>
                  </td>
                  {/* } */}
                </tr>)
              })}

              {/* {feature.product_feature_type_id === 3 && */}
              {/* {!noMultipleAdd.includes(feature.id) && */}
              {(feature.include_multiple_si !== 0 || additionalCount >= 1) &&
                <tr>
                  <td colSpan="8">
                    {additionalCount >= 1 && <i className="btn ti-trash text-danger" onClick={removeBill} />}
                    {feature.include_multiple_si !== 0 && <i className="btn ti-plus text-success" onClick={addForm} />}
                  </td>
                </tr>}
              {/* } */}
            </tbody>

          </Table>


          <Row className='d-flex mt-3 mb-3 justify-content-center'>
            <Col md={12} lg={12} xl={12} sm={12}>
              <Controller
                as={<Switch />}
                name="is_mandantory"
                label='Is Mandatory'
                control={control}
                defaultValue={!!Data?.is_mandantory}
              />
            </Col>
            <Col md={12} lg={12} xl={12} sm={12}>
              <Controller
                as={
                  <TextInput
                    className='form-control'
                    placeholder='Enter Content Here...'
                  />
                }
                name='content'
                control={control}
                defaultValue={feature.content}
              />
              <label className='form-label'>
                <span className='span-label'>Content</span>
              </label>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button type='submit'>Save</Button>
        </Modal.Footer>
      </Form>
    </Modal >
  );
}

const style = {
  minWidth: '110px'
}
