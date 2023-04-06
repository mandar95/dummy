import React from "react";

import { Button, Head, Input } from "components";
import { Row, Col, Modal } from 'react-bootstrap';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { updateECashFlow } from '../plan-hospitalization.action';
import { Controller, useForm } from "react-hook-form";
import { numOnly, noSpecial } from "../../../utils";


export const FlowModal = ({ show, onHide, Data, dispatch }) => {

  const { register, handleSubmit, watch, control } = useForm({
    defaultValues: {
      e_cashless_allowed: String(Data.e_cashless_allowed || 0),
      employee_validation_by_employer: String(Data.employee_validation_by_employer || 0),
      ...Data.employee_validation_by_employer === 3 && {
        duration: Data.duration ? String(Data.duration) : '',
        duration_unit: String(Data.duration_unit || 1)
      }
    }
  });

  const e_cashless_allowed = watch('e_cashless_allowed');
  const employee_validation_by_employer = watch('employee_validation_by_employer');



  const onSubmit = (data) => {
    updateECashFlow(dispatch, {
      e_cashless_allowed: data.e_cashless_allowed || 0,
      employee_validation_by_employer: data.employee_validation_by_employer || 0,
      ...(Number(employee_validation_by_employer) === 3) && {
        duration: data.duration || 1,
        duration_unit: data.duration_unit || 1
      },
      id: Data.id
    })
    onHide();
    // dispatch(updateTATQuery({ ...data, id: filterData[0]?.id }))
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit E-Cashless Flow</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap">

            <Col md={6} lg={6} xl={6} sm={12}>
              <Head className='text-center'>Is E-Cashless Allowed?</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                  <input ref={register} name={'e_cashless_allowed'} type={'radio'} value={0} defaultChecked={Data.e_cashless_allowed === 0} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                  <input ref={register} name={'e_cashless_allowed'} type={'radio'} value={1} defaultChecked={Data.e_cashless_allowed === 1} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>
            {Number(e_cashless_allowed) === 1 &&
              <Col md={6} lg={6} xl={6} sm={12}>
                <Head className='text-center'>Will Employer Verify Claim?</Head>
                <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0px -40px 40px -6px' }}>
                  <CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"None"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={0} defaultChecked={Data.employee_validation_by_employer === 0} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"All Employees"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={1} defaultChecked={Data.employee_validation_by_employer === 1} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Non VIP"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={2} defaultChecked={Data.employee_validation_by_employer === 2} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Auto Approval"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={3} />
                    <span></span>
                  </CustomControl>
                </div>
              </Col>}
            {Number(employee_validation_by_employer) === 3 && <>

              <Col md={6} lg={4} xl={4} sm={12}>
                <Controller
                  as={<Input label="Duration" type='tel' maxLength={3}
                    onKeyDown={numOnly} onKeyPress={noSpecial} placeholder="Enter Duration" required={true}
                    isRequired={true} />}
                  name="duration"
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={4} sm={12}>
                <Head className='text-center'>Duration Type?</Head>
                <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                  <CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Day"}</p>
                    <input ref={register} name={'duration_unit'} type={'radio'} value={1} defaultChecked={Data.duration_unit === 1 || !Data.duration_unit} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Hours"}</p>
                    <input ref={register} name={'duration_unit'} type={'radio'} value={2} defaultChecked={Data.duration_unit === 2} />
                    <span></span>
                  </CustomControl>
                </div>
              </Col>
            </>}
          </Row>
          <Row className="d-flex justify-content-end w-100">
            <Button type='submit' className='mt-2'>
              Submit
            </Button>
          </Row>
        </form>
      </Modal.Body>
    </Modal >
  );
}
