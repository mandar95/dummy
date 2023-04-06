import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, Error } from "../../components";
import * as yup from 'yup';


import {
    success, updateTATQuery, clear
} from "./TATConfig.slice";



export const TATModal = ({ show, onHide, Data }) => {
    const dispatch = useDispatch();
    const { TATQueryUpdated, AllTATQueryData } = useSelector((state) => state.TATConfig);
    const [filterData, setFilterData] = useState([])


    const validationSchema = yup.object().shape({
        status: yup.string().required("Please select status")
            .max(20, 'Maximum 20 character available'),
        duration: yup.number().required("Please enter time"),
        duration_unit: yup.string().required("Please select unit type"),
    })

    const { control, errors, handleSubmit, setValue } = useForm({
        validationSchema,
    });

    useEffect(() => {
        if (Data) {
            let filterData = AllTATQueryData.filter((item) => item.id === Data)
            setFilterData(filterData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Data])

    useEffect(() => {
        if (filterData?.length > 0)
            setValue('status', filterData[0]?.status)
        setValue('duration', filterData[0]?.duration)
        setValue('duration_unit', filterData[0]?.duration_unit)
        setValue('color_code', filterData[0]?.color_code)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterData])

    useEffect(() => {
        if (TATQueryUpdated) {
            dispatch(success(TATQueryUpdated));
            onHide();
        }

        return () => {
            dispatch(clear("TATQuery"));
        };
        //eslint-disable-next-line
    }, [TATQueryUpdated]);


    const onSubmit = (data) => {
        dispatch(updateTATQuery({ ...data, id: filterData[0]?.id }))
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Edit TAT Config Query</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mx-auto p-5">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Row xs={1} sm={2} md={2} lg={2} xl={2}>
                            <div className="p-2">
                                <Controller
                                    as={<Input label="Status" type="text" placeholder="Status" required={false}
                                        isRequired={true} />}
                                    name="status"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.status}
                                />
                                {!!errors?.status && <Error>{errors?.status?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={<Input label="Time" type="number" placeholder="Time" required={false}
                                        isRequired={true} />}
                                    name="duration"
                                    min={1}
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.duration}
                                />
                                {!!errors?.duration && <Error>{errors?.duration?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Time(Unit)"
                                            placeholder="Unit"
                                            options={[
                                                { id: 0, name: "Minutes", value: 'Minutes' },
                                                { id: 1, name: "Hours", value: 'Hours' },
                                                { id: 2, name: "Days", value: 'Days' },
                                            ]}
                                            required={false}
                                            isRequired={true}
                                        />
                                    }
                                    defaultValue={""}
                                    name="duration_unit"
                                    error={errors && errors.duration_unit}
                                    control={control}
                                />
                                {!!errors?.duration_unit && <Error>{errors?.duration_unit?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={<Input label="color" type="color" />}
                                    name="color_code"
                                    control={control}
                                    defaultValue={'black'}
                                />
                            </div>
                        </Row>
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
        </Modal >
    );
}

