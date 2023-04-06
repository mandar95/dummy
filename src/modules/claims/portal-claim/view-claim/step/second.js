import React, { useState } from "react";
import { Input, Button } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";
import ReimbursementModal from "./modal/modal";
import {useSelector} from "react-redux";

import {
    claim
  } from '../../../claims.slice';

export const Hospitalization = () => {
    const {claimDataBox: props } = useSelector(claim);

  const [modal, setModal] = useState(false);
  const { control, errors,  register } = useForm();
  return (
    <>
      <Form>
        <Row className="d-flex flex-wrap" style={{ margin: "0px" }}>
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={<Input 
                style={{
                    background: "white"
                }}
                disabled={true} label="Doctor Name" placeholder="Doctor Name" />}
              name="doctor_name"
              control={control}
              defaultValue={props?.doctor_name}
            />
          </Col>
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input
                style={{
                    background: "white"
                }}
                disabled={true}
                  // label={`${props?.type === "opd" ? "Clinic" : "Hospital"} State`}
                  label={`${"Clinic/Hospital State"}`}
                  placeholder={`Clinic/Hospital State`}
                />
              }
              defaultValue={props?.state_name}
              name="state_id"
              control={control}
            />
            <input type="hidden" name={"state_name"} ref={register} />
          </Col>
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input
                style={{
                    background: "white"
                }}
                disabled={true}
                  // label={`${props?.type === "opd" ? "Clinic" : "Hospital"} City`}
                  label={"Clinic/Hospital City"}
                  placeholder="Clinic/Hospital City"
                  id="hospital_city"
                />
              }
              defaultValue={props?.city_name}
              name="city_id"
              control={control}
            />
            <input type="hidden" name={"city_name"} ref={register} />
          </Col>
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input
                style={{
                    background: "white"
                }}
                disabled={true}
                  // label={`${props?.type === "opd" ? "Clinic" : "Hospital"} Name`}
                  label={"Clinic/Hospital Name"}
                  // placeholder={`${props?.type === "opd" ? "Clinic/Hospital" : "Hospital"
                  // 	} Name`}
                  placeholder={"Clinic/Hospital Name"}
                />
              }
              defaultValue={props?.hospital_name}
              name="hospital_name"
              control={control}
            />
          </Col>
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input
                style={{
                    background: "white"
                }}
                disabled={true}
                  // label={`${props?.type === "opd" ? "Clinic" : "Hospital"} Address`}
                  label={"Clinic/Hospital Address"}
                  placeholder={"Clinic/Hospital Address"}
                  // placeholder={`${props?.type === "opd" ? "Clinic" : "Hospital"
                  // 	} Address`}
                  />
                }
                defaultValue={props?.hospital_addres}
              name="hospital_address"
              control={control}
            />
          </Col>

          { props.hospital_pincode && props.hospital_mobile_no && <>
            <Col md={6} lg={6} xl={4} sm={12}>
              <Controller
                as={
                  <Input 
                    label="Hospital Pincode" 
                    placeholder="Enter Hospital Pincode" 
                    disabled={true}
                    type='tel'
                  />
                }
                defaultValue={props.hospital_pincode ? props.hospital_pincode : ""}
                name="hospital_pincode"
                control={control}
              />
            </Col>
            <Col md={6} lg={6} xl={4} sm={12}>
              <Controller
                as={
                  <Input 
                    label="Hospital Contact No"
                    placeholder="Enter Hospital Contact No"
                    type='tel'
                    disabled={true}
                  />
                }
                defaultValue={props.hospital_mobile_no ? props.hospital_mobile_no : ""}
                name="hospital_mobile_no"
                control={control}
              />
            </Col>
				 </> }

          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input 
                style={{
                    background: "white"
                }}
                disabled={true} label="Disease/Illness" placeholder="Disease/Illness" />
              }
              defaultValue={props?.disease}
              name="disease"
              control={control}
            />
          </Col>
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={<Input 
                style={{
                    background: "white"
                }}
                disabled={true} label="Remarks" placeholder="Remarks" />}
              error={errors && errors.reason}
              control={control}
              name="reason"
              defaultValue={props?.reason}
            />
          </Col>
          <Col md={6} lg={6} xl={4} sm={12} className="mb-3 mb-sm-0 align-self-center text-center">
            <Button
              type="button"
              buttonStyle="outline"
              onClick={() => {
                setModal(true);
              }}
            >
              Reimbursement Expenses <i className="ti-pencil-alt" />
            </Button>
          </Col>
        </Row>
      </Form>
      {modal && (
        <ReimbursementModal
          show={modal}
          onHide={() => setModal(false)}
        />
      )}
    </>
  );
};
