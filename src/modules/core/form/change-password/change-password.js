import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import { useHistory } from "react-router";
import PasswordPolicy from "../password-policy/Password-policy";

import {
  LoginBox,
  CardBody,
  LoginFormHead,
  LoginFormBody,
  FormGroup,
  FormTextIcon,
  FormTextInput,
  FormLabel,
  Button,
  AnchorTag,
} from "../style";
import { handleChangePassword, alertCleanup } from "../login.slice";
import * as yup from 'yup';
import { Error } from 'components'
import _ from "lodash";
import { useLocation } from 'react-router';
import { Loader } from "../../../../components";

const validationSchema = yup.object().shape({
  old_password: yup.string().required('Old Password Required'),
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/gm, 'Should have at least a lowercase, an uppercase, a number & a symbol'),
  new_password: yup.string().required('New Password Required')
    .min(8, 'Required minimum 8 characters')
    .max(50,'Max 50 characters allowed')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/gm, 'Should have at least a lowercase, an uppercase, a number & a symbol'),
  reenter_password: yup.string().required('Confirm Password Required')
});

export const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();
  const { control, handleSubmit, errors } = useForm({
    validationSchema
  });

  const loginState = useSelector((state) => state.login);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const [passwordShown3, setPasswordShown3] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown((prev) => !prev);
  };

  const togglePasswordVisibility2 = () => {
    setPasswordShown2((prev) => !prev);
  };
  const togglePasswordVisibility3 = () => {
    setPasswordShown3((prev) => !prev);
  };

  const onSubmit = (data) => {
    if (_.isEqual(data.new_password, data.reenter_password)) {
      dispatch(handleChangePassword(data));
    } else {
      swal("Warning", "New Password and Confirm Password Not Matched", "warning");
    }
  };

  useEffect(() => {
    const { error, success, loading } = loginState;
    if (!loading) {
      if (error) {
        swal("", error, "warning");
      }

      if (success) {
        swal("", success, "success").then(() => {
          history.replace(pathname === '/user-change-password' ? '/home' : "/login")
        });
      }
    }
    return () => {
      dispatch(alertCleanup());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  return (
    <>
      <LoginBox>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            <LoginFormHead>
              <h4>Change Password</h4>
              {/* <p>Lorem ipsum is a dummy text without any sense. It is a sequence of Latin words that, as they are positioned</p> */}
            </LoginFormHead>
            <LoginFormBody>
              <FormGroup>
                <Controller
                  as={
                    <FormTextInput
                      type={passwordShown ? "text" : "password"}
                      name="old_password"
                      placeholder="Your Old Password"
                      required={true}
                      maxLength={50}
                    />
                  }
                  name="old_password"
                  defaultValue=""
                  control={control}
                />
                <FormTextIcon marginL="185px">
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
                <FormLabel htmlFor="old_password">
                  <span>Old Password</span>
                </FormLabel>
              </FormGroup>
              {!!errors?.old_password && (
                <Error style={{ marginTop: '-28px' }}>{errors?.old_password.message}</Error>
              )}
              <FormGroup>
                <Controller
                  as={
                    <FormTextInput
                      type={passwordShown2 ? "text" : "password"}
                      name="new_password"
                      placeholder="Your New Password"
                      required={true}
                      maxLength={50}
                    />
                  }
                  name="new_password"
                  defaultValue=""
                  control={control}
                />
                <FormTextIcon marginL="185px">
                  {passwordShown2 ? (
                    <i
                      className="fa fa-eye-slash"
                      onClick={togglePasswordVisibility2}
                    ></i>
                  ) : (
                    <i
                      className="fa fa-eye"
                      onClick={togglePasswordVisibility2}
                    ></i>
                  )}
                </FormTextIcon>
                <FormLabel htmlFor="new_password">
                  <span>New Password</span>
                </FormLabel>
              </FormGroup>
              {!!errors?.new_password && (
                <Error style={{ marginTop: '-28px' }}>{errors?.new_password.message}</Error>
              )}
              <FormGroup>
                <Controller
                  as={
                    <FormTextInput
                      type={passwordShown3 ? "text" : "password"}
                      name="reenter_password"
                      placeholder="Confirm Password"
                      required={true}
                      maxLength={50}
                    />
                  }
                  name="reenter_password"
                  defaultValue=""
                  control={control}
                />
                <FormTextIcon marginL="185px">
                  {passwordShown3 ? (
                    <i
                      className="fa fa-eye-slash"
                      onClick={togglePasswordVisibility3}
                    ></i>
                  ) : (
                    <i
                      className="fa fa-eye"
                      onClick={togglePasswordVisibility3}
                    ></i>
                  )}
                </FormTextIcon>
                <FormLabel htmlFor="reenter_password">
                  <span>Confirm Password</span>
                </FormLabel>
              </FormGroup>
              {!!errors?.reenter_password && (
                <Error style={{ marginTop: '-28px' }}>{errors?.reenter_password.message}</Error>
              )}
              <Button>
                Update
                <i className="ti-arrow-right" />
              </Button>
              <AnchorTag to={'#'} onClick={() => setModalShow(true)} className="p-3">
                <label>Password Policy</label>
              </AnchorTag>
            </LoginFormBody>
          </CardBody>
        </form>
      </LoginBox>
      <PasswordPolicy show={modalShow} onHide={() => setModalShow(false)} />
      {loginState.loading && <Loader />}
    </>
  );
};
