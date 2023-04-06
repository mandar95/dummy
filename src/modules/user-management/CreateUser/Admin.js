import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import swal from 'sweetalert';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import { Input, Card, Button, Error, Loader } from "components";
import { Row, Col, Form } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { createAdmin, selectLoading, selectError, selectSuccess, clear, selectUserInfo, updateUser } from '../user.slice';
import { numOnly, noSpecial } from "utils";
import { common_module } from 'config/validations'
import GetUserInfo from './getUserInfo';

const validation = common_module.user

const validationSchema = (UserID) => yup.object().shape({
  name: yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
    .max(validation.name.max, `Maximum ${validation.name.max} character available`)
    .matches(validation.name.regex, "Name must contain only alphabets"),
  ...(!UserID && {
    email: yup.string().email('Must be a valid email').required('Email required')
      .min(validation.email.min, `Minimum ${validation.email.min} character required`)
      .max(validation.email.max, `Maximum ${validation.email.max} character available`)
  }),
  mobile_no: yup.string()
    .required('Mobile No. is required')
    .min(validation.contact.length, "Mobile No. should be 10 digits")
    .max(validation.contact.length, "Mobile No. should be 10 digits")
    .matches(validation.contact.regex, 'Not valid number')
});

export default function CreateAdmin() {
  const dispatch = useDispatch();
  const history = useHistory();
  const UserID = GetUserInfo()
  const { control, errors, handleSubmit, reset } = useForm({
    validationSchema: validationSchema(UserID),
    mode: "onBlur",
    reValidateMode: "onBlur"
  });
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const UserInfo = useSelector(selectUserInfo);
  const { userType } = useSelector(state => state.login);



  useEffect(() => {
    if (UserInfo.name)
      reset(UserInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserInfo])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
      history.goBack();
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  const onSubmit = data => {
    UserID ? dispatch(updateUser({ ...data, user_id: UserID, user_type_name: userType })) :
      dispatch(createAdmin({ ...data, type: 1 }));
  };

  return (
    <Card title={`${UserID ? 'Update' : 'Create'} Admin User`} style={{ maxWidth: "1000px" }}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="d-flex flex-wrap">
          <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={<Input label="Name" name="name" maxLength={validation.name.max}
                placeholder="Enter Name" required={false} isRequired={true} />}
              name="name"
              error={errors && errors.name}
              control={control}
            />
            {!!errors.name &&
              <Error>
                {errors.name.message}
              </Error>}
          </Col>
          {!UserID && <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={<Input label="Email" type="email" maxLength={validation.email.max}
                placeholder="Enter Email" required={false} isRequired={true} />}
              name="email"
              error={errors && errors.email}
              control={control}
            />
            {!!errors.email &&
              <Error>
                {errors.email.message}
              </Error>}
          </Col>}
          <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={<Input label="Mobile No" maxLength={validation.contact.length}
                onKeyDown={numOnly} onKeyPress={noSpecial} type='tel' placeholder="Enter Mobile No" required={false} isRequired={true} />}
              name="mobile_no"
              error={errors && errors.mobile_no}
              control={control}
            />
            {!!errors.mobile_no &&
              <Error>
                {errors.mobile_no.message}
              </Error>}
          </Col>
        </Row>
        <Row>
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="submit">
              {UserID ? 'Update' : 'Submit'}
            </Button>
          </Col>
        </Row>
      </Form>
      {loading && <Loader />}
    </Card>
  )
}
