import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import swal from "sweetalert";

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button, Input } from '../../../components';
import { useForm, Controller } from "react-hook-form";

import { CustomControl } from "modules/user-management/AssignRole/option/style";

import { useDispatch, useSelector } from 'react-redux';
import { success, UpdateQuery, clear } from "../help.slice";
// import { useParams } from "react-router";
import { insurer } from 'config/validations'

const validation = insurer.query_complaint

export const QueryReplyModal = ({ show, onHide, id, replyText }) => {

    const { control, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const { UpdateQuerysuccess, error } = useSelector((state) => state.help);
    // const { userType } = useParams();

    useEffect(() => {
        if (UpdateQuerysuccess) {
            dispatch(success(UpdateQuerysuccess));
            // resetValues();
            onHide()

        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateQuerysuccess, error])


    const onSubmit = (data) => {
        if (id) {
            const { action, status } = data;
            const formData = new FormData();
            formData.append(`action`, action);
            formData.append(`status`, status || "1");
            formData.append("_method", "PATCH");
            dispatch(UpdateQuery(id, formData))
        }
    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Head>Query Reply</Head>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="d-flex flex-wrap">
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <Controller
                                as={<Input
                                    label="Reply"
                                    type="textarea"
                                    maxLength={validation.reply}
                                    placeholder="Enter Reply Here"
                                    required />}
                                defaultValue={replyText}
                                name="action"
                                control={control}
                            />
                        </Col>
                        <Col md={12} lg={12} xl={12} sm={12} className="mx-auto">
                            <div className="d-flex justify-content-around flex-wrap p-2">
                                <Controller
                                    as={<CustomControl className="d-flex mt-4" >
                                        <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Query Resolved'}</h5>
                                        <input name={'status'} type={'radio'} value={0} />
                                        <span style={{ top: "-2px" }}></span>
                                    </CustomControl>}
                                    name={'status'}
                                    control={control}
                                />
                                <Controller
                                    as={<CustomControl className="d-flex mt-4" >
                                        <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Query Not Resolved'}</h5>
                                        <input name={'status'} type={'radio'} value={1} defaultChecked />
                                        <span style={{ top: "-2px" }}></span>
                                    </CustomControl>}
                                    name={'status'}
                                    control={control}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row >
                        <Col md={12} className="d-flex justify-content-center mt-4">
                            <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal >
    );
}

// PropTypes 
QueryReplyModal.propTypes = {
    props: PropTypes.object
}

// DefaultTypes
QueryReplyModal.defaultProps = {
    props: { onHide: () => { } }
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
