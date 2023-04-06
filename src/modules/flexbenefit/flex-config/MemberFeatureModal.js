import React from "react";
import * as yup from "yup";
import _ from "lodash";

import { Modal, Row, Col, Table, Form } from "react-bootstrap";
import { Button, Error } from "components";
import { Head } from "modules/RFQ/plan-configuration/style";

import { Controller, useForm } from "react-hook-form";
import { noSpecial, numOnlyWithPoint } from "utils";
import { CoverType, PremiumType } from "../../policies/steps/additional-details/additional-cover";
import { TextInput } from "../../RFQ/plan-configuration/style";
import { SelectComponent } from "../../../components";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

const validationSchema = yup.object().shape({
  description: yup.string()
    .required("required"),
  premium: yup.string()
    .required("required"),
  relation: yup.array().of(yup.object().shape({
    id: yup.string().required('required'),
  })).required('required'),
});

const style = {
  minWidth: '110px'
}


export const MemberFeatureModal = ({ show, onHide, setValueParent, setPlanData, filteredRelation }) => {


  const { handleSubmit, errors, control, register } = useForm({
    validationSchema: validationSchema,
    defaultValues: show
  });


  const onSubmit = ({ relation,
    cover,
    cover_type,
    premium,
    premium_type,
    is_optional,
    description,
    min_enchance_si_limit = 0, }) => {

    const response = {
      ...show.id && { id: show.id },
      description: description,
      cover,
      cover_type,
      premium,
      premium_type,
      min_enchance_si_limit,
      is_optional,
      relation
    };


    ((show["min_enchance_si_limit"] !== undefined) || show.id) ?
      setPlanData(prev => {
        let BillCopy = _.cloneDeep(prev);
        BillCopy[show.i] = response;
        return BillCopy
      })
      : setPlanData(prev => [...prev, response]);
    setValueParent('member_feature_description', '')
    onHide()
  };

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

            <Col md={12} lg={12} xl={12} sm={12} className='mt-3 mb-3'>
              <Controller
                as={
                  <TextInput
                    className='form-control'
                    placeholder={'Enter Content Here...'}
                    error={errors && errors.description}
                    maxLength={300}
                  />
                }
                name='description'
                control={control}
              />
              <label className='form-label'>
                <span className='span-label'>{'Feature Description'}</span>
              </label>
              {!!errors.description && <Error top='0'>
                {errors.description.message}
              </Error>}
            </Col>

            <Col md={6} lg={5} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Relations"
                    placeholder="Select Relations"
                    required
                    options={filteredRelation}
                    error={errors && errors.relation}
                    isRequired={true}
                    multi={true}
                    closeMenuOnSelect={false}
                    closeMenuOnScroll={false}
                    hideSelectedOptions={true}
                    isClearable={false}
                  />
                }
                control={control}
                name="relation"
              />
              {!!errors.relation && <Error>
                {errors.relation.message}
              </Error>}
            </Col>



          </Row>


          <Table className='text-center rounded text-nowrap' style={{ border: 'solid 1px #e6e6e6' }} responsive>
            <thead>
              <tr>
                <th style={style} className='align-top'>Sum Insured</th>
                <th style={style} className='align-top'>Sum Insured Type</th>
                <th style={style} className='align-top'>Premium</th>
                <th style={style} className='align-top'>Premium Type</th>
                <th style={style} className='align-top'>Is Optional</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control className='rounded-lg' size='md' type='tel'
                    maxLength={12}
                    onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                    name={`cover`}
                    ref={register}
                    placeholder='Cover Value'
                    defaultValue='0' />
                </td>

                <td>
                  <Form.Control as="select" name={`cover_type`} ref={register}>
                    {CoverType.map(({ value, name }) => <option key={value + 'cover_type'} value={value}>{name}</option>)}
                  </Form.Control>
                </td>
                <td>
                  <Form.Control className='rounded-lg' size='md' type='tel'
                    maxLength={12}
                    onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                    name={`premium`}
                    ref={register}
                    placeholder='Premium Value'
                    defaultValue='0' />
                </td>

                <td>
                  <Form.Control as="select" name={`premium_type`} ref={register}>
                    {PremiumType.map(({ value, name }) => <option key={value + 'premium_type'} value={value}>{name}</option>)}
                  </Form.Control>
                </td>
                <td>
                  <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 0px' }}>
                    <CustomControl className='d-flex mt-4 mr-0'>
                      <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'No'}</p>
                      <input name={'is_optional'} ref={register} type={'radio'} value={0} defaultChecked={true} />
                      <span></span>
                    </CustomControl>
                    <CustomControl className='d-flex mt-4 ml-0'>
                      <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Yes'}</p>
                      <input name={'is_optional'} ref={register} type={'radio'} value={1} defaultChecked={!true} />
                      <span></span>
                    </CustomControl>
                  </div>
                </td>
              </tr>

            </tbody>

          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" >Save</Button>
        </Modal.Footer>
      </form>
    </Modal >
  );
};
