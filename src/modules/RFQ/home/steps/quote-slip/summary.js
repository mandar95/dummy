import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import { Error, RFQButton, Loader, NoDataFound, Button } from "../../../../../components";
import { Input } from "../../../components";
// import { DateFormate } from 'utils';
import * as yup from "yup";
import swal from "sweetalert";

import { BackBtn } from '../button'
import _ from 'lodash';
import { downloadFile } from 'utils';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router';

import { getAllQuoteSlipData, downloadQuotedata, cleardownloadQuoteResponse, updateQuoteSlipData, clear, deleteQuoteFeature } from '../../home.slice';
import { differenceInDays } from 'date-fns';
import { structure } from "./helper";
import { DataTable } from "modules/user-management";
import { CommunicationModal } from "./communicationModal/modal";
import styled from "styled-components";
import { FeatureModal } from "./modal";
// import { AttachFile2 } from 'modules/core';
// import { AnchorTag } from '../../../../addmember2/style';

const EditButton = styled.div`
background: ${({ theme }) => theme.Tab?.color || "#e11a22"};
padding: 7px 17px;
border-radius: 3px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};

letter-spacing: 1px;
color: white;
margin-right: 24px;
cursor: pointer;
`
const CancelButton = styled(EditButton)`
background:#ff4545;
`

const DownloadBtn = styled.div`
color: white;
padding: 5px 20px;
border-radius: 3px;
cursor: pointer;

margin-right: 16px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
height: 29px;
background: ${({ theme }) => theme.Tab?.color || "#e11a22"};
`;

const ShareI = styled.i`
color: ${({ theme }) => theme.Tab?.color};
opacity:0.6;
`
const CommunicationDiv = styled.div`
position: absolute;
display: flex;
flex-direction: column;
z-index: 999;
background: red;
padding: 7px 5px;
border-radius: 7px;
top: 32px;
right: -5px;
box-shadow: 1px 6px 12px 0px #bfbfbf;
background: white;
`

// const formatDate = (date) => {
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2)
//         month = '0' + month;
//     if (day.length < 2)
//         day = '0' + day;

//     return [year, month, day].join('-');
// }

const _DateFormate = (date) => {
    const [year, month, day] = date.split('-');
    if (year.length === 4) {
        return [year, month, day].join("-");
    }
    else {
        return [day, month, year].join("-");
    }

};

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
    { label: 'Existing cover', name: 'existing_cover', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Claim paid + O/S till claim as on', name: 'claim_paid_os_claim', type: 'text', maxLength: '50' },
    { label: 'Annualised claims 365 days', name: 'annualised_claims_365_days', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Claim Ratio %', name: 'claim_ratio', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'No of employees @ Renewal', name: 'number_of_employees_renewal', type: 'text', maxLength: '50' },
    { label: 'No of dependent @ Renewal', name: 'number_of_dependent_renewal', type: 'text', maxLength: '50' },
    { label: 'No of lives @ Renewal', name: 'number_of_lives_renewal', type: 'text', maxLength: '50', isDesabled: true },
    { label: 'Non repetitve claims/major illness/death claims', name: 'non_repetitive_major_death_claims', type: 'text', maxLength: '50', isSmallLabel: true },
    { label: 'Left employees claims', name: 'left_employee_claims', type: 'text', maxLength: '50' },
]
// const validationSchema = yup.object().shape(
//     FormStructure.reduce((prev, { label, name }) =>
//         ({ ...prev, [name]: yup.string().required().label(label) }), {}));
const validationSchema = yup.object().shape({
    existing_cover: yup.string()
        .required("Please Enter existing cover")
        // .matches(/^[0-9]*$/, "Only Numbers are allowed for this field"),
        .matches(/^[0-9]\d*(\.\d+)?$/, 'Only Numbers are allowed for this field'),
    company_name: yup.string()
        .required("Please Enter company name")
        .min(2, "Please enter name more than 2 character")
        .max(50, 'Company name should be below 50')
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    family_size: yup.string()
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
        .matches(/^[0-9]\d*(\.\d+)?$/, 'Only Numbers are allowed for this field'),
    premium_paid_inception_gst_including: yup.string()
        .required("Please Enter premium paid inception gst including")
        .matches(/^[0-9]\d*(\.\d+)?$/, 'Only Numbers are allowed for this field'),

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
});


export const Summary = ({ onPrevStep, Broker_id }) => {
    const dispatch = useDispatch();
    const { success, loading, QuoteSlipData, GetQuoteSlipData, downloadQuoteResponse, emailSuccess, qouteUpdateSuccess } = useSelector(state => state.RFQHome);
    const location = useLocation();
    const history = useHistory()
    const query = new URLSearchParams(location.search);
    const brokerId = query.get("broker_id") || Broker_id;
    const { globalTheme } = useSelector(state => state.theme)
    const [featureModal, setFeatureModal] = useState();
    const [isEdit, setEdit] = useState(true)
    const [Modal, setModal] = useState({

    });
    const { id } = useParams();
    const [communicationAction, setCommunication] = useState(false)

    const { handleSubmit, register, errors, watch, setValue } = useForm({
        validationSchema,
        mode: "onBlur",
        reValidateMode: "onBlur"
    });

    useEffect(() => {
        if (Modal.show) {
            setCommunication(false)
        }
    }, [Modal])

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
            if (Number(_policyExpiry.split('-')[0]) > 1980) {
                let _today = new Date()
                if (new Date(_DateFormate(_policyInception)) > _today) {
                    swal("Alert", "Future date is not allowed for policy inception", "warning");
                    setValue('no_of_days_policy_run', "")
                    setValue('policy_inception', "")
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

    let _claimsOn = watch('claims_on');
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
            if (Number(_noOfDaysPolicyRun) > 0) {
                let _annualisedClaims = (Number(_claimAmount) / (Number(_noOfDaysPolicyRun)) * 365).toFixed(2)
                setValue('annualised_claims_365_days', _annualisedClaims)
            }
            else {
                setValue('annualised_claims_365_days', 0)
            }
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

    useEffect(() => {
        if (GetQuoteSlipData?.length && isEdit) {
            /*FormStructure.forEach((item) => {
                setValue(item?.name, GetQuoteSlipData[0][item.name])
                // if (item.name === "claims_on" || item.name === "policy_inception" || item.name === "policy_expiry") {
                //     let _date = DateFormate(GetQuoteSlipData[0][item.name])
                //     setValue(item?.name, _date)
                // } else {
                //     setValue(item?.name, GetQuoteSlipData[0][item.name])
                // }
            })*/

            setValue(FormStructure.map((item) => ({ [item?.name]: GetQuoteSlipData[0][item.name] })));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [GetQuoteSlipData, isEdit])


    useEffect(() => {
        if (QuoteSlipData || id) {
            dispatch(getAllQuoteSlipData({
                // quote_id: 19
                quote_id: QuoteSlipData || Number(id)
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [QuoteSlipData, id])

    useEffect(() => {
        if (downloadQuoteResponse) {
            downloadFile(downloadQuoteResponse?.download_report, '', true)
        }
        return () => { dispatch(cleardownloadQuoteResponse()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloadQuoteResponse])

    useEffect(() => {
        if (emailSuccess) {
            swal('Success', emailSuccess, "success")
        }
    }, [emailSuccess])

    const downloadAction = () => {
        dispatch(downloadQuotedata({
            // quote_id: 19,
            quote_id: id ? id : QuoteSlipData,
            broker_id: brokerId
        }))
    }

    // const resetData = () => {
    //     // FormStructure.forEach((item) => {
    //     //     setValue(item?.name, "")
    //     // })
    //     reset();
    // }

    useEffect(() => {
        if (qouteUpdateSuccess || success) {
            swal('Success', qouteUpdateSuccess || success, "success").then(() => {
                // resetData()
                qouteUpdateSuccess && setEdit(true);
                dispatch(getAllQuoteSlipData({
                    // quote_id: 19
                    quote_id: id ? id : QuoteSlipData,
                }))
            })
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qouteUpdateSuccess, success])


    const deleteQuote = (id, data) => {
        dispatch(deleteQuoteFeature({
            quote_slip_feature_id: data.id
        }))
    }
    const onEdit = (id, data) => {
        setFeatureModal(data)
    };

    const onSubmit = (data) => {
        let _data = {
            ...data,
            // claims_on: data.claims_on.split('-')[0].length === 4 ? DateFormate(data.claims_on) : data.claims_on,
            // policy_inception: data.policy_inception.split('-')[0].length === 4 ? DateFormate(data.policy_inception) : data.policy_inception,
            // policy_expiry: data.policy_expiry.split('-')[0].length === 4 ? DateFormate(data.policy_expiry) : data.policy_expiry

        }
        if (_DateFormate(_policyInception) > _DateFormate(_policyExpiry)) {
            swal("Alert", "Please ensure that the policy Expiry Date is greater than or equal to the policy Inception Date.", "warning");
            // setValue('policy_expiry', "")
            // setValue('no_of_days_policy_run', "")
            return false;
        }
        //let _SevenMonthAfterPolicyInception = formatDate(addDays(new Date(_policyInception), 211))
        if (_DateFormate(_claimsOn) >= _DateFormate(_policyInception)) {
            if (Number(data.no_of_days_policy_run) === 0) {
                swal('warning', "No of days policy run can't be 0 , Please enter proper details.", "warning");
                return false
            } else {
                dispatch(updateQuoteSlipData({
                    ..._data,
                    // quote_slip_id: 19,
                    quote_slip_id: id ? id : QuoteSlipData,
                    broker_id: brokerId,
                    step: 1

                }));
            }
        }
        else {
            swal('warning', "Please ensure that the Claim as on date Date is greater than or equal to the policy Inception Date", "warning");
            return false
        }
    }
    return (
        <>
            <div style={{ margin: '0px 45px' }}>
                <Row>
                    <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4 justify-content-between align-items-center">
                        <div className='d-flex'>
                            <BackBtn
                                stepAction={() => id ? history.push('/broker/qcr-quote-detail') : onPrevStep()}
                            //  url={`/add-feature?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`} style={{ outline: "none", border: "none", background: "none" }}
                            >
                                <img
                                    src="/assets/images/icon/Group-7347.png"
                                    alt="bck"
                                    height="45"
                                    width="45"
                                />
                            </BackBtn>
                            <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>{id ? 'Placement Slip' : 'Summary'}</h1>
                        </div>
                        {
                            isEdit ? <EditButton onClick={() => setEdit(false)}>Edit<i className="ti-pencil" style={{ marginLeft: '5px' }}></i></EditButton>
                                : <CancelButton onClick={() => setEdit(true)}>Cancel</CancelButton>
                        }
                    </Col>
                </Row>
                <Row className='justify-content-end' style={{ margin: '0px 25px 12px 25px', position: 'relative' }}>
                    <DownloadBtn onClick={downloadAction}><i className="fa fa-file-download" style={{ marginRight: '8px' }}></i>Download</DownloadBtn>
                    <span onClick={() => setCommunication(!communicationAction)} style={{ cursor: 'pointer' }}><ShareI className="fa fa-share-alt-square" style={{ fontSize: globalTheme.fontSize ? `calc(30px + ${globalTheme.fontSize - 92}%)` : '30px' }} /></span>
                    {communicationAction &&
                        <CommunicationDiv>
                            <span style={{ marginBottom: '8px', cursor: 'pointer' }} onClick={() => {
                                setModal({
                                    show: true,
                                    isMail: false
                                })
                            }}>
                                <img
                                    src="/assets/images/QCR/mail-icon.png"
                                    alt="bck"
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                    }}

                                />
                            </span>
                            <span style={{ cursor: 'pointer' }} onClick={() => {
                                setModal({
                                    show: true,
                                    isMail: true
                                })
                            }}>
                                <img
                                    src="/assets/images/QCR/WhatsApp-icon.png"
                                    alt="bck"
                                    style={{
                                        width: '25px',
                                        height: '23px',
                                        marginLeft: '2px'
                                    }}
                                />
                            </span>
                        </CommunicationDiv>
                    }
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '5px' }}>
                    {!isEdit ?
                        <>
                            <Row style={{ padding: '0px 15px' }}>
                                <Col md={12} lg={12} xl={12} sm={12}>
                                    <Row>
                                        {FormStructure.map(({ name, type, label, maxLength, isDesabled, isSmallLabel }, index) => (
                                            <Col key={name + 'sks' + index} md={12} lg={3} xl={3} sm={12} className='mb-3'>
                                                <Input
                                                    label={label}
                                                    name={name}
                                                    id={name}
                                                    maxLength={maxLength}
                                                    // placeholder={"Enter " + label}
                                                    autoComplete="none"
                                                    type={type}
                                                    {...(type === 'date' ? { min: '1980-01-01', max: '2999-12-31', noFocusChange: true } : {})}
                                                    // inputRef={register}
                                                    inputRef={register({
                                                        valueAsDate: true
                                                    })}
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

                                    </Row>
                                    {/* <Col
                                        sm="12"
                                        md="12"
                                        lg="12"
                                        xl="12"
                                    // className="mt-4 mb-5"
                                    >
                                        <AttachFile2
                                            fileRegister={register}
                                            name="demography_file"
                                            title="Upload Demography"
                                            key="demography_file"
                                            accept={".png, .jpeg, .jpg, .xls, .xlsx"}
                                            // resetValue={resetFile}
                                            description="File Formats: png, jpeg, jpg, xls, xlsx"
                                            nameBox
                                        />
                                        <AnchorTag
                                        //  onClick={props.downloadSampleFile}
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
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="d-flex justify-content-start mt-4">
                                    <RFQButton>
                                        Update
                                        {/* <i className="fa fa-long-arrow-right" aria-hidden="true" /> */}
                                    </RFQButton>
                                </Col>
                            </Row>
                        </>
                        :
                        <Row style={{ padding: '0px 15px' }}>
                            <Col md={12} lg={12} xl={12} sm={12}>
                                <Row>
                                    {FormStructure.map(({ name, type, label, maxLength, isDesabled, isSmallLabel }, i) => (
                                        <Col md={12} lg={3} xl={3} sm={12} className='mb-3' key={"qwesadwe" + i}>
                                            <Input
                                                label={label}
                                                name={name}
                                                id={name}
                                                maxLength={maxLength}
                                                // placeholder={"Enter " + label}
                                                autoComplete="none"
                                                type={type}
                                                {...(type === 'date' ? { min: '1980-01-01', max: '2999-12-31', noFocusChange: true } : {})}
                                                // inputRef={register}
                                                inputRef={register({
                                                    valueAsDate: true
                                                })}
                                                defaultValue={""}
                                                isRequired={false}
                                                required={false}
                                                error={errors[name]}
                                                disabled={true}
                                                style={{ background: '#e0e0e0' }}
                                                labelStyle={isSmallLabel ? {
                                                    fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
                                                    lineHeight: '14px'
                                                } : { lineHeight: '14px' }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                    }

                </Form>

                {!isEdit && <Row>
                    <Col xl={12} lg={12} md={12} sm={12} className='d-flex justify-content-end'>
                        <Button buttonStyle="outline-secondary" onClick={() => setFeatureModal(true)}>
                            Add Fetaure <i className="ti-plus" />
                        </Button>
                    </Col>
                </Row>}
                {(!_.isEmpty(GetQuoteSlipData[0]?.data_slip_feature)) ? (
                    <div className='mb-5'>
                        <DataTable
                            className="border rounded"
                            columns={structure(isEdit ? false : true)}
                            data={GetQuoteSlipData[0]?.data_slip_feature}
                            noStatus={"true"}
                            pageState={{ pageIndex: 0, pageSize: 5 }}
                            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                            rowStyle={"true"}
                            autoResetPage={false}
                            deleteFlag={'custom_delete_action'}
                            removeAction={deleteQuote}
                            EditFlag
                            EditFunc={onEdit}
                        />
                    </div>
                )
                    :
                    (<NoDataFound text='No Data Found' />)
                }
            </div>
            {!!featureModal && (
                <FeatureModal
                    show={featureModal}
                    onHide={() => setFeatureModal(false)}
                    quote_slip_id={id}
                    borker_id={brokerId}
                    features={GetQuoteSlipData[0]?.data_slip_feature}
                />
            )}
            {!!Modal.show &&
                <CommunicationModal
                    show={!!Modal.show}
                    onHide={() => setModal({
                        show: false,
                        isMail: null
                    })}
                    isEmail={Modal.isMail}
                    // quote_id={19}
                    quote_id={id ? id : QuoteSlipData}
                    broker_id={brokerId}
                />
            }
            {(loading || success) && <Loader />}
        </>
    )
}
