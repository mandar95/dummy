import React, { useState, useEffect, useReducer } from 'react';
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import { Row, Col, Form } from 'react-bootstrap';

import { SelectComponent, Select, Button, Error } from 'components';

import { createTemplateMapping, getALLEmailTemplate, updateTemplateMapping, loadFrequency, initialState, reducer } from './template.action';
import { getEmployereData, selectEmployerResponse, getPolicySubTypeData, selectPolicySubType, getPolicyNumberData, selectPolicyNumber, clear } from "modules/EndorsementRequest/EndorsementRequest.slice";
import * as yup from 'yup';
import { Prefill } from '../../custom-hooks/prefill';

// let _frequency = [{ id: 1, name: 'Daily' },
// { id: 2, name: 'Alternate Days' },
// { id: 3, name: 'One a week' },
// { id: 4, name: 'Immediate' },
// { id: 5, name: 'Fortnight' },
// { id: 6, name: 'Before Enrolment End date' }]

const _typeData = [{ id: 1, name: 'Policy Wise' }, { id: 2, name: 'Entity Wise' }]

const validationSchema = (typeData, templateId) => yup.object().shape({
    typeid: yup.string().required("Please Select Mapping Type"),
    ...(typeData === 1 && {
        employer: yup.object().shape({
            id: yup.string().required('Employer Required'),
        }),
        template_id: yup.object().shape({
            id: yup.string().required('Template Required'),
        }),
        policytype: yup.object().shape({
            id: yup.string().required('Policy Type Required'),
        }),
        policyno: yup.object().shape({
            id: yup.string().required('Policy Name Required'),
        }),
    }),
    ...(typeData === 2 && {
        employer: yup.object().shape({
            id: yup.string().required('Employer Required'),
        }),
        template_id: yup.object().shape({
            id: yup.string().required('Template Required'),
        }),
    }),
    ...(templateId && {
        frequency_id: yup.string().required('Frequency Required')
    })
})


const ModalComponent = ({ show, onHide, _editData, dispatch, allEmailTemplate }) => {

    const { userType } = useParams();
    const _dispatch = useDispatch();
    const EmployerResponse = useSelector(selectEmployerResponse);
    const PolicyTypeResponse = useSelector(selectPolicySubType);
    const PolicyNumberResponse = useSelector(selectPolicyNumber);
    const { broker } = useSelector((state) => state.endorsementRequest);
    const { currentUser } = useSelector(state => state.login);
    const [{ _frequency }, reducerDispatch] = useReducer(reducer, initialState);
    const [typeData, setTypeData] = useState(null);
    const [templateId, setTemplateId] = useState(null);


    const { control, handleSubmit, watch, setValue, errors } = useForm({
        validationSchema: validationSchema(typeData, templateId),

    });
    const _typeid = watch('typeid')
    const _empid = watch('employer')?.value || ''
    const _policyid = watch('policyno')?.value || ''
    const _policytype = watch("policytype")?.value || ''

    const _template_id = watch("template_id")?.value || ''

    useEffect(() => {
        if (_template_id && !!allEmailTemplate.length) {
            let _data = allEmailTemplate.find((item) => item.id === Number(_template_id))
            if ([27, 28].includes(Number(_data?.system_trigger_id))) {
                setTemplateId(_data.system_trigger_id)
            } else {
                setTemplateId(null)
            }
            _data?.system_trigger_id && loadFrequency(reducerDispatch, {
                master_system_trigger_id: _data?.system_trigger_id
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_template_id, allEmailTemplate])

    useEffect(() => {
        if (!!templateId && _editData && !!_frequency?.length) {
            setValue('frequency_id', _editData?.frequency_id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateId, _editData, _frequency])

    useEffect(() => {

        if (Number(_typeid) === 1 && _policyid && _empid && !_editData) {
            let _data = {
                broker_id: currentUser?.broker_id,
                employer_id: _empid,
                policy_id: _policyid,
                type: _typeid
            }
            getALLEmailTemplate(dispatch, _data)
            return () => {
                setValue('template_id', undefined)
            }

        }

        if (Number(_typeid) === 2 && _empid && !_editData) {
            let _data = {
                broker_id: currentUser?.broker_id,
                employer_id: _empid,
                type: _typeid
            }
            getALLEmailTemplate(dispatch, _data)
            return () => {
                setValue('template_id', undefined)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_empid, _policyid])

    useEffect(() => {
        if (_editData) {
            getALLEmailTemplate(dispatch, { broker_id: currentUser?.broker_id, })
            setTimeout(() => {
                setValue('typeid', _editData.type)
            }, 1000);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_editData])

    useEffect(() => {
        if (_typeid && _editData) {
            setValue('employer', { id: _editData?.employer_id, value: _editData?.employer_id, label: _editData.employer_name })
        }
        if (Number(_typeid) === 2) {
            getEmployerId([{ value: _editData?.employer_id }])
        }
        setTypeData(Number(_typeid))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_typeid])

    useEffect(() => {
        if (_empid && Number(_typeid) === 1) {
            const data = {
                employer_id: _empid
            };
            _dispatch(getPolicySubTypeData(data));
            return () => {
                dispatch(clear('policy-type'))
                dispatch({ type: 'GENERIC_UPDATE', payload: { allEmailTemplate: [] } });
                setValue([
                    { policytype: undefined },
                    { policyno: undefined },
                    { template_id: undefined },
                ])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_empid])

    useEffect(() => {
        if (PolicyTypeResponse && _editData) {
            setValue('policytype', { id: _editData?.poliyc_sub_type_id, value: _editData?.poliyc_sub_type_id, label: _editData.poliyc_sub_type })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [PolicyTypeResponse])

    useEffect(() => {
        if (_policytype) {
            const data = {
                employer_id: _empid,
                policy_sub_type_id: _policytype,
                user_type_name: 'Broker'
            };
            _dispatch(getPolicyNumberData(data));
            return () => {
                dispatch(clear('policy-no'))
                dispatch({ type: 'GENERIC_UPDATE', payload: { allEmailTemplate: [] } });
                setValue([
                    { policyno: undefined },
                    { template_id: undefined },
                ])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_policytype])

    useEffect(() => {
        if (PolicyNumberResponse && _editData) {
            setValue('policyno', { id: _editData?.policy_id, value: _editData?.policy_id, label: `${_editData.policy_name} : ${_editData.policy_number}` })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [PolicyNumberResponse])

    useEffect(() => {
        if (allEmailTemplate && _editData) {
            setTimeout(() => {
                setValue('template_id', { id: _editData?.template_id, value: _editData?.template_id, label: _editData.template_name })
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allEmailTemplate])

    // Prefill 
    Prefill(EmployerResponse, setValue, 'employer')
    Prefill(Number(_typeid) === 1 ? PolicyTypeResponse?.data?.data : [], setValue, 'policytype')
    Prefill(Number(_typeid) === 1 ? PolicyNumberResponse?.data?.data : [], setValue, 'policyno', 'number')


    const getAdminEmployer = ([e]) => {
        if (e?.value) {
            _dispatch(getEmployereData({ broker_id: e?.value }, 1, 50000));
        }
        return (e)
    }
    const getEmployerId = ([e]) => {
        if (e?.value) {
            // setEmployerId(e.value);
            // api call for Policy subtype
            const data = {
                employer_id: e.value
            };
            _dispatch(getPolicySubTypeData(data));
        }
        return e
    };

    const onSubmit = (data) => {
        let _data = {
            type: data.typeid,
            ...(data.template_id && { template_id: data.template_id?.value }),
            ...(!!templateId && { frequency_id: data.frequency_id })
        }
        if (Number(data.typeid) === 1) {
            _data = {
                ..._data,
                employer_id: data.employer?.value,
                policy_sub_type_id: data.policytype?.value,
                policy_id: data.policyno?.value
            }
        } else {
            _data = {
                ..._data,
                employer_id: data.employer?.value
            }
        }
        if (show.isEditData) {
            updateTemplateMapping(dispatch, _data, _editData.id)
        } else {
            createTemplateMapping(dispatch, _data)
        }
        onHide()

    }
    return (
        <Modal
            show={show.isShow}
            onHide={onHide}
            animation={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span>{show.isEditData ? 'Edit' : 'Create'}  Template Mapping</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    {
                        <Row style={{ padding: '0px 15px' }}>
                            <Col xl={4} lg={4} md={6} sm={12}>
                                <Controller
                                    as={
                                        <Select
                                            label="Mapping Type"
                                            placeholder="Select Mapping Type"
                                            required={false}
                                            isRequired={true}
                                            // options={_Events}
                                            options={_typeData?.map((item) => ({
                                                id: item?.id,
                                                name: item?.name,
                                                value: item?.id,
                                            }))}
                                        />
                                    }
                                    name="typeid"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.typeid}
                                />
                                {!!errors?.typeid && <Error>{errors?.typeid?.message}</Error>}
                            </Col>
                            {(userType === "admin") &&
                                <Col xl={4} lg={4} md={6} sm={12}>
                                    <Controller
                                        as={
                                            <SelectComponent
                                                label="Broker"
                                                placeholder="Select Broker"
                                                required
                                                options={broker.map(item => (
                                                    {
                                                        id: item.id,
                                                        label: item.name,
                                                        value: item.id
                                                    }
                                                )) || []}
                                            />
                                        }
                                        onChange={getAdminEmployer}
                                        control={control}
                                        name="broker"
                                    />
                                </Col>
                            }
                            {_typeid &&
                                <>
                                    <Col xl={4} lg={4} md={6} sm={12}>
                                        <Controller
                                            as={
                                                <SelectComponent
                                                    label="Employer"
                                                    placeholder="Select Employer"
                                                    required={false}
                                                    isRequired={true}
                                                    // options={_Events}
                                                    options={EmployerResponse?.map((item) => ({
                                                        id: item?.id,
                                                        label: item?.name,
                                                        value: item?.id,
                                                    }))}
                                                />
                                            }
                                            control={control}
                                            name="employer"
                                            error={errors && errors.employer?.id}
                                        />
                                        {!!errors?.employer?.id && <Error>{errors?.employer?.id?.message}</Error>}
                                    </Col>
                                    {Number(_typeid) === 1 &&
                                        <>
                                            <Col xl={4} lg={4} md={6} sm={12}>
                                                <Controller
                                                    as={
                                                        <SelectComponent
                                                            label="Policy Type"
                                                            placeholder="Select Policy Type"
                                                            required={false}
                                                            isRequired={true}
                                                            // options={_Events}
                                                            options={PolicyTypeResponse?.data?.data?.map((item) => ({
                                                                id: item?.id,
                                                                label: item?.name,
                                                                value: item?.id,
                                                            }))}
                                                        />
                                                    }
                                                    control={control}
                                                    name="policytype"
                                                    error={errors && errors.policytype?.id}
                                                />
                                                {!!errors?.policytype?.id && <Error>{errors?.policytype?.id?.message}</Error>}
                                            </Col>
                                            <Col xl={4} lg={4} md={6} sm={12}>
                                                <Controller
                                                    as={
                                                        <SelectComponent
                                                            label="Policy Number"
                                                            placeholder="Select Policy Number"
                                                            required={false}
                                                            isRequired={true}
                                                            // options={_Events}
                                                            options={PolicyNumberResponse?.data?.data?.map((item) => ({
                                                                id: item?.id,
                                                                label: item?.number,
                                                                value: item?.id,
                                                            }))}
                                                        />
                                                    }
                                                    control={control}
                                                    name="policyno"
                                                    error={errors && errors.policyno?.id}
                                                />
                                                {!!errors?.policyno?.id && <Error>{errors?.policyno?.id?.message}</Error>}
                                            </Col>
                                        </>
                                    }
                                    <Col xl={4} lg={4} md={6} sm={12}>
                                        <Controller
                                            as={
                                                <SelectComponent
                                                    label="Template"
                                                    placeholder="Select Template"
                                                    required={false}
                                                    isRequired={true}
                                                    // options={_Events}
                                                    options={allEmailTemplate?.map((item) => ({
                                                        id: item?.id,
                                                        label: item?.name,
                                                        value: item?.id,
                                                    }))}
                                                />
                                            }
                                            name="template_id"
                                            control={control}
                                            error={errors && errors.template_id?.id}
                                        />
                                        {!!errors?.template_id?.id && <Error>{errors?.template_id?.id?.message}</Error>}
                                    </Col>
                                    {!!templateId &&
                                        <Col xl={4} lg={4} md={6} sm={12}>
                                            <Controller
                                                as={
                                                    <Select
                                                        label="Frequency"
                                                        placeholder="Select Frequency"
                                                        required={false}
                                                        isRequired={true}
                                                        // options={_Events}
                                                        options={_frequency}
                                                    />
                                                }
                                                name="frequency_id"
                                                control={control}
                                                defaultValue={""}
                                                error={errors && errors.frequency_id}
                                            />
                                            {!!errors?.frequency_id && <Error>{errors?.frequency_id?.message}</Error>}
                                        </Col>
                                    }
                                </>
                            }
                        </Row>
                    }
                    <Row>
                        {_typeid &&
                            <Col md={12} lg={12} xl={12} sm={12} className="d-flex justify-content-end mt-4">
                                <Button type="submit">
                                    Submit
                                </Button>
                            </Col>
                        }
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalComponent;
