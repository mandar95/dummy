import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import swal from "sweetalert";
import { Button, Error } from "components";
import { AttachFile2 } from 'modules/core';
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { success, clear, CreateMaterDeclaration } from "modules/documents/documents.slice";

const EditModal = (props) => {
    const dispatch = useDispatch();
    const { Declarationsuccess, error } = useSelector((state) => state.documents);
    const [resetFile, setResetFile] = useState(false);

    const validationSchema = yup.object().shape({
        file: yup.mixed().required("File is required")
    });

    const { control, errors, handleSubmit, register } = useForm({
        validationSchema,
        // mode: "onBlur",
        // reValidateMode: "onBlur"
    });

    useEffect(() => {
        if (Declarationsuccess) {
            dispatch(success(Declarationsuccess));
            // resetValues();
            props.onHide()

        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Declarationsuccess, error])

    const resetValues = () => {
        setResetFile(true);
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append(`file`, data.file[0]);
        formData.append(`override`, data.override || "0");
        dispatch(CreateMaterDeclaration(formData));
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Add Declaration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
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
                                    resetValue={resetFile}
                                    description="File Formats: xls, xlsx"
                                    nameBox
                                />
                            </div>
                            {!!errors?.file && <Error>{errors?.file?.message}</Error>}
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
