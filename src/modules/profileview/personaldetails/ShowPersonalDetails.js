import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
// import httpClient from "../../../api/httpClient";
import { postUserDetails, clear, successResponse } from '../profileview.slice'
import swal from "sweetalert";
// componets
import { CardBlue, Error, Head, Text } from "../../../components";
import Input from "../../../components/inputs/input/input";
import { Button } from "../../../components/index";
import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';
import { numOnly, noSpecial } from "utils";
import { DateFormate } from "../../../utils";
import { ModuleControl } from "../../../config/module-control";
import { common_module } from 'config/validations';
const validation = common_module.user;

const validationSchema = yup.object().shape({
  emergency_contact_name: yup.string()
    // .notRequired().nullable()
    .nullable()
    .notRequired()
    .matches(/^([A-Za-z\s])+$/, { message: 'Name must contain only alphabets', excludeEmptyString: true }),
  emergency_contact_number: yup.string()
    // .notRequired().nullable()
    .notRequired()
    .nullable()
    .matches(validation.contact.regex, { message: "Not valid number", excludeEmptyString: true }),
  // .min(10, 'Must be exactly 10 digits')
  // .max(10, 'Must be exactly 10 digits')
  // .test('invalid', 'Not valid number', (value) => {
  //   return !/^[9]{10}$/.test(value);
  // }),
  alternate_email: yup.string().email('must be a valid email')
    .nullable()
    .notRequired('Alternate Email is required'),
  // .notRequired().nullable(),
  mobile_no: yup.string()

    .required('Mobile No. is required')
    .min(10, 'Mobile No. should be 10 digits')
    .max(10, 'Mobile No. should be 10 digits')
    .matches(validation.contact.regex, 'Not valid number')
  // .test('invalid', 'Not valid number', (value) => {
  //   return !/^[9]{10}$/.test(value);
  // }),
})

const ShowPersonalDetails = (props) => {
  const dispatch = useDispatch();
  const { status, message } = useSelector(successResponse);
  let [edit, setEdit] = useState(false);
  let [data, setData] = useState({
    emergency_contact_number: "",
    emergency_contact_name: "",
    alternate_email: "",
    username: "",
    email: "",
    mobile_no: "",
  });

  // destructure props
  let {
    name,
    company_name,
    dob,
    email,
    mobile_no = '',
    emergency_contact_name,
    emergency_contact,
    alternate_email,
    address,
    pincode,
    city,
    state,
    employee_grade,
    employee_desination,
    id
  } = props.personDetails.personDetails;

  const { handleSubmit, control, errors } = useForm({ validationSchema });

  useEffect(() => {
    if (status) {
      swal(message || "Details stored successfully!", "", "success");
      setEdit(false);
      dispatch(clear())
    } else {
      if (message) {
        swal(message, "", "warning");
        dispatch(clear())
      }
    }
    //eslint-disable-next-line
  }, [status, message])

  useEffect(
    () =>
      setData((prev) => ({
        ...prev,
        emergency_contact_name,
        emergency_contact_number: emergency_contact,
        alternate_email,
        mobile_no,
      })),
    [emergency_contact_name, emergency_contact, mobile_no, alternate_email]
  );

  //eslint-disable-next-line
  let onChangeMethod = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setData((prevState) => ({ ...prevState, [name]: value }));
    //
  };

  // add mobile number validation
  let onSubmitMethod = (val) => {
    // e.preventDefault(e);
    let Data = {
      ...val.alternate_email && { alternate_email: val.alternate_email },
      ...val.emergency_contact_name && { emergency_contact_name: val.emergency_contact_name },
      ...val.emergency_contact_number && { emergency_contact_number: val.emergency_contact_number },
      mobile_no: val.mobile_no,
      user_type_name: 'Employee'
    };
    dispatch(postUserDetails(Data, { id: id, master_id: 5 }))
  };

  let onClickHandlerEdit = () => {
    setEdit(!edit);
  };

  const Title = () => <Row>
    <Col sm={12} md={6} >
      Personal Details
    </Col>
    <Col sm={12} md={6} className="d-flex justify-content-end mt-3">
      <span id="edit-button" className="mr-3">
        <Button buttonStyle="outline" onClick={onClickHandlerEdit}>
          {edit ? "Cancel" : "Edit"}
        </Button>
      </span>
      {/* hide add bank details btn when active */}
      {(!!(props.addBank || props.userType !== 'Employee')) ? null : !ModuleControl.isTATA /* No Bank Detail */ && (
        <span>
          <Button onClick={props.onClickAddBD} buttonStyle="outline">
            Add Bank Details
          </Button>
        </span>
      )}
    </Col>
  </Row>


  return (
    <CardBlue title={<Title />} round={true}>
      <div style={{ marginTop: "-35px" }}>


        {/* render component based edit value */}
        {edit ? (
          // forms only 3 inputs are in used as per api property
          <Form onSubmit={handleSubmit(onSubmitMethod)}>
            <Row className="mt-3 flex-wrap">

              <Col xs={12} md={12} lg={3} className=" mx-auto" sm={12}>
                <Controller
                  as={
                    <Input
                      label="Contact No"
                      placeholder="Enter Contact No"
                      type='tel'
                      maxLength={10}
                      onKeyDown={numOnly} onKeyPress={noSpecial}
                      name="mobile_no"
                      error={!!errors["mobile_no"]?.message}
                      // onChange={onChangeMethod}
                      // value={data.mobile_no}
                      required={false}
                      isRequired={true}
                    />
                  }
                  rules={{ required: true }}
                  name="mobile_no"
                  control={control}
                  defaultValue={data.mobile_no || ''}
                />
                {!!errors.mobile_no && <Error>
                  {errors.mobile_no.message}
                </Error>}
              </Col>
              <Col xs={12} md={12} lg={3} className=" mx-auto" sm={12}>

                <Controller
                  as={
                    <Input
                      label="Emergency Contact Person"
                      placeholder="Enter Emergency Contact Person"
                      type="text"
                      name="emergency_contact_name"
                      error={!!errors["emergency_contact_name"]?.message}
                      // onChange={onChangeMethod}
                      // value={data.emergency_contact_name}
                      required={false}
                    />
                  }
                  rules={{ required: true }}
                  name="emergency_contact_name"
                  control={control}
                  defaultValue={data.emergency_contact_name}
                />
                {!!errors.emergency_contact_name && <Error>
                  {errors.emergency_contact_name.message}
                </Error>}
              </Col>
              <Col xs={12} md={12} lg={3} className=" mx-auto" sm={12}>

                <Controller
                  as={
                    <Input
                      label="Emergency Contact No"
                      placeholder="Enter Emergency Contact No"
                      type='tel'
                      maxLength={10}
                      onKeyDown={numOnly} onKeyPress={noSpecial}
                      name="emergency_contact_number"
                      // onChange={onChangeMethod}
                      // value={data.emergency_contact_number}
                      error={!!errors["emergency_contact_number"]?.message}
                      required={false}
                    />
                  }
                  rules={{ required: true }}
                  name="emergency_contact_number"
                  control={control}
                  defaultValue={data.emergency_contact_number}
                />
                {!!errors.emergency_contact_number && <Error>
                  {errors.emergency_contact_number.message}
                </Error>}
              </Col>
              <Col xs={12} md={12} lg={3} className=" mx-auto" sm={12}>
                <Controller
                  as={
                    <Input
                      label="Alternate Email Id"
                      placeholder="Enter Alternate Email Id"
                      type="text"
                      name="alternate_email"
                      error={!!errors["alternate_email"]?.message}
                      // onChange={onChangeMethod}
                      // value={data.alternate_email}
                      required={false}
                    />
                  }
                  rules={{ required: true }}
                  name="alternate_email"
                  control={control}
                  defaultValue={data.alternate_email}
                />
                {!!errors.alternate_email && <Error>
                  {errors.alternate_email.message}
                </Error>}
              </Col>


            </Row>

            {/* buttons */}
            <Row>
              <Col
                xs={12}
                md={12}
                className="d-flex justify-content-end mt-3 flex-wrap"
              >
                {/* <Button buttonStyle="danger" className="mr-4" onClick={resetMethod}>reset</Button> */}
                <Button>Save</Button>
              </Col>
            </Row>
          </Form>
        ) : (
          // "labels transfer this to seprate component
          <Row className="mt-3 flex-wrap">
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Name</Head>
              <Text>{name || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Company Name</Head>
              <Text>{company_name || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Date Of Birth</Head>
              <Text>{(DateFormate(dob) || "-")}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Email Id</Head>
              <Text>{email || "-"}</Text>
            </Col>

            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Contact No</Head>
              <Text>{mobile_no || "-"}</Text>
            </Col>
            {!!emergency_contact_name && <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Emergency Contact Person</Head>
              <Text>{emergency_contact_name || "-"}</Text>
            </Col>}
            {!!emergency_contact && <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Emergency Contact No</Head>
              <Text>{emergency_contact || "-"}</Text>
            </Col>}
            {!!alternate_email && <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Alternate Email Id</Head>
              <Text>{alternate_email || "-"}</Text>
            </Col>}

            {!!employee_grade && !employee_grade?.toLowerCase()?.startsWith('code') && <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Grade</Head>
              <Text>{employee_grade || "-"}</Text>
            </Col>}
            {!!employee_desination && !employee_desination?.toLowerCase()?.startsWith('code') && <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Designation</Head>
              <Text>{employee_desination || "-"}</Text>
            </Col>}

            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Address</Head>
              <Text>{address || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Pincode</Head>
              <Text>{pincode || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>City</Head>
              <Text>{city || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>State</Head>
              <Text>{state || "-"}</Text>
            </Col>
          </Row>
        )}
      </div>
    </CardBlue>
  );
};

export default ShowPersonalDetails;
