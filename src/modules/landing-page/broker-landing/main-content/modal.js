import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Col } from "react-bootstrap";
import styled from 'styled-components';
import { Error } from "components"
import "./modal.css";
import swal from "sweetalert";
import { numOnly, noSpecial } from 'utils'

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import {
    generateOTP, verfiyOTP, clear,
    // resendOTP,
} from "modules/RFQ/home/home.slice";

const CloseButton = styled.button`
position: absolute;
top: 15px;
right: 15px;
display: flex;
justify-content: center;
width: 35px;
height: 35px;
border-radius: 50%;
color: #232222;
text-shadow: none;
opacity: 1;
z-index: 1;
border: 1px solid #bfbfbf;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.7rem + ${fontSize - 92}%)` : '1.7rem'};

background: white;
    &:focus{
        outline:none;
    }
`
const ModalRightContentDiv = styled.div`
margin-bottom: 25px;
display:flex;
justify-content:center;
@media (max-width: 991px) {
& .OTPDiv{
    margin-left:0px !important;
    }
}
& h2{
    
}
& p{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    color: #4e4d4d;
    line-height: 1.8rem;
    word-spacing: 1px;
}
& input {
    height: 60px;
    width: 60px;
    margin-right:25px;
    
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    border:none;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 6px 1px, rgb(0 0 0 / 5%) 1px 1px 0px 0px;
    @media (max-width: 991px) {
        margin-right:10px;
    }
}
& .OTPDiv{
    margin-left:55px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    cursor: pointer;
}
`
// const ModalLeftContentDiv = styled(Col)`   
//     padding-left: 0px;
//     margin-top: -30px;
//     & img {
//       width: 280px
//     }
//     @media (max-width: 991px) {
//         display: flex;
//         justify-content: center
//     }
// `
const ButtonDiv = styled.button`
    background-color: #1bf29e !important;
    color: #fff;
    padding: 0px !important;
    display: flex;
    width: 100% !important;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    
    text-align: center;
    height: 55px;
    border: none;
    border-radius: 10px;
    outline: none;
    justify-content: center;

`
const BackBtn = styled.i`
color: #6d6d6d;
line-height: 30px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(; + ${fontSize - 92}%)` : ';'};
`

const OTPEditModal = (props) => {
    const { globalTheme } = useSelector(state => state.theme)
    const dispatch = useDispatch();
    const history = useHistory();
    const { otpSuccess, error } = useSelector(state => state.RFQHome);

    // const [resendOtp, setResendOtp] = useState(false);
    const [mobileInput, setMobileInput] = useState({
        no: null,
        status: false,
        error: false,
        message: ''
    });
    const txt = useRef();
    const otp1 = useRef();
    const otp2 = useRef();
    const otp3 = useRef();
    const otp4 = useRef();

    const handleInput = (e) => {
        const no = e.target.value
        setMobileInput(prev => ({ ...prev, no: no }))
    }

    useEffect(() => {
        if (mobileInput.status) {
            otp1.current.focus();
        }
        else {
            txt.current.focus();
        }
    }, [mobileInput.status])

    useEffect(() => {
        if (error) {
            swal("Alert", error, "warning");
        };
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    useEffect(() => {
        if (otpSuccess) {
            history.push(`/company-details`)
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpSuccess])


    const generateOtp = () => {
        setMobileInput(prev => ({
            ...prev,
            status: (prev.no?.length === 10 &&
                prev.no.match(/[6-9]{1}[0-9]{9}$/) &&
                Number(prev.no) !== 9999999999) ? true : false,
            error: (prev.no?.length === 10 &&
                prev.no.match(/[6-9]{1}[0-9]{9}$/) &&
                Number(prev.no) !== 9999999999) ? false : true,
            message: prev.no?.length !== 10 ? 'Mobile No. should be 10 digits' :
                (!prev.no.match(/[6-9]{1}[0-9]{9}$/) ||
                    Number(prev.no) === 9999999999) ? 'Please enter valid mobile no.' : ''
        }))

        if (mobileInput.no?.length === 10 &&
            mobileInput.no.match(/[6-9]{1}[0-9]{9}$/) &&
            Number(mobileInput.no) !== 9999999999) {
            dispatch(generateOTP({
                contact_no: parseInt(`91${mobileInput.no}`)
            }))
        }
    }
    const verifyOtp = () => {
        if (otp1.current.value &&
            otp2.current.value &&
            otp3.current.value &&
            otp4.current.value) {
            dispatch(verfiyOTP({
                contact_no: parseInt(`91${mobileInput.no}`),
                otp: otp1.current.value + otp2.current.value
                    + otp3.current.value + otp4.current.value
            }))
        }
        else {
            swal("Please enter OTP", "", "warning");
        }
    }
    // const otpResend = () => {
    //     setResendOtp(true);
    //     dispatch(resendOTP({
    //         contact_no: parseInt(`91${mobileInput.no}`)
    //     }))
    //     setTimeout(() => {
    //         setResendOtp(false);
    //     }, 2000)
    // }
    const nextKey = (e) => {
        if (e.target.value) {
            if (e.target.name === 'otp1') {
                otp2.current.focus();
            }
            if (e.target.name === 'otp2') {
                otp3.current.focus();
            }
            if (e.target.name === 'otp3') {
                otp4.current.focus();
            }
        }
    }
    const numberOnly = (event) => {
        let key = event.keyCode || event.which;
        if (
            (key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105) ||
            key === 8 ||
            key === 9 ||
            key === 13 ||
            key === 16 ||
            key === 17 ||
            key === 20 ||
            key === 35 ||
            key === 35 ||
            key === 37 ||
            key === 39
            // key === 144
        ) {
            if ((key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105)) {
                if (event.target.name === 'otp1') {
                    otp1.current.value = event.key;
                }
                if (event.target.name === 'otp2') {
                    otp2.current.value = event.key;
                }
                if (event.target.name === 'otp3') {
                    otp3.current.value = event.key;
                }
                if (event.target.name === 'otp4') {
                    otp4.current.value = event.key;
                }
            }
        } else {
            event.preventDefault();
        }
    };
    const goToBack = () => {
        setMobileInput(prev => ({
            ...prev,
            no: prev.no,
            status: !prev.status
        }))
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modalnew"
        >
            <Modal.Body style={{ padding: '85px 30px 50px' }}>
                <CloseButton onClick={props.onHide}>×</CloseButton>
                {mobileInput.status &&
                    <CloseButton style={{ left: '19px' }} onClick={goToBack}><BackBtn className="fa fa-long-arrow-left" aria-hidden="true" /></CloseButton>
                }
                <Row>
                    <Col md={12} lg={12} xl={12} sm={12}>
                        <div>
                            {/* {mobileInput.status &&
                                <ModalRightContentDiv style={{ marginBottom: '25px' }}>

                                </ModalRightContentDiv>
                            } */}
                            <ModalRightContentDiv style={{ marginBottom: '25px' }}>
                                <h2>Login</h2>
                            </ModalRightContentDiv>
                            <div style={{ marginBottom: '25px' }}>
                                <input
                                    style={{ height: '55px', fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px' }}
                                    autoComplete={false} name="mob" autocomplete="off"
                                    maxLength="10"
                                    onKeyDown={numOnly} onKeyPress={noSpecial}
                                    type='tel'
                                    value={mobileInput.no}
                                    onChange={handleInput}
                                    required=""
                                    placeholder="Enter Mobile Number"
                                    ref={txt} />
                            </div>
                            {(mobileInput.error) && <Error>{mobileInput.message}</Error>}
                            {mobileInput.status &&
                                <ModalRightContentDiv>
                                    <input autoComplete={false} name="otp1" ref={otp1} maxLength="1" onKeyPress={nextKey} onKeyDown={numberOnly} />
                                    <input autoComplete={false} name="otp2" ref={otp2} maxLength="1" onKeyPress={nextKey} onKeyDown={numberOnly} />
                                    <input autoComplete={false} name="otp3" ref={otp3} maxLength="1" onKeyPress={nextKey} onKeyDown={numberOnly} />
                                    <input autoComplete={false} name="otp4" ref={otp4} maxLength="1" onKeyPress={nextKey} onKeyDown={numberOnly} />
                                </ModalRightContentDiv>
                            }
                            <ModalRightContentDiv>
                                <ButtonDiv>
                                    <div onClick={!mobileInput.status ? generateOtp : verifyOtp} style={{ height: '100%', padding: '0px 25px' }} className="d-flex justify-content-between align-items-center">
                                        {mobileInput.status ? 'LOGIN' : 'LOGIN WITH OTP'}
                                    </div>
                                </ButtonDiv>
                            </ModalRightContentDiv>
                            {/* <ModalRightContentDiv>
                                <div onClick={otpResend} className="OTPDiv">Resend OTP</div>
                            </ModalRightContentDiv>
                            <ModalRightContentDiv>
                                <div className={`otpSentMsg ${resendOtp ? 'resendShow' : ''}`}>OTP has been sent again</div>
                            </ModalRightContentDiv> */}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal >
    );
}
export default OTPEditModal;
