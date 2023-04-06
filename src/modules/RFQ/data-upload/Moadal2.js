import React from 'react';
import * as yup from 'yup';
import { useLocation } from "react-router";
import { Modal, Row, Col } from 'react-bootstrap';
import { Error } from 'components';
import { useForm } from "react-hook-form";
import { CloseButton } from './style';
import { Input } from "../components";
import { Button, Title } from '../select-plan/style';
import { inviteMember } from '../home/home.slice';

const validationSchema = yup.object().shape({
    name: yup.string().required('Name Required'),
    mail_to: yup.string().email().required('Email ID Required'),
    designation: yup.string().required('Designation Required'),
});


export const InviteTeamModal = ({ show, onHide, dispatch, id }) => {
    const location = useLocation();
    const { errors, register, handleSubmit } = useForm({
        validationSchema,
    });

    const onSubmit = (data) => {
        dispatch(inviteMember({
            ...data,
            lead_id: id,
            url: `http://ebfront.fynity.in/${location.pathname}${location.search}`
        }));
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal">

            <Modal.Body className="">
                <CloseButton onClick={onHide}>×</CloseButton>
                <Title fontSize="1.7rem" className='mb-5 mt-0'>{`Invite member`}</Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="d-flex flex-wrap" >
                        <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>
                            <Input
                                label="Mail To"
                                name="mail_to"
                                type="email"
                                inputRef={register}
                                isRequired={true}
                                error={errors?.mail_to}

                            />
                            {!!errors?.mail_to && <Error top='4px'>{errors?.mail_to?.message}</Error>}
                        </Col>
                        <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>
                            <Input
                                label="Name"
                                name="name"
                                type="text"
                                inputRef={register}
                                isRequired={true}
                                error={errors?.name}

                            />
                            {!!errors?.name && <Error top='4px'>{errors?.name?.message}</Error>}
                        </Col>
                        <Col md={4} lg={4} xl={4} sm={12} className='mb-3'>
                            <Input
                                label="Designation"
                                name="designation"
                                type="text"
                                inputRef={register}
                                isRequired={true}
                                error={errors?.designation}

                            />
                            {!!errors?.designation && <Error top='4px'>{errors?.designation?.message}</Error>}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-center mt-4">
                            <Button width={"190px"}
                                padding="15px"
                                fontSize='1.5rem' type='submit'>
                                {`Add`}
                                {/* <i className="fa fa-plus" aria-hidden="true" /> */}
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal >
    );
}

