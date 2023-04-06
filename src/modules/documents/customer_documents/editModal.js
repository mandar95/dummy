/*
Module: Document
User Type: Broker/Customer
Commented By: Salman Ahmed
*/

// import React, { useEffect } from "react";
// import { Modal, Row, Col, Form } from "react-bootstrap";
// import * as yup from "yup";
// import _ from "lodash";
// import { Button, Error, Input } from "components";
// import { AttachFile2 } from 'modules/core';
// import { useForm, Controller } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { editCustomerDocument, updateCustomerDocument, clear, success } from "../documents.slice";


// /*----------validation schema----------*/
// const validationSchema = yup.object().shape({
//     document_name: yup.string()
//         .required("Document name is required")
//         .min(2, "Document name is too short"),
//     document_type: yup.mixed().required("File is required")
// });
// /*----x-----validation schema-----x----*/

// const EditModal = (props) => {
//     const dispatch = useDispatch();
//     // const { currentUser, userType } = useSelector((state) => state.login);
//     const { editCustomerData, customerUpdate } = useSelector((state) => state.documents);

//     //const [resetFile, setResetFile] = useState(false);



//     const { control, errors, handleSubmit, setValue, register } = useForm({
//         validationSchema,
//     });

//     //prefill
//     useEffect(() => {
//         if (props?.id) {
//             dispatch(editCustomerDocument(props?.id));
//         }
//         //eslint-disable-next-line
//     }, []);

//     useEffect(() => {
//         if (!_.isEmpty(editCustomerData)) {
//             setValue("document_name", editCustomerData[0]?.document_name);
//         }
//         //eslint-disable-next-line
//     }, [editCustomerData]);

//     useEffect(() => {
//         if (customerUpdate) {
//             dispatch(success(customerUpdate));
//             props.onHide();
//         }

//         return () => {
//             dispatch(clear("customer-doc"));
//         };
//         //eslint-disable-next-line
//     }, [customerUpdate]);

//     // const resetValues = () => {
//     //     setValue("document_name", "");
//     //     setValue("document_type", null);
//     //     setResetFile(true);
//     // };

//     const onSubmit = (data) => {
//         const formdata = new FormData();
//         formdata.append("document_name", data.document_name);
//         data?.document_type[0] && formdata.append("document_type", data.document_type[0]);
//         formdata.append("_method", "PATCH");
//         dispatch(updateCustomerDocument(props?.id, formdata));
//     }


//     return (
//         <Modal
//             {...props}
//             size="lg"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Form onSubmit={handleSubmit(onSubmit)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title id="contained-modal-title-vcenter">Edit Customer Document</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Row>
//                         <Col md={12} lg={12} xl={12} sm={12}>
//                             <div className="p-2">
//                                 <Controller
//                                     as={<Input label="Document Name" placeholder="Enter Document Name" />}
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
//                                     //resetValue={resetFile}
//                                     description="File Formats: (.pdf)"
//                                     nameBox
//                                 />
//                                 {!!errors?.document_type && <Error>{errors?.document_type?.message}</Error>}
//                             </div>
//                         </Col>
//                     </Row>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button buttonStyle="danger" onClick={props.onHide}>
//                         Close
//                     </Button>
//                     <Button type="submit">Update</Button>
//                 </Modal.Footer>
//             </Form>
//         </Modal>
//     );
// };

// export default EditModal;
