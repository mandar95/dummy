import React, { useEffect } from 'react';
import { Modal, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
// import _ from "lodash";
import { Button, Error, Input, SelectComponent } from "components";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { success, clear, updateInsurerSubQueryType } from "../help.slice";
import { insurer } from 'config/validations'

const validation = insurer.query_complaint


const EditModal = (props) => {
    const dispatch = useDispatch();
    const { insurerQueriesTypeData, insurerQueriesSubTypeData, insurerUpdateSubQueryType } = useSelector((state) => state.help);

    const validationSchema = yup.object().shape({
        query_type: yup.object().shape({
            id: yup.string().required('Query type Required'),
        }),
        name: yup.string()
            .required("Please enter sub query type")
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
            let filterData = insurerQueriesSubTypeData.filter((item) => item.id === props?.id);
            setValue("name", filterData[0]?.name);
            setValue("query_type", insurerQueriesTypeData?.map((item) => ({
                id: item?.id,
                label: item?.name,
                value: item?.id,
            })).find(({ id }) => filterData[0]?.query_id === id));
        }
        //eslint-disable-next-line
    }, [props?.id]);


    useEffect(() => {
        if (insurerUpdateSubQueryType) {
            dispatch(success(insurerUpdateSubQueryType));
            props.onHide();
        }

        return () => {
            dispatch(clear("insurer-sub-query-type"));
        };
        //eslint-disable-next-line
    }, [insurerUpdateSubQueryType]);



    const onSubmit = (data) => {
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("query_id", data.query_type?.value);
        formdata.append("_method", "PATCH");
        dispatch(updateInsurerSubQueryType(props?.id, formdata))
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
                    <Modal.Title id="contained-modal-title-vcenter">Edit Query Sub Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm="12" md="6" lg="6" xl="6">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <SelectComponent
                                            label="Query Type"
                                            placeholder="Select Query Type"
                                            required={false}
                                            isRequired={true}
                                            options={
                                                insurerQueriesTypeData?.map((item) => ({
                                                    id: item?.id,
                                                    label: item?.name,
                                                    value: item?.id,
                                                })) || []
                                            }
                                        />
                                    }
                                    name="query_type"
                                    control={control}
                                    error={errors && errors.query_type?.id}
                                />
                            </div>
                            {!!errors?.query_type?.id && <Error>{errors?.query_type?.id?.message}</Error>}
                        </Col>
                        <Col sm="12" md="6" lg="6" xl="6">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Input
                                            label="Query Sub Type"
                                            placeholder="Enter Query Sub Type"
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
