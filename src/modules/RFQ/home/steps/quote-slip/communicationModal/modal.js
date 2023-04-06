import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Row, Col } from 'react-bootstrap';
import { RFQButton } from 'components';
import { useForm } from "react-hook-form";
import { CloseButton } from 'modules/RFQ/data-upload/style';
import { Input } from "modules/RFQ/components/index";
import { Title } from 'modules/RFQ/select-plan/style';
import { numOnly, noSpecial } from 'utils'
import "./modal.css";
import { sendQuoteEmail } from '../../../home.slice';
import styled from "styled-components";

const TitleDiv = styled(Row)`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};

letter-spacing: 1px;
margin-bottom: 35px;

@media (max-width:767px){
    justify-content:center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
}
`

const IMG = styled.img`
@media (max-width:991px){
    width: 254px;
    height: 100%;
}
`;
const InputDiv = styled(Col)`
@media (max-width:991px){
    margin: 0px 15px;
}
`
// const validationSchema = yup.object().shape({
//     name: yup.string().required('Name Required'),
//     mail_to: yup.string().email().required('Email ID Required'),
//     designation: yup.string().required('Designation Required'),
// });


export const CommunicationModal = ({ show, onHide, isEmail, quote_id, broker_id }) => {
    const dispatch = useDispatch();
    const { errors, register, handleSubmit } = useForm({
        //validationSchema,
    });

    const onSubmit = (data) => {
        if (isEmail) {
            dispatch(sendQuoteEmail({
                email_to: data.email_id,
                quote_id,
                broker_id
            }))
        }
        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal2">

            <Modal.Body className="">
                <CloseButton onClick={onHide}>×</CloseButton>
                <Title style={{ marginLeft: '10px' }} fontSize="1.7rem" className='mb-5 mt-0'>{isEmail ? 'Mail' : 'Whatsapp'}</Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TitleDiv className="d-flex flex-wrap">
                        <span style={{
                            marginLeft: '25px'
                        }}>{/* Hey Mandar */}Hey,  </span>&nbsp;<span>{`${isEmail ? `please share E-mail Address` : `please share mobile number`} `}</span>
                    </TitleDiv>
                    <Row>
                        <Col md={12} lg={4} xl={4} sm={12} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <IMG
                                src={isEmail ? "/assets/images/QCR/mail-vector.png" : "/assets/images/QCR/WhatsApp-vector.png"}
                                alt="bck"
                                height="90%"
                                width="100%"
                            />
                        </Col>
                        <InputDiv md={12} lg={8} xl={8} sm={12} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around'
                        }}>
                            <Row style={{ marginBottom: '25px' }}>
                                {isEmail ? <Input
                                    label="E-mail ID"
                                    name="email_id"
                                    id="email_id"
                                    maxLength="50"
                                    placeholder="Enter email id"
                                    autoComplete="none"
                                    inputRef={register}
                                    defaultValue={""}
                                    isRequired={true}
                                    required={false}
                                    error={errors?.name}
                                    style={{
                                        width: '90%',
                                        minHeight: '70px'
                                    }}
                                /> :
                                    <Input
                                        label="Mobile Number"
                                        name="contact_no"
                                        id="contact_no"
                                        placeholder="Enter mobile number"
                                        maxLength="10"
                                        onKeyDown={numOnly} onKeyPress={noSpecial}
                                        type='tel'
                                        autoComplete="none"
                                        inputRef={register}
                                        defaultValue={""}
                                        isRequired={true}
                                        required={false}
                                        error={errors?.contact_no}
                                        style={{
                                            width: '90%',
                                            minHeight: '70px'
                                        }}
                                    />
                                }
                            </Row>
                            <Row>
                                <RFQButton>
                                    Share
                                    <i className="fa fa-share" aria-hidden="true" />
                                </RFQButton>
                            </Row>
                        </InputDiv>
                    </Row>
                </form>
            </Modal.Body>
        </Modal >
    );
}

