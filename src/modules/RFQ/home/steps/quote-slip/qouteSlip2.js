import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import { Error, RFQButton, Loader } from "../../../../../components";
import { Input } from "../../../components";
import { numOnly } from 'utils';
import * as yup from "yup";

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { clear, sendQuoteSlipData } from '../../home.slice';
import { differenceInDays, addDays } from 'date-fns';
// import { AttachFile2 } from 'modules/core';
// import { AnchorTag } from '../../../../addmember2/style';

import Tab from "modules/Health_Checkup/Tab";
import swal from 'sweetalert';


const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const _Policy = [
    { label: 'Name of Company', name: 'company_name', type: 'text', maxLength: '50' },
    { label: 'Family Size', name: 'family_size', type: 'text', maxLength: '10' },
    { label: 'Existing Insurer Name', name: 'existing_insurer_name', type: 'text', maxLength: '50' },
    { label: 'Policy Inception', name: 'policy_inception', type: 'date' },
    { label: 'Policy Expiry', name: 'policy_expiry', type: 'date' },
    { label: 'No of days policy run', name: 'no_of_days_policy_run', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Premium paid @ Inception(Excl. of ST)', name: 'premium_paid_inception_gst_excluding', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Premium paid @ Inception(Including add - del)', name: 'premium_paid_inception_gst_including', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Existing cover', name: 'existing_cover', type: 'text', maxLength: '50' }
]

const _Lives = [
    { label: 'No of employees @ Inception', name: 'no_of_employee', type: 'text', maxLength: '50' },
    { label: 'No of dependent @ Inception', name: 'no_of_dependent_inception', type: 'text', maxLength: '50' },
    { label: 'No of lives @ Inception', name: 'no_of_lives_inception', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'No of employees @ Renewal', name: 'number_of_employees_renewal', type: 'text', maxLength: '50' },
    { label: 'No of dependent @ Renewal', name: 'number_of_dependent_renewal', type: 'text', maxLength: '50' },
    { label: 'No of lives @ Renewal', name: 'number_of_lives_renewal', type: 'text', maxLength: '50', isDesabled: true },

]

const _Claims = [
    { label: 'Claim as on', name: 'claims_on', type: 'date' },
    { label: 'Claim paid + O/S till claim as on', name: 'claim_paid_os_claim', type: 'text', maxLength: '50' },
    { label: 'Annualised claims 365 days', name: 'annualised_claims_365_days', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Claim Ratio %', name: 'claim_ratio', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Non repetitve claims/major illness/death claims', name: 'non_repetitive_major_death_claims', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Left employees claims', name: 'left_employee_claims', type: 'text', maxLength: '50' },
]

const _DateFormate = (date) => {
    const [year, month, day] = date.split('-');
    if (year.length === 4) {
        return [year, month, day].join("-");
    }
    else {
        return [day, month, year].join("-");
    }

};

export const QuoteSlip = ({ onNextStep, Broker_id }) => {

    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)
    const { success, loading } = useSelector(state => state.RFQHome);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const brokerId = query.get("broker_id") || Broker_id;
    const [tab, setTab] = useState({
        label: 'Policy',
        id: 1,
        i: 1,
    });
    const [memberData, setMemberData] = useState({});

    const validationSchema = yup.object().shape({
        ...(tab?.label === "Policy" && {
            company_name: yup.string()
                .required("Please Enter company name")
                .min(2, "Please enter name more than 2 character")
                .max(50, 'Company name should be below 50')
                .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
            family_size: yup
                .string()
                .required("Please Enter family size")
                .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            existing_insurer_name: yup.string()
                .required("Please Enter existing insurer name")
                .min(2, "Please enter name more than 2 character")
                .max(50, 'existing insurer name should be below 50')
                .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
            policy_inception: yup.string()
                .required("Please Select policy inception"),
            policy_expiry: yup.string()
                .required("Please Select policy expiry"),
            // no_of_days_policy_run: yup.string()
            //     .required("Please Enter no of days policy run")
            //     .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            premium_paid_inception_gst_excluding: yup.string()
                .required("Please Enter premium paid inception gst excluding")
                // .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
                // .matches(/^[1-9]\d*(?:\.\d{0,2})?$/, "Only Numbers with two decimal are allowed for this field"),
                .matches(/^[0-9]\d*(\.\d+)?$/, 'Only Numbers are allowed for this field'),
            premium_paid_inception_gst_including: yup.string()
                .required("Please Enter premium paid inception gst including")
                // .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
                .matches(/^[0-9]\d*(\.\d+)?$/, 'Only Numbers are allowed for this field'),
            existing_cover: yup.string()
                .required("Please Enter existing cover")
                // .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
                .matches(/^[0-9]\d*(\.\d+)?$/, 'Only Numbers are allowed for this field'),
        }),
        ...(tab?.label === "Lives" && {
            no_of_employee: yup.string()
                .required("Please Enter no of employee")
                .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            no_of_dependent_inception: yup.string()
                .required("Please Enter no of dependent inception")
                .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            // no_of_lives_inception: yup.string()
            //     .required("Please Enter no of lives inception")
            //     .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            number_of_employees_renewal: yup.string()
                .required("Please Enter number of employees renewal")
                .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            number_of_dependent_renewal: yup.string()
                .required("Please Enter number of dependent renewal")
                .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            // number_of_lives_renewal: yup.string()
            //     .required("Please Enter number of lives renewal")
            //     .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
        }),
        ...(tab?.label === "Claims" && {
            claims_on: yup.string()
                .required("Please Select claims on"),
            claim_paid_os_claim: yup.string()
                .required("Please Enter claim paid os claim")
                .matches(/^[0-9]\d*(\.\d+)?$/, 'Only Numbers are allowed for this field'),
            // annualised_claims_365_days: yup.string()
            //     .required("Please Enter annualised claims 365 days"),
            //.matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            // claim_ratio: yup.string()
            //     .required("Please Enter claim_ratio")
            //     .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            non_repetitive_major_death_claims: yup.string()
                .required("Please Enter non repetitive major death claims")
                .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
            left_employee_claims: yup.string()
                .required("Please Enter left employee claims")
                .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
        }),
    });

    // const validationSchema = yup.object().shape(
    //     (tab?.label === "Policy" &&
    //         _Policy?.reduce((prev, { label, name }) =>
    //             ({ ...prev, [name]: yup.string().required().label(label) }), {}))
    //     ,
    //     (tab?.label === "Lives" &&
    //         _Lives?.reduce((prev, { label, name }) =>
    //             ({ ...prev, [name]: yup.string().required().label(label) }), {})
    //     )
    // );

    const { handleSubmit, register, errors, watch, setValue } = useForm({
        validationSchema,
        mode: "onBlur",
        reValidateMode: "onBlur"
    });

    let _policyInception = watch('policy_inception');
    let _policyExpiry = watch('policy_expiry');
    useEffect(() => {
        if (_policyInception && _policyExpiry) {
            if (Number(_policyExpiry.split('-')[0]) > 1980) {
                let _today = new Date()
                if (new Date(_DateFormate(_policyInception)) > _today) {
                    swal("Alert", "Future date is not allowed for policy inception", "warning");
                    //setValue('no_of_days_policy_run', "")
                    //setValue('policy_inception', "")
                    //return false
                }
                // else if (_DateFormate(_policyInception) > _DateFormate(_policyExpiry)) {
                //     swal("Alert", "Please ensure that the policy Expiry Date is greater than or equal to the policy Inception Date.", "warning");
                //     setValue('policy_expiry', "")
                //     setValue('no_of_days_policy_run', "")
                //     //return false;
                // }
                // else {

                else if (_today > new Date(_DateFormate(_policyExpiry))) {
                    //setValue('no_of_days_policy_run', "0")
                    const result = differenceInDays(
                        new Date(_policyExpiry),
                        new Date(_DateFormate(_policyInception)),
                    )
                    setValue('no_of_days_policy_run', (result + 1))
                }
                else {
                    const result = differenceInDays(
                        // new Date(_policyExpiry),
                        // new Date()
                        _today,
                        new Date(_DateFormate(_policyInception)),
                    )
                    setValue('no_of_days_policy_run', (result + 1))
                }
                // }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_policyInception, _policyExpiry])

    useEffect(() => {
        if (_policyInception) {
            const oneYear = formatDate(addDays(new Date(_policyInception), 364));
            setValue('policy_expiry', oneYear)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_policyInception])

    let _claimsOn = watch('claims_on');
    // useEffect(() => {
    //     if (_claimsOn) {
    //         let _today = new Date()
    //         if (new Date(_DateFormate(_claimsOn)) > _today) {
    //             swal("Alert", "Future date is not allowed for claim as on", "warning");
    //             setValue('claims_on', "")
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [_claimsOn])

    let _noOfEmployeesRenewal = watch('number_of_employees_renewal')
    let _noOfDependentRenewal = watch('number_of_dependent_renewal')
    useEffect(() => {
        if (_noOfEmployeesRenewal && _noOfDependentRenewal) {
            setValue('number_of_lives_renewal', (Number(_noOfEmployeesRenewal) + (Number(_noOfDependentRenewal))))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_noOfEmployeesRenewal, _noOfDependentRenewal])

    let _noOfEmployeeInception = watch('no_of_employee')
    let _noOfDependentInception = watch('no_of_dependent_inception')
    useEffect(() => {
        if (_noOfEmployeeInception?.length && _noOfDependentInception?.length) {
            let _noOflivesInception = (Number(_noOfEmployeeInception) + Number(_noOfDependentInception))
            setValue('no_of_lives_inception', _noOflivesInception)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_noOfEmployeeInception, _noOfDependentInception])

    let _claimAmount = watch('claim_paid_os_claim')
    useEffect(() => {
        if (_claimAmount) {
            setValue('annualised_claims_365_days', (Number(_claimAmount) / (Number(memberData?.no_of_days_policy_run)) * 365).toFixed(2))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_claimAmount])

    let _totalCover = watch('annualised_claims_365_days')
    useEffect(() => {
        if (_totalCover?.length) {
            // let _ratio = Math.round((Number(_claimAmount) * 100 / Number(_totalCover)) * 100)
            let _ratio = Math.round((Number(_totalCover) / Number(memberData?.premium_paid_inception_gst_including)) * 100)
            setValue('claim_ratio', _ratio)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_totalCover])


    useEffect(() => {
        if (tab) {
            _Policy.forEach((item) => {
                setValue(item?.name, memberData[item?.name])
            })
            _Lives.forEach((item) => {
                setValue(item?.name, memberData[item?.name])
            })
            _Claims.forEach((item) => {
                setValue(item?.name, memberData[item?.name])
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    const setNextTab = (i) => {
        let _flag = i === 1 ? true : false
        setTab((tab) => {
            return {
                label: _flag ? 'Lives' : 'Claims',
                id: _flag ? 2 : 3,
                i: _flag ? 2 : 3,
            };
        })
    }

    // redirect
    useEffect(() => {
        if (success) {
            // for-------------------------------- B-TO-C
            //  history.push(`/add-feature?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId })}`)
            //for---------------------------------- B-TO-B
            onNextStep();
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    const onSubmit = (data) => {
        let _data = { ...memberData, ...data }
        if (tab.i === 3) {
            _data = {
                ..._data,
                // claims_on: _data.claims_on.split('-')[0].length === 4 ? DateFormate(_data.claims_on) : _data.claims_on,
            }
            //let _SevenMonthAfterPolicyInception = formatDate(addDays(new Date(memberData?.policy_inception), 211))
            if (_DateFormate(_claimsOn) >= _DateFormate(memberData?.policy_inception)) {
                setMemberData(_data);
                dispatch(sendQuoteSlipData({
                    ..._data,
                    step: 1,
                    broker_id: brokerId
                }))
            }
            else {
                swal('warning', "Please ensure that the Claim as on date Date is greater than or equal to the policy Inception Date.", "warning");
                return false
            }

        } else {
            if (tab.i === 1) {
                _data = {
                    ..._data,
                    //     policy_inception: _data.policy_inception.split('-')[0].length === 4 ? DateFormate(_data.policy_inception) : _data.policy_inception,
                    //     policy_expiry: _data.policy_expiry.split('-')[0].length === 4 ? DateFormate(_data.policy_expiry) : _data.policy_expiry
                }
                if (_DateFormate(_policyInception) > _DateFormate(_policyExpiry)) {
                    swal("Alert", "Please ensure that the policy Expiry Date is greater than or equal to the policy Inception Date.", "warning");
                    //setValue('policy_expiry', "")
                    // setValue('no_of_days_policy_run', "")
                    return false;
                }
                if (Number(_data.no_of_days_policy_run) === 0) {
                    swal('warning', "No of days policy run can't be 0 , Please enter proper details.", "warning");
                    return false
                }
            }
            setMemberData(_data);
            setNextTab(tab.i)
        }
    }

    return (
        <>
            <div style={{ margin: '0px 45px' }}>
                <Row>
                    <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                        <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Placement Slip</h1>
                    </Col>
                </Row>
                <Row style={{ marginBottom: '20px' }}>
                    <Tab
                        tabStyle={2}
                        isActive={Boolean(tab.label === "Policy")}
                        onClick={() =>
                            setTab((tab) => {
                                return {
                                    label: 'Policy',
                                    id: 1,
                                    // isLastStep: (releation.length === (i + 1) ? true : false),
                                    i: 1,
                                };
                            })
                        }
                        label={'Policy'}
                    />
                    <Tab
                        tabStyle={2}
                        isActive={Boolean(tab.label === "Lives")}
                        disabled={!memberData.company_name}
                        onClick={() =>
                            !!memberData.company_name && setTab((tab) => {
                                return {
                                    label: 'Lives',
                                    id: 2,
                                    // isLastStep: (releation.length === (i + 1) ? true : false),
                                    i: 2,
                                };
                            })
                        }
                        label={'Lives'}
                    />
                    <Tab
                        tabStyle={2}
                        isActive={Boolean(tab.label === "Claims")}
                        disabled={!memberData.no_of_employee}
                        onClick={() =>
                            !!memberData.no_of_employee && setTab((tab) => {
                                return {
                                    label: 'Claims',
                                    id: 3,
                                    // isLastStep: (releation.length === (i + 1) ? true : false),
                                    i: 3,
                                };
                            })
                        }
                        label={'Claims'}
                    />
                </Row>
                <Row style={{ padding: '0px 0px' }}>
                    <Col md={12} lg={7} xl={7} sm={12}>
                        {tab?.label === "Policy" &&
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    {_Policy.map(({ name, type, label, maxLength, isDesabled, isSmallLabel, isNum, isCharOnly },i) => (
                                        <Col key={"Policyasdasdasd"+i} md={12} lg={6} xl={6} sm={12} className='mb-3'>
                                            <Input
                                                label={label}
                                                name={name}
                                                id={name}
                                                maxLength={maxLength}
                                                // placeholder={"Enter " + label}
                                                autoComplete="none"
                                                type={type}
                                                inputRef={register}
                                                {...(type === 'date' ? { min: '1980-01-01', max: '2999-12-31' } : {})}
                                                defaultValue={""}
                                                isRequired={true}
                                                required={false}
                                                error={errors[name]}
                                                disabled={isDesabled ? true : false}
                                                style={{ background: isDesabled && '#e0e0e0' }}
                                                labelStyle={isSmallLabel ? {
                                                    fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
                                                    lineHeight: '14px'
                                                } : { lineHeight: '14px' }}
                                            />
                                            {!!errors[name] && <Error className="mt-0">{errors[name]?.message}</Error>}
                                        </Col>
                                    ))}
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
                            </Form>
                        }
                        {tab?.label === "Lives" &&
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    {_Lives.map(({ name, type, label, maxLength, isDesabled, isSmallLabel },i) => (
                                        <Col md={12} lg={6} xl={6} sm={12} className='mb-3' key={"livesasdasdasd"+i}>
                                            <Input
                                                label={label}
                                                name={name}
                                                id={name}
                                                maxLength={maxLength}
                                                // placeholder={"Enter " + label}
                                                autoComplete="none"
                                                type={type}
                                                inputRef={register}
                                                {...(type === 'tel' ? { onKeyDown: numOnly } : {})}
                                                defaultValue={""}
                                                isRequired={true}
                                                required={false}
                                                error={errors[name]}
                                                disabled={isDesabled ? true : false}
                                                style={{ background: isDesabled && '#e0e0e0' }}
                                                labelStyle={isSmallLabel ? {
                                                    fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
                                                    lineHeight: '14px'
                                                } : { lineHeight: '14px' }}
                                            />
                                            {!!errors[name] && <Error className="mt-0">{errors[name]?.message}</Error>}
                                        </Col>
                                    ))}
                                    {/* <Col
                                        sm="12"
                                        md="12"
                                        lg="12"
                                        xl="12"
                                    // className="mt-4 mb-5"
                                    >
                                        <AttachFile2
                                            fileRegister={register}
                                            defaultValue={""}
                                            name="files"
                                            title="Upload Demography"
                                            key="demography_file"
                                            accept={".png, .jpeg, .jpg, .xls, .xlsx"}
                                            // resetValue={resetFile}
                                            description="File Formats: png, jpeg, jpg, xls, xlsx "
                                            nameBox
                                        />
                                        <AnchorTag
                                        // onClick={props.downloadSampleFile}
                                        >
                                            <i
                                                className="ti-cloud-down attach-i"
                                                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                                            ></i>
                                            <span style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                                                Download Sample Format
                                            </span>
                                        </AnchorTag>
                                    </Col> */}
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

                            </Form>
                        }
                        {tab?.label === "Claims" &&
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    {_Claims.map(({ name, type, label, maxLength, isDesabled, isSmallLabel },i) => (
                                        <Col md={12} lg={6} xl={6} sm={12} className='mb-3' key={"claimsasdasdasd"+i}>
                                            <Input
                                                label={label}
                                                name={name}
                                                id={name}
                                                maxLength={maxLength}
                                                // placeholder={"Enter " + label}
                                                autoComplete="none"
                                                type={type}
                                                inputRef={register}
                                                {...(type === 'tel' ? { onKeyDown: numOnly } : {})}
                                                defaultValue={""}
                                                isRequired={true}
                                                required={false}
                                                error={errors[name]}
                                                disabled={isDesabled ? true : false}
                                                style={{ background: isDesabled && '#e0e0e0' }}
                                                labelStyle={isSmallLabel ? {
                                                    fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
                                                    lineHeight: '14px'
                                                } : { lineHeight: '14px' }}
                                            />
                                            {!!errors[name] && <Error className="mt-0">{errors[name]?.message}</Error>}
                                        </Col>
                                    ))}
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
                            </Form>
                        }
                    </Col>
                    <Col md={12} lg={5} xl={5} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ height: '360px' }}>
                            <img
                                src="/assets/images/QCR/quote-slip.png"
                                alt="bck"
                                height="90%"
                                width="100%"
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            {(loading || success) && <Loader />}
        </>
    )
}
