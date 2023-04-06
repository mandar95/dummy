import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import PasswordPolicy from "../password-policy/Password-policy";
import { useHistory } from "react-router";
import * as yup from 'yup';

import {
  LoginBox,
  CardBody,
  LoginFormHead,
  LoginFormBody,
  FormGroup,
  FormTextInput,
  FormTextIcon,
  FormLabel,
  Button,
  AnchorTag,
} from "../style";
import { handleResetPassword, getToken, alertCleanup } from "../login.slice";
import { useQuery } from "utils";
import { Error } from 'components'
import { Loader } from "../../../../components";

const validationSchema = yup.object().shape({
  password: yup.string().required('Password Required')
    .min(8, 'Required minimum 8 characters')
    .max(50,'Max 50 characters allowed')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/gm, 'Should have at least a lowercase, an uppercase, a number & a symbol'),
});

export const ResetPassword = (props) => {
  const { location } = props;
  const query = useQuery(location.search);
  const history = useHistory();

  const dispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm({
    validationSchema
  });

  const loginState = useSelector((state) => state.login);
  const [showFlag, setShowFlag] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown((prev) => !prev);
  };

  useEffect(() => {
    let hash = query.get("token");
    if (hash) {
      setShowFlag(false);
      dispatch(getToken(hash));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loginState?.TokenResp?.data?.status) {
      setShowFlag(true);
    } else if (loginState?.TokenResp?.data?.status === false) {
      swal("The reset link is not valid", "", "warning").then(() => {
        history.replace("/broker");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState?.TokenResp]);

  useEffect(() => {
    const { error, success, loading } = loginState;
    if (!loading) {
      if (error) {
        swal("", error, "warning");
      }

      if (success) {
        swal("", success, "success").then(() => {
          history.replace("/login");
        });
      }
    }

    return () => {
      dispatch(alertCleanup());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  const onSubmit = (data) => {
    data.token = query.get("token");
    dispatch(handleResetPassword(data));
  };

  return (
    <>
      <LoginBox>
        {showFlag && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody>
              <LoginFormHead>
                <h4>Reset Password</h4>
                {/* <p>Lorem ipsum is a dummy text without any sense. It is a sequence of Latin words that, as they are positioned</p> */}
              </LoginFormHead>
              <LoginFormBody>
                <FormGroup>
                  <Controller
                    as={
                      <FormTextInput
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        placeholder="Your New Password"
                        maxLength={50}
                      />
                    }
                    name="password"
                    defaultValue=""
                    control={control}
                  />
                  <FormTextIcon style={{ marginLeft: '0px', float: 'none', right: '18px' }}>
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
                  <FormLabel htmlFor="password">
                    <span>New Password</span>
                  </FormLabel>
                </FormGroup>
                {!!errors?.password && (
                  <Error style={{ marginTop: '-28px' }}>{errors?.password.message}</Error>
                )}
                <Button>
                  Submit
                  <i className="ti-arrow-right" />
                </Button>
                <AnchorTag to="/login" className="p-3">
                  <label>Existing User Click Here To Login</label>
                </AnchorTag>
                <AnchorTag onClick={() => setModalShow(true)} className="p-3">
                  <label>Password Policy</label>
                </AnchorTag>
              </LoginFormBody>
            </CardBody>
          </form>
        )}
      </LoginBox>
      <PasswordPolicy show={modalShow} onHide={() => setModalShow(false)} />
      {loginState.loading && <Loader />}
    </>
  );
};
