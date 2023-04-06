import React from 'react';
import * as yup from 'yup';

import { Modal, Row, Col } from 'react-bootstrap';
import { Input, Button, Select, Error } from '../../../../components'
import { Controller, useForm } from 'react-hook-form';
import { numOnly, noSpecial } from '../../../../utils';
import { useDispatch } from 'react-redux';
import { createEscalationMatrix, reviseEscalationMatrix } from '../../help.slice';

const validationSchema = yup.object().shape({
  start_level: yup.string().required('Start Level Required'),
  end_level: yup.string().required('End Level Required'),
  unit: yup.string().required('Unit Required'),
  time_to_live: yup.string().required('Time To Live Required'),
})

const Unit = [
  { id: 1, name: 'Hours', value: 1 },
  { id: 2, name: 'Days', value: 2 },
]
export const StartLevel = [
  { id: 0, name: 'Initial', value: 0 },
  { id: 1, name: 'Level 1', value: 1 },
  { id: 2, name: 'Level 2', value: 2 },
];

export const EndLevel = [
  { id: 1, name: 'Level 1', value: 1 },
  { id: 2, name: 'Level 2', value: 2 },
  { id: 3, name: 'Level 3', value: 3 },
];

export const EscalationMatrixModal = ({ show, onHide, employer_id, escalationMatrix }) => {

  const dispatch = useDispatch();

  const { control, handleSubmit, errors, watch, setValue } = useForm({
    defaultValues: show?.id ?
      { ...show, start_level: String(show.start_level || 0) } : {},
    validationSchema
  });

  const start_level = Number(watch('start_level'))
  const end_level = Number(watch('end_level'))

  const onSubmit = (data) => {
    dispatch(show?.id ? reviseEscalationMatrix(show?.id, { ...data, employer_id }, onHide) : createEscalationMatrix({ ...data, employer_id }, onHide))
  };


  return (
    <Modal
      onHide={onHide}
      show={show}
      size="xl"
      dialogClassName="my-modal"
      aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {show?.id ? 'Edit' : 'Add'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className='d-flex justify-content-center' >

            <Col xl={6} lg={6} md={12} sm={12}>
              <Controller
                as={
                  <Select
                    label="Start Level"
                    placeholder="Select Start Level"
                    isRequired
                    required={false}
                    options={StartLevel.filter(({ id }) => (escalationMatrix.every(({ start_level }) => start_level !== id)) || (show?.id && show.start_level === id))} />
                }
                onChange={([e]) => {
                  (Number(e.target.value) === end_level) && setValue('end_level', '')
                  return e
                }}
                error={errors && errors?.start_level}
                control={control}
                name={'start_level'}
              />
              {!!(errors?.start_level) && <Error>
                {errors?.start_level.message}
              </Error>}
            </Col>

            <Col xl={6} lg={6} md={12} sm={12}>
              <Controller
                as={
                  <Select
                    label="End Level"
                    placeholder="Select End Level"
                    isRequired
                    required={false}
                    options={EndLevel.filter(({ id }) => start_level !== id && ((escalationMatrix.every(({ end_level }) => end_level !== id)) || (show?.id && show.end_level === id)))} />
                }
                error={errors && errors?.end_level}
                control={control}
                name={'end_level'}
              />
              {!!(errors?.end_level) && <Error>
                {errors?.end_level.message}
              </Error>}
            </Col>

            <Col xl={6} lg={6} md={12} sm={12}>
              <Controller
                as={
                  <Select
                    label="Unit"
                    placeholder="Select Unit"
                    isRequired
                    required={false}
                    options={Unit} />
                }
                error={errors && errors?.unit}
                control={control}
                name={'unit'}
              />
              {!!(errors?.unit) && <Error>
                {errors?.unit.message}
              </Error>}
            </Col>

            <Col xl={6} lg={6} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="Time To Live"
                    type="tel"
                    placeholder="Enter Time To Live"
                    maxLength={3}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                  />
                }
                error={errors && errors?.time_to_live}
                name="time_to_live"
                control={control}
              />
              {!!(errors?.time_to_live) && <Error>
                {errors?.time_to_live.message}
              </Error>}
            </Col>
          </Row>

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
                {show?.id ? 'Update' : 'Submit'}
              </Button>

            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
}
