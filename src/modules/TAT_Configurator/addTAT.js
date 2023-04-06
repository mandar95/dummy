/* eslint-disable eqeqeq */
import React from "react";
import { useDispatch } from "react-redux";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, Error } from "../../components";
import * as yup from 'yup';
import {
    CreateTATQuery, CreateBrokerTATQuery
} from "./TATConfig.slice";


const AddTAT = ({ show, onHide, BrokerID, ICID, userType, currentUser, EmployerID }) => {
    const dispatch = useDispatch();
    const validationSchema = yup.object().shape({
        status: yup.string().required("Please Enter status")
            .max(20, 'Maximum 20 character available'),
        duration: yup.string().required("Please enter time"),
        duration_unit: yup.string().required("Please select unit type"),

    })
    const { control, errors, handleSubmit } = useForm({
        validationSchema,
    });

    const onSubmit = (data) => {
        if (userType !== "broker") {
            dispatch(CreateTATQuery({
                ...data,
                ...(userType === "admin" && (BrokerID ? { broker_id: BrokerID } : { ic_id: ICID })),
                // ...(userType === "broker" && { broker_id: currentUser?.broker_id }),
                ...(userType === "employer" && { employer_id: currentUser?.employer_id }),
                ...(userType === "insurer" && { ic_id: currentUser?.ic_id })
            }))
        } else {
            if (currentUser?.broker_id && !EmployerID) {
                dispatch(CreateTATQuery({
                    ...data,
                    ...{ broker_id: currentUser?.broker_id }
                }))
            }
            else {
                dispatch(CreateBrokerTATQuery({
                    ...data,
                    ...{ broker_id: currentUser?.broker_id, employer_id: EmployerID }
                }))
            }
        }
        onHide();
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
                    Add TAT Query
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Row xs={1} sm={2} md={2} lg={2} xl={2}>
                            <div className="p-2">
                                <Controller
                                    as={<Input label="Status" type="text" placeholder="Status" required={false}
                                        isRequired={true} />}
                                    name="status"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.status}
                                />
                                {!!errors?.status && <Error>{errors?.status?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={<Input label="Time" type="number" placeholder="Time" required={false}
                                        isRequired={true} />}
                                    name="duration"
                                    min={1}
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.duration}
                                />
                                {!!errors?.duration && <Error>{errors?.duration?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Time(Unit)"
                                            placeholder="Select Unit"
                                            options={[
                                                { id: 0, name: "Minutes", value: 'Minutes' },
                                                { id: 1, name: "Hours", value: 'Hours' },
                                                { id: 2, name: "Days", value: 'Days' },
                                            ]}
                                            required={false}
                                            isRequired={true}
                                            defaultValue={""}
                                        />
                                    }
                                    name="duration_unit"
                                    error={errors && errors.duration_unit}
                                    control={control}
                                />
                                {!!errors?.duration_unit && <Error>{errors?.duration_unit?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={<Input label="color" type="color" />}
                                    name="color_code"
                                    control={control}
                                    defaultValue="black"
                                />
                            </div>
                        </Row>
                        <Row>
                            <Col md={12} className="d-flex justify-content-end mt-4">
                                <Button type="submit">
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddTAT;

