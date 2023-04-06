import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import swal from 'sweetalert';

import * as yup from 'yup';

// import { useHistory } from 'react-router-dom';

import styled from 'styled-components'
import { Input, Card, Button, Error, Loader } from "../../../components";
import { Row, Col, Form } from 'react-bootstrap';


import { AttachFile2 } from '../../../modules/core';

import { useDispatch, useSelector } from 'react-redux';
import { updateBrokerInput, getBrokerInput, clear, updateBrokerData } from '../employerLanding.slice';

const Benefits = ({ no, control, errors }) => {
    return (
        <Row className="d-flex flex-wrap">
            <Col md={12} lg={6} xl={4} sm={12} style={{ display: "none" }}>
                <Controller
                    as={<Input />}
                    name={`benefits[${(no)}].benefits_id`}
                    control={control}
                    error={errors && errors.description}
                    defaultValue={""}
                />
                {!!errors?.benefits &&
                    <Error>
                        {errors?.benefits[no]?.benefits_id?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={4} sm={12}>
                <Controller
                    as={<Input label={`Description${(no + 1)}`} placeholder={`Enter Description${(no + 1)}`} />}
                    name={`benefits[${(no)}].benefits_description`}
                    control={control}
                    error={errors && errors.description}
                    defaultValue={""}
                />
                {!!errors?.benefits &&
                    <Error>
                        {errors?.benefits[no]?.benefits_description?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={4} sm={12}>
                <Controller
                    as={<Input label={`Title${(no + 1)}`} placeholder={`Enter Title${(no + 1)}`} />}
                    name={`benefits[${(no)}].benefits_title`}
                    control={control}
                    error={errors && errors.title}
                    defaultValue={""}
                />
                {!!errors?.benefits &&
                    <Error>
                        {errors?.benefits[no]?.benefits_title?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={4} sm={12}>
                <Controller
                    as={<Input label={`Url${(no + 1)}`} placeholder={`Enter Url${(no + 1)}`} />}
                    name={`benefits[${(no)}].benefits_url`}
                    control={control}
                    error={errors && errors.url}
                    defaultValue={""}
                />
                {!!errors?.benefits &&
                    <Error>
                        {errors?.benefits[no]?.benefits_url?.message}
                    </Error>}
            </Col>
            {/* <Col md={12} lg={6} xl={4} sm={12}>
                    <AttachFile2
                        fileRegister={register}
                        name={`benefits[${(no)}].benefits_image`}
                        title="Attach Logo"
                        key="premium_file"
                        accept=".jpeg, .png, .jpg"
                        description="File Formats: jpeg, png, jpg"
                        nameBox
                    />
                </Col> */}
        </Row>
    )
}
const CustomerService = ({ no, control, errors }) => {
    return (
        <Row className="d-flex flex-wrap">
            <Col md={12} lg={6} xl={6} sm={12} style={{ display: "none" }}>
                <Controller
                    as={<Input />}
                    name={`customer_service[${(no)}].customer_service_id`}
                    control={control}
                    error={errors && errors.description}
                    defaultValue={""}
                />
                {!!errors?.customer_service &&
                    <Error>
                        {errors?.customer_service[no]?.customer_service_id?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={6} sm={12}>
                <Controller
                    as={<Input label={`Description${(no + 1)}`} placeholder={`Enter Description${(no + 1)}`} />}
                    name={`customer_service[${(no)}].customer_service_description`}
                    control={control}
                    error={errors && errors.description}
                    defaultValue={""}
                />
                {!!errors?.customer_Service &&
                    <Error>
                        {errors?.customer_Service[no]?.customer_service_description?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={6} sm={12}>
                <Controller
                    as={<Input label={`Title${(no + 1)}`} placeholder={`Enter Title${(no + 1)}`} />}
                    name={`customer_service[${(no)}].customer_service_title`}
                    control={control}
                    error={errors && errors.title}
                    defaultValue={""}
                />
                {!!errors?.customer_Service &&
                    <Error>
                        {errors?.customer_Service[no]?.customer_service_title?.message}
                    </Error>}
            </Col>
            {/* <Col md={12} lg={6} xl={4} sm={12}>
                    <AttachFile2
                        fileRegister={register}
                        name={`customer_service[${(no)}].customer_service_image`}
                        title="Attach Logo"
                        key="premium_file"
                        accept=".jpeg, .png, .jpg"
                        description="File Formats: jpeg, png, jpg"
                        nameBox
                    />
                </Col> */}
        </Row>
    )
}
const Stepers = ({ no, control, errors, register }) => {
    return (
        <Row className="d-flex flex-wrap">
            <Col md={12} lg={6} xl={4} sm={12} style={{ display: "none" }}>
                <Controller
                    as={<Input />}
                    name={`stepers[${(no)}].steper_id`}
                    control={control}
                    error={errors && errors.description}
                    defaultValue={""}
                />
                {!!errors?.stepers &&
                    <Error>
                        {errors?.stepers[no]?.steper_id?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={4} sm={12}>
                <Controller
                    as={<Input label={`Description${(no + 1)}`} placeholder={`Enter Description${(no + 1)}`} />}
                    name={`stepers[${(no)}].steper_description`}
                    control={control}
                    error={errors && errors.description}
                    defaultValue={""}
                />
                {!!errors?.stepers &&
                    <Error>
                        {errors?.stepers[no]?.steper_description?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={4} sm={12}>
                <Controller
                    as={<Input label={`Title${(no + 1)}`} placeholder={`Enter Title${(no + 1)}`} />}
                    name={`stepers[${(no)}].steper_title`}
                    control={control}
                    error={errors && errors.title}
                    defaultValue={""}
                />
                {!!errors?.stepers &&
                    <Error>
                        {errors?.stepers[no]?.steper_title?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={4} sm={12}>
                <AttachFile2
                    fileRegister={register}
                    name={`stepers[${(no)}].steper_image`}
                    title="Attach Logo"
                    key="premium_file"
                    accept=".jpeg, .png, .jpg"
                    description="File Formats: jpeg, png, jpg"
                    nameBox
                />
            </Col>
        </Row>
    )
}

export const BrokerInput = () => {
    const dispatch = useDispatch();
    // const history = useHistory();
    const { brokerData, success, error, loading } = useSelector(state => state.employerHome);

    // Form Validation Schema---------------
    const validationSchema = yup.object().shape({
        benefits: yup.array().of(
            yup.object().shape({
                benefits_description: yup.string().required('Please enter descrition'),
                benefits_title: yup.string().required('Please enter title'),
                benefits_url: yup.string().required('Please enter url'),
                benefits_id: yup.number()
            })
        )
    });
    const { control, errors, handleSubmit, register, setValue } = useForm({
        validationSchema
    });
    //Api Calls-----------------
    useEffect(() => {
        if (!brokerData.length) {
            dispatch(getBrokerInput(3))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Reset Form Data-----------------
    useEffect(() => {
        if (typeof brokerData[0] !== "undefined") {
            brokerData[0].benefits.forEach(function (value, i) {
                setValue(`benefits[${(i)}].benefits_description`, value.description)
                setValue(`benefits[${(i)}].benefits_title`, value.title)
                setValue(`benefits[${(i)}].benefits_url`, value.url)
                setValue(`benefits[${(i)}].benefits_id`, value.id)
            });
            brokerData[0].stepers.forEach(function (value, i) {
                setValue(`stepers[${(i)}].steper_description`, value.description)
                setValue(`stepers[${(i)}].steper_title`, value.title)
                setValue(`stepers[${(i)}].steper_id`, value.id)
            });
            brokerData[0].customer_service.forEach(function (value, i) {
                setValue(`customer_service[${(i)}].customer_service_description`, value.description)
                setValue(`customer_service[${(i)}].customer_service_title`, value.title)
                setValue(`customer_service[${(i)}].customer_service_id`, value.id)
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brokerData])

    //success ,error alert--------------------
    useEffect(() => {
        if (success?.status) {
            swal(success.message, "", "success").then(() => dispatch(clear()));
        } else {
            if (error) {
                swal("", error, "warning").then(() => dispatch(clear()));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    //Submit Data to Api---------------
    const onSubmit = data => {

        // dispatch(updateBrokerInput(3, { ...data}))
        const formdata = new FormData();
        data.benefits.forEach((data) => {
            formdata.append("benefits_description[]", data.benefits_description);
            formdata.append("benefits_title[]", data.benefits_title);
            formdata.append("benefits_url[]", data.benefits_url);
            formdata.append("benefits_id[]", data.benefits_id);
            //formdata.append("benefits_image[]", data.benefits_image[0]);
        });
        data.customer_service.forEach((data) => {
            formdata.append("customer_service_description[]", data.customer_service_description);
            formdata.append("customer_service_title[]", data.customer_service_title);
            formdata.append("customer_service_id[]", data.customer_service_id);
            //formdata.append("customer_service_image[]", data.customer_service_image[0]);
        });
        data.stepers.forEach((data, index) => {
            formdata.append("steper_description[]", data.steper_description);
            formdata.append("steper_title[]", data.steper_title);
            formdata.append("steper_id[]", data.steper_id);
            if (typeof data.steper_image[0] !== "undefined") {
                formdata.append(`steper_image[${index}]`, data.steper_image[0]);
            }
        });

        dispatch(updateBrokerInput(3, formdata))
        dispatch(updateBrokerData(data))

    };
    return (
        <Card title="Broker inputs">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Rows><h4><span>Benefits</span></h4></Rows>
                {[1, 2, 3].map((item, i) => {
                    return <Benefits key={'ben' + i} no={i} errors={errors} control={control} register={register} />
                })}
                <Rows style={{ marginTop: "20px" }}><h4><span>Customer Service</span></h4></Rows>
                {[1, 2, 3].map((item, i) => {
                    return <CustomerService key={'serv' + i} no={i} errors={errors} control={control} register={register} />
                })}
                <Rows style={{ marginTop: "20px" }}><h4><span>Stepers</span></h4></Rows>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => {
                    return <Stepers key={'step' + i} no={i} errors={errors} control={control} register={register} />
                })}
                <Row>
                    <Col md={12} className="d-flex justify-content-end mt-4">
                        <Button type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            {loading && <Loader />}
        </Card>
    )

}

const Rows = styled(Row)`
justify-content:center;
margin-bottom:15px
`
