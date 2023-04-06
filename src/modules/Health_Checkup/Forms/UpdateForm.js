import React from "react";
import { Modal, Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { Input, Error, Select, Button } from "components";
import { noSpecial, numOnly } from "utils";
import _ from "lodash";
import { Status } from "../helper";
const UpdateForm = ({ handleSubmit, onSubmit, classes, errors, control, editData, statecity, userTypeName }) => {
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {<h5 className={classes.redColor}>Edit Health Checkup</h5>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <Controller
                        as={<Input hidden label="" name="" placeholder="" />}
                        name={`employee_member_mapping_id`}
                        error={errors && errors.employee_member_mapping_id}
                        control={control}
                        defaultValue={""}
                    />
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    style={{ background: "white" }}
                                    label="Member Name"
                                    name="memberName"
                                    placeholder="Member Name"
                                    disabled
                                />
                            }
                            isRequired
                            name={`name`}
                            error={errors && errors.name}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.name && <Error>{errors.name.message}</Error>}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    label="Mobile Number"
                                    type="tel"
                                    maxLength={10}
                                    onKeyDown={numOnly}
                                    onKeyPress={noSpecial}
                                    name="memberMobile"
                                    placeholder="Enter Mobile No"
                                />
                            }
                            isRequired={_.isEqual(
                                editData[0]?.relation_with_employee,
                                "Self"
                            )}
                            name={`contact`}
                            error={errors && errors.contact}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.contact && <Error>{errors.contact.message}</Error>}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    label="Email Address"
                                    name="memberMail"
                                    placeholder="Enter Email"
                                />
                            }
                            isRequired={_.isEqual(
                                editData[0]?.relation_with_employee,
                                "Self"
                            )}
                            name={`email`}
                            error={errors && errors.email}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.email && <Error>{errors.email.message}</Error>}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    label="Health Check-up Date & Time"
                                    // type="date"
                                    type="datetime-local"
                                    name="appointment_request_date_time"
                                    placeholder="Health Check-up Date & Time"
                                />
                            }
                            isRequired
                            name={`appointment_request_date_time`}
                            error={errors && errors.appointment_request_date_time}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.appointment_request_date_time && (
                            <Error>{errors.appointment_request_date_time.message}</Error>
                        )}
                    </div>
                    <div className="col-12 col-md-4 align-self-center">
                        <Controller
                            as={
                                <Input
                                    label="Alternate Health Check-up Date & Time"
                                    // type="date"
                                    type="datetime-local"
                                    maxLength={10}
                                    name="alternate_appointment_request_date_time"
                                    placeholder="Alternate Health Check-up Date & Time"
                                />
                            }
                            name={`alternate_appointment_request_date_time`}
                            error={errors && errors.alternate_appointment_request_date_time}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.alternate_appointment_request_date_time && (
                            <Error>
                                {errors.alternate_appointment_request_date_time.message}
                            </Error>
                        )}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    label="Address 1"
                                    name="memberAddress"
                                    placeholder="Address 1"
                                />
                            }
                            isRequired
                            name={`address_line_1`}
                            error={errors && errors.address_line_1}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.address_line_1 && (
                            <Error>{errors.address_line_1.message}</Error>
                        )}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    label="Address 2"
                                    name="address_line_2"
                                    placeholder="Address 2"
                                />
                            }
                            name={`address_line_2`}
                            error={errors && errors.code}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.address_line_2 && (
                            <Error>{errors.address_line_2.message}</Error>
                        )}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    label="Pincode"
                                    name="pincode"
                                    placeholder="Pincode"
                                    type="tel"
                                    maxLength={6}
                                    onKeyDown={numOnly}
                                    onKeyPress={noSpecial}
                                />
                            }
                            isRequired
                            name={`pincode`}
                            error={errors && errors.pincode}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.pincode && <Error>{errors.pincode.message}</Error>}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Select
                                    label="State"
                                    placeholder="state"
                                    isRequired={true}
                                    options={[
                                        {
                                            id: statecity.length && statecity[0]?.state_id,
                                            name: statecity.length && statecity[0]?.state_name,
                                            value: statecity.length && statecity[0]?.state_id,
                                        },
                                    ]}
                                    id="state_id"
                                />
                            }
                            // onChange={getMember}
                            name={`state_id`}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.state_id && <Error>{errors.state_id.message}</Error>}
                    </div>
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Select
                                    label="City"
                                    placeholder="City"
                                    isRequired={true}
                                    options={[
                                        {
                                            id: statecity.length && statecity[0]?.city_id,
                                            name: statecity.length && statecity[0]?.city_name,
                                            value: statecity.length && statecity[0]?.city_id,
                                        },
                                    ]}
                                    id="city_id"
                                />
                            }
                            // onChange={getMember}
                            name={`city_id`}
                            control={control}
                            defaultValue={""}
                        />
                        {errors?.city_id && <Error>{errors.city_id.message}</Error>}
                    </div>
                    {_.isEqual(userTypeName, "Broker") && Boolean(editData[0]?.appointment_date_time) && <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Select
                                    label="Appointment Status"
                                    placeholder="Select Status"
                                    isRequired={true}
                                    options={Status}
                                    error={errors && errors.appointment_status_id}
                                />
                            }
                            defaultValue={""}
                            error={errors && errors?.appointment_status_id}
                            control={control}
                            name={"appointment_status_id"}
                        />
                        {!!errors?.appointment_status_id && <Error>{errors?.appointment_status_id.message}</Error>}
                    </div>}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit">Update</Button>
            </Modal.Footer>
        </Form>
    );
}

export default UpdateForm;