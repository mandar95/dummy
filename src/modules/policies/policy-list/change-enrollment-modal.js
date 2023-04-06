import React, { useEffect, useState } from 'react';

import { Modal, Row, Col } from 'react-bootstrap';
import { Button, Input } from '../../../components'

import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateMembersEnrollmentDate } from '../approve-policy/approve-policy.slice';

export const ChangeEnrollmentModal = ({ data, onHide, show, policy_id }) => {

    const [startDate, setStartDate] = useState(data.employee_enrollement_start_date || data?.policy_start_date || "")
    const dispatch = useDispatch();
    const { control, handleSubmit, errors } = useForm({
        defaultValues: data
            ? {
                enrollement_start_date: data.employee_enrollement_start_date,
                enrollement_end_date: data.employee_enrollement_end_date,
            } : {}
    });
    const policyState = useSelector(state => state.policyConfig);

    useEffect(() => {
        if (policyState && policyState.changeEnrollmentMessage) {
            onHide();
        }

        if (policyState && policyState.error) {
            onHide();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyState]);

    const onSubmit = formData => {
        if (data.id) {
            formData.employee_policy_mapping_ids = [data.id]
        } else {
            formData.employee_ids = [data.employee_id]
            formData.policy_id = policy_id

        }
        formData.employee_enrollement_status = 1;

        dispatch(updateMembersEnrollmentDate(formData));
    };

    return (
        <Modal
            onHide={onHide}
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header>
                <Modal.Title className="mx-auto" id="contained-modal-title-vcenter">
                    Change Enrolment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center mx-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col xl={6} lg={6} md={6} sm={12}>
                            <Controller
                                as={
                                    <Input
                                        label="Start Date"
                                        placeholder="mm/dd/yyyy"
                                        type="date"
                                        error={errors && errors.enrollement_start_date}
                                    />
                                }
                                name="enrollement_start_date"
                                onChange={([e]) => { setStartDate(e.target.value); return e }}
                                min={data?.policy_start_date}
                                max={data?.policy_end_date}
                                defaultValue={data && data.employee_enrollement_start_date}
                                control={control}
                                rules={{ required: true }}
                            />
                        </Col>
                        <Col xl={6} lg={6} md={6} sm={12}>
                            <Controller
                                as={
                                    <Input
                                        label="End Date"
                                        placeholder="mm/dd/yyyy"
                                        type="date"
                                        error={errors && errors.enrollement_end_date}
                                    />
                                }
                                name="enrollement_end_date"
                                min={startDate}
                                max={data?.policy_end_date}
                                defaultValue={data && data.employee_enrollement_end_date}
                                control={control}
                                rules={{ required: true }}
                            />
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
                                Submit
                            </Button>

                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
}

