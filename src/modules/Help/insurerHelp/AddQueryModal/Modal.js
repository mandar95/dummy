import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Form, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Select } from "../../../../components";
import swal from "sweetalert";
import { AttachFile2 } from 'modules/core';
import _ from 'lodash';


import {
    getQueryType, getQuerySubType, createInsOrgQueries, setEmployeeQuery, setEmployeeSubQuery, setEmployeeComments, help, createOrgQueries
} from '../../help.slice'

import { common_module } from 'config/validations'
import { TextInput } from "../../../RFQ/plan-configuration/style";

const validation = common_module.help

export const AddQuery = ({ show, onHide, userType }) => {
    const dispatch = useDispatch();

    const {
        employee_query_type,
        employee_query_subtype,
        employee_query,
        employee_subQuery,
        employee_comments,
    } = useSelector(help);


    const { control, handleSubmit, register } = useForm({
    });


    useEffect(() => {
        //  dispatch(getPolicySubTypeAcronym());
        dispatch(getQueryType());
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!!employee_query) {
            dispatch(getQuerySubType({ query_id: employee_query }));
        }
        // eslint-disable-next-line
    }, [employee_query])



    const onSubmit = (data) => {
        if (!employee_query || !employee_subQuery || !employee_comments) {
            swal('Required', "All inputs required", "info");
            return;
        }
        const formData = new FormData();
        formData.append("query_type_id", employee_query);
        formData.append("query_sub_type_id", employee_subQuery);
        formData.append("comments", employee_comments);
        !_.isEmpty(data?.document_type) && formData.append("document", data.document_type[0]);

        if (userType === "broker") {
            dispatch(createOrgQueries(formData));
        }
        else {
            dispatch(createInsOrgQueries(formData));
        }

        onHide()
        //dispatch(updateTATQuery({ ...data, id: filterData[0]?.id }))
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Add Query</Modal.Title>
            </Modal.Header>
            <Modal.Body className="">
                <Form onSubmit={handleSubmit(onSubmit)}>

                    <Row>
                        <div className="col-lg-6 col-md-12 ">
                            <Select
                                label="Query Type"
                                id={"1"}
                                options={employee_query_type}
                                name={'queryType'}
                                value={employee_query}
                                placeholder={'Select Query Type'}
                                onChange={(e) => { dispatch(setEmployeeQuery(e.target.value)) }}
                            />
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <Select
                                label="Sub Type"
                                id={"2"}
                                options={employee_query_subtype}
                                name={'subType'}
                                value={employee_subQuery}
                                placeholder={'Select Sub Type'}
                                onChange={(e) => { dispatch(setEmployeeSubQuery(e.target.value)) }}
                            />
                        </div>
                    </Row>
                    <Row>

                        <div className="col-lg-12 col-md-12 mt-3">
                            <div style={
                                {
                                    position: 'absolute',
                                    right: '15px',
                                    top: '-20px',
                                    background: '#e2e2e2',
                                    padding: '0px 5px',
                                    borderRadius: '3px'
                                }
                            }>
                                {`${employee_comments.length} / ${validation.text.length}`}
                            </div>
                            <TextInput
                                maxLength={validation.text.length}
                                className='form-control'
                                placeholder='Enter Comment Here...'
                                required
                                name="action"
                                value={employee_comments}
                                onChange={(e) => { dispatch(setEmployeeComments(e.target.value)) }}
                            />
                            <label className='form-label'>
                                <span className='span-label'>Comment</span>
                            </label>
                        </div>
                    </Row>
                    <Row>
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <div className="p-2">
                                <AttachFile2
                                    fileRegister={register}
                                    control={control}
                                    defaultValue={""}
                                    name="document_type"
                                    title="Attach File"
                                    key="premium_file"
                                    accept={".pdf,.png,.jpeg,.jpg"}
                                    // resetValue={resetFile}
                                    description="File Formats: (.png .jpeg .jpg .pdf)"
                                    nameBox
                                />
                                {/* {!!errors?.document_type && <Error>{errors?.document_type?.message}</Error>} */}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>

                </Form>
            </Modal.Body>
        </Modal>
    );
}

