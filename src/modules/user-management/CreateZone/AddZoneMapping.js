/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import { Input, Error, Chip, SelectComponent } from "../../../components";
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import { AttachFile } from "modules/core";
import { AnchorTag } from "modules/policies/steps/premium-details/styles";
import { BenefitList } from "modules/announcements/style"
import * as yup from 'yup';
import swal from 'sweetalert';
import { insurer } from 'config/validations'

import { help, sampleFile, clearSampleURL } from 'modules/Help/help.slice'
import { createZonalMapping, createBulkZonalMapping, updateZonalMapping } from '../user.slice';
import { downloadFile } from 'utils';

const validation = insurer.faq

const AddZoneMapping = ({ show, onHide, stateData, _currentUser, _editData, _broker, _ic }) => {
    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)
    const { sampleURL } = useSelector(help);
    const [file, setFile] = useState();
    const [_states, setStates] = useState([]);

    const validationSchema = yup.object().shape({
        ...(!show.isBulkUpload && {
            zone_name: yup.string()
                .min(2, "Please enter a zone name more than 2 character")
                .required("Please Enter Zone Name")
                .matches(/^[a-zA-Z0-9\s]+$/, "Only alphabets & numbers are allowed"),
            // state_id: yup.string().required("Please Select State"),
        })
    })

    const { control, errors, handleSubmit, watch, register, setValue } = useForm({
        validationSchema,
        mode: "onChange",
        reValidateMode: "onChange"
    });

    let _stateId = watch('state_id')?.value;

    useEffect(() => {
        if (sampleURL) {
            downloadFile(sampleURL);
            swal({
                title: "Downloading",
                text: "Sample Format",
                timer: 2000,
                button: false,
                icon: "info",
            });
        }
        return () => {
            dispatch(clearSampleURL());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sampleURL]);

    useEffect(() => {
        if (_editData && show.isEditData) {
            let _data = _editData.state_mapping.map((item) => {
                return {
                    id: item.state_id,
                    state_name: item.state_name
                }
            })
            setStates(_data);
        }
        else {
            setStates([]);
            setValue('zone_name', '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_editData, show])


    const onAddState = () => {
        if (Number(_stateId)) {
            const flag = stateData?.find(
                (value) => value?.id === Number(_stateId)
            );
            const flag2 = _states.some((value) => value?.id === Number(_stateId));
            if (flag && !flag2) setStates((prev) => [...prev, flag]);
        }
    };

    const removeState = (state_id) => {
        const filteredStates = _states.filter((item) => item?.id !== state_id);
        setStates((prev) => [...filteredStates]);
    }

    const onSubmit = (data) => {
        let _data = {}
        let BrokerID = _currentUser?.broker_id || _broker
        let ICID = _currentUser?.ic_id || _ic
        if (!show.isBulkUpload) {
            if (_states.length > 0) {
                _data = {
                    zone_name: data.zone_name,
                    state_id: _states.map((item) => item.id),
                    ...(BrokerID && {
                        broker_id: BrokerID
                    }),
                    ...(ICID && {
                        ic_id: ICID
                    }),
                }
                if (!show.isEditData) {
                    dispatch(createZonalMapping(_data))
                }
                else {
                    dispatch(updateZonalMapping({ ..._data, _method: 'PATCH' }, _editData.id))
                }
                onHide();
            } else {
                swal("Please add at least one state", "", "warning")
            }
        }
        else {
            const formData = new FormData();
            if (BrokerID) {
                formData.append("broker_id", BrokerID);
            }
            if (ICID) {
                formData.append("ic_id", ICID);
            }
            formData.append("file", file);
            formData.append("override", data.override || '1');
            dispatch(createBulkZonalMapping(formData))
            onHide();
        }
    };

    return (
        <Modal
            show={show.isShow}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {show.isEditData ? 'Edit Zone' : 'Add Zone'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {!show?.isBulkUpload ?
                            <Row xs={1} sm={1} md={1} lg={1} xl={1}>
                                <div className="p-2">
                                    <Controller
                                        as={<Input
                                            label="Zone Name"
                                            placeholder="Enter Zone Name"
                                            required={false}
                                            isRequired={true}
                                        />}
                                        name="zone_name"
                                        control={control}
                                        error={errors && errors.zone_name}
                                        defaultValue={_editData?.name}
                                    />
                                    {!!errors?.zone_name && <Error>{errors?.zone_name?.message}</Error>}

                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={<SelectComponent
                                            label="Select State"
                                            placeholder="Select State"
                                            required={false}
                                            isRequired={true}
                                            options={stateData?.map((item) => ({
                                                id: item?.id,
                                                label: item?.state_name,
                                                value: item?.id,
                                            }))}
                                        />}
                                        name="state_id"
                                        control={control}
                                        error={errors && errors.state_id?.id}
                                    />
                                    {!!errors?.state_id?.id && <Error>{errors?.state_id?.id?.message}</Error>}
                                    <div style={{ display: "flex", paddingBottom: "10px" }}>
                                        <div className="p-2">
                                            <Button type="button" onClick={onAddState}>
                                                <i className="ti ti-plus"></i> Add
                                            </Button>
                                        </div>
                                    </div>
                                    {_states.length ? (
                                        <BenefitList>
                                            {_states.map((item) => {
                                                return (
                                                    <Chip
                                                        key={'states' + item?.id}
                                                        id={item?.id}
                                                        name={item?.state_name}
                                                        onDelete={removeState}
                                                    />
                                                );
                                            })}
                                        </BenefitList>
                                    ) : null}
                                </div>
                            </Row> :
                            <Row className="d-flex flex-wrap">
                                <Col
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    sm={12}
                                    className="text-left"
                                    style={{ border: "1.5px dotted #0093ff", borderRadius: "10px" }}
                                >
                                    <div className="d-flex justify-content-around flex-wrap p-2">
                                        <Controller
                                            as={
                                                <CustomControl className="d-flex mt-4">
                                                    <h5 className="m-0" style={{ paddingLeft: "33px" }}>
                                                        {"Overwrite file"}
                                                    </h5>
                                                    <input name={"override"} type={"radio"} value={1} defaultChecked />
                                                    <span style={{ top: "-2px" }}></span>
                                                </CustomControl>
                                            }
                                            name={"override"}
                                            control={control}
                                        />
                                        <Controller
                                            as={
                                                <CustomControl className="d-flex mt-4">
                                                    <h5 className="m-0" style={{ paddingLeft: "33px" }}>
                                                        {"Add into existing zonal mapping"}
                                                    </h5>
                                                    <input name={"override"} type={"radio"} value={0} />
                                                    <span style={{ top: "-2px" }}></span>
                                                </CustomControl>
                                            }
                                            name={"override"}
                                            control={control}
                                        />
                                    </div>
                                    <AttachFile
                                        name="document_type"
                                        title="Attach File"
                                        key="premium_file"
                                        {...validation.file}
                                        control={control}
                                        fileRegister={register}
                                        onUpload={(files) => setFile(files[0])}
                                        nameBox
                                        required
                                    />
                                    <AnchorTag href={"#"}
                                        onClick={() => dispatch(sampleFile('55'))}
                                    >
                                        <i
                                            className="ti-cloud-down attach-i"
                                            style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                                        ></i>
                                        <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                                            Download Sample Format
                                        </p>
                                    </AnchorTag>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col md={12} className="d-flex justify-content-end mt-4">
                                <Button type="submit">
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddZoneMapping;

