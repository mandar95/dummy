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
// import {
// 	CardBlue,
// 	Button,
// 	Error,
// 	Input,
// 	Select,
// 	Loader,
// 	Tab,
// 	TabWrapper,
// } from "components";
// import { AttachFile2 } from "modules/core";
// import { useForm, Controller } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";

// import {
// 	uploadInsurerDocument,
// 	getAllInsurerDocuments,
// 	getFileType,
// 	getPlanType,
// 	clear,
// 	getBroker,
// 	getAllIcList as InsurerAll,
// 	trigger as Trigger,
// 	brokerId as brokerID,
// 	ic,
// } from "../documents.slice";
// import { insurer } from "config/validations";

// const validation = insurer.documents;

// const InsurerDocuments = ({ userType }) => {
// 	const dispatch = useDispatch();
// 	const {
// 		success,
// 		error,
// 		fileTypeData,
// 		planTypeData,
// 		insurerDocumentsData,
// 		loading,
// 		broker,
// 		AllICListData,
// 	} = useSelector((state) => state.documents);
// 	const { currentUser } = useSelector((state) => state.login);
// 	const [resetFile, setResetFile] = useState(false);
// 	const [trigger, setTrigger] = useState("insurer");

// 	/*----------validation schema----------*/
// 	const validationSchema = yup.object().shape({
// 		document_name: yup
// 			.string()
// 			.required("Document name is required")
// 			.min(
// 				validation.name.min,
// 				`Minimum ${validation.name.min} character required`
// 			)
// 			.max(
// 				validation.name.max,
// 				`Maximum ${validation.name.max} character available`
// 			)
// 			.matches(validation.name.regex, "Must contain only alphabets"),
// 		document_type_id: yup.string().required("Please select file type"),
// 		document: yup.mixed().required("File is required"),
// 		quote_id: yup.string().required("Plan is required"),
// 		...(userType === "admin" &&
// 			trigger === "insurer" && {
// 				ic: yup.string().required("Please select insurer"),
// 			}),
// 		...(userType === "admin" &&
// 			trigger === "broker" && {
// 				brokerId: yup.string().required("Please select broker"),
// 			}),
// 	});
// 	/*----x-----validation schema-----x----*/

// 	const { control, errors, handleSubmit, setValue, register, watch } = useForm({
// 		validationSchema,
// 		// mode: "onBlur",
// 		// reValidateMode: "onBlur"
// 	});

// 	const IcId = watch("ic");
// 	const brokerId = watch("brokerId");

// 	useEffect(() => {
// 		if (IcId) dispatch(ic(IcId));
// 		if (brokerId) dispatch(brokerID(brokerId));
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [IcId, brokerId]);

// 	useEffect(() => {
// 		setValue("ic", "");
// 		setValue("brokerId", "");
// 		dispatch(Trigger(trigger));
// 		resetValues();
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [trigger]);

// 	useEffect(() => {
// 		if (currentUser?.ic_id || IcId || currentUser?.broker_id || brokerId) {
// 			if (userType === "admin") {
// 				if ((trigger === "insurer" && IcId) || (trigger === "broker" && brokerId)) {
// 					dispatch(
// 						getAllInsurerDocuments(
// 							trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
// 						)
// 					);
// 				}
// 			} else {
// 				if (userType !== "admin")
// 					dispatch(
// 						getAllInsurerDocuments(
// 							userType === "insurer"
// 								? { ic_id: currentUser?.ic_id }
// 								: { broker_id: currentUser?.broker_id }
// 						)
// 					);
// 			}
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [currentUser.ic_id, IcId, currentUser?.broker_id, brokerId]);

// 	useEffect(() => {
// 		if (userType === "admin" && trigger === "insurer") {
// 			dispatch(InsurerAll());
// 			IcId && dispatch(getPlanType({ ic_id: IcId }));
// 		}
// 		if (userType === "admin" && trigger === "broker") {
// 			dispatch(getBroker());
// 			brokerId && dispatch(getPlanType({ broker_id: brokerId }));
// 		}
// 		if (userType === "insurer") {
// 			currentUser?.ic_id && dispatch(getPlanType({ ic_id: currentUser?.ic_id }));
// 		}
// 		if (userType === "broker") {
// 			currentUser?.broker_id &&
// 				dispatch(getPlanType({ broker_id: currentUser?.broker_id }));
// 		}
// 		dispatch(getFileType());
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [userType, trigger, currentUser, brokerId, IcId]);

// 	useEffect(() => {
// 		if (success) {
// 			swal(success, "", "success").then(() => {
// 				if (userType === "admin") {
// 					dispatch(
// 						getAllInsurerDocuments(
// 							trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
// 						)
// 					);
// 				} else if (userType !== "admin") {
// 					dispatch(
// 						getAllInsurerDocuments(
// 							userType === "insurer"
// 								? { ic_id: currentUser?.ic_id }
// 								: { broker_id: currentUser?.broker_id }
// 						)
// 					);
// 				}
// 				resetValues();
// 				dispatch(brokerID());
// 				dispatch(ic());
// 				dispatch(Trigger("insurer"));
// 			});
// 		}
// 		if (error) {
// 			swal("Alert", error, "warning");
// 		}
// 		return () => {
// 			dispatch(clear());
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [success, error]);

// 	const resetValues = () => {
// 		setValue("document_type_id", "");
// 		setValue("document", null);
// 		setValue("document_name", "");
// 		setValue("quote_id", "");
// 		setResetFile(true);
// 	};

// 	const onSubmit = (data) => {
// 		const formdata = new FormData();
// 		formdata.append("document_type_id", data.document_type_id);
// 		formdata.append("document_name", data.document_name);
// 		formdata.append("document", data.document[0]);
// 		currentUser?.broker_id &&
// 			formdata.append("broker_id", currentUser?.broker_id);
// 		currentUser?.ic_id && formdata.append("ic_id", currentUser?.ic_id);
// 		trigger === "insurer" && IcId && formdata.append("ic_id", IcId);
// 		trigger === "broker" && brokerId && formdata.append("broker_id", brokerId);
// 		formdata.append("quote_id", data.quote_id);
// 		dispatch(uploadInsurerDocument(formdata));
// 	};
// 	return (
// 		<>
// 			{userType === "admin" && (
// 				<TabWrapper width={"200px"}>
// 					<Tab
// 						isActive={trigger === "insurer"}
// 						onClick={() => setTrigger("insurer")}
// 					>
// 						Insurer
// 					</Tab>
// 					<Tab isActive={trigger === "broker"} onClick={() => setTrigger("broker")}>
// 						Broker
// 					</Tab>
// 				</TabWrapper>
// 			)}
// 			<CardBlue title="Documents">
// 				<Form onSubmit={handleSubmit(onSubmit)}>
// 					<Row>
// 						{userType === "admin" && (
// 							<>
// 								{trigger === "insurer" ? (
// 									<Col sm="12" md="6" lg="12" xl="12">
// 										<div className="p-2">
// 											<Controller
// 												as={
// 													<Select
// 														label={"Insurer"}
// 														placeholder={"Select Insurer"}
// 														options={
// 															AllICListData.map(({ ic_id, name }) => ({
// 																ic_id,
// 																name,
// 																value: ic_id,
// 															})) || []
// 														}
// 													/>
// 												}
// 												control={control}
// 												name={"ic"}
// 											/>
// 											{!!errors?.ic && <Error>{errors?.ic?.message}</Error>}
// 										</div>
// 									</Col>
// 								) : (
// 									<Col sm="12" md="6" lg="12" xl="12">
// 										<div className="p-2">
// 											<Controller
// 												as={
// 													<Select
// 														label={"Broker"}
// 														placeholder={"Select Broker"}
// 														options={
// 															broker.map(({ id, name }) => ({
// 																id,
// 																name,
// 																value: id,
// 															})) || []
// 														}
// 													/>
// 												}
// 												control={control}
// 												name={"brokerId"}
// 											/>
// 											{!!errors?.brokerId && <Error>{errors?.brokerId?.message}</Error>}
// 										</div>
// 									</Col>
// 								)}
// 							</>
// 						)}
// 						<Col md={6} lg={4} xl={4} sm={12}>
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
// 						<Col sm="12" md="6" lg="4" xl="4">
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
// 						<Col sm="12" md="6" lg="4" xl="4">
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
// 									resetValue={resetFile}
// 									{...validation.file}
// 									nameBox
// 								/>
// 								{!!errors?.document && <Error>{errors?.document?.message}</Error>}
// 							</div>
// 						</Col>
// 					</Row>
// 					<Row>
// 						<Col md={12} className="d-flex justify-content-end mt-4">
// 							<Button type="submit">
// 								Submit
// 							</Button>
// 						</Col>
// 					</Row>
// 				</Form>
// 			</CardBlue>
// 			<CardBlue
// 				title={
// 					<>
// 						<div className="d-flex justify-content-between">
// 							<span>View</span>
// 						</div>
// 					</>
// 				}
// 			>
// 				<Table data={insurerDocumentsData} />
// 			</CardBlue>
// 			{loading && <Loader />}
// 		</>
// 	);
// };

// export default InsurerDocuments;
