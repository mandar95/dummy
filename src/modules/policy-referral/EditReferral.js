import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button, Input, Head } from '../../components'
import { useForm, Controller } from "react-hook-form";
// import Select from "../user-management/Onboard/Select/Select";
import { submitPolicyReferal } from './policy-referral.slice';

import { useDispatch } from 'react-redux';

export const EditReferral = (props) => {

  const dispatch = useDispatch();
  const { show, onHide, edit } = props
  const { control, reset, handleSubmit } = useForm();

  useEffect(() => {
    reset({
      url: edit?.url
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit])

  const onSubmit = data => {
    dispatch(submitPolicyReferal({
      broker_id: data.broker_id || edit.broker_id,
      insurer_id: data.insurer_id || edit.insurer_id,
      url: data.url || edit.url
    }));
    setTimeout(onHide, 500);
  };


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
          <Head>Edit Policy Referral</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap justify-content-center" >
            {/* <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={<Select
                  label="Broker"
                  option={brokers || []}
                  valueName="name"
                  id="broker_id"
                  required
                  selected={edit?.broker_id || ''}
                />}
                name="broker_id"
                control={control}
              />
            </Col>
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={<Select
                  label="Insurer Type"
                  option={insurer_types || []}
                  valueName="name"
                  id="insurer_type"
                  selected={edit?.insurer_id || ''}
                  required
                />}
                name="insurer_id"
                defaultValue
                control={control}
              />
            </Col> */}
            <Col md={12} lg={12} xl={10} sm={12}>
              <Controller
                as={<Input label="URL" type="url" name="url" placeholder="Enter URL " required />}
                name="url"
                control={control}
              />
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-center mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button type="submit">Update</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal >
  );
}


