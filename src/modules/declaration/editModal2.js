import React, { useEffect } from 'react';
import { Modal, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { Button, Error, Input } from "components";
import { Switch } from "modules/user-management/AssignRole/switch/switch";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { success, clear, updateDeclaration } from "modules/documents/documents.slice";
// import { insurer } from 'config/validations'
// import { proposalSlice } from 'modules/proposal-page/proposal.slice';

// const validation = insurer.query_complaint


const EditModal = (props) => {
    const dispatch = useDispatch();
    const { declarationUpdated } = useSelector((state) => state.documents);

    const validationSchema = yup.object().shape({
        declaration: yup.string()
            .required("declaration name is required")
        //.min(validation.name.min, `Minimum ${validation.name.min} character required`)
        //.matches(validation.name.regex, 'Must contain only alphabets')
    });

    const { control, errors, handleSubmit } = useForm({
        validationSchema,
    });

    //prefill
    // useEffect(() => {
    //     if (props?.id) {
    //         let filterData = allDeclrationData.filter((item) => item.id === props?.id);
    //         setValue("declaration", filterData[0]?.declaration);
    //     }
    //     //eslint-disable-next-line
    // }, [props?.id]);


    useEffect(() => {
        if (declarationUpdated) {
            dispatch(success(declarationUpdated));
            props.onHide();
            props.setId();
        }

        return () => {
            dispatch(clear("declaration"));
        };
        //eslint-disable-next-line
    }, [declarationUpdated]);



    const onSubmit = (data) => {
        const formdata = new FormData();
        formdata.append("declaration", data.declaration);
        formdata.append("is_mandatory", data.is_mandatory);
        formdata.append("_method", "PATCH");
        dispatch(updateDeclaration(props?.id, formdata))
    }

    const closeModal = () => {
        props.onHide();
        props.setId();
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
                    <Modal.Title id="contained-modal-title-vcenter">Edit Declaration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm="12" md="12" lg="12" xl="12">
                            <div className="p-2">
                                <Controller
                                    as={<Input
                                        label="Declaration Name"
                                        placeholder="Enter Declaration Name"
                                        required={false}
                                        //maxLength={validation.name.max}
                                        isRequired={true}
                                    />}
                                    name="declaration"
                                    defaultValue={props.editData.length > 0 ? props.editData[0].declaration : ""}
                                    control={control}
                                    error={errors && errors.declaration}

                                />
                                {!!errors?.declaration && <Error>{errors?.declaration?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={<Switch label="Is Mandatory" />}
                                    name="is_mandatory"
                                    control={control}
                                    defaultValue={props.editData.length > 0 ? props.editData[0].is_mandatory : 0}
                                />
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" buttonStyle="danger" onClick={closeModal}>
                        Close
                    </Button>
                    <Button type="submit">Update</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditModal;
