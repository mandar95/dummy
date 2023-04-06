
/*
Module: MIS Report
User Type: Broker/Insurer
Commented By: Salman Ahmed
*/


// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Row, Col, Form } from "react-bootstrap";
// import * as yup from "yup";
// import { Controller, useForm } from "react-hook-form";
// import { getReport, clear, getBroker, InsurerAll } from "../home/home.slice";
// import swal from "sweetalert";
// import { downloadFile } from "utils";
// import { useParams } from "react-router";
// import {
// 	Card,
// 	Input,
// 	Error,
// 	Button,
// 	Select,
// 	Tab,
// 	TabWrapper,
// } from "components";

// export const Reports = () => {
// 	const dispatch = useDispatch();
// 	const { userType } = useParams();

// 	const { reports, error, broker, insurer } = useSelector(
// 		(state) => state.RFQHome
// 	);
// 	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
// 	const [trigger, setTrigger] = useState("insurer");

// 	/*----------validation schema----------*/
// 	const validationSchema = yup.object().shape({
// 		till_date: yup.string().required("Please enter End Date"),
// 		from_date: yup.string().required("Please enter Start Date"),
// 		...(userType === "admin" &&
// 			trigger === "insurer" && {
// 			ic: yup.string().required("Please select insurer"),
// 		}),
// 		...(userType === "admin" &&
// 			trigger === "broker" && {
// 			brokerId: yup.string().required("Please select broker"),
// 		}),
// 	});
// 	/*----x-----validation schema-----x----*/

// 	const { handleSubmit, control, errors, setValue, watch } = useForm({
// 		validationSchema,
// 	});

// 	const IcId = watch("ic");
// 	const brokerId = watch("brokerId");

// 	//load insurers/brokers
// 	useEffect(() => {
// 		if (userType === "admin" && trigger === "insurer") {
// 			dispatch(InsurerAll());
// 		}
// 		if (userType === "admin" && trigger === "broker" && userTypeName) {
// 			dispatch(getBroker(userTypeName));
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [userType, trigger, userTypeName]);

// 	//download report
// 	useEffect(() => {
// 		if (reports) {
// 			downloadFile(reports);
// 			resetValues();
// 			setValue("ic", "");
// 			setValue("brokerId", "");
// 		}

// 		return () => {
// 			dispatch(clear("reports"));
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [reports]);

// 	//onError
// 	useEffect(() => {
// 		if (error) {
// 			swal(error, "", "warning");
// 		}
// 		return () => {
// 			dispatch(clear());
// 		};
// 		//eslint-disable-next-line
// 	}, [error]);

// 	useEffect(() => {
// 		setValue("ic", "");
// 		setValue("brokerId", "");
// 		resetValues();
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [trigger]);

// 	const resetValues = () => {
// 		setValue("from_date", "");
// 		setValue("till_date", "");
// 	};

// 	const onSubmit = ({ from_date, till_date }) => {
// 		if (userType === "admin") {
// 			if ((trigger === "insurer" && IcId) || (trigger === "broker" && brokerId)) {
// 				dispatch(
// 					getReport(
// 						trigger === "insurer"
// 							? { ic_id: IcId, from_date, till_date, user_type_name: 'Insurer' }
// 							: { broker_id: brokerId, from_date, till_date, user_type_name: 'Broker' },
// 						'Insurer'
// 					)
// 				);
// 			}
// 		} else {
// 			if (userType !== "admin")
// 				dispatch(
// 					getReport(
// 						userType === "insurer"
// 							? { ic_id: currentUser?.ic_id, from_date, till_date, user_type_name: 'Insurer' }
// 							: { broker_id: currentUser?.broker_id, from_date, till_date, user_type_name: 'Broker' },
// 						'Broker'
// 					)
// 				);
// 		}
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
// 			<Card title="MIS Report">
// 				<Form onSubmit={handleSubmit(onSubmit)}>
// 					<Row className="d-flex">
// 						{userType === "admin" && (
// 							<>
// 								{trigger === "insurer" ? (
// 									<Col sm="12" md="12" lg="4" xl="4">
// 										<Controller
// 											as={
// 												<Select
// 													label={"Insurer"}
// 													placeholder={"Select Insurer"}
// 													options={
// 														insurer.map(({ id, name }) => ({
// 															id,
// 															name,
// 															value: id,
// 														})) || []
// 													}
// 												/>
// 											}
// 											control={control}
// 											name={"ic"}
// 										/>
// 										{!!errors?.ic && <Error>{errors?.ic?.message}</Error>}
// 									</Col>
// 								) : (
// 									<Col sm="12" md="12" lg="4" xl="4">
// 										<Controller
// 											as={
// 												<Select
// 													label={"Broker"}
// 													placeholder={"Select Broker"}
// 													options={
// 														broker.map(({ id, name }) => ({
// 															id,
// 															name,
// 															value: id,
// 														})) || []
// 													}
// 												/>
// 											}
// 											control={control}
// 											name={"brokerId"}
// 										/>
// 										{!!errors?.brokerId && <Error>{errors?.brokerId?.message}</Error>}
// 									</Col>
// 								)}
// 							</>
// 						)}
// 						<Col
// 							xs={12}
// 							sm={12}
// 							md={6}
// 							lg={userType === "admin" ? 4 : 6}
// 							xl={userType === "admin" ? 4 : 6}
// 							className="w-100"
// 						>
// 							<Controller
// 								as={<Input type="date" label="Date Range From" />}
// 								name="from_date"
// 								control={control}
// 							/>
// 							{!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
// 						</Col>
// 						<Col
// 							xs={12}
// 							sm={12}
// 							md={6}
// 							lg={userType === "admin" ? 4 : 6}
// 							xl={userType === "admin" ? 4 : 6}
// 							className="w-100"
// 						>
// 							<Controller
// 								as={<Input type="date" label="Date Range To" />}
// 								name="till_date"
// 								control={control}
// 							/>
// 							{!!errors?.till_date && <Error>{errors?.till_date?.message}</Error>}
// 						</Col>
// 						<Col
// 							xs={12}
// 							sm={12}
// 							md={12}
// 							lg={12}
// 							xl={12}
// 							className="d-flex justify-content-end mt-2"
// 						>
// 							<Button type="submit">Export</Button>
// 						</Col>
// 					</Row>
// 				</Form>
// 			</Card>
// 		</>
// 	);
// };
