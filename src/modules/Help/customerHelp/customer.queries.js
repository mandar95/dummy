import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import Table from "./table";
import swal from "sweetalert";
// import _ from "lodash";
import { CardBlue, Button, Error, Select, Loader } from "components";
import { AttachFile2 } from 'modules/core';
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerQueryType, getCustomerSubQueryType, submitCustomerQuery, getAllCustomerQueries, clear } from "../help.slice";

export const Queries = (props) => {
    const dispatch = useDispatch();
    const { queryTypeData, subQueryTypeData, customerQueriesData, success, error, loading } = useSelector((state) => state.help);
    const [resetFile, setResetFile] = useState(false);
    const { globalTheme } = useSelector(state => state.theme)

    const validationSchema = yup.object().shape({
        query_type: yup.string().required("Please select query"),
        query_sub_type: yup.string().required("Please select sub query"),
        comment: yup.string().required("Please enter comment"),
        document: yup.mixed().required("File is required")
    });

    const { control, errors, handleSubmit, setValue, watch, register } = useForm({
        validationSchema,
        // mode: "onBlur",
        // reValidateMode: "onBlur"
    });

    const QueryType = watch('query_type')

    useEffect(() => {
        dispatch(getCustomerQueryType());
        dispatch(getAllCustomerQueries());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (QueryType) {
            dispatch(getCustomerSubQueryType({ query_id: QueryType }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [QueryType])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                dispatch(getAllCustomerQueries());
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
        setValue([
            { "query_type": "" },
            { "query_sub_type": "" },
            { "comment": "" },
        ])
        setResetFile(true);
    };

    const onSubmit = (data) => {
        const formdata = new FormData();
        formdata.append("query_type_id", data.query_type);
        formdata.append("query_sub_type_id", data.query_sub_type);
        data?.document[0] && formdata.append("document", data.document[0]);
        formdata.append("comments", data.comment);
        dispatch(submitCustomerQuery(formdata));
    }

    return (
        <>
            <CardBlue title='Queries & Complaints'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm="12" md="6" lg="6" xl="6">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Query Type"
                                            placeholder="Select Query Type"
                                            required={false}
                                            isRequired={true}
                                            options={
                                                queryTypeData?.map((item) => ({
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
                        <Col sm="12" md="6" lg="6" xl="6">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Sub Type"
                                            placeholder="Select Sub Type"
                                            required={false}
                                            isRequired={true}
                                            options={
                                                subQueryTypeData?.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                })) || []
                                            }
                                        />
                                    }
                                    name="query_sub_type"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.query_sub_type}
                                />
                            </div>
                            {!!errors?.query_sub_type && <Error>{errors?.query_sub_type?.message}</Error>}
                        </Col>
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <div className="p-2">
                                <AttachFile2
                                    fileRegister={register}
                                    control={control}
                                    defaultValue={""}
                                    name="document"
                                    title="Attach File"
                                    key="premium_file"
                                    accept=".jpeg, .png, .jpg"
                                    description="File Formats: jpeg, png, jpg"
                                    resetValue={resetFile}
                                    nameBox
                                />
                                {!!errors?.document && <Error>{errors?.document?.message}</Error>}
                            </div>
                        </Col>
                        <Col sm="12" md="12" lg="12" xl="12" className="text-center">
                            <div className="my-2 py-2">
                                <label style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>
                                    Comments
                                    <sup>
                                        <img alt="important" src="/assets/images/inputs/important.png" />
                                    </sup>
                                </label>
                                <Controller
                                    as={<Form.Control as="textarea" rows="2" isRequired={true} />}
                                    name="comment"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.comment}
                                />
                            </div>
                            {!!errors?.comment && (
                                <Error>{errors?.comment?.message}</Error>
                            )}
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
            </CardBlue>
            <CardBlue
                title={<div className="d-flex justify-content-between">
                    <span>Queries</span>
                </div>}>
                <Table data={customerQueriesData} />
            </CardBlue>
            {loading && <Loader />}
        </>
    )

}
