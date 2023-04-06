import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { Button, Input } from "components";
import * as yup from "yup";
import { Head } from "modules/RFQ/plan-configuration/style";
import { Controller, useForm } from "react-hook-form";
import { createEndorsementDeficiency } from "./EndorsementRequest.slice";
import { useDispatch } from "react-redux";


const validationSchema = yup.object().shape({
    remark: yup.string().required("Please enter remark"),
});
export const EditModal = ({ show, onHide, Data, userType }) => {
    const dispatch = useDispatch();
    const { control, handleSubmit, errors } = useForm({
        validationSchema
    });

    const onSubmit = (data) => {
        const _Data = userType === 'broker' ? {
            broker_deficiency_remark: data.remark,
            broker_verification_status: 2,
            member_id: Data.id
        } : {
            employer_deficiency_remark: data.remark,
            employer_verification_status: 2,
            member_id: Data.id
        }
        dispatch(createEndorsementDeficiency(_Data))
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Head>
                        Raised Deficiency
                    </Head>
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className="text-center mr-5 ml-5">
                    <Row className="d-flex justify-content-center flex-wrap">
                        {(
                            <Col md={12} lg={12} xl={12} sm={12}>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Input
                                                label="Remark"
                                                placeholder="Enter Remark"
                                                //maxLength={validation.name.length}
                                                required={false}
                                                isRequired={true}
                                            />
                                        }
                                        name="remark"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.name}
                                    />
                                </div>
                            </Col>
                        )}

                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Save</Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};
