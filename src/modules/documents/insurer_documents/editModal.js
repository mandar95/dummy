/*
Module: Document
User Type: Broker/Customer
Commented By: Salman Ahmed
*/

// import React, { useEffect } from "react";
// import { Modal, Row, Col, Form } from "react-bootstrap";
// import * as yup from "yup";
// import _ from "lodash";
// import { Button, Error, Input, Select } from "components";
// import { AttachFile2 } from "modules/core";
// import { useForm, Controller } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import {
// 	editInsurerDocument,
// 	updateInsurerDocument,
// 	clear,
// 	success,
// } from "../documents.slice";
// import { insurer } from "config/validations";
// // import { useParams } from "react-router";

// const validation = insurer.documents;

// /*----------validation schema----------*/
// const validationSchema = yup.object().shape({
// 	document_name: yup
// 		.string()
// 		.required("Document name is required")
// 		.min(validation.name.min, `Minimum ${validation.name.min} character required`)
// 		.max(
// 			validation.name.max,
// 			`Maximum ${validation.name.max} character available`
// 		)
// 		.matches(validation.name.regex, "Must contain only alphabets"),
// 	document_type_id: yup.string().required("Please select file type"),
// 	document: yup.mixed().required("File is required"),
// 	quote_id: yup.string().required("Plan is required"),
// });
// /*----x-----validation schema-----x----*/

// const EditModal = (props) => {
// 	const dispatch = useDispatch();
// 	// const { userType } = useParams();
// 	const {
// 		editInsurerData,
// 		insurerUpdate,
// 		fileTypeData,
// 		planTypeData,
// 		trigger,
// 		ic,
// 		brokerId,
// 	} = useSelector((state) => state.documents);
// 	const { currentUser } = useSelector((state) => state.login);
// 	// const [resetFile, setResetFile] = useState(false);
// 	const { control, errors, handleSubmit, setValue, register } = useForm({
// 		validationSchema,
// 	});

// 	//prefill
// 	useEffect(() => {
// 		if (props?.id) {
// 			dispatch(editInsurerDocument(props?.id));
// 		}
// 		//eslint-disable-next-line
// 	}, []);

// 	useEffect(() => {
// 		if (!_.isEmpty(editInsurerData)) {
// 			setValue("document_name", editInsurerData[0]?.document_name);
// 			setValue("document_type_id", editInsurerData[0]?.document_type_id);
// 			setValue("quote_id", editInsurerData[0]?.quote_id);
// 		}
// 		//eslint-disable-next-line
// 	}, [editInsurerData]);

// 	useEffect(() => {
// 		if (insurerUpdate) {
// 			dispatch(success(insurerUpdate));
// 			props.onHide();
// 		}

// 		return () => {
// 			dispatch(clear("insurer-doc"));
// 		};
// 		//eslint-disable-next-line
// 	}, [insurerUpdate]);

// 	const onSubmit = (data) => {
// 		const formdata = new FormData();
// 		formdata.append("document_type_id", data.document_type_id);
// 		formdata.append("document_name", data.document_name);
// 		data?.document[0] && formdata.append("document", data.document[0]);
// 		// formdata.append("ic_id", editInsurerData[0]?.ic_id);
// 		currentUser?.broker_id &&
// 			formdata.append("broker_id", currentUser?.broker_id);
// 		currentUser?.ic_id && formdata.append("ic_id", currentUser?.ic_id);
// 		trigger === "insurer" && ic && formdata.append("ic_id", ic);
// 		trigger === "broker" && brokerId && formdata.append("broker_id", brokerId);
// 		formdata.append("ic_plan_id", data.quote_id);
// 		formdata.append("_method", "PATCH");
// 		dispatch(updateInsurerDocument(props?.id, formdata));
// 	};

// 	return (
// 		<Modal
// 			{...props}
// 			size="lg"
// 			aria-labelledby="contained-modal-title-vcenter"
// 			centered
// 		>
// 			<Form onSubmit={handleSubmit(onSubmit)}>
// 				<Modal.Header closeButton>
// 					<Modal.Title id="contained-modal-title-vcenter">
// 						Edit Insurer Document
// 					</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<Row>
// 						<Col md={12} lg={12} xl={12} sm={12}>
// 							<div className="p-2">
// 								<Controller
// 									as={
// 										<Input
// 											label="Document Name"
// 											placeholder="Enter Document Name"
// 											required={false}
// 											maxLength={validation.name.max}
// 											isRequired={true}
// 										/>
// 									}
// 									name="document_name"
// 									defaultValue={""}
// 									control={control}
// 									error={errors && errors.document_name}
// 								/>
// 								{!!errors?.document_name && (
// 									<Error>{errors?.document_name?.message}</Error>
// 								)}
// 							</div>
// 						</Col>
// 						<Col sm="12" md="6" lg="6" xl="6">
// 							<div className="p-2">
// 								<Controller
// 									as={
// 										<Select
// 											label="File Type"
// 											placeholder="Select File Type"
// 											required={false}
// 											isRequired={true}
// 											options={
// 												fileTypeData?.map((item) => ({
// 													id: item?.id,
// 													name: item?.document_name,
// 													value: item?.id,
// 												})) || []
// 											}
// 										/>
// 									}
// 									name="document_type_id"
// 									control={control}
// 									defaultValue={""}
// 									error={errors && errors.document_type_id}
// 								/>
// 							</div>
// 							{!!errors?.document_type_id && (
// 								<Error>{errors?.document_type_id?.message}</Error>
// 							)}
// 						</Col>
// 						<Col sm="12" md="6" lg="6" xl="6">
// 							<div className="p-2">
// 								<Controller
// 									as={
// 										<Select
// 											label="Plan"
// 											placeholder="Select Plan"
// 											required={false}
// 											isRequired={true}
// 											options={
// 												planTypeData?.map((item) => ({
// 													id: item?.quote_id,
// 													name: item?.quote_name,
// 													value: item?.quote_id,
// 												})) || []
// 											}
// 										/>
// 									}
// 									name="quote_id"
// 									control={control}
// 									defaultValue={""}
// 									error={errors && errors.quote_id}
// 								/>
// 							</div>
// 							{!!errors?.quote_id && <Error>{errors?.quote_id?.message}</Error>}
// 						</Col>
// 						<Col md={12} lg={12} xl={12} sm={12}>
// 							<div className="p-2">
// 								<AttachFile2
// 									fileRegister={register}
// 									control={control}
// 									name={`document`}
// 									title="Attach Document"
// 									key="premium_file"
// 									{...validation.file}
// 									// resetValue={resetFile}
// 									nameBox
// 								/>
// 								{!!errors?.document && <Error>{errors?.document?.message}</Error>}
// 							</div>
// 						</Col>
// 					</Row>
// 				</Modal.Body>
// 				<Modal.Footer>
// 					<Button buttonStyle="danger" onClick={props.onHide}>
// 						Close
// 					</Button>
// 					<Button type="submit">Update</Button>
// 				</Modal.Footer>
// 			</Form>
// 		</Modal>
// 	);
// };

// export default EditModal;
