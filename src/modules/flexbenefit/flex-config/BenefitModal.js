import React, { Fragment, useState } from "react";
import * as yup from "yup";
import _ from "lodash";

import { Modal, Row, Col, Button as Btn, Table, Form } from "react-bootstrap";
import { Button, Error } from "components";
import { Head } from "modules/RFQ/plan-configuration/style";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { Controller, useForm } from "react-hook-form";
import { noSpecial, numOnlyWithPoint } from "utils";
import { CoverType, PremiumType } from "../../policies/steps/additional-details/additional-cover";
import { TextInput } from "../../RFQ/plan-configuration/style";
import { Input, SelectComponent } from "../../../components";

const validationSchema = yup.object().shape({
  benefit_name: yup.object().shape({
    id: yup.string().required('required')
  }),
  features: yup.array().of(
    yup.object().shape({
      cover: yup.string()
        .required("required"),
    })),
});

const style = {
  minWidth: '110px'
}

export const CustomNames = ['ab12', 'co pay']

export const BenefitModal = ({ show, onHide, setValueParent,
  setPlanData, set_deleted_feature_ids, benefit_master,
  benefits_covered, benefits_not_covered }) => {

  const [additionalCount, setAdditionalCount] = useState((show.features?.length) || 1);

  const [cappedSumInsured, setCappedSumInsured] = useState((show.features?.length && show.features?.map(
    ({ has_capping_data, capping_data }) => !!Number(has_capping_data) ? capping_data?.length || 1 : 1)) || []);

  const { handleSubmit, errors, control, register, watch } = useForm({
    validationSchema: validationSchema,
    defaultValues: show ? ({
      ...show,
      mandatory_type: String(show?.mandatory_type || 0),
      ...show.mandatory_if_not_selected_benefit_ids && {
        mandatory_if_not_selected_benefit_ids: benefit_master.filter(({ id }) => show.mandatory_if_not_selected_benefit_ids.some(item => +item.id === id)).map(item => (
          {
            id: item.id,
            label: item.name,
            value: item.id
          }
        ))
      },
      features: show?.features?.map((elem1) => ({
        ...elem1,
        cover_by: String(elem1?.cover_by),
        premium_by: String(elem1?.premium_by),
        has_capping_data: String(elem1?.has_capping_data),
      }))
    }) : {}
  });

  const benefit_name = watch('benefit_name');
  const mandatory_type = watch('mandatory_type');

  const onSubmit = ({ benefit_description,
    benefit_name,
    min_enchance_si_limit = 0,
    mandatory_type = 0,
    mandatory_if_not_selected_benefit_ids = [],
    features }) => {

    (show.features || []).forEach(({ id }) => {
      if (id) {
        const notFound = features.every((feature) => Number(feature.id) !== Number(id))
        notFound && set_deleted_feature_ids(prev => [...prev, id])
      }
    })


    const response = {
      // ...show,
      ...show.id && { id: show.id },
      product_feature_id: benefit_name.id,
      mandatory_type,
      ...mandatory_if_not_selected_benefit_ids?.length && { mandatory_if_not_selected_benefit_ids },
      features: features?.map(({
        id,
        feature_name,
        feature_description,
        cover_by,
        cover,
        cover_type = 3,
        premium_by = 1,
        premium = 0,
        premium_type = 3,
        has_capping_data,
        capping_data,
        min_enchance_si_limit = 0
      }) => ({
        ...id && { id },
        ...(feature_name && { feature_name }),
        ...(feature_description && { feature_description }),
        ...(cover_by && { cover_by }),
        cover: cover || 0,
        ...(cover_type && { cover_type }),
        ...(premium_by && { premium_by }),
        premium: premium || 0,
        ...(premium_type && { premium_type }),
        has_capping_data: Number(has_capping_data),
        min_enchance_si_limit,
        ...(Number(has_capping_data) && { capping_data })
      })) || [],
      ...(benefit_description && { benefit_description: benefit_description }),
      ...(benefit_name && { benefit_name: benefit_name }),
      min_enchance_si_limit,
    };


    ((show["min_enchance_si_limit"] !== undefined) || show['is_not_covered'] || show.id) ?
      setPlanData(prev => {
        let BillCopy = _.cloneDeep(prev);
        BillCopy[show.i] = response;
        return BillCopy
      })
      : setPlanData(prev => [...prev, response]);
    setValueParent([{ benefit_name_temp: undefined }, { benefit_description_temp: '' }])
    onHide()
  };


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

  return (
    <Modal
      show={!!show}
      onHide={onHide}
      size="xl"
      fullscreen={true}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>
            {show.benefit_name ? 'Update ' : 'Create '} Benefit
          </Head>
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="text-center mr-5 ml-5">

          <Row className="d-flex justify-content-center flex-wrap">

            <Col md={6} lg={5} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Benefit Name"
                    placeholder="Select Benefit Name"
                    required
                    options={benefit_master.filter(({ id }) => id === Number(show.product_feature_id) || [...benefits_covered, ...benefits_not_covered].every(({ product_feature_id }) => product_feature_id !== id)).map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    ))}
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

            <Col md={12} lg={12} xl={12} sm={12} className='mt-3 mb-3'>
              <Controller
                as={
                  <TextInput
                    className='form-control'
                    placeholder={'Enter Content Here...'}
                    error={errors && errors.benefit_description}
                    maxLength={300}
                  />
                }
                name='benefit_description'
                control={control}
              />
              <label className='form-label'>
                <span className='span-label'>{'Benefit Description'}</span>
              </label>
              {!!errors.benefit_description && <Error top='0'>
                {errors.benefit_description.message}
              </Error>}
            </Col>

            {!show['is_not_covered'] && <Col md={6} lg={5} xl={4} sm={12}>
              <Controller
                as={
                  <Input
                    label={'Benefit Visible From SI Value'}
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
            </Col>}

            <Col md={6} lg={5} xl={4} sm={12}>
              <Head className='text-center'>Benefit Mandatory{" "}</Head>
              <div className="d-flex justify-content-around flex-wrap mt-0">
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Mandatory"}</p>
                  <input ref={register} name={'mandatory_type'} type={'radio'} value={0} defaultChecked={show.mandatory_type ? Number(show.mandatory_type) === 0 : true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Optional"}</p>
                  <input ref={register} name={'mandatory_type'} type={'radio'} value={1} defaultChecked={Number(show.mandatory_type) === 1 || false} />
                  <span></span>
                </CustomControl>
                {/* <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Optional"}</p>
                  <input ref={register} name={'mandatory_type'} type={'radio'} value={2} defaultChecked={Number(show.mandatory_type) === 2 || false} />
                  <span></span>
                </CustomControl> */}
              </div>
            </Col>

            <Col md={6} lg={5} xl={4} sm={12}>
              {+mandatory_type === 1 &&
                <Controller
                  as={
                    <SelectComponent
                      label="Mandatory If Not Selected"
                      placeholder="Select"
                      options={benefit_master.filter(({ id }) => id !== Number(benefit_name.id)).map(item => (
                        {
                          id: item.id,
                          label: item.name,
                          value: item.id
                        }
                      ))}
                      // error={errors && errors.grade}
                      multi={true}
                      closeMenuOnSelect={false}
                      closeMenuOnScroll={false}
                      hideSelectedOptions={true}
                      isClearable={false}
                    />
                  }
                  name="mandatory_if_not_selected_benefit_ids"
                  control={control}
                  error={errors && errors.grade}
                />
              }
            </Col>

          </Row>


          {!show['is_not_covered'] && (additionalCount < 1 ?
            <Row>
              <Col md={6} lg={5} xl={4} sm={12} className="d-flex align-items-center">
                <Btn type='button' onClick={addForm}>Add Benefits +</Btn>
              </Col>
            </Row>
            : <Table className='text-center rounded text-nowrap' style={{ border: 'solid 1px #e6e6e6' }} responsive>
              <thead>
                <tr>
                  <th style={style} className='align-top'>Feature Name</th>
                  <th style={style} className='align-top'>Feature Description</th>
                  <th style={style} className='align-top'>{CustomNames.includes(benefit_name?.label?.toLowerCase()) ? benefit_name?.label : "Add On's SI"}</th>
                  <th style={style} className='align-top'>{CustomNames.includes(benefit_name?.label?.toLowerCase()) ? benefit_name?.label : 'Cover'} By</th>
                  {!CustomNames.includes(benefit_name?.label?.toLowerCase()) && <th style={style} className='align-top'>Cover Type</th>}
                  <th style={style} className='align-top'>Sum Insured Cap</th>
                  <th style={style} className='align-top'>Premium By</th>
                  <th style={style} className='align-top'>Premium Value</th>
                  <th style={style} className='align-top'>Premium Type</th>
                  <th style={style} className='align-top'>Visible From SI Value</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(Number(additionalCount))]?.map((_, index) => {

                  const has_capping_data = watch(`features[${index}].has_capping_data`);

                  return (<Fragment key={index + 'modal'}><tr>
                    <td>
                      <Form.Control className='rounded-lg' size='sm' type='text'
                        maxLength={200}
                        name={`features[${index}].feature_name`}
                        ref={register}
                        error={errors && errors.features && errors.features[index] && errors.features[index].feature_name}
                        placeholder={'Feature Name'} />
                      {!!errors.features && errors.features[index] && errors.features[index].feature_name && <Error top='0'>
                        {errors.features[index].feature_name.message}
                      </Error>}
                    </td>
                    <td>
                      <Form.Control className='rounded-lg' size='sm' type='text'
                        maxLength={1000}
                        name={`features[${index}].feature_description`}
                        ref={register}
                        placeholder={'Feature feature_description'} />
                    </td>
                    <td>
                      <input type='hidden' ref={register} name={`features[${index}].id`} />
                      <Form.Control className='rounded-lg' size='md' type='tel'
                        maxLength={12}
                        onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                        name={`features[${index}].cover`}
                        ref={register}
                        placeholder='Enter SI Value'
                        defaultValue='0' />
                      {!!errors.features?.[index]?.cover && <Error>
                        {errors.features?.[index]?.cover.message}
                      </Error>}
                    </td>
                    <td>
                      <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 0px' }}>
                        <CustomControl className='d-flex mt-4 mr-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Value'}</p>
                          <input name={`features[${index}].cover_by`} ref={register} type={'radio'} value={1} defaultChecked={true} />
                          <span></span>
                        </CustomControl>
                        <CustomControl className='d-flex mt-4 ml-0'>
                          <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>By {!CustomNames.includes(benefit_name?.label?.toLowerCase()) && 'SI'} %</p>
                          <input name={`features[${index}].cover_by`} ref={register} type={'radio'} value={2} defaultChecked={!true} />
                          <span></span>
                        </CustomControl>
                      </div>
                    </td>

                    {!CustomNames.includes(benefit_name?.label?.toLowerCase()) && <td>
                      <Form.Control as="select" name={`features[${index}].cover_type`} ref={register}>
                        {CoverType.map(({ value, name }) => <option key={value + 'cover_type'} value={value}>{name}</option>)}
                      </Form.Control>
                    </td>}

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

                    {/* Premium */}
                    <td>
                      {!Number(has_capping_data) ? <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 0px' }}>
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
                      </div> : '-'}
                    </td>
                    <td>
                      {!Number(has_capping_data) ? <Form.Control className='rounded-lg' size='md' type='tel'
                        maxLength={12}
                        onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                        name={`features[${index}].premium`}
                        ref={register}
                        placeholder='Premium Value'
                        defaultValue='0' /> : '-'}
                    </td>

                    <td>
                      {!Number(has_capping_data) ? <Form.Control as="select" name={`features[${index}].premium_type`} ref={register}>
                        {PremiumType.map(({ value, name }) => <option key={value + 'cover_type'} value={value}>{name}</option>)}
                      </Form.Control> : '-'}
                    </td>

                    <td>
                      <Form.Control className='rounded-lg' size='sm' type='tel'
                        maxLength={9}
                        onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                        name={`features[${index}].min_enchance_si_limit`}
                        ref={register}
                        placeholder='Enter SI Value'
                        defaultValue='0' />
                    </td>





                  </tr>
                    {!!Number(has_capping_data) && <tr >
                      <td colSpan="1" className='border-top-0'></td>
                      <td colSpan="8" className='border-top-0'>

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
                    {additionalCount > 1 && <i className="btn ti-trash text-danger" onClick={removeBill} />}
                    <i className="btn ti-plus text-success" onClick={addForm} />
                  </td>
                </tr>
              </tbody>

            </Table>)}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" >Save</Button>
        </Modal.Footer>
      </form>
    </Modal >
  );
};
