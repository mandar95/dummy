// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Row, Col, Form, Table } from "react-bootstrap";
// import * as yup from "yup";
// import { CardBlue, SelectComponent, Error } from "components";
// import { Img } from 'components/inputs/Select/style';
// import { ProgressBar } from "modules/EndorsementRequest/progressbar";
// import swal from "@sweetalert/with-react";
// import DataUpload from "./MultipleFileDrop";
// import { Button } from "components/button/Button";
// import {
//     fetchBrokers,
//     fetchEmployers,
//     fetchPoliciesST,
//     fetchPolicies,
//     setPageData,
// } from "modules/networkHospital_broker/networkhospitalbroker.slice";
// import { postECardDataTPA, clear } from "modules/ECard/ECard.slice";
// import { /*sampleFileData,*/ selectSampleResponse, samplefileDetails } from "modules/Allocate/Allocate.slice";
// import { downloadFile } from "utils";
// import "./ecard.css"
// import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";

// import { useForm, Controller } from 'react-hook-form';
// import { useParams } from "react-router";

// const style = {
//     PageButton: {
//         background: "rgb(222, 142, 240, 0.74)",
//         borderRadius: "50%",
//         minWidth: "34px",
//         minHeight: "34px"
//     },
//     Table: { border: "solid 1px #e6e6e6", background: "#00000000", fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' },
//     HeadRow: { background: "#353535", color: "#FFFFFF" },
//     TableHead: {
//         minWidth: "120px",
//     },
//     td: {
//         color: "#666666"
//     }
// }

// /*----------validation schema----------*/
// const validationSchema = (userType) => yup.object().shape({
//     ...(userType === 'broker' && {
//         employer_id: yup.object().shape({
//             id: yup.string().required('Employer required')
//         }).nullable()
//     }),
//     policy_sub_type_id: yup.object().shape({
//         id: yup.string().required('Policy Type required'),
//     }).nullable(),
//     policy_id: yup.object().shape({
//         id: yup.string().required('Policy Name required'),
//     }).nullable(),
// })


// const ECardUpload = () => {
//     const { userType } = useParams();
//     const { control, errors, handleSubmit, watch, setValue } = useForm({
//         validationSchema: validationSchema(userType)
//     });
//     const [file, setFile] = useState([]);
//     const [resetFile, setResetFile] = useState(false);
//     const dispatch = useDispatch();
//     const { userType: userTypeName, currentUser } = useSelector((state) => state.login);
//     const { brokers, employers, policiesST, policies,
//         firstPage,
//         lastPage } = useSelector((state) => state.networkhospitalbroker);
//     const { success, error, loading, ErrorMessage } = useSelector((state) => state.eCard);
//     const SampleResponse = useSelector(selectSampleResponse);

//     // const getFile = (file) => {
//     //     setFile(file);
//     // };

//     useEffect(() => {
//         if (error) {
//             let _obj = JSON.parse(error)
//             if (typeof _obj === "object") {
//                 swal("Data Updated Partially.", "Please Check The Error Table And Upload File Again", "", {
//                     buttons: {
//                         catch: {
//                             text: "View Error Table",
//                             value: "catch",
//                         }
//                     },
//                 }).then((value) => {
//                     switch (value) {
//                         case "catch":
//                             swal(
//                                 <div className="mytable">
//                                     <Table className="text-center m-0" style={style.Table} responsive>
//                                         <thead >
//                                             <tr style={style.HeadRow}>
//                                                 <th scope="col">File Name</th>
//                                                 <th scope="col">Error</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {_obj?.map((item, index) =>
//                                                 <tr key={index + '_obj'}>
//                                                     <th scope="row">{item.file_name}</th>
//                                                     <th scope="row" style={{ color: '#ff1313' }}>{item.error}</th>
//                                                 </tr>
//                                             )}
//                                         </tbody>
//                                     </Table>
//                                 </div>
//                             );
//                             break;
//                         default:
//                             swal("Got away safely!");
//                     }
//                 });
//             }
//             else {
//                 swal(error, "", "warning");
//             }
//         }
//         if (success) {
//             swal('Success', success, "success").then(() => {
//                 ResetValue()
//             });
//         }
//         if (ErrorMessage) {
//             swal(ErrorMessage, "", "warning");
//         }
//         return () => {
//             dispatch(clear());
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [success, error, ErrorMessage])
//     //get broker
//     useEffect(() => {
//         if (userTypeName === "Admin" || userTypeName === "Super Admin") {
//             dispatch(fetchBrokers(userTypeName));
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [userTypeName]);

//     const brokerId = watch("broker_id")?.value || null;
//     /*-x-broker ID -x-*/

//     /*---Employer ID ---*/
//     //get employer
//     // useEffect(() => {
//     //     if (currentUser?.broker_id || brokerId)
//     //         dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }));

//     //     // eslint-disable-next-line react-hooks/exhaustive-deps
//     // }, [currentUser, brokerId]);
//     useEffect(() => {
//         return () => {
//             dispatch(setPageData({
//                 firstPage: 1,
//                 lastPage: 1
//             }))
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])
//     useEffect(() => {
//         if ((currentUser?.broker_id || brokerId) && userType !== "Employee") {
//             if (lastPage >= firstPage) {
//                 var _TimeOut = setTimeout(_callback, 250);
//             }
//             function _callback() {
//                 dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
//             }
//             return () => {
//                 clearTimeout(_TimeOut)
//             }
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [firstPage, brokerId, currentUser]);

//     const employerId = watch("employer_id")?.value || null;

//     //get policy type id
//     useEffect(() => {
//         if (currentUser?.employer_id || employerId)
//             dispatch(
//                 fetchPoliciesST({ employer_id: currentUser?.employer_id || employerId })
//             );
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [currentUser, employerId]);

//     const policyTypeID = watch("policy_sub_type_id")?.value;
//     //get policy id
//     useEffect(() => {
//         if (policyTypeID && (currentUser?.employer_id || employerId))
//             dispatch(
//                 fetchPolicies({
//                     user_type_name: userTypeName,
//                     employer_id: currentUser?.employer_id || employerId,
//                     policy_sub_type_id: policyTypeID,
//                     ...(currentUser.broker_id && { broker_id: currentUser.broker_id })
//                 }, userType === 'broker')
//             );
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [policyTypeID, employerId]);

//     // download Sample file
//     // const getSample = () => {
//     //     dispatch(sampleFileData(63))
//     // }

//     useEffect(() => {
//         if (SampleResponse?.data) {
//             downloadFile(SampleResponse?.data?.data[0].upload_path)
//         }
//         return () => { dispatch(samplefileDetails('')) }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [SampleResponse])

//     const onSubmit = ({ employer_id, policy_id }) => {
//         if (file.length) {
//             const formdata = new FormData();
//             formData.append("employer_id", employer_id?.value || currentUser?.employer_id);
//             formData.append("policy_id", policy_id?.value);

//             file.forEach((data, index) => {
//                 formData.append(`documents[${index}]`, data);
//             });
//             dispatch(postECardDataTPA(formData));
//         }
//         else {
//             swal("Validation", "Please Upload File", "warning");
//         }

//     };

//     const ResetValue = () => {
//         setValue("broker_id", null);
//         setValue("employer_id", null);
//         setValue("policy_sub_type_id", null);
//         setValue("policy_id", null);
//         setResetFile(true)
//     }

//     return (
//         <CardBlue title="E-Card File Upload" round>
//             <Form onSubmit={handleSubmit(onSubmit)}>
//                 <Row>
//                     {(userTypeName === "Admin" || userTypeName === "Super Admin") && (
//                         <Col xl={4} lg={4} md={6} sm={12}>
//                             <Controller
//                                 as={
//                                     <SelectComponent
//                                         label="Broker"
//                                         placeholder="Select Broker"
//                                         required={false}
//                                         isRequired={true}
//                                         options={
//                                             brokers?.map((item) => ({
//                                                 id: item?.id,
//                                                 label: item?.name,
//                                                 value: item?.id,
//                                             })) || []
//                                         }
//                                     />
//                                 }
//                                 name="broker_id"
//                                 control={control}
//                                 error={errors && errors.broker_id}
//                             />
//                         </Col>
//                     )}
//                     {(userTypeName === "Admin" ||
//                         userTypeName === "Super Admin" ||
//                         userTypeName === "Broker") && (
//                             <Col xl={4} lg={4} md={6} sm={12}>
//                                 <Controller
//                                     as={
//                                         <SelectComponent
//                                             label="Employer"
//                                             placeholder="Select Employer"
//                                             required={false}
//                                             isRequired={true}
//                                             options={
//                                                 employers?.map((item) => ({
//                                                     id: item?.id,
//                                                     label: item?.name,
//                                                     value: item?.id,
//                                                 })) || []
//                                             }
//                                         />
//                                     }
//                                     name="employer_id"
//                                     control={control}
//                                     error={errors && errors.employer_id?.id}
//                                 />
//                                 {!!errors?.employer_id?.id && (
//                                     <Error>{errors?.employer_id?.id?.message}</Error>
//                                 )}
//                             </Col>
//                         )}
//                     <Col xl={4} lg={4} md={6} sm={12}>
//                         <Controller
//                             as={
//                                 <SelectComponent
//                                     label="Policy Type"
//                                     placeholder="Select Policy Type"
//                                     required={false}
//                                     isRequired={true}
//                                     options={
//                                         policiesST?.filter(({ policy_sub_type_id }) => policy_sub_type_id === 1).map((item) => ({
//                                             id: item?.policy_sub_type_id,
//                                             label: item?.policy_sub_type_name,
//                                             value: item?.policy_sub_type_id,
//                                         })) || []
//                                     }
//                                 />
//                             }
//                             name="policy_sub_type_id"
//                             control={control}
//                             error={errors && errors.policy_sub_type_id?.id}
//                         />
//                         {!!errors?.policy_sub_type_id?.id && (
//                             <Error>{errors?.policy_sub_type_id?.id?.message}</Error>
//                         )}
//                     </Col>
//                     <Col xl={4} lg={4} md={6} sm={12}>
//                         <Controller
//                             as={
//                                 <SelectComponent
//                                     label="Policy Name"
//                                     placeholder="Select Policy Name"
//                                     isRequired={true}
//                                     required={false}
//                                     options={
//                                         policies?.map((item) => ({
//                                             id: item?.id,
//                                             label: userType === 'broker' ? item?.number : item.policy_no,
//                                             value: item?.id,
//                                         })) || []
//                                     }
//                                 />
//                             }
//                             name="policy_id"
//                             control={control}
//                             error={errors && errors.policy_id?.id}
//                         />
//                         {!!errors?.policy_id?.id && (
//                             <Error>{errors?.policy_id?.id?.message}</Error>
//                         )}
//                     </Col>
//                 </Row>
//                 <Row className="mb-3">
//                     <Title color="#555555" fontSize="1.15rem">Upload file&nbsp;(PDF, DOC, Image)
//                         <sup> <Img style={{ height: '11px' }} alt="Image Not Found" src='/assets/images/inputs/important.png' /> </sup>
//                     </Title>
//                     <DataUpload
//                         setFile={setFile}
//                         file={file}
//                         accept={".doc, .docx,.png,.jpeg,.jpg,.pdf"}
//                         uploadType={["image", "pdf", "doc"]}
//                         resetFile={resetFile}
//                     //uploadLimit={3}
//                     />
//                 </Row>
//                 <Row className="d-flex flex-wrap mt-3">
//                     <Col md={12} lg={12} xl={5} sm={12}>
//                         <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f2f2f2">
//                             <Title fontSize="0.9rem" color='#70a0ff'>
//                                 Note: File name should be as employeeCode-tpaMemberId <br />
//                                 eg. FYN001-952214
//                                 <br />
//                                 <br />
//                             </Title>
//                         </TextCard>
//                     </Col>
//                 </Row>
//                 <Row className="d-flex justify-content-end">
//                     <Button>Submit</Button>
//                 </Row>
//             </Form>
//             {loading && <ProgressBar text='Uploading Data...' />}
//         </CardBlue >
//     );
// };

// export default ECardUpload;
