import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Form, Col, Modal } from "react-bootstrap";

import { useParams } from "react-router";
import * as yup from "yup";
import swal from "sweetalert";

import { Button, Error, Select } from "components";
import { AttachFile2 } from 'modules/core';
import { AnchorTag } from "modules/policies/steps/premium-details/styles";
import { useForm, Controller } from "react-hook-form";

import { downloadFile } from "utils";

import { loadPolicyNumber } from '../../communication-config/communication-config.slice';
import { uploadPolicyData, claim, clear } from '../claims.slice';
import { sampleFile, clearSampleURL } from "../../Help/help.slice";


export const ClaimData = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { userType } = useParams();
    const { success, error } = useSelector(claim);
    const { policy_no } = useSelector(state => state.commConfig);
    const loginState = useSelector(state => state.login);
    const { currentUser } = loginState;
    const { sampleURL } = useSelector((state) => state.help);
    const { globalTheme } = useSelector(state => state.theme)


    const [policies, setPolicies] = useState([]);
    const [resetFile, setResetFile] = useState(false);

    const validationSchema = yup.object().shape({
        policy_id: yup.string().required("Policy name is required"),
        file: yup.mixed().required("File is required")
    });
    const { control, errors, handleSubmit, setValue, register } = useForm({
        validationSchema,
    });

    useEffect(() => {
        if (sampleURL) {
            downloadFile(sampleURL);
            swal({
                title: "Downloading",
                text: "Sample Format",
                timer: 2000,
                button: false,
                icon: "info",
            });
        }
        return () => {
            dispatch(clearSampleURL());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sampleURL]);

    useEffect(() => {
        dispatch(loadPolicyNumber());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Filter(broker)
    useEffect(() => {
        if (currentUser?.broker_id && userType === 'broker' && policy_no.length !== 0) {
            const _policy = policy_no.filter((elem2) => elem2.broker_id === currentUser?.broker_id)
            setPolicies(_policy)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, userType, policy_no])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                // dispatch(getAllCustomerDocuments());
                resetValues();
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    const resetValues = () => {
        setValue("policy_id", "");
        setValue("claim_data", null);
        setResetFile(true)
    };

    const onSubmit = (data) => {
        const formdata = new FormData();
        formdata.append("policy_id", data.policy_id);
        formdata.append("claim_data", data.file[0]);
        dispatch(uploadPolicyData(formdata));
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Edit TAT Config Query</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mx-auto p-5">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <Controller
                                as={<Select
                                    label="Policy Name"
                                    placeholder='Select Policy Name'
                                    options={policies.map((item) => ({
                                        id: item?.id,
                                        name: item?.policy_no,
                                        value: item?.id,
                                    }))}
                                    required={false}
                                    isRequired={true}
                                />}
                                name="policy_id"
                                defaultValue={""}
                                control={control}
                                error={errors && errors.policy_id}
                            />
                            {!!errors?.policy_id && <Error>{errors?.policy_id?.message}</Error>}
                        </Col>
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <div className="p-2">
                                <AttachFile2
                                    fileRegister={register}
                                    control={control}
                                    defaultValue={""}
                                    name="file"
                                    title="Attach File"
                                    key="premium_file"
                                    accept={".xls, .xlsx"}
                                    resetValue={resetFile}
                                    description="File Formats: xls, xlsx "
                                    nameBox
                                />
                                <AnchorTag href={"#"} onClick={() => dispatch(sampleFile("58"))}>
                                    <i
                                        className="ti-cloud-down attach-i"
                                        style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                                    ></i>
                                    <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                                        Download Sample Format
                                    </p>
                                </AnchorTag>
                                {!!errors?.file && <Error>{errors?.file?.message}</Error>}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal >
    );
}

