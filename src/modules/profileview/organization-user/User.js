import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import * as yup from 'yup';

import { CardBlue, Button, Head, Text, Error, Input } from "../../../components";
import { Row, Col } from "react-bootstrap";

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { common_module } from 'config/validations'
import { selectError, selectSuccess, updateUser, clear } from '../../user-management/user.slice';
import { numOnly, noSpecial } from "utils";
import { getUserDetails, loadCurrentUser } from '../../core/form/login.slice';
import { getProfileDetails } from '../profileview.slice';

const validation = common_module.user

const validationSchema = (userType) => yup.object().shape({
  name: userType === 'Employer' ? yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
    .max(validation.name.max, `Maximum ${validation.name.max} character available`) :
    yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
      .max(validation.name.max, `Maximum ${validation.name.max} character available`)
      .matches(validation.name.regex, "Name must contain only alphabets"),

  mobile_no: yup.string()
    .required('Mobile No. is required')
    .min(validation.contact.length, "Mobile No. should be 10 digits")
    .max(validation.contact.length, "Mobile No. should be 10 digits")
    .matches(validation.contact.regex, 'Not valid number'),
});


export default function User({ userData, userType, userTypeName, currentUser }) {

  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  useEffect(() => {
    if (userData.name && edit) {
      reset(userData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, edit])

  useEffect(() => {
    if (error) {
      swal("Alert", error, "warning");
    };
    if (success) {
      swal('Success', success, "success");
      changeEdit()
      getUser()
      dispatch(getProfileDetails(Number(currentUser.profile_master) ? { id: currentUser.id, master_id: userTypeName === 'Broker' ? 3 : 4 } : {}));

    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);

  const getUser = () => {
    getUserDetails({ master_user_type_id: userTypeName === 'Broker' ? 3 : 4, user_id: currentUser.id }).then(() => {
      dispatch(loadCurrentUser())
    })
  }

  const { control, errors, handleSubmit, reset } = useForm({
    validationSchema: validationSchema(userType),
    mode: "onBlur",
    reValidateMode: "onBlur"
  });

  const onSubmit = ({ name, mobile_no }) => {

    dispatch(updateUser({
      name,
      mobile_no,
      user_id: userData.id,
      user_type_name: userTypeName
    }))
  };

  const changeEdit = () => {
    setEdit(prev => !prev)
  }

  const Show = (
    <Row className="mt-3 flex-wrap">
      <Col xs={12} md={6} lg={4} xl={4} className="mt-2" sm={12}>
        <Head>Name</Head>
        <Text>{userData.name || "-"}</Text>
      </Col>

      <Col xs={12} md={6} lg={4} xl={4} className="mt-2" sm={12}>
        <Head>Email Id</Head>
        <Text>{userData.email || "-"}</Text>
      </Col>

      <Col xs={12} md={6} lg={4} xl={4} className="mt-2" sm={12}>
        <Head>Contact No</Head>
        <Text>{userData.mobile_no || "-"}</Text>
      </Col>
    </Row>
  )

  const Edit = (
    <form onSubmit={handleSubmit(onSubmit)}>
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

        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="submit">
            Update
          </Button>
        </Col>
      </Row>
    </form>
  )

  return (
    <CardBlue title={<div className="d-flex justify-content-between">
      <span>{'Personal Details'}</span>
      <div>
        <Button buttonStyle='outline-secondary' type="button" onClick={changeEdit}>
          {edit ? 'Cancel' : 'Edit'}
        </Button>
      </div>
    </div>} round={true}>

      {edit ? Edit : Show}
    </CardBlue >
  )
}
