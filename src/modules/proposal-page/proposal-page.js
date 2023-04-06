/*
Module: Propsal
User Type: -
Commented By: Salman Ahmed
 */

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as yup from "yup";
// import { useForm, Controller } from "react-hook-form";
// import { Card, Input, Select, Error, Button } from "components";
// import { AttachFile2 } from "modules/core";
// import { Form, Row, Col } from "react-bootstrap";
// import { createGlobalStyle } from "styled-components";
// import { NavBar, Footer } from "components";
// import { getstatecity, clear, postProposal } from "./proposal.slice";
// import swal from "sweetalert";
// import _ from "lodash";
// import { reloadPage } from "utils";
// import { useHistory } from "react-router-dom";
// import { numOnly, noSpecial } from "utils";

// /*---------- validation schema ----------*/
// const validationSchema = yup.object().shape({
// 	city: yup.string().required("City is required"),
// 	state: yup.string().required("State is required"),
// 	country: yup.string().required("Country is required"),
// 	name: yup
// 		.string()
// 		.required("Name required")
// 		.matches(/^([A-Za-z\s])+$/, "Name must contain only alphabets"),
// 	email: yup.string().email("must be a valid email").required("Email required"),
// 	contact: yup.string()
// 		.required('Mobile No. is required')
// 		.min(10, 'Mobile No. should be 10 digits')
// 		.max(10, 'Mobile No. should be 10 digits')
// 		.matches(validation.contact.regex, 'Not valid number'),
// 		// .test('invalid', 'Not valid number', (value) => {
// 		// 	return !/^[9]{10}$/.test(value);
// 		// }),
// 	address_line_1: yup
// 		.string()
// 		.required("Address required")
// 		.min(8, "Enter atleast 8 letters"),
// 	address_line_2: yup
// 		.string()
// 		.required("Address required")
// 		.min(8, "Enter atleast 8 letters"),
// 	pincode: yup
// 		.string()
// 		.required("Pincode required")
// 		.min(6, "pincode must consist 6 digits")
// 		.max(6, "pincode must consist 6 digits"),
// 	PAN: yup
// 		.string()
// 		.required("PAN no required")
// 		.matches(
// 			/[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
// 			"PAN number invalid"
// 		),
// 	GSTIN: yup
// 		.string()
// 		.required("GST no required")
// 		.matches(
// 			/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
// 			"GST number invalid"
// 		),
// });

// const ProposalPage = () => {
// 	/*---x------ validation schema ------x---*/

// 	const { control, errors, register, watch, setValue, handleSubmit } = useForm({
// 		validationSchema,
// 	});
// 	const dispatch = useDispatch();
// 	const { statecity, error, plan_data, proposal } = useSelector(
// 		(state) => state.proposal
// 	);
// 	const history = useHistory();

// 	const onSubmit = ({
// 		name,
// 		email,
// 		contact,
// 		logo,
// 		address_line_1,
// 		address_line_2,
// 		country,
// 		state,
// 		city,
// 		pincode,
// 		PAN,
// 		GSTIN,
// 	}) => {
// 		if (!_.isEmpty(plan_data)) {
// 			let client = plan_data?.path === "/broker" ? 1 : 2;

// 			const formdata = new FormData();
// 			formdata.append("name", name);
// 			formdata.append("client", client);
// 			formdata.append("email", email);
// 			formdata.append("country_id", country);
// 			formdata.append("pincode", pincode);
// 			formdata.append("city_id", city);
// 			formdata.append("state_id", state);
// 			formdata.append("address_line_1", address_line_1);
// 			formdata.append("address_line_2", address_line_2);
// 			formdata.append("contact", contact);
// 			formdata.append("status", 0);
// 			formdata.append("has_saas", 1);
// 			formdata.append("plan_id", plan_data?.id);
// 			formdata.append("theme_id", 1); /*hard-coded*/
// 			formdata.append("subcribe_mode", plan_data?.subs_type * 1);
// 			!_.isEmpty(logo) && formdata.append("logo", logo[0]);
// 			formdata.append("PAN", PAN);
// 			formdata.append("GSTIN", GSTIN);
// 			dispatch(postProposal(formdata));
// 		}
// 	};

// 	/*------state city------*/
// 	const Pincode = watch("pincode") || "";
// 	useEffect(() => {
// 		if (Pincode?.length === 6) {
// 			dispatch(getstatecity({ pincode: Pincode }));
// 		} else {
// 			dispatch(clear("pincode"));
// 			setValue("city", "");
// 			setValue("state", "");
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [Pincode]);

// 	useEffect(() => {
// 		if (!_.isEmpty(statecity)) {
// 			setValue("city", statecity[0]?.city_id);
// 			setValue("state", statecity[0]?.state_id);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [statecity]);
// 	/*--x---state city---x--*/

// 	/*------ error handling ------*/
// 	useEffect(() => {
// 		if (error) {
// 			swal(error, "", "warning");
// 		}

// 		return () => {
// 			dispatch(clear());
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [error]);

// 	/*--x--- error handling ---x--*/

// 	/*---------- proposal-success ----------*/
// 	useEffect(() => {
// 		if (!_.isEmpty(proposal) && proposal?.client_id) {
// 			swal(proposal?.message || "OnBoarding successful. Proceed to pay", "", "success").then(
// 				() => {
// 					history.push(
// 						`/payment-gateway?type=landing-page&subscription=${plan_data?.subs_type
// 						}&client_id=${proposal?.client_id}&amount=${plan_data?.amount}&plan=${plan_data?.id
// 						}&client=${plan_data?.plan_data?.path === "/broker" ? 1 : 2}`
// 					);
// 				}
// 			);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [proposal]);
// 	/*---x------ proposal-success ------x---*/

// 	useEffect(() => {
// 		if (_.isEmpty(plan_data)) {
// 			swal("Something went wrong", "", "warning").then(() => reloadPage("./home"));
// 		}
// 	}, [plan_data]);

// 	return (
// 		<>
// 			<NavBar style={{ position: "absolute" }} />
// 			<div className="mb-4 mt-1 pt-1 pb-4">
// 				<Card title="Organisation Details" headerStyle={{ textAlign: "center" }}>
// 					<Form onSubmit={handleSubmit(onSubmit)}>
// 						<Row className="d-flex justify-content-center">
// 							<Col sm="12" md="6" lg="4" xl="4">
// 								<Controller
// 									as={<Input placeholder="Name" label="Name" isRequired={true} />}
// 									name="name"
// 									error={errors && errors.name}
// 									control={control}
// 								/>
// 								{!!errors.name && <Error>{errors.name.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="6" lg="4" xl="4">
// 								<Controller
// 									as={<Input placeholder="Email" label="Email" isRequired={true} />}
// 									name="email"
// 									error={errors && errors.email}
// 									control={control}
// 								/>
// 								{!!errors.email && <Error>{errors.email.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="6" lg="4" xl="4">
// 								<Controller
// 									as={
// 										<Input
// 											placeholder="Mobile No"
// 											label="Mobile No"
// 											isRequired={true}
// 											// minLength="10"
// 											maxLength="10"
// 											type='tel'
// 											onKeyDown={numOnly} onKeyPress={noSpecial}
// 										/>
// 									}
// 									name="contact"
// 									error={errors && errors.contact}
// 									control={control}
// 								/>
// 								{!!errors.contact && <Error>{errors.contact.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="6" lg="4" xl="4">
// 								<Controller
// 									as={<Input placeholder="PAN No" label="PAN No" isRequired={true} />}
// 									name="PAN"
// 									error={errors && errors.PAN}
// 									control={control}
// 								/>
// 								{!!errors.PAN && <Error>{errors.PAN.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="6" lg="4" xl="4">
// 								<Controller
// 									as={<Input placeholder="GST No" label="GST No" isRequired={true} />}
// 									name="GSTIN"
// 									error={errors && errors.GSTIN}
// 									control={control}
// 								/>
// 								{!!errors.GSTIN && <Error>{errors.GSTIN.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="12" lg="6" xl="6" className="mt-3 mb-3">
// 								<AttachFile2
// 									fileRegister={register}
// 									required
// 									name={`logo`}
// 									title="Attach Logo"
// 									key="logo"
// 									accept=".jpeg, .png, .jpg"
// 									description="File Formats: jpeg, png, jpg"
// 									nameBox
// 								/>
// 							</Col>
// 						</Row>
// 						<Row className="d-flex justify-content-center">
// 							<Col sm="12" md="6" lg="6" xl="6">
// 								<Controller
// 									as={
// 										<Input
// 											placeholder="Address Line 1"
// 											label="Address Line 1"
// 											isRequired={true}
// 										/>
// 									}
// 									name="address_line_1"
// 									control={control}
// 									error={errors && errors.address_line_1}
// 								/>
// 								{!!errors.address_line_1 && (
// 									<Error>{errors.address_line_1.message}</Error>
// 								)}
// 							</Col>
// 							<Col sm="12" md="6" lg="6" xl="6">
// 								<Controller
// 									as={
// 										<Input
// 											placeholder="Address Line 2"
// 											label="Address Line 2"
// 											isRequired={true}
// 										/>
// 									}
// 									name="address_line_2"
// 									error={errors && errors.address_line_2}
// 									control={control}
// 								/>
// 								{!!errors.address_line_2 && (
// 									<Error>{errors.address_line_2.message}</Error>
// 								)}
// 							</Col>
// 							<Col sm="12" md="6" lg="3" xl="3">
// 								<Controller
// 									as={
// 										<Select
// 											placeholder="Country"
// 											label="Country"
// 											options={[{ id: 1, value: 1, name: "India" }]}
// 										/>
// 									}
// 									name="country"
// 									error={errors && errors.country}
// 									control={control}
// 								/>
// 								{!!errors.country && <Error>{errors.country.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="6" lg="3" xl="3" className="mb-4">
// 								<Controller
// 									as={
// 										<Input
// 											placeholder="Pincode"
// 											label="Pincode"
// 											isRequired={true}
// 											// minLength="6"
// 											maxLength="6"
// 										/>
// 									}
// 									name="pincode"
// 									error={errors && errors.pincode}
// 									control={control}
// 								/>
// 								{!!errors.pincode && <Error>{errors.pincode.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="6" lg="3" xl="3">
// 								<Controller
// 									as={
// 										<Select
// 											placeholder="State"
// 											label="State"
// 											isRequired={true}
// 											options={[
// 												{
// 													id: statecity.length && statecity[0]?.state_id,
// 													name: statecity.length && statecity[0]?.state_name,
// 													value: statecity.length && statecity[0]?.state_id,
// 												},
// 											]}
// 										/>
// 									}
// 									name="state"
// 									error={errors && errors.state}
// 									control={control}
// 								/>
// 								{!!errors.state && <Error>{errors.state.message}</Error>}
// 							</Col>
// 							<Col sm="12" md="6" lg="3" xl="3">
// 								<Controller
// 									as={
// 										<Select
// 											placeholder="City"
// 											label="City"
// 											isRequired={true}
// 											options={[
// 												{
// 													id: statecity.length && statecity[0]?.city_id,
// 													name: statecity.length && statecity[0]?.city_name,
// 													value: statecity.length && statecity[0]?.city_id,
// 												},
// 											]}
// 										/>
// 									}
// 									name="city"
// 									error={errors && errors.city}
// 									control={control}
// 								/>
// 								{!!errors.city && <Error>{errors.city.message}</Error>}
// 							</Col>
// 							<Col
// 								sm="12"
// 								md="12"
// 								lg="12"
// 								xl="12"
// 								className="mt-2 d-flex justify-content-end mb-2"
// 							>
// 								<Button type="submit">Submit</Button>
// 							</Col>
// 						</Row>
// 					</Form>
// 				</Card>
// 				<GlobalStyle />
// 			</div>
// 			<Footer />
// 		</>
// 	);
// };

// const GlobalStyle = createGlobalStyle`
//   body {
    
//   }
// `;

// export default ProposalPage;
