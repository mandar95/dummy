/*
Module: Plan Details
User Type: Admin
Commented By: Salman Ahmed
 */

// import React, { useEffect, useState, useCallback } from 'react'
// import swal from "sweetalert";
// import _ from 'lodash';
// import * as yup from 'yup';

// import { Card, Chip, Input, Select, Button, Error, TabWrapper, Tab } from '../../../components';
// import { Row, Col, Form, Button as Btn } from 'react-bootstrap';
// import { Roles } from './Roles'

// import { useDispatch, useSelector } from 'react-redux';
// import { useForm, Controller } from "react-hook-form";
// import { Switch } from '../../user-management/AssignRole/switch/switch';
// import { storePlan, updatePlan, loadPlan, clear_plan, loadOptions, clear, clear_plan_modules } from '../saas.slice';
// import { BenefitList } from '../../policies/steps/additional-details/styles';
// import { useParams, useHistory } from 'react-router';
// import { numOnly, noSpecial } from "utils";
// import { Decrypt } from '../../../utils';


// const validationSchema = yup.object().shape({
//   name: yup.string()
//     .required('Required')
//     .matches(/^([A-Za-z\s])+$/, 'Must contain only alphabets'),
//   price: yup.string()
//     .required('Required')
//     .matches(/^[0-9]+$/, 'Not valid number'),
//   monthly_price: yup.string()
//     .required('Required')
//     .matches(/^[0-9]+$/, 'Not valid number'),
//   quaterly_price: yup.string()
//     .required('Required')
//     .matches(/^[0-9]+$/, 'Not valid number'),
//   half_yearly_price: yup.string()
//     .required('Required')
//     .matches(/^[0-9]+$/, 'Not valid number'),
//   yearly_price: yup.string()
//     .required('Required')
//     .matches(/^[0-9]+$/, 'Not valid number')
// });

// export const CreatePlan = ({ setDataTable }) => {

//   const dispatch = useDispatch();
//   const [tab, setTab] = useState("Broker");
//   const history = useHistory();
//   const { policy_types, plan, success, loading, error,
//     modules, plan_modules } = useSelector(state => state.saas);
//   const { control, errors, reset, handleSubmit, watch, register } = useForm({
//     validationSchema, mode: "onBlur",
//     reValidateMode: "onBlur"
//   });
//   const [startDate, setStartDate] = useState('');
//   const [policyType, setPolicyType] = useState();
//   const [policyTypes, setPolicyTypes] = useState([]);
//   const [feature, setFeature] = useState('');
//   const [features, setFeatures] = useState([]);
//   let { id } = useParams();
//   id = Decrypt(id);

//   useEffect(() => {

//     return () => {
//       dispatch(clear_plan());
//       dispatch(clear_plan_modules());
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   useEffect(() => {
//     if (modules.length && id) {
//       dispatch(loadPlan(id, modules));
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [modules])

//   useEffect(() => {
//     if (!policy_types.length)
//       dispatch(loadOptions());

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [policy_types])

//   useEffect(() => {
//     if (!_.isEmpty(plan) && id) {
//       reset(plan)
//       setFeatures(plan.features.map(({ name }) => (name)) || [])
//       setPolicyTypes(plan.plan_policy_types.map(({ name, policy_type_id }) => ({ id: policy_type_id, name })) || [])
//     }
//   }, [plan, reset, id])

//   const resetForm = useCallback(() => {
//     reset({
//       name: '',
//       tagline: '',
//       description: '',
//       status: '',
//       // master_user_types_id: '',
//       start_date: '',
//       end_date: '',
//       price: '',
//       monthly_price: '',
//       quaterly_price: '',
//       half_yearly_price: '',
//       yearly_price: '',
//       // master_plan_types_id: '',
//       policy_types: '',
//       feature_name: '',
//       // broker: {
//       //   module_id: [],
//       //   canread: [],
//       //   canwrite: [],
//       //   candelete: []
//       // },
//       // 'broker.canread': '',
//       // 'broker.canwrite': '',
//       // 'broker.candelete': ''
//     });
//     setFeatures([]);
//     setPolicyTypes([]);
//   }, [reset])

//   useEffect(() => {
//     if (!loading && error) {
//       swal("Alert", error, "warning");
//     };

//     if (!loading && success) {
//       swal('Success', success, "success");
//       resetForm()
//       if (id)
//         history.push('/admin/plans')
//       if (setDataTable)
//         setDataTable('PlansData')
//     };

//     return () => { dispatch(clear()) }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [success, loading, error]);




//   const addPolicyType = () => {
//     if (policyType && Number(policyType)) {
//       const flag = policy_types?.find(
//         (value) => value?.id === Number(policyType)
//       );
//       const flag2 = policyTypes.some((value) => value?.id === Number(policyType));
//       if (flag && !flag2) {
//         setPolicyTypes((prev) => [...prev, flag]);
//         setPolicyType('')
//         reset({ policy_types: '' })
//       }
//     }
//   };

//   const removePolicyType = (Broker) => {
//     const filteredPolicyType = policyTypes?.filter((item) => item?.id !== Broker);
//     setPolicyTypes((prev) => [...filteredPolicyType]);
//   };


//   const addFeature = () => {
//     const flag = features.some((value) => value === feature);
//     if (!flag && feature) {
//       setFeatures((prev) => [...prev, feature]);
//       setFeature('')
//       reset({ feature_name: '' })
//     }
//   };

//   const removeFeature = (Broker) => {
//     const filteredFeature = features?.filter((item) => item !== Broker);
//     setFeatures([...filteredFeature]);
//   };


//   const onSubmit = (data) => {

//     if (!features.length && !policyTypes.length) {
//       swal('Validation', "Policy types & features  can't be empty", "info");
//       return;
//     }
//     if (!features.length) {
//       swal('Validation', "features can't be empty", "info");
//       return;
//     }

//     if (!policyTypes.length) {
//       swal('Validation', "Policy types can't be empty", "info");
//       return;
//     }


//     const {
//       name,
//       tagline,
//       description,
//       status,
//       // master_user_types_id,
//       start_date,
//       end_date,
//       price,
//       monthly_price,
//       quaterly_price,
//       half_yearly_price,
//       yearly_price,
//       // master_plan_types_id
//     } = data

//     const result = {
//       name,
//       tagline,
//       description,
//       status: status === 0 ? 0 : 1,
//       // master_user_types_id,
//       start_date,
//       end_date,
//       price,
//       monthly_price,
//       quaterly_price,
//       half_yearly_price,
//       yearly_price,
//       // master_plan_types_id,
//       // 'modules': data?.module_id?.filter(Number) || [],
//       // 'can_read': data?.canread?.filter(Number) || [],
//       // 'can_write': data?.canwrite?.filter(Number) || [],
//       // 'can_delete': data?.candelete?.filter(Number) || [],
//       broker_access_writes: {
//         modules: data?.broker?.module_id?.map((value, index) => value && index).filter(Number) || [],
//         can_read: data?.broker?.canread?.map((value, index) => value && index).filter(Number) || [],
//         can_write: data?.broker?.canwrite?.map((value, index) => value && index).filter(Number) || [],
//         can_delete: data?.broker?.candelete?.map((value, index) => value && index).filter(Number) || [],
//       },
//       employer_access_writes: {
//         modules: data?.employer?.module_id?.map((value, index) => value && index).filter(Number) || [],
//         can_read: data?.employer?.canread?.map((value, index) => value && index).filter(Number) || [],
//         can_write: data?.employer?.canwrite?.map((value, index) => value && index).filter(Number) || [],
//         can_delete: data?.employer?.candelete?.map((value, index) => value && index).filter(Number) || [],
//       },
//       features,
//       policy_types: policyTypes.map(({ id }) => id),
//     };

//     if (!result.broker_access_writes.modules.length && !result.employer_access_writes.modules.length) {
//       swal('Validation', "No module selected for broker or employer", "info");
//       return;
//     }

//     dispatch(id ? updatePlan(result, id) : storePlan(result))


//   }

//   return (
//     <Card title={id ? 'Update Plan' : 'Create Plan'}>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Row className="d-flex flex-wrap">
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Plan Name"
//                 placeholder="Enter Plan Name"
//                 required />}
//               name="name"
//               error={errors && errors.name}
//               control={control}
//             />
//             {!!errors.name &&
//               <Error>
//                 {errors.name.message}
//               </Error>}
//           </Col>
//           {/* <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={
//                 <Select
//                   label="Client Type"
//                   placeholder='Select Client Type'
//                   options={users_master}
//                   id="id"
//                   required
//                 />}
//               control={control}
//               name="master_user_types_id"
//             />
//           </Col> */}
//           {/* <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={
//                 <Select
//                   label="Plan Type"
//                   placeholder='Select Plan Type'
//                   options={plan_types.map((item) => ({
//                     id: item?.id,
//                     name: item?.name,
//                     value: item?.id,
//                   }))}
//                   id="id"
//                   required
//                 />}
//               control={control}
//               name="master_plan_types_id"
//             />
//           </Col> */}
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Switch />}
//               name="status"
//               control={control}
//               defaultValue={1}
//             />

//           </Col>
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Start Date"
//                 type='date'
//                 placeholder="Enter Start Date"
//                 required />}
//               onChange={([e]) => { setStartDate(e.target.value); return e }}
//               name="start_date"
//               error={errors && errors.start_date}
//               control={control}
//             />
//           </Col>
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="End Date"
//                 type='date'
//                 min={startDate}
//                 placeholder="Enter End Date"
//                 required />}
//               name="end_date"
//               error={errors && errors.end_date}
//               control={control}
//             />
//           </Col>
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Price"
//                 maxLength={15}
//                 onKeyDown={numOnly} onKeyPress={noSpecial}
//                 type='tel'
//                 min={0}
//                 placeholder="Enter Price"
//                 required />}
//               name="price"
//               error={errors && errors.price}
//               control={control}
//             />
//             {!!errors.price &&
//               <Error>
//                 {errors.price.message}
//               </Error>}
//           </Col>
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Monthly Price"
//                 maxLength={15}
//                 onKeyDown={numOnly} onKeyPress={noSpecial}
//                 type='tel'
//                 min={0}
//                 placeholder="Enter Monthly Price"
//                 required />}
//               name="monthly_price"
//               error={errors && errors.monthly_price}
//               control={control}
//             />
//             {!!errors.monthly_price &&
//               <Error>
//                 {errors.monthly_price.message}
//               </Error>}
//           </Col>
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Quaterly Price"
//                 maxLength={15}
//                 onKeyDown={numOnly} onKeyPress={noSpecial}
//                 type='tel'
//                 min={0}
//                 placeholder="Enter Quaterly Price"
//                 required />}
//               name="quaterly_price"
//               error={errors && errors.quaterly_price}
//               control={control}
//             />
//             {!!errors.quaterly_price &&
//               <Error>
//                 {errors.quaterly_price.message}
//               </Error>}
//           </Col>
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Half Yearly Price"
//                 maxLength={15}
//                 onKeyDown={numOnly} onKeyPress={noSpecial}
//                 type='tel'
//                 min={0}
//                 placeholder="Enter Half Yearly Price"
//                 required />}
//               name="half_yearly_price"
//               error={errors && errors.half_yearly_price}
//               control={control}
//             />
//             {!!errors.half_yearly_price &&
//               <Error>
//                 {errors.half_yearly_price.message}
//               </Error>}
//           </Col>
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Yearly Price"
//                 maxLength={15}
//                 onKeyDown={numOnly} onKeyPress={noSpecial}
//                 type='tel'
//                 min={0}
//                 placeholder="Enter Yearly Price"
//                 required />}
//               name="yearly_price"
//               error={errors && errors.yearly_price}
//               control={control}
//             />
//             {!!errors.yearly_price &&
//               <Error>
//                 {errors.yearly_price.message}
//               </Error>}
//           </Col>

//           <Col md={12} lg={12} xl={12} sm={12}>
//             <Controller
//               as={<Input
//                 label="Tagline"
//                 placeholder="Enter Tagline"
//                 required />}
//               name="tagline"
//               error={errors && errors.tagline}
//               control={control}
//             />
//           </Col>
//           <Col md={12} lg={12} xl={12} sm={12}>
//             <Controller
//               as={<Input
//                 label="Description"
//                 placeholder="Enter Description"
//                 required />}
//               name="description"
//               error={errors && errors.description}
//               control={control}
//             />
//           </Col>
//         </Row>
//         <Row className="d-flex flex-wrap">
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={
//                 <Select
//                   label="Policy Types"
//                   placeholder='Select Policy Types'
//                   options={policy_types.map((item) => ({
//                     id: item?.id,
//                     name: item?.name,
//                     value: item?.id,
//                   }))}
//                   id="id"
//                   required={false}
//                 />}
//               onChange={([e]) => {
//                 setPolicyType(e.target.value);
//               }}
//               control={control}
//               name="policy_types"
//             />
//           </Col>
//           <Col md={6} lg={2} xl={2} sm={12} className="d-flex align-items-center">
//             <Btn type="button" onClick={addPolicyType}>
//               <i className="ti ti-plus"></i> Add
//             </Btn>
//           </Col>
//           {!!policyTypes.length && (
//             <Col md={12} lg={12} xl={6} sm={12}>
//               <BenefitList>
//                 {policyTypes.map((item, index) => {
//                   return (
//                     <Chip
//                       key={'policy' + index}
//                       id={item?.id}
//                       name={item?.name}
//                       onDelete={removePolicyType}
//                     />
//                   );
//                 })}
//               </BenefitList>
//             </Col>
//           )}
//         </Row>
//         <Row className="d-flex flex-wrap">
//           <Col md={6} lg={4} xl={3} sm={12}>
//             <Controller
//               as={<Input
//                 label="Features"
//                 placeholder="Enter Features"
//                 required={false} />}
//               name="feature_name"
//               onChange={([e]) => {
//                 setFeature(e.target.value);
//                 return e
//               }}
//               error={errors && errors.features}
//               control={control}
//             />
//           </Col>
//           <Col md={6} lg={2} xl={2} sm={12} className="d-flex align-items-center">
//             <Btn type="button" onClick={addFeature}>
//               <i className="ti ti-plus"></i> Add
//             </Btn>
//           </Col>
//           {!!features.length && (
//             <Col md={12} lg={12} xl={6} sm={12}>
//               <BenefitList>
//                 {features.map((item, index) => {
//                   return (
//                     <Chip
//                       key={'benfit' + index}
//                       id={item}
//                       name={item}
//                       onDelete={removeFeature}
//                     />
//                   );
//                 })}
//               </BenefitList>
//             </Col>
//           )}
//         </Row>
//         <TabWrapper width='300px'>
//           <Tab isActive={Boolean(tab === "Broker")} name={'broker'} onClick={() => setTab("Broker")}>Broker Access</Tab>
//           <Tab isActive={Boolean(tab === "Employer")} name={'employer'} onClick={() => setTab("Employer")}>Employer Access</Tab>
//         </TabWrapper>
//         <div style={{ display: (tab === "Broker") ? 'block' : 'none' }}>
//           {<Roles modules={id ? plan_modules['broker'] : modules} name={'broker'} id={id} watch={watch} register={register} />}
//         </div>
//         <div style={{ display: (tab === "Employer") ? 'block' : 'none' }}>
//           {<Roles modules={id ? plan_modules['employer'] : modules} name={'employer'} id={id} watch={watch} register={register} />}
//         </div>

//         {/* <Roles Controller={Controller} id={id} control={control} /> */}
//         <Row className="d-flex flex-wrap">
//           <Col md={12} className="d-flex justify-content-end mt-4">
//             {/* {!id && <Button buttonStyle={'danger'} type="button" onClick={resetForm}>
//               Reset
//             </Button>} */}
//             <Button type="submit">
//               {id ? 'Update' : 'Submit'}
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Card>
//   )
// }
