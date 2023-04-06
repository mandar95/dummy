/* eslint-disable eqeqeq */
import React from "react";
import * as yup from 'yup';

import { Row, Col, Modal } from "react-bootstrap";
import { Input, Error, Button } from "components";

import { Controller, useForm } from "react-hook-form";
import { createWhiteListing, updateWhiteListing } from "./white-listing.action";
import { Head } from "../../components";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

const validationSchema = yup.object().shape({
  ip: yup.string().when("whitelist_type", {
    is: value => +value === 1,
    then: yup.string().matches(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/, "Incorrect IP Address").required("IP Address Required"),
    otherwise: yup.string().notRequired().nullable()
  }),
  email: yup.string().when("whitelist_type", {
    is: value => +value === 2,
    then: yup.string().email().required("Email Address Required"),
    otherwise: yup.string().notRequired().nullable()
  }).when("type", {
    is: value => +value === 2,
    then: yup.string().email().required("Email Address Required"),
    otherwise: yup.string().notRequired().nullable()
  })
})

const ModalWhiteListing = ({ show, onHide, dispatch }) => {

  const { control, errors, handleSubmit, register, watch } = useForm({
    validationSchema,
    defaultValues: { type: String(show.type ?? '1'), whitelist_type: show.email ? '2' : '1', ip: show.ip, email: show.email }
  });

  const whitelist_type = watch('whitelist_type');
  const type = watch('type');

  const onSubmit = ({ ip, email }) => {
    show.id ? updateWhiteListing(dispatch, { ...ip && { ip: ip }, ...email && { email: email } }, show.id, onHide) :
      createWhiteListing(dispatch, { ...ip && { ip: [ip] }, ...email && { email: [email] }, type: show.type || type }, onHide)
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
          {show.id ? 'Update' : 'Create'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>

          <Row className="d-flex flex-wrap justify-content-center">
            {!show.id && <Col md={6} lg={6} xl={4} sm={12}>
              <Head className='text-center'>Configuration Type?</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2">
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"IP/Email"}</p>
                  <input ref={register} name={'type'} type={'radio'} value={1} defaultChecked={true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"2FA"}</p>
                  <input ref={register} name={'type'} type={'radio'} value={2} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>}

            {+type === 1 && <Col md={6} lg={6} xl={4} sm={12}>
              <Head className='text-center'>Whilte Listing Type?</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2">
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"IP"}</p>
                  <input ref={register} name={'whitelist_type'} type={'radio'} value={1} defaultChecked={true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Email"}</p>
                  <input ref={register} name={'whitelist_type'} type={'radio'} value={2} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>}
            {+whitelist_type === 1 && (+type === 1 || +show.type === 1) ? <Col md={12} lg={5} xl={6} sm={12}>
              <Controller
                as={<Input label="IP Address" isRequired placeholder="Enter IP Address" />}
                error={errors && errors.ip}
                control={control}
                name="ip" />
              {!!errors.ip && <Error>
                {errors.ip.message}
              </Error>}
            </Col> :
              <Col md={12} lg={5} xl={6} sm={12}>
                <Controller
                  as={<Input label="Email Address" isRequired placeholder="Enter Email Address" />}
                  error={errors && errors.email}
                  control={control}
                  name="email" />
                {!!errors.email && <Error>
                  {errors.email.message}
                </Error>}
              </Col>}
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

export default ModalWhiteListing;
