import React from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
// import swal from "sweetalert";
import styled from 'styled-components';
// import _ from "lodash";
import { DatePicker, Button, Error } from "../../../components";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { format } from 'date-fns'

import "./modal.css";

import { StatusWise } from "./dashboard_customer.slice";



const CloseButton = styled.button`
    position: absolute;
    top: -15px;
    right: -10px;
    display: flex;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    color: #515151;
    text-shadow: none;
    opacity: 1;
    box-shadow: 0px 4px 20px 0px #00000080;
    z-index: 1;
    border: 1px solid #ffffff;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.7rem + ${fontSize - 92}%)` : '1.7rem'};
    
    background: white;
    &:focus{
        outline:none;
    }
`


const EditModal = (props) => {

    const dispatch = useDispatch();

    const validationSchema = yup.object().shape({
        till_date: yup.string().required("Please enter Till Date"),
        from_date: yup.string().required("Please enter From Date"),
    });
    const { control, errors, handleSubmit } = useForm({
        validationSchema,
    });

    const onSubmit = ({ till_date, from_date }) => {
        let resp = {
            till_date: till_date,
            from_date: from_date,
            type: 'custom',
        };
        switch (parseInt(props.id)) {
            case 1:
                dispatch(StatusWise(resp));
                break;
            case 2:
                //dispatch(StatusWise(resp));
                break;
            case 3:
                //dispatch(ActivityWise(resp));
                break;
            default:

        }
        props.onHide();
    };


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="my-modal"
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header style={{ border: 'none' }}>
                    <Modal.Title id="contained-modal-title-vcenter"><i className="fa fa-filter"></i> <span className="ml-2">Filter</span></Modal.Title>
                </Modal.Header>
                <CloseButton onClick={props.onHide}>×</CloseButton>
                <Modal.Body>
                    <Row>
                        <Col md={12} lg={6} xl={6} sm={6}>
                            <div className="p-2">
                                <Controller
                                    as={
                                        <DatePicker
                                            name={'from_date'}
                                            label={'Date Range From'}
                                            required={false}
                                            isRequired={true}
                                        />
                                    }
                                    error={errors?.from_date}
                                    onChange={([selected]) => {
                                        return selected ? format(selected, 'dd-MM-yyyy') : '';
                                    }}
                                    name="from_date"
                                    control={control}
                                />
                                {!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
                            </div>
                        </Col>
                        <Col md={12} lg={6} xl={6} sm={6}>
                            <div className="p-2">
                                <Controller
                                    as={
                                        <DatePicker
                                            name={'till_date'}
                                            label={'Date Range To'}
                                            required={false}
                                            isRequired={true}
                                        />
                                    }
                                    error={errors?.till_date}
                                    onChange={([selected]) => {
                                        return selected ? format(selected, 'dd-MM-yyyy') : '';
                                    }}
                                    name="till_date"
                                    control={control}
                                />
                                {!!errors?.till_date && <Error>{errors?.till_date?.message}</Error>}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{ border: 'none', padding: '10px', background: '#e3e3e3', display: 'flex', justifyContent: 'center' }}>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end">
                            <Button type="submit">
                                Save
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditModal;
