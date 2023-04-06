import React, { useEffect } from "react";

import { Modal, Row, Col } from "react-bootstrap";
import { Button, Input, Select, Error } from "components";
import { Head } from "../plan-configuration/style";
import { Controller, useForm } from "react-hook-form";
import { updateUWQuote } from "../rfq.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    age_group: yup.string().required('Please select age group'),
    sum_insured: yup.string().required('Please select sum insured'),
    no_of_employees: yup.string().required('No .of employee required'),
});

export const EditModal = ({ show, onHide, Data, qouteData }) => {
    const dispatch = useDispatch();
    const { sumInsuredData, ageGroupData } = useSelector(state => state.RFQHome);
    const { control, handleSubmit, setValue, errors } = useForm({
        // defaultValues: {
        // 	status: Data.status === "Open" ? 0 : 1,
        // 	deficiency_remarks: Data.deficiency_remarks,
        // },
        validationSchema
    });

    useEffect(() => {
        if (!_.isEmpty(Data)) {
            setValue('sum_insured', Data.sum_insured)
            setValue('no_of_employees', Data.no_of_employees)
            setValue('age_group', getAgeGroup(Data.max_age, ageGroupData))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Data])

    const onSubmit = (data) => {
        let _minMax = ageGroupData.filter((item) => Number(item.id) === Number(data.age_group))[0].name.split('-')
        const _response = {
            id: Data.id,
            min_age: Number(_minMax[0]),
            max_age: Number(_minMax[1]),
            no_of_employees: data.no_of_employees,
            sum_insured: data.sum_insured,
        }
        dispatch(updateUWQuote({ rfq_age_demography: [_response], id: qouteData.id, }))
        onHide()
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Head>
                        {`Update Demography`}
                    </Head>
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className="text-center mr-5 ml-5">
                    <Row className="d-flex justify-content-center flex-wrap">
                        {(
                            <>
                                <Col md={6} lg={5} xl={4} sm={12}>
                                    <Controller
                                        as={
                                            <Select
                                                label="Age Group"
                                                placeholder="Age Group"
                                                required={false}
                                                isRequired={true}
                                                options={ageGroupData.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                }))}
                                            />}
                                        defaultValue={""}
                                        control={control}
                                        name="age_group"
                                        error={errors && errors.age_group}
                                    />
                                    {!!errors?.age_group && <Error className="mt-0">{errors?.age_group?.message}</Error>}
                                </Col>
                                <Col md={6} lg={5} xl={4} sm={12}>
                                    <Controller
                                        as={
                                            <Select
                                                label="Sum Insured"
                                                placeholder="Sum Insured"
                                                required={false}
                                                isRequired={true}
                                                options={sumInsuredData.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.name,
                                                }))}
                                            />}
                                        defaultValue={""}
                                        control={control}
                                        name="sum_insured"
                                        error={errors && errors.sum_insured}
                                    />
                                    {!!errors?.sum_insured && <Error className="mt-0">{errors?.sum_insured?.message}</Error>}
                                </Col>
                                <Col md={6} lg={5} xl={4} sm={12}>
                                    <Controller
                                        as={
                                            <Input
                                                label="No Of Employees"
                                                placeholder="Enter No Of Employees"
                                                required={false}
                                                isRequired={true}
                                            />
                                        }
                                        name="no_of_employees"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.no_of_employees}
                                    />
                                    {!!errors?.no_of_employees && <Error className="mt-0">{errors?.no_of_employees?.message}</Error>}
                                </Col>
                            </>
                        )}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Save</Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

const getAgeGroup = (maxAge, ageGroupData) => {
    const _ageGroup = ageGroupData?.filter((item) => maxAge === Number(item.name.split("-")[1]))
    return _ageGroup.length > 0 ? _ageGroup[0].id : 0
}
