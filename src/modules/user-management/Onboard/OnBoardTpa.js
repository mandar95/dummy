
/*
Module: OnBoard TPA
User Type: Admin/Insurer
Commented By: Salman Ahmed
*/


// import React, { useState, useEffect, Fragment } from 'react';
// import { useForm, Controller } from "react-hook-form";
// import swal from 'sweetalert';
// import { useHistory } from 'react-router-dom';
// import * as yup from 'yup';
// import TextArea from "react-textarea-autosize";
// import styled from 'styled-components';
// import _ from 'lodash';

// import { Input, Card, Button, Error, Loader } from "components";
// import { Row, Col, Form } from 'react-bootstrap';
// import Select from "./Select/Select";
// import { Switch } from "../AssignRole/switch/switch";
// import { BottomHeader } from 'components/GlobalCard/style';
// import { Img } from 'components/inputs/input/style.js'

// import { useDispatch, useSelector } from 'react-redux';
// import { loadInsurer, clear, tpaOnboard } from '../user.slice';
// import { numOnly, noSpecial } from "utils";

// // unique validation
// const uniquePropertyTest = function (value, propertyName, message) {
//   if (
//     this.parent
//       .filter(v => v !== value)
//       .some(v => _.get(v, propertyName) === _.get(value, propertyName)) && value.name && value.url
//   ) {
//     throw this.createError({
//       path: `${this.path}.${propertyName}`,
//       message
//     });
//   }

//   return true;
// };
// yup.addMethod(yup.object, 'uniqueProperties', function (propertyNames) {
//   return this.test('unique', '', function (value) {
//     const errors = propertyNames.map(([propertyName, message]) => {
//       try {
//         return uniquePropertyTest.call(this, value, propertyName, message);
//       } catch (error) {
//         return error;
//       }
//     }).filter(error => error instanceof yup.ValidationError);

//     if (!_.isEmpty(errors)) {
//       throw new yup.ValidationError(errors);
//     }

//     return true;
//   });
// });

// const validationSchema = yup.object().shape({
//   name: yup.string().required('Name required').test('alphabets', 'Name must contain only alphabets', (value) => {
//     return /^([A-Za-z\s])+$/.test(value?.trim());
//   }),
//   email_1: yup.string().email('Must be a valid email').required('Email required'),
//   contact_1: yup.string().test('len', 'Must be 10 digits', val => (val)?.toString().length === 10),
//   address_line_1: yup.string().required('Address required').min(8, 'Must be atleast 8 letters'),
//   address_line_2: yup.string().required('Address required').min(8, 'Must be atleast 8 letters'),
//   tpa_services: yup.array().of(
//     yup.object().uniqueProperties([
//       ['name', 'Service name must be unique'],
//       ['url', 'Service URL must be unique']
//     ]).shape({
//       name: yup.string().required('Please enter name').max(30, 'Max 30 char').test('alphabets', 'Name must contain only alphabets', (value) => {
//         return /^[a-zA-Z ]*$/.test(value?.trim());
//       }),
//       url: yup.string().url('Enter valid Url').required('Please enter url'),
//       headers: yup.string().required('Please enter headers'),
//       username: yup.string().required('Please enter username'),
//       password: yup.string().required('Please enter password')
//     }))
// });

// export const OnBoardTpa = ({ type = 'TPA' }) => {

//   const history = useHistory();
//   const { control, errors, handleSubmit } = useForm({ validationSchema });
//   const dispatch = useDispatch();
//   const [serviceCount, setServiceCount] = useState(1);
//   const [hasIC, setHasIC] = useState();
//   const { currentUser, userType } = useSelector(state => state.login);
//   const { loading, success, error, data } = useSelector(state => state.userManagement);


//   useEffect(() => {
//     dispatch(loadInsurer());

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])


//   useEffect(() => {
//     if (!loading && error) {
//       swal("Alert", error, "warning");
//     };
//     if (!loading && success) {
//       swal('Success', success, "success");
//       history.goBack();
//     };

//     return () => { dispatch(clear()) }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [success, error, loading]);


//   const addCount = () => {
//     setServiceCount(prev => prev ? prev + 1 : 1);
//   }

//   const subCount = () => {
//     setServiceCount(prev => prev === 1 ? 1 : prev - 1);
//   }

//   const onSubmit = data => {

//     dispatch(tpaOnboard({
//       ...data,
//       ...userType ? { broker_id: currentUser.broker_id } : { ic_id: currentUser.ic_id },
//       status: data.status ? 1 : 0
//     }));
//   };


//   return (
//     <>
//       <Card title={`Add ${type}`}>
//         <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
//           <Row className="d-flex flex-wrap justify-content-center">
//             <Col md={6} lg={6} xl={3} sm={12}>
//               <Controller
//                 as={<Input label={`${type} Name`} placeholder={`Enter ${type} Name`} isRequired />}
//                 name="name"
//                 error={errors && errors.name}
//                 control={control}
//               />
//               {!!errors.name &&
//                 <Error>
//                   {errors.name.message}
//                 </Error>}
//             </Col>
//             <Col md={6} lg={6} xl={3} sm={12}>
//               <Controller
//                 as={<Input label="Email" type="email" placeholder={`Enter ${type} Email`} isRequired />}
//                 name="email_1"
//                 error={errors && errors.email_1}
//                 control={control}
//               />
//               {!!errors.email_1 &&
//                 <Error>
//                   {errors.email_1.message}
//                 </Error>}
//             </Col>
//             <Col md={6} lg={6} xl={3} sm={12}>
//               <Controller
//                 as={<Input label="Mobile No" maxLength={10}
//                   onKeyDown={numOnly} onKeyPress={noSpecial} type='tel' min={0} placeholder={`Enter ${type} Mobile No`} isRequired />}
//                 name="contact_1"
//                 error={errors && errors.contact_1}
//                 control={control}
//               />
//               {!!errors.contact_1 &&
//                 <Error>
//                   {errors.contact_1.message}
//                 </Error>}
//             </Col>

//             <Col md={6} lg={6} xl={3} sm={12}>
//               <Controller
//                 as={<Switch />}
//                 name="status"
//                 control={control}
//                 defaultValue={0}
//                 isRequired
//               />
//             </Col>
//             {(userType === "Super Admin") &&
//               <Col md={6} lg={6} xl={3} sm={12}>
//                 <Controller
//                   as={<Switch />}
//                   label='Have IC'
//                   name="has_ic"
//                   onChange={([e]) => { setHasIC(e); return e }}
//                   control={control}
//                   defaultValue={0}
//                   isRequired
//                 />
//               </Col>
//             }
//             {(userType === "Super Admin" && !!hasIC) &&
//               <Col md={6} lg={6} xl={3} sm={12}>
//                 <Controller
//                   as={<Select
//                     label="Insurer"
//                     option={data?.data || []}
//                     isRequired={true}
//                     valueName="name"
//                     selected=""
//                     id="id"
//                   />}
//                   name="insurerId"
//                   control={control}
//                 />
//               </Col>
//             }
//           </Row>

//           <Row className="d-flex flex-wrap">
//             <Col md={6} lg={6} xl={6} sm={12}>
//               <Controller
//                 as={<Input label="Address 1" placeholder={`Enter ${type} Address`} isRequired />}
//                 name="address_line_1"
//                 error={errors && errors.address_line_1}
//                 control={control}
//               />
//               {!!errors.address_line_1 &&
//                 <Error>
//                   {errors.address_line_1.message}
//                 </Error>}
//             </Col>
//             <Col md={6} lg={6} xl={6} sm={12}>
//               <Controller
//                 as={<Input label="Address 2" placeholder={`Enter ${type} Address`} isRequired />}
//                 name="address_line_2"
//                 error={errors && errors.address_line_2}
//                 control={control}
//               />
//               {!!errors.address_line_2 &&
//                 <Error>
//                   {errors.address_line_2.message}
//                 </Error>}
//             </Col>
//           </Row>

//           <div>
//             <h5 className="mt-5>Services</h5>
//           </div>
//           {[...Array(Number(serviceCount))].map((_, index) => (
//             <Fragment key={index + 'sevices'}>
//               <BottomHeader />
//               <Row key={'services' + index} className='justify-content-center'>
//                 <Col md={6} lg={6} xl={4} sm={12}>
//                   <Controller
//                     as={<Input label='Service Name' placeholder='Enter Service Name' isRequired />}
//                     name={`tpa_services[${index}].name`}
//                     error={errors && errors?.tpa_services?.length && errors.tpa_services[index]?.name}
//                     control={control}
//                   />
//                   {!!errors?.tpa_services?.length && errors.tpa_services[index]?.name &&
//                     <Error>
//                       {errors?.tpa_services?.length && errors.tpa_services[index]?.name.message}
//                     </Error>}
//                 </Col>
//                 <Col md={6} lg={6} xl={4} sm={12}>
//                   <Controller
//                     as={<Input label='Service URL' placeholder='Enter Service URL' isRequired />}
//                     name={`tpa_services[${index}].url`}
//                     error={errors && errors?.tpa_services?.length && errors.tpa_services[index]?.url}
//                     control={control}
//                   />
//                   {!!errors?.tpa_services?.length && errors.tpa_services[index]?.url &&
//                     <Error>
//                       {errors?.tpa_services?.length && errors.tpa_services[index]?.url.message}
//                     </Error>}
//                 </Col>
//                 <Col md={6} lg={6} xl={4} sm={12}>
//                   <Controller
//                     as={<Switch />}
//                     label='Is JSON'
//                     name={`tpa_services[${index}].is_json`}
//                     // onChange={([e]) => { setHasIC(e); return e }}
//                     control={control}
//                     defaultValue={0}
//                     isRequired
//                   />
//                 </Col>
//                 <Col md={12} lg={12} xl={12} sm={12}>
//                   <Controller
//                     as={
//                       // <Input label='Headers' placeholder='Enter Headers' isRequired />
//                       <InputText className="form-control" placeholder='Enter Headers' isRequired />
//                     }
//                     name={`tpa_services[${index}].headers`}
//                     error={errors && errors?.tpa_services?.length && errors.tpa_services[index]?.headers}
//                     control={control}
//                   />
//                   <label className="form-label">
//                     <span className="span-label">Header
//                     <sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup></span>
//                   </label>
//                   {!!errors?.tpa_services?.length && errors.tpa_services[index]?.headers &&
//                     <Error className='mt-1'>
//                       {errors?.tpa_services?.length && errors.tpa_services[index]?.headers.message}
//                     </Error>}
//                 </Col>
//                 <Col md={6} lg={6} xl={4} sm={12}>
//                   <Controller
//                     as={<Input label='Service Username' placeholder='Enter Service Username' isRequired />}
//                     name={`tpa_services[${index}].username`}
//                     error={errors && errors?.tpa_services?.length && errors.tpa_services[index]?.username}
//                     control={control}
//                   />
//                   {!!errors?.tpa_services?.length && errors.tpa_services[index]?.username &&
//                     <Error>
//                       {errors?.tpa_services?.length && errors.tpa_services[index]?.username.message}
//                     </Error>}
//                 </Col>
//                 <Col md={6} lg={6} xl={4} sm={12}>
//                   <Controller
//                     as={<Input label='Service Password' placeholder='Enter Service Password' isRequired />}
//                     name={`tpa_services[${index}].password`}
//                     error={errors && errors?.tpa_services?.length && errors.tpa_services[index]?.password}
//                     control={control}
//                   />
//                   {!!errors?.tpa_services?.length && errors.tpa_services[index]?.password &&
//                     <Error>
//                       {errors?.tpa_services?.length && errors.tpa_services[index]?.password.message}
//                     </Error>}
//                 </Col>
//               </Row>
//             </Fragment>
//           ))}
//           <BottomHeader />
//           <Row className='mt-3'>
//             <Col className="d-flex justify-content-end align-items-center">
//               <Button buttonStyle="warning" type='button' onClick={addCount}>
//                 <i className="ti ti-plus"></i> Add{'\u00A0'}
//               </Button>
//               {serviceCount !== 1 &&
//                 <Button buttonStyle="danger" type='button' onClick={subCount}>
//                   <i className="ti ti-minus"></i> Remove
//                 </Button>
//               }
//             </Col>
//           </Row>


//           <Row >
//             <Col md={12} className="d-flex justify-content-end mt-4">
//               <Button type="submit">
//                 Submit
//              </Button>
//             </Col>
//           </Row>

//         </Form>
//       </Card>
//       {loading && <Loader />}
//     </>
//   )
// }

// const InputText = styled(TextArea)`
// overflow: hidden;
// min-height: 80px;
// border-color: ${({ error }) => error ? 'red' : '#cae9ff'};
// `
