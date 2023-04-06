import React, { useEffect, useState, Fragment } from 'react';
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import { useForm, Controller } from 'react-hook-form';
import swal from 'sweetalert';
import { Error, Input, Select } from "components";
import styled from 'styled-components';

import { handleForgotPassword, alertCleanup, getSecurityQuestion, verifySecurityQA, clear } from '../login.slice';

import {
  LoginBox,
  FormTextInput,
  Button,
  AnchorTag,
  AnchorTag2
} from '../style';
import { useLocation } from 'react-router';
import { Loader } from '../../../../components';

const Label = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};

padding: 0px 5px;
border-radius: 5px;
`
const BorderDiv = styled.div`
height: 8px;
width: 40px;
background: #ffcd37;
border-radius: 15px;
margin-left: 5px;
`

const SideCard = styled.div`
//padding: 10px 35px;
//background: white;
//border-radius: 5px;
//box-shadow: 0px 1px 6px 1px gainsboro;
width: 600px;
// height: 415px;

@media (max-width:992px) {
	margin-top:20px;
   }
`
const TitleLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};

`
const OutputLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};

color:#51516f;
`

const CardRows = styled(Row)`
padding: 0px 145px;
@media (max-width:992px) {
	margin:0px 10px
   }
   @media (max-width:1291px) {
    padding: 0px 0px
   }
`

const IMG = styled.img`
@media (max-width:767px) {
height:165px;
   }
`

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [QA, setQA] = useState(false);
  const [QACount, setQACount] = useState(0)
  const { control, handleSubmit, errors, setValue } = useForm();
  const { search } = useLocation();
  const loginState = useSelector(state => state.login);
  const { securityQuestion, QAVerifysuccess, QAVerifytoken, errorQA } = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(getSecurityQuestion())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    if (QACount > 2) {
      swal("", "You have reached the maximum attempts. Please recover your password with email", "warning").then(() => {
        setQA(false)
      });
    }
  }, [QACount])

  useEffect(() => {
    if (QAVerifysuccess) {
      swal("", QAVerifysuccess, "success").then(() => {
        if (QAVerifytoken) { history.push(`/reset-password?token=${QAVerifytoken}`); }
      });
    }

    if (errorQA) {
      swal("", errorQA, "warning").then(() => {
        setQACount((QACount + 1));
        dispatch(clear())
      });

    }

    return () => {
      if (QAVerifytoken)
        dispatch(clear('QAVerify'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QAVerifysuccess, QAVerifytoken, errorQA])

  useEffect(() => {
    const { error, success, loading } = loginState;
    if (!loading) {
      if (error) {
        swal("", error, "warning");
      }

      if (success) {
        swal("", success, "success").then(() => {
          setValue('email', '')
        });
      }
    }

    return () => {
      dispatch(alertCleanup())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState])

  const onSubmit = data => {
    if (QA) {
      var regex = /[@]/g;
      let check = regex.test(data?.field);
      let formdata = {}
      if (check) {
        formdata.email = data?.field
      } else if (
        typeof (data?.field * 1) === "number" &&
        data?.field.length === 10
      ) {
        formdata.number = data?.field
      } else {
        formdata.code = data?.field
      }
      dispatch(verifySecurityQA({
        ...formdata,
        question_1_id: data.answers[0].question_id,
        answer_1: data.answers[0].answer,
        question_2_id: data.answers[1].question_id,
        answer_2: data.answers[1].answer,
      }));
    } else {
      dispatch(handleForgotPassword(data));
    }
  };

  return (
    <LoginBox>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardRows>
          <Col xl={6} lg={6} md={12} sm={12} className="d-flex justify-content-center align-items-center">
            <IMG
              src="/assets/images/Group 3797@2x.png" height="300"
            />
          </Col>
          <Col xl={6} lg={6} md={12} sm={12} className="d-flex justify-content-center">
            <SideCard className="">
              <Row className="flex-column" style={{ lineHeight: '25px' }}>
                <Label>{search ? ('Reset Password') : ('Forgot Password')}</Label>
                <BorderDiv />
              </Row>
              <Row className="flex-column mt-4">
                {!QA ?
                  <>
                    <TitleLabel>Email</TitleLabel>
                    <OutputLabel>
                      <Controller
                        as={
                          <FormTextInput
                            type="email"
                            name="email"
                            placeholder="Your Email Id" />
                        }
                        name="email"
                        defaultValue=""
                        control={control}
                      />
                    </OutputLabel>
                  </> :
                  <>
                    <TitleLabel>Email/Mobile/Code</TitleLabel>
                    <OutputLabel>
                      <Controller
                        as={
                          <FormTextInput
                            name="field"
                            type="input"
                            placeholder="Your Email Id/Mobile No./Code"
                            error={errors && errors.field}
                          />
                        }
                        name="field"
                        control={control}
                      />
                    </OutputLabel>
                  </>
                }
              </Row>
              {QA &&
                [1, 2]?.map((item, i) =>
                (
                  <Fragment key={i + 'QA'}>
                    <Row>
                      <Col sm="12" md="12" lg="12" xl="12">
                        <Controller
                          as={
                            <Select
                              label={"Questions"}
                              placeholder={"Select Security Question"}
                              options={
                                securityQuestion?.map(({ id, question }) => ({
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
                )
              }
              <Row className="justify-content-between">
                <AnchorTag to="/login" className="p-3">
                  <label>Existing User Click Here To Login</label>
                </AnchorTag>
                {QACount < 3 &&
                  <AnchorTag2 onClick={() => setQA(!QA)}>
                    <label>Reset Password Using Security Question</label>
                  </AnchorTag2>
                }
              </Row>
              <Row>
                <Button type="submit">
                  Submit
                  <i className="ti-arrow-right" />
                </Button>
              </Row>
            </SideCard>
          </Col>
        </CardRows>
      </form>
      {loginState.loading && <Loader />}
    </LoginBox>
  )
};
