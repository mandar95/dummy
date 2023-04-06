import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import swal from 'sweetalert';
import styled from 'styled-components'
import * as yup from 'yup';
// import { useHistory } from 'react-router-dom';

import { Input, Card, Button, Error, Loader } from "../../../components";
import { Row, Col, Form } from 'react-bootstrap';


import { AttachFile2 } from '../../core';

import { useDispatch, useSelector } from 'react-redux';
import { updateEmployerInput, getEmployerInput, clear, updateEmployerData } from '../employerLanding.slice';


const BenefitTagline = ({ control, errors }) => {

    return (
        <Col md={12} lg={6} xl={3} sm={12}>
            <Controller
                as={<Input label={`Tagline`} placeholder={`Enter Tagline`} />}
                name={`benefit_tagline`}
                control={control}
                error={errors && errors.tagline}
                defaultValue={""}
            />
            {!!errors?.benefit_tagline &&
                <Error>
                    {errors?.benefit_tagline?.message}
                </Error>}
        </Col>
    )
}
const BenefitTitle = ({ control, errors }) => {
    return (
        <Col md={12} lg={6} xl={3} sm={12}>
            <Controller
                as={<Input label={`Title`} placeholder={`Enter Title`} />}
                name={`benefit_title`}
                control={control}
                error={errors && errors.title}
                defaultValue={""}

            />
            {!!errors?.benefit_title &&
                <Error>
                    {errors?.benefit_title?.message}
                </Error>}
        </Col>
    )
}
const Benefits = ({ no, control, errors }) => {
    return (
        <>
            <Col md={12} lg={6} xl={3} sm={12} style={{ display: "none" }}>
                <Controller
                    as={<Input />}
                    name={`benefit_id`}
                    control={control}
                    //error={errors && errors.description}
                    defaultValue={""}
                />
                {!!errors?.benefit_id &&
                    <Error>
                        {errors?.benefits_id?.message}
                    </Error>}
            </Col>
            <Col md={12} lg={6} xl={3} sm={12}>
                <Controller
                    as={<Input label={`Features${(no + 1)}`} placeholder={`Enter Features${(no + 1)}`} />}
                    name={`benefits[${(no)}].benefit_features`}
                    control={control}
                    error={errors && errors.feature}
                    defaultValue={""}
                />
                {!!errors?.benefits &&
                    <Error>
                        {errors?.benefits[no]?.benefit_features?.message}
                    </Error>}
            </Col>
        </>
    )
}
const AppUrl = ({ control, errors }) => {
    return (
        <Row className="d-flex flex-wrap justify-content-md-center">
            <Col md={12} lg={6} xl={4} sm={12}>
                <Controller
                    as={<Input label={`Url`} placeholder={`Enter Url`} />}
                    name={`benefit_app_url`}
                    control={control}
                    error={errors && errors.url}
                    defaultValue={""}
                />
                {!!errors?.benefit_app_url &&
                    <Error>
                        {errors?.benefit_app_url?.message}
                    </Error>}
            </Col>
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

export const EmployerInput = () => {
    const dispatch = useDispatch();
    // const history = useHistory();
    const { employerData, success, error, loading } = useSelector(state => state.employerHome);

    // Form Validation Schema---------------
    const validationSchema = yup.object().shape({
        benefit_app_url: yup.string().required('Please enter url'),
        benefit_tagline: yup.string().required('Please enter tagline'),
        benefit_title: yup.string().required('Please enter title'),
        benefit_id: yup.number(),
        benefits: yup.array().of(
            yup.object().shape({
                benefit_features: yup.string().required('Please enter feature'),
            })
        ),
        stepers: yup.array().of(
            yup.object().shape({
                steper_description: yup.string().required('Please enter descrition steper'),
                steper_title: yup.string().required('Please enter title'),
                steper_id: yup.number()
            })
        )
    });
    const { control, errors, handleSubmit, register, setValue } = useForm({
        validationSchema
    });

    //Api Calls-----------------
    useEffect(() => {
        if (!employerData.length) {
            dispatch(getEmployerInput(4))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Reset Form Data-----------------
    useEffect(() => {
        if (typeof employerData[0] !== "undefined") {
            setValue('benefit_tagline', employerData[0].benefit_tagline)
            setValue('benefit_title', employerData[0].benefit_title)
            setValue('benefit_app_url', employerData[0].app_url)
            setValue('benefit_id', employerData[0].benefit_id)
            employerData[0].benefit_features.forEach(function (value, i) {
                setValue(`benefits[${(i)}].benefit_features`, value)
            });
            employerData[0].stepers.forEach(function (value, i) {
                setValue(`stepers[${(i)}].steper_description`, value.description)
                setValue(`stepers[${(i)}].steper_title`, value.title)
                setValue(`stepers[${(i)}].steper_id`, value.id)
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employerData])

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
        const formdata = new FormData();

        formdata.append("benefit_app_url", data.benefit_app_url);
        formdata.append("benefit_tagline", data.benefit_tagline);
        formdata.append("benefit_title", data.benefit_title);
        formdata.append("benefit_id", data.benefit_id);
        data.benefits.forEach((data, index) => {
            formdata.append("benefit_features[]", data.benefit_features);
        });
        data.stepers.forEach((data, index) => {
            formdata.append("steper_description[]", data.steper_description);
            formdata.append("steper_title[]", data.steper_title);
            formdata.append("steper_id[]", data.steper_id);
            if (typeof data.steper_image[0] !== "undefined") {
                formdata.append(`steper_image[${index}]`, data.steper_image[0]);
            }
        });
        dispatch(updateEmployerInput(4, formdata));
        dispatch(updateEmployerData(data))
    };
    return (
        <Card title="Employer inputs">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Rows><h4><span>Benefits</span></h4></Rows>
                <Row className="d-flex flex-wrap">
                    {[1, 2, 3, 4, 5].map((item, i) => {
                        return <Benefits key={'ben' + i} no={i} errors={errors} control={control} />
                    })}
                    {/* <Row><h1>Benefits Title</h1></Row> */}
                    {[1].map((item, i) => {
                        return <BenefitTitle key={'title' + i} no={i} errors={errors} control={control} />
                    })}
                    {/* <Row><h1>Benefits Tagline</h1></Row> */}
                    {[1].map((item, i) => {
                        return <BenefitTagline key={'tagline' + i} no={i} errors={errors} control={control} employerData={employerData} />
                    })}
                </Row>
                <Rows style={{ marginTop: "20px" }}><h4><span>App Url</span></h4></Rows>
                {[1].map((item, i) => {
                    return <AppUrl key={'url' + i} no={i} errors={errors} control={control} />
                })}
                <Rows style={{ marginTop: "20px" }}><h4><span>Stepers</span></h4></Rows>
                {[1, 2, 3, 4, 5].map((item, i) => {
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
