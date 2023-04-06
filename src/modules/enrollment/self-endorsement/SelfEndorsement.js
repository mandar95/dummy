import React, {/* useState,*/  Fragment, useEffect, useReducer } from "react";
import * as yup from "yup";
import swal from "sweetalert";

// import classesone from "./index.module.css";
import { Row, Col } from "react-bootstrap";
import {
  Input, Button, Select,
  Error,
  Marker, Typography, Loader
} from "components";
import { Title } from "modules/RFQ/select-plan/style.js";


import { Controller, useForm } from "react-hook-form";
import { formatDate, filterGender } from "../enrollment.help";
import {
  initialState, reducer, loadPolicyDetail, submitEndorsement
} from "./self-endorsement.action";
import { Card, Footer, NavBar } from "../../../components"
import styled from "styled-components";
import { useHistory, useLocation } from "react-router";
import { Decrypt, noSpecial, numOnly } from 'utils'
import { common_module } from 'config/validations'
import { subYears } from "date-fns";

const validation = common_module.user

const validationSchema = (designation, grade, isSalaryMandatory) => yup.object().shape({
  first_name: yup.string().required('First Name Required')
    .min(validation.name.min, `Minimum ${validation.name.min} character Required`)
    .max(validation.name.max, `Maximum ${validation.name.max} character available`)
    .matches(validation.name.regex, "First Name must contain only alphabets"),
  last_name: yup.string().nullable().notRequired()
    .max(validation.name.max, `Maximum ${validation.name.max} character available`)
    .matches(validation.name.regex, { message: "Last Name must contain only alphabets", excludeEmptyString: true }),
  gender: yup.string().required('Gender Required'),
  dob: yup.string().required('Date of Birth Required'),
  date_of_joining: yup.string().required('Date of Joining Required'),
  employee_code: yup.string().required('Employee Code Required'),

  ...designation.length && { designation: yup.string().required('Designation Required') },
  ...grade.length && { grade: yup.string().required('Grade Required') },
  ...isSalaryMandatory && {
    annual_salary: yup.string().required('Annual Salary Required'),
    variable_in_salary: yup.string().required('Variable in Salary Required')
  },

  mobile_number: yup.string().nullable().notRequired()
    .max(validation.contact.length, "Mobile No. should be 10 digits")
    .matches(validation.contact.regex, { message: "'Not valid number'", excludeEmptyString: true }),
  email: yup.string().email('Must be a valid email').required('Email Required')
    .min(validation.email.min, `Minimum ${validation.email.min} character Required`)
    .max(validation.email.max, `Maximum ${validation.email.max} character available`),
});


export const SelfEndorsement = () => {

  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const options = query.get("options");
  const policy_ids = options.split('o').map((id) => Decrypt(id))
  const [{ policy_detail, loading, designation, grade }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // no policy ids
    if (!options) {
      history.replace('/')
    }
    // incoorect policy ids
    if (!policy_ids.every(Number.isInteger)) {
      swal('Incorrect Link', 'Contact Hr to generate correct URL', 'info').then(() => {
        history.replace('/')
      })
    } else {
      loadPolicyDetail(dispatch, policy_ids)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading && !policy_detail.length) {
      swal('Incorrect Link', 'Contact Hr to generate correct URL', 'info').then(() => {
        history.replace('/')
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, policy_detail])

  const isSalaryMandatory = policy_detail.some(({ number_of_time_salary }) => number_of_time_salary.length)

  const { control, errors, /* reset, */ handleSubmit, register } = useForm({
    validationSchema: validationSchema(designation, grade, isSalaryMandatory)
  });

  const onSubmit = (data) => {

    const filterData = Object.entries(data).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {})

    const payload = {
      ...filterData,
      request_from: 1,
      employer_id: policy_detail?.[0]?.employer_id,
      gender: data.gender === "1"
        ? "Male"
        : (data.gender === "2"
          ? "Female"
          : "Other")
    }
    submitEndorsement(dispatch, payload, history)
  };

  return <>
    <NavBar noLink second_logo={policy_detail?.[0]?.employer_logo} />
    <PageWrapper>

      <Row className="m-0 p-0">
        <Col xl='12' lg='12' md='12' sm='12' className="text-center">
          <Title fontSize='3rem' color="#005bb3">Welcome To {process.env.REACT_APP_BROKER_NAME}</Title>
        </Col>
      </Row>
      <Row className="m-0 p-0 flex-column-reverse flex-xl-row flex-lg-row">
        <Col xl='9' lg='12' md='12' sm='12' className="p-0 m-0">
          <Card title={<Title className="m-0" fontSize='1.7rem' color="#005bb3">Employee Detail</Title>}>
            <form className="row m-0 justify-content-center justify-content-sm-center justify-content-md-start" onSubmit={handleSubmit(onSubmit)}>
              <div className="row m-0 justify-content-center justify-content-sm-center justify-content-md-start w-100">

                {/* 1 */}
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="First Name"
                        placeholder="Enter First Name"
                        required={false}
                        isRequired
                      />
                    }
                    error={errors && errors.first_name}
                    control={control}
                    name="first_name"
                  />
                  {!!errors.first_name && (
                    <Error>{errors.first_name.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Last Name"
                        placeholder="Enter Last Name"
                        required={false}
                      />
                    }
                    error={errors && errors.last_name}
                    control={control}
                    name="last_name"
                  />
                  {!!errors.last_name && (
                    <Error>{errors.last_name.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Select
                        label="Gender"
                        placeholder="Select Gender"
                        required={false}
                        options={
                          filterGender().map((item) => ({
                            id: item.id,
                            name: item.name,
                            value: item.id,
                          })) || []
                        }
                        error={errors && errors.gender}
                        isRequired
                      />
                    }
                    control={control}
                    name="gender"
                  />
                  {!!errors.gender && (
                    <Error>{errors.gender.message}</Error>
                  )}
                </Col>

                {/* 2 */}
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={<Input label="Date of Birth" type="date" required={false} />}
                    name="dob"
                    max={formatDate(subYears(new Date(), 18))}
                    error={errors && errors.dob}
                    control={control}
                    isRequired
                  />
                  {!!errors.dob && (
                    <Error>{errors.dob.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={<Input label="Date of Joining" type="date" required={false} />}
                    name="date_of_joining"
                    max={formatDate(new Date())}
                    error={errors && errors.date_of_joining}
                    control={control}
                    isRequired
                  />
                  {!!errors.date_of_joining && (
                    <Error>{errors.date_of_joining.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Mobile No."
                        placeholder="Enter Mobile No"
                        min={0}
                        type="tel"
                        maxLength={10}
                        onKeyDown={numOnly}
                        onKeyPress={noSpecial}
                        required={false}
                        error={errors && errors.mobile_number}
                      />
                    }
                    control={control}
                    name="mobile_number"
                  />
                  {!!errors.mobile_number && (
                    <Error>{errors.mobile_number.message}</Error>
                  )}
                </Col>

                {/* 3 */}
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Employee Code"
                        placeholder="Enter Employee Code"
                        required={false}
                        error={errors && errors.employee_code}
                      />
                    }
                    isRequired
                    control={control}
                    name="employee_code"
                  />
                  {!!errors.employee_code && (
                    <Error>{errors.employee_code.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Email"
                        placeholder="Enter Email"
                        type="email"
                        error={errors && errors.email}
                        required={false}
                      />
                    }
                    isRequired
                    control={control}
                    name="email"
                  />
                  {!!errors.email && (
                    <Error>{errors.email.message}</Error>
                  )}
                </Col>

                {/* 4 */}
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      designation.length ?
                        <Select
                          label="Designation"
                          placeholder="Select Designation"
                          required={false}
                          isRequired
                          options={designation}
                          error={errors && errors.designation}
                        /> :
                        <Input
                          label="Designation"
                          placeholder="Enter Designation"
                          required={false}
                          error={errors && errors.designation}
                        />
                    }
                    control={control}
                    name="designation"
                  />
                  {!!errors.designation && (
                    <Error>{errors.designation.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={grade.length ?
                      <Select
                        label="Grade"
                        placeholder="Select Grade"
                        required={false}
                        isRequired
                        options={grade}
                        error={errors && errors.grade}
                      /> :
                      <Input
                        label="Grade"
                        placeholder="Enter Grade"
                        required={false}
                        error={errors && errors.grade}
                      />
                    }
                    control={control}
                    name="grade"
                  />
                  {!!errors.grade && (
                    <Error>{errors.grade.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Annual Salary"
                        placeholder="Enter Annual Salary"
                        min={0}
                        type="tel"
                        isRequired={isSalaryMandatory}
                        maxLength={10}
                        onKeyDown={numOnly}
                        onKeyPress={noSpecial}
                        required={false}
                        error={errors && errors.annual_salary}
                      />
                    }
                    control={control}
                    name="annual_salary"
                  />
                  {!!errors.annual_salary && (
                    <Error>{errors.annual_salary.message}</Error>
                  )}
                </Col>
                <Col xl={4} lg={6} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Variable in Salary"
                        placeholder="Enter Variable in Salary"
                        min={0}
                        type="tel"
                        isRequired={isSalaryMandatory}
                        maxLength={10}
                        onKeyDown={numOnly}
                        onKeyPress={noSpecial}
                        required={false}
                        error={errors && errors.variable_in_salary}
                      />
                    }
                    control={control}
                    name="variable_in_salary"
                  />
                  {!!errors.variable_in_salary && (
                    <Error>{errors.variable_in_salary.message}</Error>
                  )}
                </Col>
              </div>

              {policy_detail.map(({ suminsured, opd_suminsured, number_of_time_salary, policy_id, policy_name }, index) =>
                <Fragment key={'policy_detail' + index}>
                  <input type='hidden' ref={register} name={`policy_detail[${index}].policy_id`} value={policy_id} />
                  {!!(suminsured.length || opd_suminsured.length || number_of_time_salary.length) &&

                    <>
                      {(suminsured.length > 1 || opd_suminsured.length > 1 || number_of_time_salary.length > 1) && <>
                        <Marker />
                        <Typography>{'\u00A0'} Select Cover for {policy_name}</Typography>
                      </>}
                      <div className="row m-0 justify-content-center justify-content-sm-center justify-content-md-start w-100">
                        {/* Sum Insured */}

                        {!!suminsured?.length && suminsured.length > 1 && (
                          <Col xl={4} lg={6} md={12} sm={12}>
                            <Controller
                              as={
                                <Select
                                  label="Sum Insured"
                                  placeholder="Select Sum Insured"
                                  options={suminsured.map(value => ({
                                    id: value,
                                    name: value,
                                    value
                                  })) || []}
                                  valueName="name"
                                  id="suminsured"
                                  required
                                />
                              }
                              name={`policy_detail[${index}].suminsured`}
                              control={control}
                            />
                          </Col>)}

                        {suminsured.length === 1 &&
                          <input
                            type="hidden"
                            value={suminsured[0]}
                            name={`policy_detail[${index}].suminsured`}
                            ref={register} />
                        }

                        {!!opd_suminsured?.length && opd_suminsured?.length > 1 && (
                          <Col xl={4} lg={6} md={12} sm={12}>
                            <Controller
                              as={
                                <Select
                                  label="OPD Sum Insured"
                                  placeholder="Select OPD Sum Insured"
                                  options={opd_suminsured.map(value => ({
                                    id: value,
                                    name: value,
                                    value
                                  })) || []}
                                  valueName="name"
                                  id="opd_suminsured"
                                  required
                                />
                              }
                              name={`policy_detail[${index}].opd_suminsured`}
                              control={control}
                            />
                          </Col>)}

                        {opd_suminsured.length === 1 &&
                          <input
                            type="hidden"
                            value={opd_suminsured[0]}
                            name={`policy_detail[${index}].opd_suminsured`}
                            ref={register} />
                        }

                        {/* No. of time salary relation */}
                        {!!number_of_time_salary.length && number_of_time_salary.length > 1 &&
                          <Col xl={4} lg={6} md={12} sm={12}>
                            <Controller
                              as={
                                <Select
                                  label="No. of time salary"
                                  placeholder="Select No. of time salary"
                                  options={number_of_time_salary
                                    .map((salary) => ({
                                      id: salary,
                                      name: Number(salary),
                                      value: salary
                                    })) || []}
                                  valueName="name"
                                  id="number_of_time_salary"
                                  required
                                />
                              }
                              name={`policy_detail[${index}].number_of_time_salary`}
                              control={control}
                            />
                          </Col>}

                        {number_of_time_salary.length === 1 &&
                          <input
                            type="hidden"
                            value={number_of_time_salary[0]}
                            name={`policy_detail[${index}].number_of_time_salary`}
                            ref={register} />
                        }
                      </div>
                    </>}
                </Fragment>
              )}


              {/* <Col md={12} lg={12} xl={12} sm={12}>
                  <TextCard width='auto' className="pl-3 pr-3 my-2" noShadow bgColor="#f2f2f2">
                    <Title fontSize="1rem" color="#4da2ff">
                      You will be enrolled into following policies
                    </Title>
                    <br />
                    {policy_detail.map(({ policy_name }) =>
                      <>
                        <Title fontSize="1rem" color="#4da2ff">
                          <i className="ti-arrow-circle-right mr-2" />
                          {policy_name}
                        </Title>
                        <br />
                      </>
                    )}
                  </TextCard>
                </Col> */}
              <Row className="w-100">

                <Col md={12} lg={12} xl={12} sm={12} className="d-flex justify-content-end p-0">
                  <Button>
                    Final Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </Card>
        </Col>
        <Col xl='3' lg='12' md='12' sm='12' className="d-flex flex-row flex-wrap justify-content-center align-items-start mt-5 image_final">
          <img src="/assets/images/Group 3797@2x.png" alt="Done" className='position-sticky sticky-top' />
          {/* <Title fontSize='1rem' color="#005bb3">
            Why do we use it?
            It is a long established fact that a reader will be distracted
            by the readable content of a page when looking at its layout.
            The point of using Lorem Ipsum is that it has a more-or-less
            normal distribution of letters, as opposed to using 'Content
            here, content here', making it look like readable English.
            Many desktop publishing packages and web page editors now use
            Lorem Ipsum as their default model text, and a search for
            'lorem ipsum' will uncover many web sites still in their infancy.
            Various versions have evolved over the years, sometimes by accident,
            sometimes on purpose (injected humour and the like).
          </Title> */}
        </Col>
      </Row>
    </PageWrapper>

    <Footer noLogin />
    {loading && <Loader />}
  </>
}

const PageWrapper = styled.div`
  padding-bottom: 60px;
  .image_final{
    img{
      height: 200px;
    }
  }
`
