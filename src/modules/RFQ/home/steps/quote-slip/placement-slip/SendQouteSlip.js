import React from 'react';
import styled from 'styled-components';

import { Modal, Row, Col } from 'react-bootstrap';
import { Error, RFQButton } from 'components'

import { useForm } from "react-hook-form";
import { useParams } from 'react-router';
import { Input } from "modules/RFQ/components/index.js";

import { sendQouteSlip } from './qcr.action';
// import { OptionInput } from 'modules/enrollment/style.js'
import * as yup from "yup";


const validationSchema = yup.object().shape({
    email: yup.string()
        .email('Please enter valid email id')
        .required('Email id is required'),

});

export const SendQouteSlip = ({ show, onHide }) => {
    const { id } = useParams();

    const { register, handleSubmit, errors } = useForm({
        validationSchema
    });


    const onSubmit = (data) => {
        const _data = {
            quote_id: id ? id : show.id,
            email_to: data.email,
            ...show.type === 'final' && { is_final_quote: 1 }
        }
        sendQouteSlip(_data,onHide)
        
        // UploadFileApi(formData, 'insurer_cd_statement', payload, dispatch);

    }


    return (
        <Modal
            show={!!show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal2"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <Head>Send {show.type === 'final' && 'Final'} Qoute Slip</Head>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row className='d-flex justify-content-center m-1 p-2'>
                        <Col md={12} lg={12} xl={12} sm={12} className='mb-3'>
                            <Input
                                label="Email ID"
                                name="email"
                                id="email"
                                maxLength="50"
                                placeholder="Enter Email ID"
                                autoComplete="none"
                                inputRef={register}
                                defaultValue={""}
                                isRequired={true}
                                required={false}
                                error={errors?.email}
                            />
                            {!!errors?.email && <Error className="mt-0">{errors?.email?.message}</Error>}
                        </Col>
                        <Col
                            sm="12"
                            md="12"
                            lg="12"
                            xl="12"
                            className="mt-4 mb-5"
                        >
                            <RFQButton>
                                Send
                                <i className="fa fa-long-arrow-right" aria-hidden="true" />
                            </RFQButton>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal >
    );
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
`


