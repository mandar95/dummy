/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import * as yup from 'yup';

import { Row, Col, Modal } from "react-bootstrap";
import { Input, Error, Button } from "components";

import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { createBrokerBranches, updateBrokerBranches } from "./broker-branches.action";
import { SelectComponent } from "../../components";
import { city_data, getCity, selectCity, selectState } from "../user-management/user.slice";

const validationSchema = yup.object().shape({
  branch_name: yup.string()
    .matches(/^[a-zA-Z0-9-/\s]+$/, {
      message: 'Alphanumeric characters, hyphen(-) & frontslash(/) only',
      excludeEmptyString: true,
    })
    .required('Branch Name Required'),
  branch_location: yup.string()
    .matches(/^[a-zA-Z0-9-/\s]+$/, {
      message: 'Alphanumeric characters, hyphen(-) & frontslash(/) only',
      excludeEmptyString: true,
    })
    .required('Branch Location Required'),
  state_id: yup.object().shape({
    id: yup.string().required('State Required'),
  }),
  city_id: yup.object().shape({
    id: yup.string().required('City Required'),
  })
})

const ModalBrokerBranch = ({ show, onHide, dispatch, dispatchRedux }) => {

  const { control, errors, handleSubmit, watch, setValue } = useForm({
    validationSchema,
    ...show.id && {
      defaultValues: {
        branch_name: show.branch_name || '',
        branch_location: show.branch_location || '',
        state_id: {
          id: show.state_id,
          label: show.state_name,
          value: show.state_id,
        },
        city_id: {
          id: show.city_id,
          label: show.city_name,
          value: show.city_id,
        }
      }
    }
  });
  const states = useSelector(selectState);
  const cities = useSelector(selectCity);
  const { currentUser } = useSelector(state => state.login);
  const state_id = watch('state_id')?.value;

  useEffect(() => {
    return () => dispatchRedux(city_data([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state_id) {
      dispatchRedux(getCity({ state_id: Number(state_id) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state_id])

  const onSubmit = ({ branch_name, branch_location, state_id, city_id }) => {

    show.id ? updateBrokerBranches(dispatch, {
      branch_name,
      branch_location,
      state_id: String(state_id.value),
      city_id: String(city_id.value),
      branch_id: show.id
    }, onHide, currentUser.broker_id) :
      createBrokerBranches(dispatch, {
        branch_name,
        branch_location,
        state_id: String(state_id.value),
        city_id: String(city_id.value),
        broker_id: currentUser.broker_id
      }, onHide, currentUser.broker_id)
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {show.id ? 'Update' : 'Create'} Branch
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>

          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={12} lg={5} xl={6} sm={12}>
              <Controller
                as={<Input label="Branch Name" isRequired maxLength={300} placeholder="Enter Branch Name" />}
                error={errors && errors.branch_name}
                control={control}
                name="branch_name" />
              {!!errors.branch_name && <Error>
                {errors.branch_name.message}
              </Error>}
            </Col>
            <Col md={12} lg={5} xl={6} sm={12}>
              <Controller
                as={<Input label="Branch Location" isRequired maxLength={300} placeholder="Enter Branch Location" />}
                error={errors && errors.branch_location}
                control={control}
                name="branch_location" />
              {!!errors.branch_location && <Error>
                {errors.branch_location.message}
              </Error>}
            </Col>
            <Col md={12} lg={5} xl={6} sm={12}>
              <Controller
                as={<SelectComponent
                  label="Select State"
                  placeholder="Select State"
                  required={false}
                  isRequired={true}
                  options={states?.map((item) => ({
                    id: item?.id,
                    label: item?.state_name,
                    value: item?.id,
                  }))}
                />}
                onChange={([e]) => { setValue('city_id', undefined); return e }}
                name="state_id"
                control={control}
                error={errors && errors.state_id?.id}
              />
              {!!errors?.state_id?.id && <Error>{errors?.state_id?.id?.message}</Error>}
            </Col>
            <Col md={12} lg={5} xl={6} sm={12}>
              <Controller
                as={<SelectComponent
                  label="Select City"
                  placeholder="Select City"
                  required={false}
                  isRequired={true}
                  options={cities?.map((item) => ({
                    id: item?.id,
                    label: item?.city_name,
                    value: item?.id,
                  }))}
                />}
                name="city_id"
                control={control}
                error={errors && errors.city_id?.id}
              />
              {!!errors?.city_id?.id && <Error>{errors?.city_id?.id?.message}</Error>}
            </Col>
          </Row>
          <Row>
            <Col className='d-flex justify-content-end mb-3 mt-3'>
              <Button
                type='submit'>
                {show.id ? 'Update' : 'Submit'}
              </Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalBrokerBranch;
