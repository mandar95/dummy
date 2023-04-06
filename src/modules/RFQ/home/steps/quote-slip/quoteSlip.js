import React, { useEffect } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import { Error, RFQButton, Loader } from "../../../../../components";
import { Input } from "../../../components";
import { numOnly } from 'utils';
import * as yup from "yup";

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { clear, sendQuoteSlipData } from '../../home.slice';
import { differenceInDays } from 'date-fns';

const FormStructure = [
    { label: 'Name of Company', name: 'company_name', type: 'text', maxLength: '50' },
    { label: 'Family Size', name: 'family_size', type: 'text', maxLength: '50' },
    { label: 'Existing Insurer Name', name: 'existing_insurer_name', type: 'text', maxLength: '50' },
    { label: 'Claim as on', name: 'claims_on', type: 'date', maxLength: '50' },
    { label: 'Policy Inception', name: 'policy_inception', type: 'date', maxLength: '50' },
    { label: 'Policy Expiry', name: 'policy_expiry', type: 'date', maxLength: '50' },
    { label: 'No of days policy run', name: 'no_of_days_policy_run', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'No of employees @ Inception', name: 'no_of_employee', type: 'text', maxLength: '50' },
    { label: 'No of dependent @ Inception', name: 'no_of_dependent_inception', type: 'text', maxLength: '50' },
    { label: 'No of lives @ Inception', name: 'no_of_lives_inception', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Premium paid @ Inception(Excl. of ST)', name: 'premium_paid_inception_gst_excluding', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Premium paid @ Inception(Including add - del)', name: 'premium_paid_inception_gst_including', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Claim paid + O/S till claim as on', name: 'claim_paid_os_claim', type: 'text', maxLength: '50' },
    { label: 'Annualised claims 365 days', name: 'annualised_claims_365_days', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Claim Ratio %', name: 'claim_ratio', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'No of employees @ Renewal', name: 'number_of_employees_renewal', type: 'text', maxLength: '50' },
    { label: 'No of dependent @ Renewal', name: 'number_of_dependent_renewal', type: 'text', maxLength: '50' },
    { label: 'No of lives @ Renewal', name: 'number_of_lives_renewal', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Non repetitve claims/major illness/death claims', name: 'non_repetitive_major_death_claims', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Left employees claims', name: 'left_employee_claims', type: 'text', maxLength: '50' },
]
const validationSchema = yup.object().shape(
    FormStructure.reduce((prev, { label, name }) =>
        ({ ...prev, [name]: yup.string().required().label(label) }), {}));

export const QuoteSlip = ({ onNextStep, Broker_id }) => {

    const dispatch = useDispatch();
    const { success, loading } = useSelector(state => state.RFQHome);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const brokerId = query.get("broker_id") || Broker_id;
    const enquiry_id = decodeURIComponent(query.get("enquiry_id"));
    const { globalTheme } = useSelector(state => state.theme)

    const { handleSubmit, register, errors, watch, setValue } = useForm({
        // defaultValues: {
        //     previous_ic_name: company_data?.previous_ic_name,
        //     lives_at_inception: company_data?.lives_at_inception,
        //     previous_active_lives: company_data?.previous_active_lives,
        //     previous_total_cover: company_data?.previous_total_cover,
        //     previous_claim_ratio: company_data?.previous_claim_ratio,
        //     previous_claim_amount: company_data?.previous_claim_amount,
        //     previous_policy_expiry_date: company_data?.previous_policy_expiry_date,
        //     pervious_policy_tpa_name: company_data?.pervious_policy_tpa_name,
        //     pervious_paid_claim_count: company_data?.pervious_paid_claim_count,
        //     pervious_outstanding_claim_count: company_data?.pervious_outstanding_claim_count,
        //     pervious_policy_number: company_data?.pervious_policy_number,
        //     previous_policy_start_date: company_data?.previous_policy_start_date,
        // },
        validationSchema,
        mode: "onBlur",
        reValidateMode: "onBlur"
    });


    let _noOfEmployeeInception = watch('no_of_employee')
    let _noOfDependentInception = watch('no_of_dependent_inception')

    useEffect(() => {
        if (_noOfEmployeeInception?.length && _noOfDependentInception?.length) {
            let _noOflivesInception = (Number(_noOfEmployeeInception) + Number(_noOfDependentInception))
            setValue('no_of_lives_inception', _noOflivesInception)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_noOfEmployeeInception, _noOfDependentInception])


    let _policyInception = watch('policy_inception');
    let _policyExpiry = watch('policy_expiry');

    useEffect(() => {
        if (_policyInception && _policyExpiry) {
            const result = differenceInDays(
                // new Date(_policyExpiry),
                // new Date()

                new Date(),
                new Date(_policyInception),
            )
            setValue('no_of_days_policy_run', (result + 1))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_policyInception, _policyExpiry])


    let _claimAmount = watch('claim_paid_os_claim')
    let _totalCover = watch('annualised_claims_365_days')
    let _premiumPaidIncluding = watch('premium_paid_inception_gst_including')

    useEffect(() => {
        if (_premiumPaidIncluding?.length && _totalCover?.length) {
            // let _ratio = Math.round((Number(_claimAmount) * 100 / Number(_totalCover)) * 100)
            let _ratio = Math.round((Number(_totalCover) / Number(_premiumPaidIncluding)) * 100)
            setValue('claim_ratio', _ratio)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_premiumPaidIncluding, _totalCover])


    let _noOfDaysPolicyRun = watch('no_of_days_policy_run')

    useEffect(() => {
        if (_noOfDaysPolicyRun && _claimAmount) {
            setValue('annualised_claims_365_days', (Number(_claimAmount) / (Number(_noOfDaysPolicyRun)) * 365).toFixed(2))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_claimAmount, _noOfDaysPolicyRun])

    let _noOfEmployeesRenewal = watch('number_of_employees_renewal')
    let _noOfDependentRenewal = watch('number_of_dependent_renewal')

    useEffect(() => {
        if (_noOfEmployeesRenewal && _noOfDependentRenewal) {
            setValue('number_of_lives_renewal', (Number(_noOfEmployeesRenewal) + (Number(_noOfDependentRenewal))))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_noOfEmployeesRenewal, _noOfDependentRenewal])


    // useEffect(() => {
    //     if (company_data?.previous_ic_name) {
    //         reset({
    //             previous_ic_name: company_data?.previous_ic_name,
    //             lives_at_inception: company_data?.lives_at_inception,
    //             previous_active_lives: company_data?.previous_active_lives,
    //             previous_total_cover: company_data?.previous_total_cover,
    //             previous_claim_ratio: company_data?.previous_claim_ratio,
    //             previous_claim_amount: company_data?.previous_claim_amount,
    //             previous_policy_expiry_date: company_data?.previous_policy_expiry_date,
    //             pervious_policy_tpa_name: company_data?.pervious_policy_tpa_name,
    //             pervious_paid_claim_count: company_data?.pervious_paid_claim_count,
    //             pervious_outstanding_claim_count: company_data?.pervious_outstanding_claim_count,
    //             pervious_policy_number: company_data?.pervious_policy_number,
    //             previous_policy_start_date: company_data?.previous_policy_start_date,
    //         })
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [company_data])


    // redirect
    useEffect(() => {
        if (success && (enquiry_id)) {
            // for-------------------------------- B-TO-C
            //  history.push(`/add-feature?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId })}`)  
            //for---------------------------------- B-TO-B
            onNextStep();
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, enquiry_id])


    const onSubmit = (data) => {
        dispatch(sendQuoteSlipData({
            ...data,
            step: 1,
            broker_id: brokerId
        }))
    }
    return (
        <>
            <div style={{ margin: '0px 45px' }}>
                <Row>
                    <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                        {/* <BackBtn url={`/policy-renewal?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId })}`} style={{ outline: "none", border: "none", background: "none" }}>
                        <img
                            src="/assets/images/icon/Group-7347.png"
                            alt="bck"
                            height="45"
                            width="45"
                        />
                    </BackBtn> */}
                        <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Quote Slip</h1>
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row style={{ padding: '0px 15px' }}>
                        <Col md={12} lg={7} xl={7} sm={12}>
                            <Row>
                                {FormStructure.map(({ name, type, label, maxLength, isDesabled, isSmallLabel },i) => (
                                    <Col md={12} lg={6} xl={6} sm={12} className='mb-3' key={"quoteSlipasdasdasd"+i}>
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
                </Form>
            </div>

            {(loading || success) && <Loader />}
        </>
    )
}
