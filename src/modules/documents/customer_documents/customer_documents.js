/*
Module: Document
User Type: Broker/Customer
Commented By: Salman Ahmed
*/

// import React, { useState, useEffect } from "react";
// import { Row, Col, Form } from "react-bootstrap";
// import * as yup from "yup";
// import Table from "./table";
// import swal from "sweetalert";
// // import _ from "lodash";
// import { CardBlue, Button, Error, Input, Loader } from "components";
// import { AttachFile2 } from 'modules/core';
// import { useForm, Controller } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadCustomerDocument, getAllCustomerDocuments, clear } from "../documents.slice";

// const CustomerDocuments = () => {
//     const dispatch = useDispatch();
//     const { success, error, customerDocumentsData, loading } = useSelector((state) => state.documents);

//     const [resetFile, setResetFile] = useState(false);

//     const validationSchema = yup.object().shape({
//         document_name: yup.string()
//             .required("Document name is required")
//             .min(2, "Document name is too short"),
//         document_type: yup.mixed().required("File is required")
//     });
//     const { control, errors, handleSubmit, setValue, register } = useForm({
//         validationSchema,
//     });

//     useEffect(() => {
//         dispatch(getAllCustomerDocuments());
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     useEffect(() => {
//         if (success) {
//             swal(success, "", "success").then(() => {
//                 dispatch(getAllCustomerDocuments());
//                 resetValues();
//             });
//         }
//         if (error) {
//             swal("Alert", error, "warning");
//         }
//         return () => { dispatch(clear()) }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [success, error])

//     const resetValues = () => {
//         setValue("document_name", "");
//         setValue("document_type", null);
//         setResetFile(true);
//     };

//     const onSubmit = (data) => {
//         const formdata = new FormData();
//         formdata.append("document_name", data.document_name);
//         formdata.append("document_type", data.document_type[0]);
//         dispatch(uploadCustomerDocument(formdata));
//     }

//     return (
//         <>
//             <CardBlue title="Documents">
//                 <Form onSubmit={handleSubmit(onSubmit)}>
//                     <Row>
//                         <Col md={12} lg={12} xl={12} sm={12}>
//                             <div className="p-2">
//                                 <Controller
//                                     as={<Input
//                                         label="Document Name"
//                                         placeholder="Enter Document Name"
//                                         required={false}
//                                         isRequired={true}
//                                     />}
//                                     name="document_name"
//                                     defaultValue={""}
//                                     control={control}
//                                     error={errors && errors.document_name}

//                                 />
//                                 {!!errors?.document_name && <Error>{errors?.document_name?.message}</Error>}
//                             </div>
//                         </Col>
//                         <Col md={12} lg={12} xl={12} sm={12}>
//                             <div className="p-2">
//                                 <AttachFile2
//                                     fileRegister={register}
//                                     control={control}
//                                     defaultValue={""}
//                                     name="document_type"
//                                     title="Attach File"
//                                     key="premium_file"
//                                     accept={".pdf"}
//                                     resetValue={resetFile}
//                                     description="File Formats: (.pdf)"
//                                     nameBox
//                                 />
//                                 {!!errors?.document_type && <Error>{errors?.document_type?.message}</Error>}
//                             </div>
//                         </Col>
//                     </Row>
//                     <Row>
//                         <Col md={12} className="d-flex justify-content-end mt-4">
//                             <Button type="submit">
//                                 Submit
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Form>
//             </CardBlue>
//             {!!customerDocumentsData.length && <CardBlue
//                 title={<>
//                     <div className="d-flex justify-content-between">
//                         <span>View</span>
//                     </div>
//                 </>}>
//                 <Table data={customerDocumentsData} />
//             </CardBlue>}
//             {loading && <Loader />}
//         </>
//     );
// }




// export default CustomerDocuments;
