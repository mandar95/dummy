import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Error } from "../../components";
import * as yup from 'yup';
import { TextInput } from "../RFQ/plan-configuration/style";
import { updateDiscrepancy, updateProceedWith } from "./plan-hospitalization.action";
import { AttachFile2 } from "modules/core";
import { randomString } from "../../utils";
import { useSelector } from "react-redux";

const validationSchema = yup.object().shape({
    remark: yup.string().min(2, 'Minimum 2 charactor required').required("Please enter content"),
})

const validationSchema1 = yup.object().shape({
    response: yup.string().min(2, 'Minimum 2 charactor required').required("Please enter content"),
})

export const DiscrepancyModal = ({ show, onHide, dispatch, claim_request_id, Data, userType, member_id }) => {

    const { globalTheme } = useSelector(state => state.theme)
    const { control, errors, handleSubmit, register } = useForm({
        validationSchema: (Data?.id && Data?.type !== 4) ? validationSchema1 : validationSchema,
    });

    const onSubmit = ({ remark, response, doctor_prescription, id_proof, other_document }) => {
        if (Data.id && Data?.type !== 4) {
            const formData = new FormData();

            formData.append('type', 2);
            formData.append('response', response);
            formData.append('claim_request_id', claim_request_id);
            formData.append('log_id', Data?.id);
            formData.append('member_id', member_id);


            doctor_prescription?.length && formData.append('doctor_prescription', doctor_prescription[0]);
            id_proof?.length && formData.append('id_proof', id_proof[0]);
            other_document?.length && formData.append('other_document', other_document[0]);

            userType === 'employee' &&
                updateProceedWith(dispatch, {
                    // has_gone_with_recommendation: 1,
                    // hospital_name: claimData.recommendation_data.hospital_name,
                    // hospital_id: claimData.recommendation_data.hospital_id,
                    path: `tpa/${randomString()}/e-cashless-intimation/${claim_request_id}/${randomString()}`,
                    claim_request_id
                }, true)
            updateDiscrepancy(dispatch, formData, claim_request_id)
        } else if (Data?.type === 4) {
            updateDiscrepancy(dispatch, {
                member_id,
                type: 4,
                remark: (Data?.remark || '') + ` (${remark})`,
                created_by: userType,
                claim_request_id,
                log_id: Data?.id
            });
        } else {
            updateDiscrepancy(dispatch, {
                member_id,
                type: 1,
                remark: remark,
                created_by: userType,
                claim_request_id
            });

        }

        setTimeout(() => {
            onHide();
        }, 500);
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{Data?.id ? 'Reply Discrepancy' : 'Raise Discrepancy'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {(!Data?.id || Data?.type === 4) ? <Row xs={1} sm={2} md={2} lg={2} xl={2}>
                            <Col sm="12" md="12" lg="12" xl="12" className="text-center">
                                <div className="my-2 py-2">
                                    <label style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>
                                        {Data?.type === 4 ? 'Reject' : 'Raise'} Discrepancy
                                        <sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
                                    </label>
                                    <Controller
                                        as={
                                            <TextInput
                                                className='form-control'
                                                placeholder=''
                                            />}
                                        name={`remark`}
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.remark}
                                    />
                                </div>
                                {!!errors?.remark && <Error top='0'>{errors?.remark?.message}</Error>}
                            </Col>
                        </Row> :
                            <Row xs={1} sm={2} md={2} lg={2} xl={2}>

                                <Col sm="12" md="12" lg="12" xl="12" className="text-center">
                                    <Controller
                                        as={
                                            <TextInput
                                                minHeight='50px'
                                                className='form-control'
                                                placeholder='Enter Comment Here...'
                                            />}
                                        name={'response'}
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.response}
                                    />
                                    {!!errors?.response && <Error top='0'>{errors?.response?.message}</Error>}
                                </Col>

                                <Col sm="12" md="12" lg="12" xl="12" className="text-left mt-4">
                                    <AttachFile2
                                        fileRegister={register}
                                        name={'id_proof'}
                                        title={'ID Proof'}
                                        key="file"
                                        // required
                                        accept={".png,.jpeg,.jpg"}
                                        description="File Formats: (.png .jpeg .jpg)"
                                        nameBox
                                    />

                                </Col>

                                <Col sm="12" md="12" lg="12" xl="12" className="text-left mt-4">
                                    <AttachFile2
                                        fileRegister={register}
                                        name={'doctor_prescription'}
                                        title={"Doctor's Prescription"}
                                        key="file"
                                        // required
                                        accept={".png,.jpeg,.jpg"}
                                        description="File Formats: (.png .jpeg .jpg)"
                                        nameBox
                                    />

                                </Col>

                                <Col sm="12" md="12" lg="12" xl="12" className="text-left mt-4">
                                    <AttachFile2
                                        fileRegister={register}
                                        name={'other_document'}
                                        title={"Other Document"}
                                        key="file"
                                        // required
                                        accept={".png,.jpeg,.jpg"}
                                        description="File Formats: (.png .jpeg .jpg)"
                                        nameBox
                                    />

                                </Col>
                            </Row>

                        }
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
        </Modal >
    );
}
