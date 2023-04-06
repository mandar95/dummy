import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import { Error, RFQButton, Loader, NoDataFound, Button } from "../../../../../components";
import { Input } from "../../../components";
import swal from "sweetalert";

import { BackBtn } from '../button'
import * as yup from "yup";
import _ from 'lodash';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import classes from "modules/policies/Nominee-Config/index.module.css";
import { Select } from "modules/RFQ/components/index.js";
import { clear, sendQuoteSlipData, getAllQuoteSlipData, deleteQuoteFeature } from '../../home.slice';
import { structure } from "./helper";
import { DataTable } from "modules/user-management";
import { FeatureModal } from "./modal";

const validationSchema = (isChild) => yup.object().shape({
    feature_name: yup.string()
        .min(2, "Please enter feature name more than 2 character")
        .required("Please Enter Feature Name"),
    sequence: yup.string().required("Sequence Required"),
    ...isChild && { parent_id: yup.string().required("Sequence Required") }
    // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    // existing_terms: yup.string()
    //     .min(2, "Please enter existing terms more than 2 character")
    //     .required("Please Enter Existing Terms"),
    // .max(50, 'Company name should be below 50'),

    //.matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
    // work_email: yup.string()
    //     .email('Please enter valid email id')
    //     .required('Email id is required'),
    // proposed_option: yup.string().required("proposed option is requied")
    //     .min(2, "Please enter proposed option more than 2 character")
});
// /*----x-----validation schema-----x----*/

export const AddFeature = ({ onNextStep, onPrevStep, Broker_id }) => {
    const dispatch = useDispatch();
    const { success, qouteUpdateSuccess, loading, QuoteSlipData, GetQuoteSlipData } = useSelector(state => state.RFQHome);
    const [Modal, setModal] = useState();
    const [check, setCheck] = useState(false);
    const { globalTheme } = useSelector(state => state.theme)
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const brokerId = query.get("broker_id") || Broker_id;
    const enquiryId = decodeURIComponent(query.get("enquiry_id"));



    const { handleSubmit, register, errors, setValue } = useForm({
        validationSchema: validationSchema(check),
        mode: "onChange",
        reValidateMode: "onChange"
    });

    useEffect(() => {
        if (QuoteSlipData) {
            dispatch(getAllQuoteSlipData({
                // quote_id: 19,
                quote_id: QuoteSlipData,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [QuoteSlipData])

    useEffect(() => {
        if (success && (enquiryId)) {
            //history.push(`/add-feature?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`)
            dispatch(getAllQuoteSlipData({
                //quote_id: 19
                quote_id: QuoteSlipData,
            }))
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, enquiryId])

    useEffect(() => {
        if (qouteUpdateSuccess || success) {
            swal('Success', qouteUpdateSuccess || success, "success").then(() => {
                dispatch(getAllQuoteSlipData({
                    // quote_id: 19
                    quote_id: QuoteSlipData,
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
    const nextStep = () => {
        if (GetQuoteSlipData[0]?.data_slip_feature.length) {
            // history.push(`/summary?enquiry_id=${encodeURIComponent(enquiryId || enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`)
            onNextStep()
        }
        else {
            swal("warning", "Please Add Feature", "warning");
        }
    }
    const onEdit = (id, data) => {
        setModal(data)
    };
    const resetData = () => {
        setValue('feature_name', '')
        setValue('existing_terms', '')
        setValue('proposed_option', '')
    }
    const onSubmit = (data) => {
        let _data = {
            feature_name: data.feature_name,
            ...(data.existing_terms !== '' && {
                existing_terms: data.existing_terms
            }),
            ...(data.proposed_option !== '' && {
                proposed_option: data.proposed_option
            }),
            sequence: data.sequence,
            is_parent: check ? 0 : 1,
            ...data.parent_id && { parent_id: data.parent_id },
            step: 2,
            quote_slip_id: QuoteSlipData,
            broker_id: brokerId
        }
        dispatch(sendQuoteSlipData(_data));
        resetData()
    }

    return (
        <>
            <div style={{ margin: '0px 45px' }}>
                <Row>
                    <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                        <BackBtn
                            stepAction={() => onPrevStep()}
                        //url={`/quote-slip?enquiry_id=${encodeURIComponent(enquiry_id || enquiryId)}${doesHasIdParam({ brokerId, insurerId })}`} style={{ outline: "none", border: "none", background: "none" }}
                        >
                            <img
                                src="/assets/images/icon/Group-7347.png"
                                alt="bck"
                                height="45"
                                width="45"
                            />
                        </BackBtn>
                        <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Placement Slip</h1>
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row style={{ padding: '0px 15px' }}>
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <Row>
                                <Col md={12} lg={4} xl={4} sm={12} className='mb-3'>
                                    <Input
                                        label="Feature Name"
                                        name="feature_name"
                                        id="feature_name"
                                        maxLength="100"
                                        // placeholder="Enter Feature Name"
                                        autoComplete="none"
                                        inputRef={register}
                                        defaultValue={""}
                                        isRequired={true}
                                        required={false}
                                        error={errors?.feature_name}
                                    />
                                    {!!errors?.feature_name && <Error className="mt-0">{errors?.feature_name?.message}</Error>}
                                </Col>
                                <Col md={12} lg={4} xl={4} sm={12} className='mb-3'>
                                    <Input
                                        label="Existing Terms"
                                        name="existing_terms"
                                        id="existing_terms"
                                        maxLength="100"
                                        // placeholder="Enter Existing Terms"
                                        autoComplete="none"
                                        inputRef={register}
                                        defaultValue={""}
                                        isRequired={false}
                                        required={false}
                                        error={errors?.existing_terms}
                                    />
                                    {!!errors?.existing_terms && <Error className="mt-0">{errors?.existing_terms?.message}</Error>}
                                </Col>
                                <Col md={12} lg={4} xl={4} sm={12} className='mb-3'>
                                    <Input
                                        label="Proposed Option"
                                        name="proposed_option"
                                        id="proposed_option"
                                        maxLength="100"
                                        // placeholder="Enter Proposed Option"
                                        autoComplete="none"
                                        inputRef={register}
                                        defaultValue={""}
                                        isRequired={false}
                                        required={false}
                                        error={errors?.proposed_option}
                                    />
                                    {!!errors?.proposed_option && <Error className="mt-0">{errors?.proposed_option?.message}</Error>}
                                </Col>
                                <Col
                                    xl={4}
                                    lg={4}
                                    md={6}
                                    sm={12}
                                    className="align-self-center"
                                >
                                    <div className="text-center md-1 text-secondary">
                                        Is Sub Feature ?{" "}
                                        <small
                                            className="text-danger"
                                            style={{ fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}
                                        >
                                            *
                                        </small>{" "}
                                    </div>
                                    <label
                                        className={`w-100 d-flex justify-content-center align-items-center ${classes.checkbox}`}
                                        htmlFor="checkfeaturee"
                                    >
                                        <div className="d-flex w-100 m-1 justify-content-center align-items-center">
                                            <div
                                                className={`py-2 px-2 text-center w-100  ${!check &&
                                                    classes.borderRounded +
                                                    " bg-primary text-center text-light"
                                                    }`}
                                            >
                                                <span>No</span>
                                            </div>

                                            <input
                                                onChange={(e) => setCheck((check) => !check)}
                                                type="checkbox"
                                                id="checkfeaturee"
                                            />
                                            <div
                                                className={`py-2 px-2 text-center w-100 ${check &&
                                                    classes.borderRounded +
                                                    " bg-primary text-center text-light"
                                                    }`}
                                            >
                                                <span>Yes</span>
                                            </div>
                                        </div>
                                    </label>
                                </Col>

                                {check && <Col md={6} lg={4} xl={4} sm={12} className='mb-3'>

                                    <Select
                                        name="parent_id"
                                        label='Parent Feature'
                                        placeholder="Select Parent"
                                        autoComplete="none"
                                        id="parent_id"
                                        inputRef={register}
                                        isRequired={true}
                                        required={false}
                                        defaultValue={""}
                                        options={GetQuoteSlipData[0]?.data_slip_feature?.filter(({ is_parent }) => is_parent).map(({ feature_name, id }) => ({
                                            id, name: feature_name, value: id
                                        })) || []}
                                        error={errors.parent_id}
                                    />
                                    {!!errors?.parent_id && <Error top='4px'>{errors?.parent_id?.message}</Error>}
                                </Col>}

                                <Col md={6} lg={4} xl={4} sm={12} className='mb-3'>
                                    <Input
                                        label="Feature Sequence"
                                        name="sequence"
                                        id="sequence"
                                        maxLength="100"
                                        // placeholder="Enter Proposed Option"
                                        autoComplete="none"
                                        inputRef={register}
                                        defaultValue={""}
                                        isRequired={true}
                                        required={false}
                                        error={errors?.sequence}
                                    />
                                    {!!errors?.sequence && <Error top='4px'>{errors?.sequence?.message}</Error>}
                                </Col>
                                <Col
                                    sm="12"
                                    md="12"
                                    lg="12"
                                    xl="12"
                                    className="mt-4 mb-5"
                                >
                                    <Button
                                        buttonStyle={"outline"}
                                    >
                                        Add Feature +
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
                {(!_.isEmpty(GetQuoteSlipData[0]?.data_slip_feature)) ? (
                    <>
                        <DataTable
                            className="border rounded"
                            columns={structure(true)}
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
                        <RFQButton onClick={nextStep}>
                            Submit
                            <i className="fa fa-long-arrow-right" aria-hidden="true" />
                        </RFQButton>
                    </>
                )
                    :
                    (<NoDataFound text='No Data Found' />)
                }
            </div>
            {!!Modal && (
                <FeatureModal
                    show={Modal}
                    onHide={() => setModal(false)}
                    borker_id={brokerId}
                    features={GetQuoteSlipData[0]?.data_slip_feature}
                />
            )}
            {(loading || success) && <Loader />}
        </>
    )
}
