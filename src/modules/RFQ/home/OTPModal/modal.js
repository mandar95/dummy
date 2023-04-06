import React, { useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { RFQButton } from "components";
import "./modal.css";
import swal from "sweetalert";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import {
  generateOTP,
  generateOTP2,
  verfiyOTP,
  // resendOTP,
  verfiyOTP2,
  clear,
  set_company_data,
  saveCompanyData,
} from "../home.slice";
import { doesHasIdParam } from "../home";
import { ModuleControl } from "../../../../config/module-control";

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

// 6 digit code SMS API RFQ OTP
const HOWDEN = ModuleControl.isHowden;

const OTPEditModal = ({ show, onHide, utm_source }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { company_data, enquiry_id, error, success, otpSuccess } = useSelector(
    (state) => state.RFQHome
  );
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const brokerId = query.get("broker_id");
  const insurerId = query.get("insurer_id");
  // const [resendOtp, setResendOtp] = useState(false);
  const otp1 = useRef();
  const otp2 = useRef();
  const otp3 = useRef();
  const otp4 = useRef();
  const otp5 = useRef();
  const otp6 = useRef();

  // const otpResend = () => {
  //  setResendOtp(true);
  //  dispatch(resendOTP({
  //      contact_no: parseInt(`91${company_data.contact_no}`)
  //  }))
  //  setTimeout(() => {
  //      setResendOtp(false);
  //  }, 2000)
  // }

  useEffect(() => {
    if (error) {
      swal("Alert", error, "warning");
    }

    if (success) {
      // swal('Success', success, "success");
      if (HOWDEN && company_data.is_otp_verified) {
        history.push(
          `/policy-renewal?enquiry_id=${encodeURIComponent(
            enquiry_id
          )}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`
        );
      } else {
        history.push(
          `/policy-renewal?enquiry_id=${encodeURIComponent(
            enquiry_id
          )}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`
        );
      }
    }

    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, success]);

  useEffect(() => {
    if (otpSuccess) {
      dispatch(
        saveCompanyData({
          enquiry_id: enquiry_id,
          step: 2,
          is_otp_verified: 1,
        })
      );
      dispatch(set_company_data({ is_otp_verified: 1 }));
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpSuccess]);

  const OTPGenerate = () => {
    if (HOWDEN) {
      dispatch(
        generateOTP2({
          sms_type: 1,
          mobile_no: parseInt(`${company_data.contact_no}`),
          message: "test test test",
          timetoalive: 60,
        })
      );
    } else {
      dispatch(
        generateOTP({
          contact_no: parseInt(`91${company_data.contact_no}`)
        })
      );
    }
  };

  const verifyOtp = () => {
    if (HOWDEN) {
      if (
        otp1.current.value &&
        otp2.current.value &&
        otp3.current.value &&
        otp4.current.value &&
        otp5.current.value &&
        otp6.current.value
      ) {
        dispatch(
          verfiyOTP2({
            // enquiry_id,
            // contact_no: parseInt(`91${company_data.contact_no}`),
            // otp: otp1.current.value + otp2.current.value
            //   + otp3.current.value + otp4.current.value
            sms_type: 2,
            mobile_no: parseInt(`${company_data.contact_no}`),
            otp:
              otp1.current.value +
              otp2.current.value +
              otp3.current.value +
              otp4.current.value +
              otp5.current.value +
              otp6.current.value,
          })
        );
      } else {
        swal("Please enter OTP", "", "warning");
      }
    } else {
      if (
        otp1.current.value &&
        otp2.current.value &&
        otp3.current.value &&
        otp4.current.value
      ) {
        dispatch(
          verfiyOTP({
            enquiry_id,
            contact_no: parseInt(`91${company_data.contact_no}`),
            otp:
              otp1.current.value +
              otp2.current.value +
              otp3.current.value +
              otp4.current.value,
          })
        );
      } else {
        swal("Please enter OTP", "", "warning");
      }
    }
  };

  useEffect(() => {
    OTPGenerate();
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
      if (HOWDEN) {
        if (e.target.name === "otp4") {
          otp5.current.focus();
        }
        if (e.target.name === "otp5") {
          otp6.current.focus();
        }
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
        if (HOWDEN) {
          if (event.target.name === "otp5") {
            otp5.current.value = event.key;
          }
          if (event.target.name === "otp6") {
            otp6.current.value = event.key;
          }
        }
      }
    } else {
      event.preventDefault();
    }
  };

  return (
    <Modal
      show={show} onHide={onHide}
      // size="lg"
      // aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={"my-modal" + (HOWDEN ? '-howden-otp' : '')}
      size="xl"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Body style={{ padding: "85px 15px 50px 15px" }}>
        <CloseButton onClick={onHide}>×</CloseButton>
        <Row>
          <ModalLeftContentDiv md={12} lg={5} xl={5} sm={12}>
            <img
              src="/assets/images/RFQ/security-otp-one-time-password-smartphone-shield_9904-104.png"
              alt="otp"
            ></img>
          </ModalLeftContentDiv>
          <Col md={12} lg={7} xl={7} sm={12}>
            <div>
              <ModalRightContentDiv style={{ marginBottom: "25px" }}>
                <h2>Please enter verification code</h2>
              </ModalRightContentDiv>
              <ModalRightContentDiv>
                <p>
                  OTP has been sent to <b>{`${company_data?.contact_no}`}</b>
                  &nbsp;&nbsp;
                  <i
                    className="fa fa-pencil"
                    aria-hidden="true"
                    onClick={onHide}
                    style={{ cursor: "pointer" }}
                  ></i>
                </p>
              </ModalRightContentDiv>
              <ModalRightContentDiv>
                <input
                  autoComplete={false}
                  name="otp1"
                  ref={otp1}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete={false}
                  name="otp2"
                  ref={otp2}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete={false}
                  name="otp3"
                  ref={otp3}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                <input
                  autoComplete={false}
                  name="otp4"
                  ref={otp4}
                  maxLength="1"
                  onKeyPress={nextKey}
                  type="tel"
                  onKeyDown={numOnly}
                />
                {HOWDEN && (
                  <>
                    <input
                      autoComplete={false}
                      name="otp5"
                      ref={otp5}
                      maxLength="1"
                      onKeyPress={nextKey}
                      type="tel"
                      onKeyDown={numOnly}
                    />
                    <input
                      autoComplete={false}
                      name="otp6"
                      ref={otp6}
                      maxLength="1"
                      onKeyPress={nextKey}
                      type="tel"
                      onKeyDown={numOnly}
                    />
                  </>
                )}
              </ModalRightContentDiv>
              <ModalRightContentDiv>
                <RFQButton>
                  <div
                    onClick={() => verifyOtp()}
                    style={{ height: "100%", padding: "0px 25px" }}
                    className="d-flex justify-content-between align-items-center"
                  >
                    Submit
                    <i className="fa fa-long-arrow-right" aria-hidden="true" />
                  </div>
                </RFQButton>
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
    </Modal>
  );
};
export default OTPEditModal;
