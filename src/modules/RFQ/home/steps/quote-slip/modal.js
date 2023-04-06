import React, { useState } from 'react';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Row, Col } from 'react-bootstrap';
import { Error } from 'components';
import { useForm } from "react-hook-form";
import { CloseButton } from 'modules/RFQ/data-upload/style';
import { Input } from "../../../components";
import { Button, Title } from 'modules/RFQ/select-plan/style';
import { sendQuoteSlipData, updateQuoteSlipData } from '../../home.slice';
import classes from "modules/policies/Nominee-Config/index.module.css";
import { Select } from "modules/RFQ/components/index.js";

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


export const FeatureModal = ({ show, onHide, borker_id, quote_slip_id, features }) => {
    const dispatch = useDispatch();
    const [check, setCheck] = useState(show.id ? !show.is_parent : false);
    const { globalTheme } = useSelector(state => state.theme)
    const { errors, register, handleSubmit } = useForm({
        validationSchema: validationSchema(check),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: show.id ? show : {}
    });
    // useEffect(() => {
    //     if (show.id) {
    //         setValue("feature_name", show?.feature_name);
    //         setValue("existing_terms", show?.existing_terms);
    //         setValue("proposed_option", show?.proposed_option);
    //     }
    //     //eslint-disable-next-line
    // }, [show]);

    const is_new = !show.id;

    const onSubmit = (data) => {
        //alert('g')
        if (!is_new) {
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
                quote_slip_id: show.quote_slip_id,
                quote_slip_feature_id: show.id,
                step: 2
            }
            dispatch(updateQuoteSlipData(_data));
        } else {
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
                quote_slip_id: quote_slip_id,
                broker_id: borker_id
            }
            dispatch(sendQuoteSlipData(_data));
        }
        onHide();
    }

    return (
        <Modal
            show={!!show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal">

            <Modal.Body className="">
                <CloseButton onClick={onHide}>×</CloseButton>
                <Title fontSize="1.7rem" className='mb-5 mt-0'>{``}</Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="d-flex flex-wrap" >
                        <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>
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
                            {!!errors?.feature_name && <Error top='4px'>{errors?.feature_name?.message}</Error>}
                        </Col>
                        <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>
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
                            {!!errors?.existing_terms && <Error top='4px'>{errors?.existing_terms?.message}</Error>}
                        </Col>
                        <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>
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
                            {!!errors?.proposed_option && <Error top='4px'>{errors?.proposed_option?.message}</Error>}
                        </Col>
                        <Col
                            xl={4}
                            lg={4}
                            md={4}
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
                                htmlFor="check1"
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
                                        id="check1"
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

                        {check && <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>

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
                                options={features.filter(({ is_parent }) => is_parent).map(({ feature_name, id }) => ({
                                    id, name: feature_name, value: id
                                })) || []}
                                error={errors.parent_id}
                            />
                            {!!errors?.parent_id && <Error top='4px'>{errors?.parent_id?.message}</Error>}
                        </Col>}

                        <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>
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
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-center mt-4">
                            <Button width={"190px"}
                                padding="15px"
                                fontSize='1.5rem' type='submit'>
                                {is_new ? 'Add' : 'Update'}
                                {/* <i className="fa fa-plus" aria-hidden="true" /> */}
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal >
    );
}

