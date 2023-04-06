import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import { Error, RFQButton, RFQcard, Loader } from "../../../../../components";
import { Input, Select } from "../../../components";
import { numOnly, noSpecial } from 'utils'

import { BackBtn } from '../button'
import OTPEditModal from "../../OTPModal/modal";
import * as yup from "yup";
import _ from 'lodash';
// import swal from "sweetalert";

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import { clear, set_company_data, saveCompanyData, getstatecity } from '../../home.slice';
import { doesHasIdParam, giveProperId } from '../../home';
import { ModuleControl } from '../../../../../config/module-control';
import { common_module } from 'config/validations';
const validation = common_module.user;

export const CompanyDetails = ({ utm_source }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { globalTheme } = useSelector(state => state.theme)
    const { success, loading, pincodeLoading,
        company_data, enquiry_id, statecity,
        industry_data } = useSelector(state => state.RFQHome);
    const [OTPModal, setOTPModal] = useState(null);
    // const [subIndustry, setSubIndustry] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");
    const noOTP = query.get("no_otp");
    const creating_user = query.get("creating_user");

    const validationSchema = yup.object().shape({
        name: yup.string()
            .min(2, "Please enter name more than 2 character")
            .required("Please Enter Name")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
        designation: yup.string()
            // .min(2, "Please enter designation more than 2 character")
            // .required("Please Enter Designation")
            .matches(/^[aA-zZ\s]+$/, { message: "Only alphabets are allowed for this field", excludeEmptyString: true })
            .notRequired().nullable(),
        work_email: yup.string()
            .email('Please enter valid email id')
            .required('Email id is required'),
        company_name: yup.string().required("Company name is requied")
            .min(2, "Please enter name more than 2 character")
            .max(50, 'Company name should be below 50')
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
        contact_no: yup.string()
            .required('Mobile No. is required')
            .min(10, 'Mobile No. should be 10 digits')
            .max(10, 'Mobile No. should be 10 digits')
            .matches(validation.contact.regex, 'Not valid number'),
        // .test('invalid', 'Not valid number', (value) => {
        //     return !/^[9]{10}$/.test(value);
        // }),
        pincode: yup
            .string()
            .required("Pincode is required")
            .min(6, "Pincode must consist 6 digits")
            .max(6, "Pincode must consist 6 digits"),
        city_id: yup.string().required("City is required"),
        state_id: yup.string().required("State is required"),
        industry_type: yup.string().required("Industry type is required"),
        // industry_subtype: yup.string().required("Industry sub type is required"),
    });
    // /*----x-----validation schema-----x----*/

    const { handleSubmit, register, errors, watch, reset } = useForm({
        defaultValues: {
            name: company_data?.name,
            designation: company_data?.designation,
            work_email: company_data?.work_email,
            company_name: company_data?.company_name,
            contact_no: company_data?.contact_no,
            pincode: company_data?.pincode,
            city_id: company_data?.city_id,
            state_id: company_data?.state_id,
            industry_type: company_data?.industry_type,
            // industry_subtype: company_data?.industry_subtype,
        },
        validationSchema,
        mode: "onChange",
        reValidateMode: "onChange"
    });

    const Pincode = watch("pincode") || "";
    // const industryId = watch("industry_type");
    useEffect(() => {
        if (Pincode?.length === 6 || String(Pincode).length === 6) {
            dispatch(getstatecity({ pincode: Pincode }));
        } else {
            // dispatch(clear("pincode"));
            // setValue("city", "");
            // setValue("state", "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Pincode]);

    useEffect(() => {
        if (company_data?.work_email) {
            reset({
                name: company_data?.name,
                designation: company_data?.designation,
                work_email: company_data?.work_email,
                company_name: company_data?.company_name,
                contact_no: company_data?.contact_no,
                pincode: company_data?.pincode,
                city_id: company_data?.city_id,
                state_id: company_data?.state_id,
                industry_type: company_data?.industry_type,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data])

    // useEffect(() => {
    //     if ((industryId)) {
    //         let subIndustryData = industry_data?.sub_industries.filter((e) => e.super_industry_id === parseInt(industryId));
    //         setSubIndustry(subIndustryData);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [industryId]);


    useEffect(() => {
        // if (!_.isEmpty(company_data) && _.isEmpty(statecity)) {
        //     dispatch(getstatecity({ pincode: company_data?.pincode }));
        // }
        if (!_.isEmpty(statecity)) {
            dispatch(getstatecity({ pincode: company_data?.pincode }));
        }
        // setTimeout(() => {
        //     setValue("industry_subtype", company_data?.industry_subtype);
        // }, 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data]);

    // useEffect(() => {
    //     if (!_.isEmpty(company_data)) {
    //         setIndustryType(company_data.city_id)
    //         setIndustrySubType(company_data.city_id)
    //     }
    // }, [company_data])

    // redirect
    useEffect(() => {
        if (success && enquiry_id) {
            if (!ModuleControl.isDevelopment /* No OTP */ && noOTP !== 'true') {
                if (company_data.is_otp_verified) {
                    history.push(`/policy-renewal?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
                }
                else {
                    setOTPModal(true)
                }
            }
            else {
                history.push(`/policy-renewal?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
            }
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, enquiry_id])



    const onSubmit = ({ designation, ...data }) => {
        dispatch(saveCompanyData({
            ...designation && { designation },
            ...data,
            ...(creating_user && { creating_user }),
            ...giveProperId({ brokerId, insurerId }),
            ...utm_source && { campaign_code: utm_source },
            step: 1
        }));
        dispatch(set_company_data({ ...designation && { designation }, ...data }));
    }

    return (
        <>
            <Row>
                <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                    <BackBtn url='/employer' style={{ outline: "none", border: "none", background: "none" }}>
                        <img
                            src="/assets/images/icon/Group-7347.png"
                            alt="bck"
                            height="45"
                            width="45"
                        />
                    </BackBtn>
                    <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Tell us about your company</h1>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ padding: '0px 15px' }}>
                    <Col md={12} lg={7} xl={7} sm={12}>
                        <Row>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Input
                                    label="Name"
                                    name="name"
                                    id="name"
                                    maxLength="50"
                                    placeholder="Enter your name"
                                    autoComplete="none"
                                    inputRef={register}
                                    defaultValue={""}
                                    isRequired={true}
                                    required={false}
                                    error={errors?.name}
                                />
                                {!!errors?.name && <Error className="mt-0">{errors?.name?.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Input
                                    label="Designation"
                                    name="designation"
                                    id="Designation"
                                    maxLength="50"
                                    placeholder="Enter your Designation"
                                    autoComplete="none"
                                    inputRef={register}
                                    // defaultValue={""}
                                    // isRequired={true}
                                    required={false}
                                    error={errors?.designation}
                                />
                                {!!errors?.designation && <Error className="mt-0">{errors?.designation?.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Input
                                    label="Work Email ID"
                                    name="work_email"
                                    id="work_email"
                                    maxLength="50"
                                    placeholder="Enter work email id"
                                    autoComplete="none"
                                    inputRef={register}
                                    defaultValue={""}
                                    isRequired={true}
                                    required={false}
                                    error={errors?.work_email}
                                />
                                {!!errors?.work_email && <Error className="mt-0">{errors?.work_email?.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Input
                                    label="Company name"
                                    name="company_name"
                                    id="company_name"
                                    type="text"
                                    placeholder="Enter company name"
                                    maxLength="50"
                                    autoComplete="none"
                                    inputRef={register}
                                    defaultValue={""}
                                    isRequired={true}
                                    required={false}
                                    error={errors?.company_name}

                                />
                                {!!errors?.company_name && <Error className="mt-0">{errors?.company_name?.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Input
                                    label="Mobile Number"
                                    name="contact_no"
                                    id="contact_no"
                                    placeholder="Enter mobile number"
                                    maxLength="10"
                                    onKeyDown={numOnly} onKeyPress={noSpecial}
                                    type='tel'
                                    autoComplete="none"
                                    inputRef={register}
                                    defaultValue={""}
                                    isRequired={true}
                                    required={false}
                                    error={errors?.contact_no}

                                />
                                {!!errors?.contact_no && <Error className="mt-0">{errors?.contact_no?.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Input
                                    label="Pincode Number"
                                    name="pincode"
                                    id="pincode"
                                    placeholder="Enter pincode number"
                                    maxLength="6"
                                    onKeyDown={numOnly} onKeyPress={noSpecial}
                                    type='tel'
                                    autoComplete="none"
                                    inputRef={register}
                                    defaultValue={""}
                                    isRequired={true}
                                    required={false}
                                    error={errors?.pincode}
                                />
                                {!!errors?.pincode && <Error className="mt-0">{errors?.pincode?.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Select
                                    isLoader={pincodeLoading}
                                    required={false}
                                    name="state_id"
                                    label='State'
                                    autoComplete="none"
                                    id="state_id"
                                    inputRef={register}
                                    options={[
                                        {
                                            id: statecity.length && statecity[0]?.state_id,
                                            name: statecity.length && statecity[0]?.state_name,
                                            value: statecity.length && statecity[0]?.state_id,
                                        },
                                    ]}
                                    error={errors.state_id}
                                />

                                {!!(errors.state_id) && <Error className="mt-0">{errors.state_id.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Select
                                    isLoader={pincodeLoading}
                                    required={false}
                                    name="city_id"
                                    label='City'
                                    autoComplete="none"
                                    id="city_id"
                                    inputRef={register}
                                    options={[
                                        {
                                            id: statecity.length && statecity[0]?.city_id,
                                            name: statecity.length && statecity[0]?.city_name,
                                            value: statecity.length && statecity[0]?.city_id,
                                        },
                                    ]}
                                    error={errors.city_id}
                                />
                                {!!(errors.city_id) && <Error className="mt-0">{errors.city_id.message}</Error>}
                            </Col>
                            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                <Select
                                    name="industry_type"
                                    label='Industry Type'
                                    placeholder="Select Industry Type"
                                    autoComplete="none"
                                    id="industry_type"
                                    inputRef={register}
                                    isRequired={true}
                                    required={false}
                                    options={
                                        industry_data?.industries?.map((item) => ({
                                            id: item?.id,
                                            name: item?.name,
                                            value: item?.id,
                                        })) || []
                                    }
                                    error={errors.industry_type}
                                />
                                {!!(errors.industry_type) && <Error className="mt-0">{errors.industry_type.message}</Error>}
                            </Col>
                            <Col
                                sm="12"
                                md="12"
                                lg="12"
                                xl="12"
                                className="mt-4 mb-5"
                            >
                                <RFQButton>
                                    Next
                                    <i className="fa fa-long-arrow-right" aria-hidden="true" />
                                </RFQButton>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={12} lg={5} xl={5} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <RFQcard title="Get tailored pricing"
                            content="We use this info to find a plan that is tailored for your company. having your email id let us send you a detailed quotes"
                            imgSrc="/assets/images/RFQ/lightbulb@2x.png"
                            cardStyle={{ height: '282px' }} />
                    </Col>
                </Row>
            </Form>
            {!!OTPModal &&
                <OTPEditModal
                    show={OTPModal}
                    onHide={() => setOTPModal(false)}
                    utm_source={utm_source}
                />
            }
            {(loading || success) && <Loader />}
        </>
    )
}
