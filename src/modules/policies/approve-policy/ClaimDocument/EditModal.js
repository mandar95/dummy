import React from 'react';
import * as yup from 'yup';
// import PropTypes from 'prop-types';
// import { differenceInYears } from 'date-fns';

import { Modal, Row, Col } from 'react-bootstrap';
import { Button, Input, Error, Head } from 'components'
import { useForm, Controller } from "react-hook-form";
import { AttachFile2 } from 'modules/core';
import { Switch } from "modules/user-management/AssignRole/switch/switch";

import { editPolicy } from '../approve-policy.slice';
import { useDispatch, useSelector } from 'react-redux';
import { SelectComponent } from '../../../../components';
import swal from 'sweetalert';


const validationSchema = yup.object().shape({
  document_name: yup.string().required('Document name required'),
  // document_type: yup.object().when("is_opd_document", {
  //   is: value => value !== 1,
  //   then: yup.object().shape({
  //     id: yup.string().required("Required")
  //   }),
  //   otherwise: yup.object()
  // })
})

export const _documentType = [{ id: 1, name: 'Pre Hospitalization' }, { id: 2, name: 'Post Hospitalization' }, { id: 3, name: 'Hospitalization' }]

export const EditModal = ({ show, onHide, Data, id, is_ipd_opd, rater_id }) => {
  const dispatch = useDispatch();
  const { userType } = useSelector(state => state.login);
  const { control, errors, register, handleSubmit, watch } = useForm({
    defaultValues: Data.id ? {
      ...Data,
      is_opd_document: Data.is_opd_document,
      document_name: Data.document_name,
      is_mandatory: Data.is_mandatory === 'Yes' ? 1 : 0,
      document_type: Data.document_type.split(',').map(item => {
        const documentType = (_documentType.find(({ id }) => +item === id) || _documentType[0])
        return { id: documentType.id, label: documentType.name, value: documentType.id }
      })
    } : {},
    validationSchema
  });

  let _is_opd = watch('is_opd_document');

  const onSubmit = ({ is_mandatory, document_name, sample_document_url, is_opd_document, document_type }) => {

    if (!_is_opd && !document_type) {
      swal('Validation', 'Document Type Required', 'info');
      return null;
    }

    let _doc_Type = (is_opd_document || !document_type || +document_type === 4) ? [{ id: '4' }] : document_type
    const formData = new FormData();
    formData.append(`is_mandatory`, is_mandatory);
    formData.append(`document_name`, document_name);
    formData.append(`document_type`, _doc_Type?.reduce((total, { id }) => total ? `${total},${id}` : id, '') || '3');
    if (sample_document_url[0]) {
      formData.append(`sample_document_url`, sample_document_url[0]);
    }
    formData.append(`is_opd_document`, rater_id === 2 ? 1 : is_opd_document || 0);

    Data.id && formData.append('id', Data.id)
    formData.append('policy_id', id)
    formData.append('operation_type', Data.id ? 2 : 1)
    formData.append('user_type_name', userType);
    formData.append('step', 5)
    formData.append('_method', 'PATCH')

    dispatch(editPolicy(
      formData
      , id))

  }



  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>{Data.id ? 'Update' : 'Add'} Claim Document</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row key={'claim-document'}>
            <Col xl={4} lg={4} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="Document Name"
                    id='document_id'
                    placeholder="Enter Document Name"
                    required
                  />
                }
                error={errors && errors.document_name}
                control={control}
                name={'document_name'}
              />
              {!!(errors && errors.document_name) && <Error>
                {errors.document_name.message}
              </Error>}
            </Col>


            {/* <Head className='text-center'>Document Type</Head> */}
            {/* <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Pre"}</p>
                  <input ref={register} name={'document_type'} type={'radio'} value={1} defaultChecked={true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Post"}</p>
                  <input ref={register} name={'document_type'} type={'radio'} value={0} />
                  <span></span>
                </CustomControl>
              </div> */}
            {rater_id === 1 || (rater_id === 3 && !_is_opd) ?
              <Col xl={4} lg={4} md={12} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label={"Document Type"}
                      placeholder={"Select Document Type"}
                      options={
                        _documentType.map(({ id, name }) => ({
                          id,
                          label: name,
                          value: id,
                        })) || []
                      }
                      isRequired={false}
                      required={false}
                    />
                  }
                  isRequired={true}
                  multi={true}
                  closeMenuOnSelect={false}
                  closeMenuOnScroll={false}
                  hideSelectedOptions={true}
                  isClearable={false}
                  // defaultValue={1}
                  error={errors && errors.document_type}
                  control={control}
                  name={`document_type`}
                />
              </Col>
              :
              <Controller
                as={
                  <Input
                    hidden
                    label=""
                    id='document_id'
                  // placeholder="Enter Document Name"
                  />
                }
                control={control}
                defaultValue={4}
                // rules={{ required: !claimsArray[index]?.sample_document_url?.length ? true : false }}
                name={`document_type`}
              />
            }


            <Col xl={4} lg={4} md={12} sm={12}>
              <Controller
                as={<Switch label={'Mandatory'} />}
                name={'is_mandatory'}
                control={control}
                defaultValue={0}
                required
              />
              {!!(errors && errors.is_mandatory) && <Error>
                {errors.is_mandatory.message}
              </Error>}
            </Col>

            <Col xl={4} lg={4} md={12} sm={12}>
              <AttachFile2
                fileRegister={register}
                name={'sample_document_url'}
                title="Attach Sample Format"
                key="premium_file"
                accept=".jpeg, .png, .jpg, .pdf"
                description="File Formats: jpeg, png, jpg, pdf"
                nameBox
              />
              {!!(errors && errors.sample_document_url) && <Error>
                {errors.sample_document_url.message}
              </Error>}
            </Col>

            {is_ipd_opd && <Col xl={4} lg={4} md={12} sm={12}>
              <Controller
                as={<Switch label={'Is OPD'} />}
                name={'is_opd_document'}
                control={control}
                defaultValue={0}
                required
              />
              {!!(errors && errors.is_opd_document) && <Error>
                {errors.is_opd_document.message}
              </Error>}
            </Col>}
          </Row>

          <Row >
            <Col md={12} className="d-flex justify-content-center mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button type="submit">{Data.id ? 'Update' : 'Add'}</Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal >
  );
}


