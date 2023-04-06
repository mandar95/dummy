import React from 'react';
import * as yup from 'yup';

import { Input, Error, Button } from "components";
import { Row, Col, Form, Modal } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { createNewPassword } from '../../user.slice';
import { useForm, Controller } from "react-hook-form";


export const ResetPasswordModal = ({ show, onHide, Data }) => {
    const dispatch = useDispatch();
    const validationSchema = yup.object().shape({
        password: yup.string().required('Password Required')
            .min(8, 'Min 8 character required')
            .max(50,'Max 50 characters allowed')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/gm, 'Should have at least a lowercase, an uppercase, a number & a symbol')
    })
    const { control, errors, handleSubmit } = useForm({
        validationSchema
    })

    const onSubmit = data => {
        dispatch(createNewPassword({
            user_id: Data,
            password: data.password
        }, onHide))

    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body className="">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="d-flex flex-wrap justify-content-center">
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <Controller
                                as={<Input label="New Password" maxLength='50' name="New Password" placeholder={"Enter New Password"} isRequired required={false} />}
                                name="password"
                                error={errors && errors.password}
                                control={control}
                            />
                            {!!errors.password &&
                                <Error>
                                    {errors.password.message}
                                </Error>}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="float-right flex-d justify-content-end" >
                                <Button type="submit">Submit</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
