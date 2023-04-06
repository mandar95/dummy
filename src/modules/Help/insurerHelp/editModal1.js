import React, { useEffect } from 'react';
import { Modal, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { Button, Error, Input } from "components";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { success, clear, updateInsurerQueryType } from "../help.slice";
import { insurer } from 'config/validations'

const validation = insurer.query_complaint


const EditModal = (props) => {
    const dispatch = useDispatch();
    const { insurerQueriesTypeData, insurerUpdateQueryType } = useSelector((state) => state.help);

    const validationSchema = yup.object().shape({
        name: yup.string()
            .required("Please enter query type")
            // eslint-disable-next-line no-useless-escape
            .matches(validation.name.regex, {
                message: 'Alphanumeric characters, hyphen(-) & slash(/,\\/) only',
                excludeEmptyString: true,
            })
    });

    const { control, errors, handleSubmit, setValue } = useForm({
        validationSchema,
    });

    //prefill
    useEffect(() => {
        if (props?.id) {
            let filterData = insurerQueriesTypeData.filter((item) => item.id === props?.id);
            setValue("name", filterData[0]?.name);
        }
        //eslint-disable-next-line
    }, [props?.id]);


    useEffect(() => {
        if (insurerUpdateQueryType) {
            dispatch(success(insurerUpdateQueryType));
            props.onHide();
        }

        return () => {
            dispatch(clear("insurer-query-type"));
        };
        //eslint-disable-next-line
    }, [insurerUpdateQueryType]);



    const onSubmit = (data) => {
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("_method", "PATCH");
        dispatch(updateInsurerQueryType(props?.id, formdata))
    }


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Edit Query Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm="12" md="12" lg="12" xl="12">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Input
                                            label="Query Type"
                                            placeholder="Enter Query Type"
                                            maxLength={validation.name.length}
                                            required={false}
                                            isRequired={true}
                                        />
                                    }
                                    name="name"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.name}
                                />
                            </div>
                            {!!errors?.name && <Error>{errors?.name?.message}</Error>}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button buttonStyle="danger" onClick={props.onHide}>
                        Close
					</Button>
                    <Button type="submit">Update</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditModal;
