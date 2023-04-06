import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import swal from "sweetalert";
import _ from "lodash";
import { CardBlue, Head, Text, Input, Button, Error, Select, Loader } from "../../../components";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getstatecity, getIndustry } from '../../RFQ/home/home.slice';
import { getCustomerProfileData, updateCustomerProfile, clear } from '../customerProfile.slice'

const ShowCompanyDetails = (props) => {
	const dispatch = useDispatch();
	const { editCustomerProfileData, success, error, loading } = useSelector((state) => state.customerProfile);
	const RFQData = useSelector(state => state.RFQHome);
	const statecity = RFQData.statecity;
	const industry_data = RFQData.industry_data;

	let [edit, setEdit] = useState(false);
	let [industryName, setIndustryName] = useState("");

	const validationSchema = yup.object().shape({
		work_email: yup
			.string()
			.email("Please enter valid email id").nullable(),
		company_name: yup
			.string()
			.max(50, "Company name should be below 50").nullable(),
		pincode: yup
			.string()
			.min(6, "Pincode must consist 6 digits")
			.max(6, "Pincode must consist 6 digits").nullable(),
		city_id: yup.string().nullable(),
		state_id: yup.string().nullable(),
		industry_type: yup.string().nullable(),
		company_legal_name: yup
			.string()
			.matches(/^([A-Za-z\s])+$/, "Must contain only alphabets").nullable(),
		address: yup.string().nullable(),
		pan_number: yup
			.string()
			.matches(
				/[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/,
				"PAN no. invalid(e.g. ALWPG5809L)"
			)
			.max(10, "Please enter a valid pan number").nullable(),
		gstin_number: yup
			.string()
			.matches(
				/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
				"GST no. invalid(e.g. 22AABCU9603R1ZX)"
			).nullable(),
		no_of_employees: yup.number().nullable(),
	});
	const { handleSubmit, control, errors, watch, setValue } = useForm({
		validationSchema
	});

	const Pincode = watch("pincode") || "";

	useEffect(() => {
		dispatch(getCustomerProfileData());
		dispatch(getIndustry());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (Pincode?.length === 6) {
			dispatch(getstatecity({ pincode: Pincode }));
		} else {
			// dispatch(clear("pincode"));
			// setValue("city", "");
			// setValue("state", "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Pincode]);

	useEffect(() => {
		if (!_.isEmpty(editCustomerProfileData) && _.isEmpty(statecity)) {
			dispatch(getstatecity({ pincode: editCustomerProfileData?.pincode }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editCustomerProfileData]);

	useEffect(() => {
		if (!_.isEmpty(editCustomerProfileData) && !_.isEmpty(industry_data)) {
			let industry = industry_data?.industries?.filter((item) => parseInt(item.id) === parseInt(editCustomerProfileData.industry_type))
			setIndustryName(industry[0]?.name || "")
		}
	}, [editCustomerProfileData, industry_data])

	useEffect(() => {
		if (!_.isEmpty(editCustomerProfileData)) {
			for (let i in editCustomerProfileData) {
				setValue(i, editCustomerProfileData[i]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editCustomerProfileData, edit])

	useEffect(() => {
		if (success) {
			swal(success, "", "success")
				.then(() => {
					dispatch(getCustomerProfileData());
					setEdit(false)
				});
		}
		if (error) {
			swal("Alert", error, "warning");
		}
		return () => { dispatch(clear()) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, error])


	let onSubmitMethod = (data) => {
		let response = {
			...(data.company_name && { company_name: data.company_name }),
			...(data.work_email && { work_email: data.work_email }),
			...(data.industry_type && { industry_type: data.industry_type }),
			...(data.company_legal_name && { company_legal_name: data.company_legal_name }),
			...(data.address && { address: data.address }),
			...(data.gstin_number && { gstin_number: data.gstin_number }),
			...(data.pan_number && { pan_number: data.pan_number }),
			...(data.pincode && { pincode: data.pincode }),
			...(data.state_id && { state_id: data.state_id }),
			...(data.city_id && { city_id: data.city_id }),
			...(data.no_of_employees && { no_of_employees: data.no_of_employees })
		};

		dispatch(updateCustomerProfile(response));
	};

	let onClickHandlerEdit = () => {
		setEdit(!edit);
	};

	const Title = () => (
		<Row>
			<Col sm={12} md={6}>
				Company Details
			</Col>
			<Col sm={12} md={6} className="d-flex justify-content-end mt-3">
				<span id="edit-button" className="mr-3">
					<Button buttonStyle="outline" onClick={onClickHandlerEdit}>
						{edit ? "Cancel" : "Edit"}
					</Button>
				</span>
			</Col>
		</Row>
	);

	return (
		<>
			<CardBlue title={<Title />} round={true}>
				<div style={{ marginTop: "-35px" }}>
					{/* render component based edit value */}
					{edit ? (
						// forms only 3 inputs are in used as per api property
						<Form onSubmit={handleSubmit(onSubmitMethod)}>
							<Row className="mt-3 flex-wrap">
								<Col xs={12} md={12} lg={3} className="mx-auto" sm={12}>
									<Controller
										as={<Input
											label="Company Name"
											placeholder="Company Name"
											required={false}
											isRequired={true}
										/>}
										name="company_name"
										defaultValue={""}
										control={control}
										error={errors && errors.company_name}

									/>
									{!!errors?.company_name && <Error className="mt-0">{errors?.company_name?.message}</Error>}
								</Col>
								<Col xs={12} md={12} lg={3} className="mx-auto" sm={12}>
									<Controller
										as={
											<Input
												label="Work Email ID"
												placeholder="Work Email ID"
												required={false}
												isRequired={true}
											/>}
										name="work_email"
										defaultValue={""}
										control={control}
										error={errors && errors.work_email}
									/>
									{!!errors?.work_email && <Error className="mt-0">{errors?.work_email?.message}</Error>}
								</Col>
								<Col xs={12} md={12} lg={3} className="mx-auto" sm={12}>
									<Controller
										as={
											<Input
												label="Contact No"
												placeholder="Contact No"
												required={false}
												isRequired={true}
											/>}
										name="contact_no"
										defaultValue={""}
										control={control}
										error={errors && errors.contact_no}
									/>
									{!!errors?.contact_no && <Error className="mt-0">{errors?.contact_no?.message}</Error>}
								</Col>
								<Col xs={12} md={12} lg={3} className=" mx-auto" sm={12}>
									<Controller
										as={
											<Select
												label="Industry Type"
												placeholder="Industry Type"
												required={false}
												isRequired={true}
												options={
													industry_data?.industries?.map((item) => ({
														id: item?.id,
														name: item?.name,
														value: item?.id,
													})) || []
												}
											/>}
										defaultValue={""}
										control={control}
										name="industry_type"
										error={errors && errors.industry_type}
									/>
									{!!errors?.industry_type && <Error className="mt-0">{errors?.industry_type?.message}</Error>}
								</Col>
								<Col xs={12} md={12} lg={3} className=" mx-auto" sm={12}>
									<Controller
										as={
											<Input
												label="Pincode"
												placeholder="Pincode"
												type="number"
												required={false}
												isRequired={true}

											/>}
										name="pincode"
										defaultValue={""}
										control={control}
										error={errors && errors.pincode}
									/>
									{!!errors?.pincode && <Error className="mt-0">{errors?.pincode?.message}</Error>}
								</Col>
								<Col xs={12} md={12} lg={3} className="mx-auto" sm={12}>
									<Controller
										as={
											<Select
												label="State"
												placeholder="State"
												required={false}
												isRequired={true}
												options={[
													{
														id: statecity.length && statecity[0]?.state_id,
														name: statecity.length && statecity[0]?.state_name,
														value: statecity.length && statecity[0]?.state_id,
													},
												]}

											/>}
										defaultValue={""}
										control={control}
										name="state_id"
										error={errors && errors.state_id}
									/>
									{!!errors?.state_id && <Error className="mt-0">{errors?.state_id?.message}</Error>}
								</Col>
								<Col xs={12} md={12} lg={3} className="mx-auto" sm={12}>
									<Controller
										as={
											<Select
												label="City"
												placeholder="City"
												required={false}
												isRequired={true}
												options={[
													{
														id: statecity.length && statecity[0]?.city_id,
														name: statecity.length && statecity[0]?.city_name,
														value: statecity.length && statecity[0]?.city_id,
													},
												]}
											/>}
										defaultValue={""}
										control={control}
										name="city_id"
										error={errors && errors.city_id}
									/>
									{!!errors?.city_id && <Error className="mt-0">{errors?.city_id?.message}</Error>}
								</Col>
								<Col xs={12} md={12} lg={3} className="mx-auto" sm={12}>
									<Controller
										as={
											<Input
												label="Company Legal Name"
												placeholder="Company Legal Name"
												required={false}
												isRequired={true}

											/>}
										defaultValue={""}
										control={control}
										name="company_legal_name"
										error={errors && errors.company_legal_name}
									/>
									{!!errors?.company_legal_name && <Error className="mt-0">{errors?.company_legal_name?.message}</Error>}
								</Col>
								<Col sm="12" md="3" lg="3" xl="3">
									<Controller
										as={
											<Input
												label="No Of Employees"
												placeholder="No Of Employees"
												required={false}
												isRequired={true}
											/>}
										defaultValue={""}
										control={control}
										name="no_of_employees"
										error={errors && errors.no_of_employees}
									/>
									{!!errors?.no_of_employees && <Error className="mt-0">{errors?.no_of_employees?.message}</Error>}
								</Col>
								<Col sm="12" md="3" lg="3" xl="3">
									<Controller
										as={
											<Input
												label="Company Address"
												placeholder="Company Address"
												required={false}
												isRequired={true}
											/>}
										defaultValue={""}
										control={control}
										name="address"
										error={errors && errors.address}
									/>
									{!!errors?.address && <Error className="mt-0">{errors?.address?.message}</Error>}
								</Col>
								<Col sm="12" md="3" lg="3" xl="3">
									<Controller
										as={
											<Input
												label="GSTIN Number"
												placeholder="GSTIN Number"
												required={false}
												isRequired={true}
											/>}
										defaultValue={""}
										control={control}
										name="gstin_number"
										error={errors && errors.gstin_number}
									/>
									{!!errors?.gstin_number && <Error className="mt-0">{errors?.gstin_number?.message}</Error>}
								</Col>
								<Col sm="12" md="3" lg="3" xl="3">
									<Controller
										as={
											<Input
												label="Pan Number"
												placeholder="Pan Number"
												required={false}
												isRequired={true}
											/>}
										defaultValue={""}
										control={control}
										name="pan_number"
										error={errors && errors.pan_number}
									/>
									{!!errors?.pan_number && <Error className="mt-0">{errors?.pan_number?.message}</Error>}
								</Col>
							</Row>
							<Row>
								<Col md={12} className="d-flex justify-content-end mt-4">
									<Button type="submit">
										Save
									</Button>
								</Col>
							</Row>
						</Form>
					) : (
						// "labels transfer this to seprate component
						<Row className="mt-3 flex-wrap">
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Company Name</Head>
								<Text>{editCustomerProfileData?.company_name || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Work Email ID</Head>
								<Text>{editCustomerProfileData?.work_email || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Mobile Number</Head>
								<Text>{editCustomerProfileData?.contact_no || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Industry Type</Head>
								<Text>{industryName}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Pincode</Head>
								<Text>{editCustomerProfileData?.pincode || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>State</Head>
								<Text>{statecity[0]?.state_name || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>City</Head>
								<Text>{statecity[0]?.city_name || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Company Legal Name</Head>
								<Text>{editCustomerProfileData?.company_legal_name || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>No Of Employees</Head>
								<Text>{editCustomerProfileData?.no_of_employees || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Company Address</Head>
								<Text>{editCustomerProfileData?.address || "-"}</Text>
							</Col>
							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>GSTIN Number</Head>
								<Text>{editCustomerProfileData?.gstin_number || "-"}</Text>
							</Col>

							<Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
								<Head>Pan Number</Head>
								<Text>{editCustomerProfileData?.pan_number || "-"}</Text>
							</Col>
						</Row>
					)}
				</div>
			</CardBlue>
			{loading && <Loader />}
		</>
	);
};

export default ShowCompanyDetails;
