/*
Module: Declaration
User Type: Broker/Insurer
Commented By: Salman Ahmed
*/

// import React, { useState, useEffect, useRef } from "react";
// import { Row, Col, Form, Button as Btn } from "react-bootstrap";
// import * as yup from "yup";
// import swal from "sweetalert";
// import styled from 'styled-components';
// // import _ from "lodash";
// import { CardBlue, Button, Error, Select, Loader } from "components";

// import { Switch } from "modules/user-management/AssignRole/switch/switch";

// import { CarausalDiv } from 'modules/announcements/style/';
// import { SelectSpan } from 'components/inputs/Select/style';

// import { useParams, useHistory } from 'react-router-dom';

// import { useForm, Controller } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     getBrokers,
// } from "modules/wellness/wellness.slice";
// import {
//     clear, clearDeclaration,
//     getAllAdminDeclaration,
//     updateAdminDeclaration,
//     setAdminDeclaration,
//     getAllIcList
// } from "modules/documents/documents.slice";
// import { InsurerAll } from 'modules/RFQ/rfq.slice';
// import { Decrypt } from "../../../utils";

// // import { insurer } from 'config/validations';



// const Label = styled.label`
// 
// `


// const ADDDeclrationConfig = (props) => {
//     let { userType, id } = useParams();
//     id = Decrypt(id);
//     const history = useHistory();
//     const closeBtn = useRef(null);
//     const [trigger, setTrigger] = useState(true);
//     const validationSchema = yup.object().shape({
//         ...((!id) && {
//             user_Type: yup.string().required("Please select userType"),
//         }),
//         ...((!id && trigger) && {
//             ic_id: yup.string().required("Please select Insurer"),
//         }),
//         ...((!id && !trigger) && {
//             broker_id: yup.string().required("Please select broker"),
//         }),
//         declarationData: yup.array().of(
//             yup.object().shape({
//                 declaration: yup.string()
//                     .required("Declaration name is required"),
//             })),
//         //.min(validation.name.min, `Minimum ${validation.name.min} character required`)
//         //.matches(validation.name.regex, 'Must contain only alphabets')
//     });

//     const dispatch = useDispatch();

//     const { success, error, loading, allAdminDeclrationData, AllICListData } = useSelector((state) => state.documents);
//     const { brokers } = useSelector((state) => state.wellness);
//     const { insurer } = useSelector(
//         (state) => state.rfq
//     );
//     // const [modalShow, setModalShow] = useState(false);
//     // const [editId, setEditId] = useState(null);
//     // const [editDetails, setEditDetails] = useState([]);
//     // const [show, setShow] = useState(false);
//     const [ICData, setICID] = useState([]);


//     // const [declarationCount, setDeclarationCount] = useState(1);

//     const { control, errors, handleSubmit, setValue, watch } = useForm({
//         validationSchema,
//     });


//     const icID = watch('ic_id');
//     const brokerID = watch('broker_id');
//     const user_Type = watch('user_Type');


//     useEffect(() => {
//         dispatch(clearDeclaration());
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [trigger])

//     useEffect(() => {
//         if (id && AllICListData.length !== 0) {
//             let filterData = AllICListData.filter((item, index) => {
//                 return Number(item.id) === parseInt(id)
//             })
//             setICID(filterData)
//             if (filterData[0].ic_id) {
//                 dispatch(getAllAdminDeclaration({
//                     ic_id: filterData[0].ic_id
//                 }))
//             }
//             else {
//                 dispatch(getAllAdminDeclaration({
//                     broker_id: filterData[0].broker_id
//                 }))
//             }

//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [id, AllICListData])

//     // add counter component
//     const add = () => {
//         if (allAdminDeclrationData.length !== 10) {
//             let newData = allAdminDeclrationData.map((item, index) => {
//                 let Declaration = watch(`declarationData[${index}].declaration`);
//                 let isMandatory = watch(`declarationData[${index}].is_mandatory`);
//                 return {
//                     ...item,
//                     declaration: Declaration,
//                     is_mandatory: isMandatory
//                 }
//             })

//             const data = [...newData, { declaration: "", is_mandatory: 0 }]
//             dispatch(setAdminDeclaration({
//                 data: [...data],
//             }));
//         }
//         else {
//             swal("Can not add declaration more than 10", "", "warning")
//         }
//     }

//     const remove = () => {
//         let filterData = allAdminDeclrationData.filter((item, index) => {
//             return index !== (allAdminDeclrationData.length - 1)
//         })
//         dispatch(setAdminDeclaration({
//             data: [...filterData],
//         }));
//     }

//     useEffect(() => {
//         if (icID) {
//             dispatch(getAllAdminDeclaration({
//                 ic_id: icID
//             }))
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [icID])

//     useEffect(() => {
//         if (brokerID) {
//             dispatch(getAllAdminDeclaration({
//                 broker_id: brokerID
//             }))
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [brokerID])

//     useEffect(() => {
//         dispatch(InsurerAll());
//         dispatch(getBrokers());
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     useEffect(() => {
//         if (allAdminDeclrationData.length === 0 && (icID || brokerID)) {
//             add()
//         }
//         allAdminDeclrationData.forEach((item, index) => {
//             setValue(`declarationData[${index}].declaration`, item.declaration)
//             setValue(`declarationData[${index}].is_mandatory`, item.is_mandatory)
//         })
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [allAdminDeclrationData])

//     useEffect(() => {
//         if (success) {
//             if (id) history.replace(`/${userType}/declaration-config`)
//             else closeBtn.current.click()
//             dispatch(getAllIcList())
//             swal('Success', success, "success").then(() => {
//                 //dispatch(clear());
//             });
//             // swal(success, "", "success").then(() => {
//             //     if(id) history.replace(`/${userType}/declaration-config`)
//             //     else alert('y')
//             // })
//         }
//         if (error) {
//             swal("Alert", error, "warning");
//         }
//         return () => {
//             dispatch(clearDeclaration());
//             dispatch(clear())
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [success, error])

//     useEffect(() => {
//         if (user_Type === "1") {
//             setTrigger(true)
//         }
//         else {
//             setTrigger(false)
//         }
//     }, [user_Type])

//     const onSubmit = (data) => {
//         dispatch(updateAdminDeclaration({
//             declarations: data.declarationData,
//             ...((id && ICData[0].ic_id) && { ic_id: `${ICData[0].ic_id}` }),
//             ...((id && ICData[0].broker_id) && { broker_id: `${ICData[0].broker_id}` }),
//             ...((!id && trigger) && { ic_id: icID }),
//             ...((!id && !trigger) && { broker_id: brokerID }),
//             _method: "PATCH"
//         }))
//     }

//     const goBack = () => {
//         if (id) {
//             history.replace(`/${userType}/declaration-config`)
//         } else {
//             props.onHide()
//         }
//     }
//     //card title------------------
//     const title = (
//         <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
//             <span style={{ width: "100%" }}>{id ? 'Edit Declaration' : 'Add Declaration'}</span>
//         </div>
//     );

//     return (
//         <>
//             <div style={{ display: "flex", justifyContent: "flex-start", margin: '15px 0px 0px 40px' }}>
//                 <Btn size="sm" varient="primary" onClick={goBack} style={{ width: '85px' }}>
//                     <span style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}><i className="fa fa-long-arrow-left"></i>&nbsp;&nbsp;back</span>
//                 </Btn>
//             </div>
//             <CardBlue title={title}>
//                 <Form onSubmit={handleSubmit(onSubmit)}>
//                     <Row style={{ marginBottom: '15px' }}>
//                         {!id ? <>
//                             {/* <TabWrapper width={'350px'}>
//                                 <Tab isActive={trigger} onClick={() => setTrigger(true)}>
//                                     Insurer
//                                 </Tab>
//                                 <Tab isActive={!trigger} onClick={() => setTrigger(false)}>
//                                     Broker
//                                 </Tab>
//                             </TabWrapper> */}
//                             <Col sm="12" md="12" lg="12" xl="12">
//                                 <Controller
//                                     as={
//                                         <Select
//                                             label="User Type"
//                                             placeholder="Select User Type"
//                                             required={false}
//                                             isRequired={true}
//                                             options={
//                                                 [{ id: 1, name: 'Insurer' }, { id: 2, name: 'Broker' }]?.map((item) => ({
//                                                     id: item?.id,
//                                                     name: item?.name,
//                                                     value: item?.id,
//                                                 })) || []
//                                             }
//                                         />
//                                     }
//                                     name="user_Type"
//                                     control={control}
//                                     defaultValue={""}
//                                     error={errors && errors.user_Type}
//                                 />
//                                 {!!errors?.user_Type && <Error>{errors?.user_Type?.message}</Error>}
//                             </Col>
//                             {(trigger && user_Type) &&
//                                 <Col sm="12" md="12" lg="12" xl="12">
//                                     <Controller
//                                         as={
//                                             <Select
//                                                 label="Insurer"
//                                                 placeholder="Select Insurer"
//                                                 required={false}
//                                                 isRequired={true}
//                                                 options={
//                                                     insurer?.map((item) => ({
//                                                         id: item?.id,
//                                                         name: item?.name,
//                                                         value: item?.id,
//                                                     })) || []
//                                                 }
//                                             />
//                                         }
//                                         name="ic_id"
//                                         control={control}
//                                         defaultValue={""}
//                                         error={errors && errors.ic_id}
//                                     />
//                                     {!!errors?.ic_id && <Error>{errors?.ic_id?.message}</Error>}
//                                 </Col>
//                             }
//                             {(!trigger && user_Type) &&
//                                 <Col sm="12" md="12" lg="12" xl="12">
//                                     <Controller
//                                         as={
//                                             <Select
//                                                 label="Broker"
//                                                 placeholder="Select Broker"
//                                                 required={false}
//                                                 isRequired={true}
//                                                 options={
//                                                     brokers?.map((item) => ({
//                                                         id: item?.id,
//                                                         name: item?.name,
//                                                         value: item?.id,
//                                                     })) || []
//                                                 }
//                                             />
//                                         }
//                                         name="broker_id"
//                                         control={control}
//                                         defaultValue={""}
//                                         error={errors && errors.broker_id}
//                                     />
//                                     {!!errors?.broker_id && <Error>{errors?.broker_id?.message}</Error>}
//                                 </Col>
//                             }
//                         </> :
//                             <>
//                                 <Col sm="12" md="6" lg="6" xl="6" className="d-flex justify-content-center">
//                                     <Label>Name:&nbsp;&nbsp;</Label>
//                                     <Label>{ICData[0]?.name}</Label>
//                                 </Col>
//                                 <Col sm="12" md="6" lg="6" xl="6" className="d-flex justify-content-center">
//                                     <Label>type:&nbsp;&nbsp;</Label>
//                                     <Label>{ICData[0]?.type}</Label>
//                                 </Col>
//                             </>
//                         }
//                     </Row>
//                     {allAdminDeclrationData?.map((item, index) => (

//                         <Row key={index + 'declaration-2'}>
//                             <Col md={12} lg={8} xl={8} sm={12}>
//                                 <CarausalDiv style={{ borderBottom: 'none' }}>
//                                     <div style={{ padding: "10px", marginTop: "10px" }}>
//                                         <div style={{ display: "flex", justifyContent: "center" }}>
//                                             <SelectSpan style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
//                                                 {`Declaration Name ${index + 1}`}
//                                                 <sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
//                                             </SelectSpan>
//                                         </div>
//                                         <Controller
//                                             as={<Form.Control as="textarea" rows="3" />}
//                                             name={`declarationData[${index}].declaration`}
//                                             control={control}
//                                             defaultValue={item.declaration}
//                                             error={errors && errors?.declarationData?.length && errors.declarationData[index]?.declaration}
//                                             style={{ resize: 'none' }}
//                                         />
//                                     </div>
//                                     {!!errors?.declarationData?.length && errors.declarationData[index]?.declaration &&
//                                         <Error>
//                                             {errors?.declarationData?.length && errors.declarationData[index]?.declaration.message}
//                                         </Error>}
//                                 </CarausalDiv>
//                             </Col>
//                             <Col md={12} lg={4} xl={4} sm={12}>
//                                 <div style={{ marginTop: '55px' }}>
//                                     <Controller
//                                         as={<Switch label="Is Mandatory" />}
//                                         name={`declarationData[${index}].is_mandatory`}
//                                         control={control}
//                                         defaultValue={item.is_mandatory}
//                                         error={errors && errors?.declarationData?.length && errors.declarationData[index]?.is_mandatory}
//                                     />
//                                     {!!errors?.declarationData?.length && errors.declarationData[index]?.is_mandatory &&
//                                         <Error>
//                                             {errors?.declarationData?.length && errors.declarationData[index]?.is_mandatory.message}
//                                         </Error>}
//                                 </div>
//                             </Col>

//                         </Row>

//                     ))}
//                     {(icID || id || brokerID) &&
//                         <>
//                             <Row className='mt-3'>
//                                 <Col className="d-flex justify-content-center align-items-center">
//                                     <Button buttonStyle="warning" type='button' onClick={add}>
//                                         <i className="ti ti-plus"></i> Add{'\u00A0'}
//                                     </Button>
//                                     {allAdminDeclrationData.length !== 1 &&
//                                         <Button buttonStyle="danger" type='button' onClick={remove}>
//                                             <i className="ti ti-minus"></i> Remove{'\u00A0'}
//                                         </Button>
//                                     }
//                                 </Col>
//                             </Row>
//                             <Row>
//                                 <Col md={12} className="d-flex justify-content-end mt-4">
//                                     {!id &&

//                                         <Button buttonStyle="danger" type='button' onClick={props.onHide} ref={closeBtn}>
//                                             <span style={{ fontWeight: "600" }}>Close</span>
//                                         </Button>
//                                     }
//                                     <Button type="submit">
//                                         {id ? `Update & Submit` : `Submit`}
//                                     </Button>
//                                 </Col>
//                             </Row>
//                         </>
//                     }

//                 </Form>
//             </CardBlue>
//             {loading && <Loader />}
//         </>
//     );
// }

// export default ADDDeclrationConfig;
