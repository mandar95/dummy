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
import { insurer } from 'config/validations';

import { help, sampleFile, clearSampleURL } from 'modules/Help/help.slice'
import { getCity, selectCity, createRegionMapping, createBulkRegionMapping, updateRegionMapping } from '../user.slice';
import { downloadFile } from 'utils';

const validation = insurer.faq

const AddRegionMapping = ({ show, onHide, stateData, _currentUser, _editData, _broker, _ic }) => {
    const dispatch = useDispatch();
    const { sampleURL } = useSelector(help);
    const { globalTheme } = useSelector(state => state.theme)
    const cities = useSelector(selectCity);
    const [file, setFile] = useState();
    const [_cities, set_cities] = useState([]);

    const validationSchema = yup.object().shape({
        ...(!show.isBulkUpload && {
            name: yup.string()
                .required("Please Enter region Name")
                .min(2, "Please enter a region name more than 2 character")
                .matches(/^[a-zA-Z0-9\s]+$/, "Only alphabets & numbers are allowed"),
            // state_id: yup.string().required("Please Select State"),
            // city_id: yup.string().required("Please Select City"),
        })
    })

    const { control, errors, handleSubmit, watch, register, setValue } = useForm({
        validationSchema,
        mode: "onChange",
        reValidateMode: "onChange"
    });

    let _stateId = watch('state_id')?.value;
    let _cityId = watch('city_id')?.value;

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
        if (_stateId) {
            dispatch(getCity({ state_id: Number(_stateId) }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_stateId])

    useEffect(() => {
        if (_editData && show.isEditData) {
            let _data = _editData.cities.map((item) => {
                return {
                    id: item.city_id,
                    city_name: item.city_name
                }
            })
            set_cities(_data);
        }
        else {
            set_cities([])
            setValue('name', '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_editData, show])

    const onAddCity = () => {
        if (Number(_cityId)) {
            const flag = cities?.find(
                (value) => value?.id === Number(_cityId)
            );
            const flag2 = _cities.some((value) => value?.id === Number(_cityId));
            if (flag && !flag2) set_cities((prev) => [...prev, flag]);
        }
    };

    const removeCity = (cityid) => {
        const filteredStates = _cities.filter((item) => item?.id !== cityid);
        set_cities((prev) => [...filteredStates]);
    }

    const onSubmit = (data) => {
        let _data = {}
        let BrokerID = _currentUser?.broker_id || _broker
        let ICID = _currentUser?.ic_id || _ic
        if (!show.isBulkUpload) {
            if (_cities.length > 0) {
                _data = {
                    name: data.name,
                    cities: _cities.map((item) => item.city_name),
                    ...(BrokerID && {
                        broker_id: BrokerID
                    }),
                    ...(ICID && {
                        ic_id: ICID
                    }),
                }
                if (!show.isEditData) {
                    dispatch(createRegionMapping(_data))
                }
                else {
                    dispatch(updateRegionMapping({ ..._data, _method: 'PATCH' }, _editData.id))
                }
                onHide();
            }
            else {
                swal("Please add at least one city", "", "warning")
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
            dispatch(createBulkRegionMapping(formData))
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
                    {show.isEditData ? 'Edit Region' : 'Add Region'}
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
                                            label="Region Name"
                                            placeholder="Enter Region Name"
                                            required={false}
                                            isRequired={true}
                                        />}
                                        name="name"
                                        control={control}
                                        error={errors && errors.name}
                                        defaultValue={_editData?.name}
                                    />
                                    {!!errors?.name && <Error>{errors?.name?.message}</Error>}

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
                                        error={errors && errors.state_id}
                                    />
                                    {!!errors?.state_id && <Error>{errors?.state_id?.message}</Error>}
                                </div>
                                <div className="p-2">
                                    <Controller
                                        as={<SelectComponent
                                            label="Select City"
                                            placeholder="Select City"
                                            required={false}
                                            isRequired={true}
                                            options={cities?.map((item) => ({
                                                id: item?.id,
                                                label: item?.city_name,
                                                value: item?.id,
                                            }))}
                                        />}
                                        name="city_id"
                                        control={control}
                                        error={errors && errors.city_id}
                                    />
                                    {!!errors?.city_id && <Error>{errors?.city_id?.message}</Error>}
                                    <div style={{ display: "flex", paddingBottom: "10px" }}>
                                        <div className="p-2">
                                            <Button type="button" onClick={onAddCity}>
                                                <i className="ti ti-plus"></i> Add
                                            </Button>
                                        </div>
                                    </div>
                                    {_cities.length ? (
                                        <BenefitList>
                                            {_cities.map((item) => {
                                                return (
                                                    <Chip
                                                        key={'Cities' + item?.id}
                                                        id={item?.id}
                                                        name={item?.city_name}
                                                        onDelete={removeCity}
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
                                                        {"Add into existing regional mapping"}
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
                                        onClick={() => dispatch(sampleFile("56"))}
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

export default AddRegionMapping;

