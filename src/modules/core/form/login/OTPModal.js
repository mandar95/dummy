import React, { useRef, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { RFQButton } from "components";
import "modules/RFQ/home/OTPModal/modal.css";
import swal from "sweetalert";

import { useDispatch, useSelector } from "react-redux";
// import { useHistory, useLocation } from "react-router";

import { resendOtpAction, verifyOtpAction } from "../login.slice";
import { AnchorTag } from "../style";
// import { doesHasIdParam } from "../home";
// import { ModuleControl } from "../../../../config/module-control";

const TFA_TYPES = ['', 'Email', 'Mobile Number', 'Email & Mobile Number']

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
  &:focus {
    outline: none;
  }
`;
const ModalRightContentDiv = styled.div`
  margin-bottom: 25px;
  @media (max-width: 991px) {
    display: flex;
    flex-wrap:wrap;
    justify-content: center;
    & .OTPDiv {
      margin-left: 0px !important;
    }
  }
  & h2 {
    
  }
  & p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    color: #4e4d4d;
    line-height: 1.8rem;
    word-spacing: 1px;
  }
  & input {
    height: 60px;
    width: 60px;
    margin-right: 25px;
    
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    border: none;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 6px 1px,
      rgb(0 0 0 / 5%) 1px 1px 0px 0px;
    @media (max-width: 991px) {
      margin-right: 10px;
      margin-top: 7px;
    }
  }
  & .OTPDiv {
    margin-left: 55px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    cursor: pointer;
  }
`;
const ModalLeftContentDiv = styled(Col)`
  padding-left: 0px;
  margin-top: -30px;
  & img {
    width: 280px;
  }
  @media (max-width: 991px) {
    display: flex;
    justify-content: center;
  }
`;

const OTPEditModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const { error, success } = useSelector(
    (state) => state.login
  );
  const otp1 = useRef();
  const otp2 = useRef();
  const otp3 = useRef();
  const otp4 = useRef();
  const otp5 = useRef();
  const otp6 = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000)
    return () => {
      clearInterval(myInterval);
    };
  });


  useEffect(() => {
    if (error) {
      swal("Alert", error, "warning");
    }

    if (success) {
      // success
    }

    return () => {
      // dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, success]);

  const verifyOtp = () => {
    if (
      otp1.current.value &&
      otp2.current.value &&
      otp3.current.value &&
      otp4.current.value &&
      otp5.current.value &&
      otp6.current.value
    ) {
      dispatch(
        verifyOtpAction({
          user_id: show.user_id,
          otp:
            otp1.current.value +
            otp2.current.value +
            otp3.current.value +
            otp4.current.value +
            otp5.current.value +
            otp6.current.value,
        }, { ...show.payload, no_otp_req: 1 })
      );
    } else {
      swal("Please enter OTP", "", "warning");
    }
  };

  useEffect(() => {
    otp1.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextKey = (e) => {
    if (e.target.value) {
      if (e.target.name === "otp1") {
        otp2.current.focus();
      }
      if (e.target.name === "otp2") {
        otp3.current.focus();
      }
      if (e.target.name === "otp3") {
        otp4.current.focus();
      }
      if (e.target.name === "otp4") {
        otp5.current.focus();
      }
      if (e.target.name === "otp5") {
        otp6.current.focus();
      }
      if (e.target.name === "otp6") {
        buttonRef.current.focus();
      }
    }
  };

  const numOnly = (event) => {
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
      if (key === 8) {

        if (event.target.name === "otp1") {
          if (otp1.current.value) otp1.current.value = '';
        }
        if (event.target.name === "otp2") {
          if (!otp2.current.value) otp1.current.focus();
          else otp2.current.value = '';
        }
        if (event.target.name === "otp3") {
          if (!otp3.current.value) otp2.current.focus();
          else otp3.current.value = '';
        }
        if (event.target.name === "otp4") {
          if (!otp4.current.value) otp3.current.focus();
          else otp4.current.value = '';
        }
        if (event.target.name === "otp5") {
          if (!otp5.current.value) otp4.current.focus();
          else otp5.current.value = '';
        }
        if (event.target.name === "otp6") {
          if (!otp6.current.value) otp5.current.focus()
          else otp6.current.value = ''
        }
      }
      if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        if (event.target.name === "otp1") {
          otp1.current.value = event.key;
        }
        if (event.target.name === "otp2") {
          otp2.current.value = event.key;
        }
        if (event.target.name === "otp3") {
          otp3.current.value = event.key;
        }
        if (event.target.name === "otp4") {
          otp4.current.value = event.key;
        }
        if (event.target.name === "otp5") {
          otp5.current.value = event.key;
        }
        if (event.target.name === "otp6") {
          otp6.current.value = event.key;
        }
      }
    } else {
      event.preventDefault();
    }
  };

  const resendOTP = () => {
    setSeconds(30)
    dispatch(resendOtpAction({
      user_id: show.user_id,
      tfa_type: show.tfa_type
    }))
  }

  return (
    <Modal
      show={!!show} onHide={onHide}
      backdrop={'static'}
      keyboard={false}
      dialogClassName={"my-modal-howden-otp"}
      size="xl"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Body style={{ padding: "85px 15px 50px 15px" }}>
        <CloseButton onClick={onHide}>×</CloseButton>
        <Row>
          <ModalLeftContentDiv md={12} lg={5} xl={5} sm={12}>
            <img
              src="/assets/images/RFQ/2fa.png"
              alt="otp"
            ></img>
          </ModalLeftContentDiv>
          <Col md={12} lg={7} xl={7} sm={12}>
            <div>
              <ModalRightContentDiv style={{ marginBottom: "25px" }}>
                <h2>Two Factor Authentication</h2>
              </ModalRightContentDiv>
              <ModalRightContentDiv>
                <p>
                  A verification code has been sent to your {TFA_TYPES[show.tfa_type]}. This code will be valid for 15 minutes.
                </p>
              </ModalRightContentDiv>
              <ModalRightContentDiv>
                <input
                  autoComplete='off'
                  name="otp1"
                  ref={otp1}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete='off'
                  name="otp2"
                  ref={otp2}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete='off'
                  name="otp3"
                  ref={otp3}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete='off'
                  name="otp4"
                  ref={otp4}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete='off'
                  name="otp5"
                  ref={otp5}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete='off'
                  name="otp6"
                  ref={otp6}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
              </ModalRightContentDiv>
              <ModalRightContentDiv className="d-flex justify-content-between mr-0 pr-0 mr-lg-5 pr-lg-4">

                {minutes === 0 && seconds === 0
                  ? <AnchorTag className="mt-0" to="#" onClick={resendOTP}>
                    <label>Resend Code</label>
                  </AnchorTag>
                  : <span>Resend Code in {/* {minutes}: */}{seconds < 10 ? `0${seconds}` : seconds} seconds</span>
                }

                <RFQButton onKeyDown={(event) => {
                  let key = event.keyCode || event.which;

                  if (key === 8) {
                    otp6.current.value = ''
                    otp6.current.focus()
                  }
                }} ref={buttonRef} onClick={() => verifyOtp()}>
                  Submit
                  <i style={{ paddingLeft: '20px' }} className="fa fa-long-arrow-right" aria-hidden="true" />
                </RFQButton>
              </ModalRightContentDiv>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal >
  );
};
export default OTPEditModal;
