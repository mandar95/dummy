import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import swal from "sweetalert";
import _ from "lodash";
import * as yup from 'yup';
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import PasswordPolicy from "../password-policy/Password-policy";
// import { Popup } from './CustomModal';

import {
  LoginBox,
  // CardBody,
  // LoginFormHead,
  // LoginFormBody,
  // FormGroup,
  FormTextInput,
  FormTextIcon,
  // FormLabel,
  Button,
  AnchorTag,
} from "../style";
import { Error, Loader } from 'components'

import { handleLogin, alertCleanup, cleanExpiryDetails, loadCurrentUser, AzureRedirection } from "../login.slice";
import { serializeError } from "../../../../utils";
import { ModuleControl } from "../../../../config/module-control";
import { Footer, NavBar } from "../../../../components";
import OTPEditModal from "./OTPModal";
import { common_module } from 'config/validations';
const validation = common_module.user;

const Label = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};

padding: 0px 5px;
border-radius: 5px;
`
const BorderDiv = styled.div`
height: 8px;
width: 40px;
background: #ffcd37;
border-radius: 15px;
margin-left: 5px;
`

const SideCard = styled.div`
//padding: 10px 35px;
//background: white;
//border-radius: 5px;
//box-shadow: 0px 1px 6px 1px gainsboro;
width: 450px;
// height: 415px;

@media (max-width:992px) {
	margin-top:20px;
   }
`
const TitleLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};

`
const OutputLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};

color:#51516f;
`

const CardRows = styled(Row)`
padding: 0px 145px;
@media (max-width:992px) {
	margin:0px 10px
   }
   @media (max-width:1291px) {
    padding: 0px 0px
   }
`

const IMG = styled.img`
@media (max-width:767px) {
height:165px;
   }
`

const validationSchema = yup.object().shape({
  field: yup.string().required('Email/Mobile/Code Required'),
  password: yup.string().required('Password Required')
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/gm, 'Should have at least a lowercase, an uppercase, a number & a symbol'),
});

export const Login = (props) => {
  const { history } = props;
  const dispatch = useDispatch();

  const { control, handleSubmit, errors } = useForm({
    validationSchema
  });
  const [modalShow, setModalShow] = React.useState(false);
  const [OTPModal, setOTPModal] = useState(/* { tfa_type: 1, } */false);
  // const [modalLanguage, setModalLanguage] = React.useState(false);

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown((prev) => !prev);
  };

  // const Language = document.cookie.replace(/(?:(?:^|.*;\s*)googtrans\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  // useEffect(() => {
  //   if (!Language) {
  //     setModalLanguage(true)
  //   }
  // }, [Language])

  const loginState = useSelector((state) => state.login);
  const onSubmit = async (data) => {

    const checkTab = localStorage.getItem("checkTab");
    const isMultiWindow = checkTab ? JSON.parse(checkTab) : [];
    if (isMultiWindow.length > 1 && loginState.isAuthenticated && !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
      swal({
        title: "Are you sure?",
        text: "Your Previous session is active across Tabs or another Window. All session will be expired",
        icon: "info",
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Continue",
            value: "continue",
          }
        },
        dangerMode: true,
      })
        .then((caseValue) => {
          switch (caseValue) {
            case "continue":
              var regex = /[@]/g;
              let check = regex.test(data?.field);
              let formData = {};
              // const formdata = new FormData();
              formData["password"] = data?.password;
              if (check) {
                formData["email"] = data?.field?.trim();
              } else if (
                Number.isInteger(data?.field * 1) === "number" &&
                data?.field?.trim().length === 10 &&
                (validation.contact.regex).test(data?.field?.trim())
              ) {
                formData["number"] = data?.field.trim();
              } else {
                formData["code"] = data?.field.trim();
              }
              // formData.append("switch", 0);
              dispatch(handleLogin(formData, false, false, setOTPModal));
              break;
            default:
          }
        })
    } else {
      var regex = /[@]/g;
      let check = regex.test(data?.field);
      let formData = {};
      // const formdata = new FormData();
      formData["password"] = data?.password;
      if (check) {
        formData["email"] = data?.field?.trim();
      } else if (
        Number.isInteger(data?.field * 1) &&
        data?.field?.trim().length === 10 &&
        (validation.contact.regex).test(data?.field)
      ) {
        formData["number"] = data?.field.trim();
      } else {
        formData["code"] = data?.field.trim();
      }
      // formData.append("switch", 0);
      dispatch(handleLogin(formData, false, false, setOTPModal));

      // Below Code Danger for System Security
      // dispatch(handleLogin({
      //   user_id: 2,
      //   switch: 1,
      //   master_user_type_id: 3
      // }, false, false))
    }
  };

  useEffect(() => {
    dispatch(loadCurrentUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { loading, error, isAuthenticated, getExpiryResp } = loginState;
    if (!loading && isAuthenticated && !_.isEmpty(getExpiryResp)) {
      if (getExpiryResp?.data?.days_left < 6) {
        swal(
          serializeError(getExpiryResp?.data?.message) || "You Password Will Expire Soon",
          getExpiryResp?.data?.message ? "" : "Update Your Password",
          "info"
        ).then(() => {
          if (getExpiryResp?.data?.master_password === 1) {
            swal(
              "Password Reset Required after First Login",
              "",
              "info"
              // ).then(() => history.push("/change-password"));
            ).then(() => history.push("/security-question"));
          } else {
            history.replace("/home");
            dispatch(cleanExpiryDetails());
          }
        });
      } else {
        if (getExpiryResp?.data?.master_password === 1) {
          swal(
            "Password Reset Required",
            "As per policy, password change is mandatory at the time of first login",
            "info"
            //).then(() => history.push("/change-password"));
          ).then(() => history.push("/security-question"))
        } else {
          history.replace("/home");
          dispatch(cleanExpiryDetails());
        }
      }
    }

    if (!loading && error === 'Password Expired ! Please Reset Password') {
      swal("", serializeError(error), "warning").then(() => {
        history.push("/forgot-password?reset=true");
      });
    }
    else if (!loading && error) {
      swal("", serializeError(error), "warning");
    }

    return () => {
      dispatch(alertCleanup())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  const _renderLoginForm = () => {
    return (
      <>
        <NavBar noLink />
        <LoginBox>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardRows>
              <Col xl={6} lg={6} md={12} sm={12} className="d-flex justify-content-center align-items-center">
                <IMG
                  src="/assets/images/Group 3797@2x.png" height="300"
                />
              </Col>
              <Col xl={6} lg={6} md={12} sm={12} className="d-flex justify-content-center">
                <SideCard className="">
                  {ModuleControl.Azure &&
                    <Row className="flex-column" style={{ lineHeight: '25px' }}>
                      <Button bgColor="#ffffff" type="button" onClick={AzureRedirection}>
                        <img src='/assets/images/landing-page/microsoft-logo.png' height='100%' alt='microsoft-logo' />
                      </Button>
                    </Row>}

                  <Row className="flex-column" style={{ lineHeight: '25px' }}>
                    <Label>LOGIN</Label>
                    <BorderDiv />
                  </Row>
                  <Row className="flex-column mt-4">
                    <TitleLabel>Email ID/Employee Code/Mobile No.</TitleLabel>
                    <OutputLabel>
                      <Controller
                        as={
                          <FormTextInput
                            name="field"
                            type="text"
                            placeholder="Your Email ID/Employee Code/Mobile No."
                            error={errors && errors.field}
                            maxLength={80}
                          />
                        }
                        defaultValue=""
                        name="field"
                        control={control}
                      />
                      {!!errors?.field && (
                        <Error top={3}>{errors?.field.message}</Error>
                      )}
                    </OutputLabel>
                  </Row>
                  <Row className="flex-column mt-3">
                    <TitleLabel>Password</TitleLabel>
                    <OutputLabel>
                      <Controller
                        as={
                          <FormTextInput
                            type={passwordShown ? "text" : "password"}
                            name="password"
                            placeholder="Your Password"
                            maxLength={50}
                            error={errors && errors.password}
                          />
                        }
                        defaultValue=""
                        name="password"
                        control={control}
                      />
                      <FormTextIcon>
                        {passwordShown ? (
                          <i
                            className="fa fa-eye-slash"
                            onClick={togglePasswordVisibility}
                          ></i>
                        ) : (
                          <i
                            className="fa fa-eye"
                            onClick={togglePasswordVisibility}
                          ></i>
                        )}
                      </FormTextIcon>
                      {!!errors?.password && (
                        <Error top={3}>{errors?.password.message}</Error>
                      )}
                    </OutputLabel>
                  </Row>
                  <Row className="justify-content-between">
                    <AnchorTag to="/forgot-password" className="p-3">
                      <label>Forgot Password?</label>
                    </AnchorTag>
                    <AnchorTag to="/login" onClick={() => setModalShow(true)} className="p-3">
                      <label>Password Policy</label>
                    </AnchorTag>
                  </Row>
                  <Row className="justify-content-center">
                    <Button type="submit">
                      Submit
                      <i className="ti-arrow-right" />
                    </Button>
                    {ModuleControl.isDevelopment /* Direct Login */ &&
                      !!loginState?.currentUser?.name && !loginState.loading && <AnchorTag to="/home" className="m-0">
                        <label>Login as {loginState.currentUser.name} <sub className='text-secondary'>(only for development)</sub></label>
                      </AnchorTag>}
                  </Row>
                </SideCard>
              </Col>
            </CardRows>
          </form>
        </LoginBox>
        <PasswordPolicy show={modalShow} onHide={() => setModalShow(false)} />
        {loginState.loading && <Loader />}
        <Footer />
        {!!OTPModal &&
          <OTPEditModal
            show={OTPModal}
            onHide={() => setOTPModal(false)}
          />
        }
      </>
    );
  };

  return _renderLoginForm();
};
