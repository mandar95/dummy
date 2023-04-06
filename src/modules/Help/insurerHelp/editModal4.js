import React, { useEffect } from 'react';
import { Modal, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
// import Table from "./table1";
import swal from "sweetalert";
// import _ from "lodash";
import { Button, Error, Select } from "components";
import { AttachFile2 } from 'modules/core';
import { AnchorTag } from "modules/policies/steps/premium-details/styles";
import { downloadFile } from "utils";
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { success, clear, CreateMaterSubQuery, sampleFile, clearSampleURL } from "../help.slice";

const EditModal = ({ show, onHide, userType, currentUser }) => {
    const dispatch = useDispatch();
    const { SubQuerysuccess, error, insurerQueriesTypeData, sampleURL } = useSelector((state) => state.help);
    const { globalTheme } = useSelector(state => state.theme)


    const validationSchema = yup.object().shape({
        query_type: yup.string().required("Please select query type"),
        file: yup.mixed().required("File is required")
    });

    const { control, errors, handleSubmit, register } = useForm({
        validationSchema,
        // mode: "onBlur",
        // reValidateMode: "onBlur"
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
        if (SubQuerysuccess) {

            dispatch(success(SubQuerysuccess));
            // resetValues();
            onHide()

        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SubQuerysuccess, error])

    // const resetValues = () => {
    //     setResetFile(true);
    // };

    const onSubmit = (data) => {
        if (data.file[0]) {
            const formData = new FormData();
            formData.append(`query_id`, data.query_type);
            formData.append(`file`, data.file[0]);
            formData.append(`override`, data.override || "0");
            userType === 'broker' ?
                formData.append(`broker_id`, currentUser?.broker_id)
                : formData.append(`ic_id`, currentUser?.ic_id)
            dispatch(CreateMaterSubQuery(formData));
        }
        else {
            swal('Validation', 'File Required', 'warning')
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Add Query Sub Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm="12" md="12" lg="12" xl="12">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Query Type"
                                            placeholder="Select Query Type"
                                            required={false}
                                            isRequired={true}
                                            options={
                                                insurerQueriesTypeData?.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                })) || []
                                            }
                                        />
                                    }
                                    name="query_type"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.query_type}
                                />
                            </div>
                            {!!errors?.query_type && <Error>{errors?.query_type?.message}</Error>}
                        </Col>
                        <Col sm="12" md="12" lg="12" xl="12">
                            <div className="d-flex justify-content-around flex-wrap p-2">
                                <Controller
                                    as={<CustomControl className="d-flex mt-4" >
                                        <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Overwrite file'}</h5>
                                        <input name={'override'} type={'radio'} value={1} />
                                        <span style={{ top: "-2px" }}></span>
                                    </CustomControl>}
                                    name={'override'}
                                    control={control}
                                />
                                <Controller
                                    as={<CustomControl className="d-flex mt-4" >
                                        <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Add in existing'}</h5>
                                        <input name={'override'} type={'radio'} value={0} defaultChecked />
                                        <span style={{ top: "-2px" }}></span>
                                    </CustomControl>}
                                    name={'override'}
                                    control={control}
                                />
                            </div>
                        </Col>
                        <Col sm="12" md="12" lg="12" xl="12">
                            <div className="p-2">
                                <AttachFile2
                                    fileRegister={register}
                                    control={control}
                                    defaultValue={""}
                                    name="file"
                                    title="Attach File"
                                    key="premium_file"
                                    accept={".xls, .xlsx"}
                                    // resetValue={resetFile}
                                    description="File Formats: xls, xlsx"
                                    nameBox
                                    required
                                />
                            </div>
                            {!!errors?.file && <Error>{errors?.file?.message}</Error>}
                            <AnchorTag href={"#"} onClick={() => dispatch(sampleFile("31"))}>
                                <i
                                    className="ti-cloud-down attach-i"
                                    style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                                ></i>
                                <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                                    Download Sample Format
                                </p>
                            </AnchorTag>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>
    )

}

export default EditModal;
