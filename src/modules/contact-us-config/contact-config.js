/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Button, Row, Form, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, Card, Error, Loader, TabWrapper, Tab, NoDataFound } from "../../components";
import * as yup from 'yup';
import swal from "sweetalert";
import { loadBroker, loadEmployer } from "../announcements/announcement.slice";
import { InsurerAll } from "../RFQ/home/home.slice";
import { getContactDetails, updateBrokerDetails, updateICDetails, updateEmployerDetails, updateTPADetails, clear } from "./contact-config.slice";
import { getMaster } from 'modules/master-config/master.helper'
import { insurer } from 'config/validations';
import { getContactUserWise } from './contact-config.helper'

const validation = insurer.profile

const ContactConfig = () => {
    const dispatch = useDispatch();
    const { userType } = useParams();
    const [tab, setTab] = useState("broker");
    const { broker: brokerData, EmployerNameResponse } = useSelector(state => state.announcement);
    const { BrokerDetailsData, loading, ContactDetailsUpdated, error } = useSelector((state) => state.ContactConfig);
    const { insurer } = useSelector(state => state.RFQHome);
    const loginState = useSelector(state => state.login);
    const { response } = useSelector((state) => state.master);
    const { currentUser } = loginState;
    const validationSchema = yup.object().shape({
        ...(userType === 'admin' && tab === 'broker' && {
            broker_id: yup.string().required('Please select broker'),
        }),
        ...(userType === 'admin' && tab === 'insurer' && {
            ic_id: yup.string().required('Please select insurer')
        }),
        email_1: yup.string().email("must be a valid email")
            .min(validation.email.min, `Minimum ${validation.email.min} character required`)
            .max(validation.email.max, `Maximum ${validation.email.max} character available`)
            .nullable(),
        email_2: yup.string().email("must be a valid email")
            .min(validation.email.min, `Minimum ${validation.email.min} character required`)
            .max(validation.email.max, `Maximum ${validation.email.max} character available`)
            .nullable(),
        email_3: yup.string().email("must be a valid email")
            .min(validation.email.min, `Minimum ${validation.email.min} character required`)
            .max(validation.email.max, `Maximum ${validation.email.max} character available`)
            .nullable(),
        contact_1: yup
            .string()
            .nullable()
            .matches(validation.contact_no.regex, 'Not valid number')
            .min(validation.contact_no.length, "Mobile No. should be 10 digits")
            .max(validation.contact_no.length, "Mobile No. should be 10 digits"),
        contact_2: yup
            .string()
            .nullable()
            .matches(validation.contact_no.regex, 'Not valid number')
            .min(validation.contact_no.length, "Mobile No. should be 10 digits")
            .max(validation.contact_no.length, "Mobile No. should be 10 digits"),
        contact_3: yup
            .string()
            .nullable()
            .matches(validation.contact_no.regex, 'Not valid number')
            .min(validation.contact_no.length, "Mobile No. should be 10 digits")
            .max(validation.contact_no.length, "Mobile No. should be 10 digits"),
        address_line_1: yup.string().nullable()
            .min(validation.address_line.min, `Enter atleast ${validation.address_line.min} letters`)
            .max(validation.address_line.max, `Maximum ${validation.address_line.max} character available`),
        address_line_2: yup.string().nullable()
            .min(validation.address_line.min, `Enter atleast ${validation.address_line.min} letters`)
            .max(validation.address_line.max, `Maximum ${validation.address_line.max} character available`),
        address_line_3: yup.string().nullable()
            .min(validation.address_line.min, `Enter atleast ${validation.address_line.min} letters`)
            .max(validation.address_line.max, `Maximum ${validation.address_line.max} character available`),

    })
    const { control, errors, watch, handleSubmit, setValue } = useForm({
        validationSchema,
    });

    let BrokerID = watch('broker_id');
    let ICID = watch('ic_id');
    let EmployerID = watch('employer_id');
    let TPAID = watch('tpa_id');

    useEffect(() => {
        if (ContactDetailsUpdated) {
            swal(ContactDetailsUpdated, "", "success").then(() => {
                dispatch(clear('ContactDetailsUpdated'))
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        // return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ContactDetailsUpdated, error])

    useEffect(() => {
        if (BrokerDetailsData.length > 0) {
            setValue([
                { email_1: BrokerDetailsData[0].email_1 ? BrokerDetailsData[0].email_1 : "" },
                { email_2: BrokerDetailsData[0].email_2 ? BrokerDetailsData[0].email_2 : "" },
                { email_3: BrokerDetailsData[0].email_3 ? BrokerDetailsData[0].email_3 : "" },
                { contact_1: BrokerDetailsData[0].contact_1 ? BrokerDetailsData[0].contact_1 : "" },
                { contact_2: BrokerDetailsData[0].contact_2 ? BrokerDetailsData[0].contact_2 : "" },
                { contact_3: BrokerDetailsData[0].contact_3 ? BrokerDetailsData[0].contact_3 : "" },
                { address_line_1: BrokerDetailsData[0].address_line_1 ? BrokerDetailsData[0].address_line_1 : "" },
                { address_line_2: BrokerDetailsData[0].address_line_2 ? BrokerDetailsData[0].address_line_2 : "" },
                { address_line_3: BrokerDetailsData[0].address_line_3 ? BrokerDetailsData[0].address_line_3 : "" },
            ])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BrokerDetailsData])

    useEffect(() => {
        setValue([
            { broker_id: "" },
            { ic_id: "" },
            { employer_id: "" },
            { tpa_id: "" },
            { email_1: "" },
            { email_2: "" },
            { email_3: "" },
            { contact_1: "" },
            { contact_2: "" },
            { contact_3: "" },
            { address_line_1: "" },
            { address_line_2: "" },
            { address_line_3: "" },
        ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    useEffect(() => {
        if (BrokerID || ICID || EmployerID || TPAID) {
            let userObj = { BrokerID, ICID, EmployerID, TPAID }
            getContactUserWise(null, userObj, dispatch, getContactDetails)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BrokerID, ICID, EmployerID, TPAID])

    useEffect(() => {
        if (userType === 'admin') {
            dispatch(loadBroker())
            dispatch(InsurerAll())
            dispatch(loadEmployer())
            getMaster(36, dispatch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType]);

    useEffect(() => {
        getContactUserWise(currentUser, null, dispatch, getContactDetails)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    const onSubmit = (data) => {
        if (userType === 'admin') {
            if (tab === "broker") {
                dispatch(updateBrokerDetails(data))
            }
            if (tab === "insurer") {
                dispatch(updateICDetails(data))
            }
            if (tab === "employer") {
                dispatch(updateEmployerDetails(data))
            }
            if (tab === "tpa") {
                dispatch(updateTPADetails(data))
            }
        }
        if (userType === 'broker') {
            dispatch(updateBrokerDetails({
                ...data,
                broker_id: currentUser?.broker_id
            }))
        }
        if (userType === "insurer") {
            dispatch(updateICDetails({
                ...data,
                ic_id: currentUser?.ic_id
            }))
        }
        if (userType === "employer") {
            dispatch(updateEmployerDetails({
                ...data,
                employer_id: currentUser?.employer_id
            }))
        }
    };
    return (
        <>
            <Card title="Contact Us Configurator">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {userType === 'admin' && <>
                        <TabWrapper width='max-content'>
                            <Tab isActive={Boolean(tab === "broker")} onClick={() => setTab("broker")} className="d-block">Broker</Tab>
                            <Tab isActive={Boolean(tab === "employer")} onClick={() => setTab("employer")} className="d-block">Employer</Tab>
                            <Tab isActive={Boolean(tab === "insurer")} onClick={() => setTab("insurer")} className="d-block">Insurer</Tab>
                            <Tab isActive={Boolean(tab === "tpa")} onClick={() => setTab("tpa")} className="d-block">TPA</Tab>
                        </TabWrapper>
                        {tab === "broker" &&
                            <div>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Select
                                                label="Broker"
                                                placeholder='Select Broker'
                                                required={false}
                                                isRequired={true}
                                                options={brokerData.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                }))}
                                            />
                                        }
                                        name="broker_id"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.broker_id}
                                    />
                                    {!!errors?.broker_id && <Error>{errors?.broker_id?.message}</Error>}
                                </div>
                            </div>
                        }
                        {tab === "employer" &&
                            <div>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Select
                                                label="Employer"
                                                placeholder='Select employer'
                                                required={false}
                                                isRequired={true}
                                                options={EmployerNameResponse.data.data.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                }))}
                                            />
                                        }
                                        name="employer_id"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.ic_id}
                                    />
                                    {!!errors?.ic_id && <Error>{errors?.ic_id?.message}</Error>}
                                </div>
                            </div>
                        }
                        {tab === "insurer" &&
                            <div>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Select
                                                label="Insurer"
                                                placeholder='Select insurer'
                                                required={false}
                                                isRequired={true}
                                                options={insurer.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                }))}
                                            />
                                        }
                                        name="ic_id"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.ic_id}
                                    />
                                    {!!errors?.ic_id && <Error>{errors?.ic_id?.message}</Error>}
                                </div>
                            </div>
                        }
                        {tab === "tpa" &&
                            <div>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Select
                                                label="TPA"
                                                placeholder='Select TPA'
                                                required={false}
                                                isRequired={true}
                                                options={response?.data?.data.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                }))}
                                            />
                                        }
                                        name="tpa_id"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.ic_id}
                                    />
                                    {!!errors?.ic_id && <Error>{errors?.ic_id?.message}</Error>}
                                </div>
                            </div>
                        }
                    </>
                    }
                    {!!(BrokerDetailsData.length && (BrokerID || ICID || EmployerID || TPAID || userType !== 'admin')) ?
                        <>
                            <Row xs={1} sm={3} md={3} lg={3} xl={3}>
                                <div className="p-2">
                                    <Controller
                                        as={<Input placeholder="Email 1" label="Email 1" maxLength={validation.email.max} isRequired={true} />}
                                        name="email_1"
                                        error={errors && errors.email_1}
                                        control={control}
                                    />
                                    {!!errors.email_1 && <Error>{errors.email_1.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={<Input placeholder="Email 2" label="Email 2" maxLength={validation.email.max} isRequired={true} />}
                                        name="email_2"
                                        error={errors && errors.email_2}
                                        control={control}
                                    />
                                    {!!errors.email_2 && <Error>{errors.email_2.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={<Input placeholder="Email 3" label="Email 3" maxLength={validation.email.max} isRequired={true} />}
                                        name="email_3"
                                        error={errors && errors.email_3}
                                        control={control}
                                    />
                                    {!!errors.email_3 && <Error>{errors.email_3.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={<Input label="Contact 1" type="text" placeholder="Contact 1" required={false}
                                            isRequired={true} />}
                                        name="contact_1"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.contact_1}
                                    />
                                    {!!errors?.contact_1 && <Error>{errors?.contact_1?.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={<Input label="Contact 2" type="text" placeholder="Contact 2" required={false}
                                            isRequired={true} />}
                                        name="contact_2"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.contact_2}
                                    />
                                    {!!errors?.contact_2 && <Error>{errors?.contact_2?.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={<Input label="Contact 3" type="text" placeholder="Contact 3" required={false}
                                            isRequired={true} />}
                                        name="contact_3"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.contact_3}
                                    />
                                    {!!errors?.contact_3 && <Error>{errors?.contact_3?.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Input
                                                placeholder="Address Line 1"
                                                label="Address Line 1"
                                                //maxLength={validation.address_line.max}
                                                isRequired={true}
                                            />
                                        }
                                        name="address_line_1"
                                        control={control}
                                        error={errors && errors.address_line_1}
                                    />
                                    {!!errors.address_line_1 && <Error>{errors.address_line_1.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Input
                                                placeholder="Address Line 2"
                                                label="Address Line 2"
                                                //maxLength={validation.address_line.max}
                                                isRequired={true}
                                            />
                                        }
                                        name="address_line_2"
                                        error={errors && errors.address_line_2}
                                        control={control}
                                    />
                                    {!!errors.address_line_2 && <Error>{errors.address_line_2.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Input
                                                placeholder="Address Line 3"
                                                label="Address Line 3"
                                                //maxLength={validation.address_line.max}
                                                isRequired={true}
                                            />
                                        }
                                        name="address_line_3"
                                        error={errors && errors.address_line_3}
                                        control={control}
                                    />
                                    {!!errors.address_line_3 && <Error>{errors.address_line_3.message}</Error>}
                                </div>
                            </Row>
                            <Row>
                                <Col md={12} className="d-flex justify-content-end mt-4">
                                    <Button type="submit">
                                        Update & Save
                                    </Button>
                                </Col>
                            </Row>
                        </>
                        : <NoDataFound />
                    }
                </Form>
            </Card>
            {loading && <Loader />}
        </>
    )
}


export default ContactConfig;
