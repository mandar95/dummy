import React, { useEffect, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Error, Input, Select, Button } from "components";
import swal from "sweetalert";
import styled from 'styled-components';
import * as yup from 'yup';

import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router";

import { LoginBox, CardBody, LoginFormHead, LoginFormBody } from "../style";
import { getSecurityQuestion, storeSecurityQuestion, clear, cleanExpiryDetails } from "../login.slice";

const BodyDiv = styled(CardBody)`
width:50%;
@media (max-width:767px) {
    width:100%;
   }
`

const LoginBodyDiv = styled(LoginFormBody)`
@media (max-width:767px) {
    padding:35px 0px;
   }
`


const validationSchema = yup.object().shape({
    answers: yup.array().of(
        yup.object().shape({
            answer: yup.string().required('Please enter answer'),
            question_id: yup.string().required('Please select security question'),
        }),
    )
});

export const SecurityQuestion = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { securityQuestion, QAsuccess, error } = useSelector((state) => state.login);

    const { control, handleSubmit, errors } = useForm({
        validationSchema
    });

    useEffect(() => {
        dispatch(getSecurityQuestion())

        return () => dispatch(cleanExpiryDetails())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (QAsuccess) {
            swal(QAsuccess, "", "success").then(() => {
                history.push("/change-password");
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [QAsuccess, error])
    const onSubmit = (data) => {
        dispatch(storeSecurityQuestion({
            answers: data.answers
        }));
    };

    const securityQuestion1 = securityQuestion.slice(0, securityQuestion.length / 2),
        securityQuestion2 = securityQuestion.slice(securityQuestion.length / 2, securityQuestion.length);
    return (
        <LoginBox>
            <form onSubmit={handleSubmit(onSubmit)} style={{ margin: '25px auto', width: '100%' }}>
                <BodyDiv>
                    <LoginFormHead>
                        <h4>Security Question</h4>
                    </LoginFormHead>
                    <LoginBodyDiv>
                        {[1, 2]?.map((item, i) =>
                        (
                            <Fragment key={i + 'QA2'}>
                                <Row>
                                    <Col sm="12" md="12" lg="12" xl="12">
                                        <div className="p-2">
                                            <Controller
                                                as={
                                                    <Select
                                                        label={"Questions"}
                                                        placeholder={"Select Security Question"}
                                                        options={
                                                            (item === 1 ? securityQuestion1 : securityQuestion2)?.map(({ id, question }) => ({
                                                                id: id,
                                                                name: question,
                                                                value: id,
                                                            })) || []
                                                        }
                                                    />
                                                }
                                                control={control}
                                                name={`answers[${i}].question_id`}
                                                error={errors && errors?.answers?.length && errors.answers[i]?.question_id}
                                            />
                                            {!!errors?.answers?.length && errors.answers[i]?.question_id &&
                                                <Error>
                                                    {errors?.answers?.length && errors.answers[i]?.question_id.message}
                                                </Error>}
                                        </div>
                                    </Col>
                                    <Col sm="12" md="12" lg="12" xl="12">
                                        <Controller
                                            as={<Input label="Answer" isRequired placeholder="Enter Answer" />}
                                            name={`answers[${i}].answer`}
                                            error={errors && errors?.answers?.length && errors.answers[i]?.answer}
                                            control={control}
                                        />
                                        {!!errors?.answers?.length && errors.answers[i]?.answer &&
                                            <Error>
                                                {errors?.answers?.length && errors.answers[i]?.answer.message}
                                            </Error>}
                                    </Col>
                                </Row>
                            </Fragment>
                        )
                        )}

                    </LoginBodyDiv>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </BodyDiv>
            </form>
        </LoginBox>
    );
};
