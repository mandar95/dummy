import React, { useEffect } from "react";
import { AttachFile2 } from "modules/core";
import { Row, Col, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Error, Select } from "components";
import { Button } from "components";
import { useSelector, useDispatch } from "react-redux";
import { clr, getstatecity, Update, success } from "../profileview.slice";
import * as yup from "yup";
import _ from "lodash";
import swal from "sweetalert";
import { numOnly, noSpecial } from "utils";
import { insurer } from 'config/validations'

const validation = insurer.profile

/*---------- validation schema ----------*/
const validationSchema = yup.object().shape({
	city: yup.string().nullable(),
	state: yup.string().nullable(),
	country: yup.string().nullable(),
	name: yup
		.string()
		.min(validation.name.min, `Minimum ${validation.name.min} character required`)
		.max(validation.name.max, `Maximum ${validation.name.max} character available`)
		.matches(validation.name.regex, "Name must contain only alphabets")
		.nullable(),
	email: yup.string().email("must be a valid email")
		.min(validation.email.min, `Minimum ${validation.email.min} character required`)
		.max(validation.email.max, `Maximum ${validation.email.max} character available`)
		.nullable(),
	contact_no_1: yup
		.string()
		.nullable()
		.matches(validation.contact_no.regex, 'Not valid number')
		.min(validation.contact_no.length, "Mobile No. should be 10 digits")
		.max(validation.contact_no.length, "Mobile No. should be 10 digits"),
	contact_no_2: yup
		.string()
		.nullable()
		.min(validation.contact_no.length, "Mobile No. should be 10 digits")
		.max(validation.contact_no.length, "Mobile No. should be 10 digits"),
	contact_no_3: yup
		.string()
		.nullable()
		.min(validation.contact_no.length, "Mobile No. should be 10 digits")
		.max(validation.contact_no.length, "Mobile No. should be 10 digits"),
	address_line_1: yup.string().nullable()
		.min(validation.address_line.min, `Enter atleast ${validation.address_line.min} letters`)
		.max(validation.address_line.max, `Maximum ${validation.address_line.max} character available`),
	address_line_2: yup.string().nullable()
		.min(validation.address_line.min, `Enter atleast ${validation.address_line.min} letters`)
		.max(validation.address_line.max, `Maximum ${validation.address_line.max} character available`),
	pincode: yup
		.string()
		.nullable()
		.min(validation.pincode.length, "pincode must consist 6 digits")
		.max(validation.pincode.length, "pincode must consist 6 digits"),
	PAN: yup
		.string()
		.nullable()
		.matches(
			validation.PAN.regex,
			"PAN number invalid"
		),
	GST: yup
		.string()
		.nullable()
		.matches(
			validation.GST.regex,
			"GST number invalid"
		),
});

const Edit = ({ onSet }) => {
	/*---x------ validation schema ------x---*/
	const dispatch = useDispatch();
	const { statecity, insurer, update } = useSelector((state) => state.profile);
	const { currentUser } = useSelector((state) => state.login);
	const { register, watch, handleSubmit, errors, control, setValue, reset } = useForm({
		validationSchema
	});

	//data prefill
	useEffect(() => {
		if (!_.isEmpty(insurer)) {
			reset({
				"name": insurer[0]?.name,
				"email": insurer[0]?.email,
				"country_id": insurer[0]?.country,
				"pincode": insurer[0]?.pincode,
				"city": insurer[0]?.city_id * 1,
				"state": insurer[0]?.state_id * 1,
				"address_line_1": insurer[0]?.address_line_1,
				"address_line_2": insurer[0]?.address_line_2,
				"contact_no_1": insurer[0]?.contact_no_1,
				"contact_no_2": insurer[0]?.contact_no_2,
				"contact_no_3": insurer[0]?.contact_no_3,
				"PAN": insurer[0]?.PAN,
				"GSTIN": insurer[0]?.GSTIN,
				"cin_no": insurer[0]?.cin_no,
				"irda_registration_number": insurer[0]?.irda_registration_number,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [insurer]);
	let Pincode = watch("pincode");

	useEffect(() => {
		if (String(Pincode)?.length === 6) {
			dispatch(getstatecity({ pincode: Pincode }));
		} else {
			dispatch(clr("pincode"));
			setValue("city", "");
			setValue("state", "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Pincode]);

	useEffect(() => {
		if (!_.isEmpty(statecity)) {
			setValue("city", statecity[0]?.city_id);
			setValue("state", statecity[0]?.state_id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [statecity]);

	//onSuccess
	useEffect(() => {
		if (update) {
			dispatch(success(update))
			swal(update, "", "success");
			onSet();
		}
		return () => {
			dispatch(clr("update"));
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [update]);

	const onSubmit = ({
		name,
		email,
		contact_no_1,
		contact_no_2,
		contact_no_3,
		logo,
		address_line_1,
		address_line_2,
		country,
		state,
		city,
		pincode,
		PAN,
		GSTIN,
		cin_no,
		irda_registration_number,
	}) => {
		const formdata = new FormData();
		name && formdata.append("name", name);
		email && formdata.append("email", email);
		country && formdata.append("country_id", country);
		pincode && formdata.append("pincode", pincode);
		city && formdata.append("city_id", city);
		state && formdata.append("state_id", state);
		address_line_1 && formdata.append("address_line_1", address_line_1);
		address_line_2 && formdata.append("address_line_2", address_line_2);
		contact_no_1 && formdata.append("contact_no_1", contact_no_1);
		contact_no_2 && formdata.append("contact_no_2", contact_no_2);
		contact_no_3 && formdata.append("contact_no_3", contact_no_3);
		formdata.append("status", 1);
		!_.isEmpty(logo) && formdata.append("logo", logo[0]);
		PAN && formdata.append("PAN", PAN);
		GSTIN && formdata.append("GSTIN", GSTIN);
		// cin_no && formdata.append("cin_no", cin_no);
		// irda_registration_number && formdata.append("irda_registration_number", irda_registration_number);
		dispatch(Update(currentUser?.ic_id, formdata));
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Row className="d-flex justify-content-center w-100">
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={<Input placeholder="Name" label="Name" maxLength={validation.name.max} isRequired={true} />}
						name="name"
						error={errors && errors.name}
						control={control}
					/>
					{!!errors.name && <Error>{errors.name.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={<Input placeholder="Email" label="Email" maxLength={validation.email.max} isRequired={true} />}
						name="email"
						error={errors && errors.email}
						control={control}
					/>
					{!!errors.email && <Error>{errors.email.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={<Input placeholder="PAN No" label="PAN No" maxLength={validation.PAN.length} isRequired={true} />}
						name="PAN"
						error={errors && errors.PAN}
						control={control}
					/>
					{!!errors.PAN && <Error>{errors.PAN.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={
							<Input
								placeholder="Contact No. 1"
								label="Contact No. 1"
								isRequired={true}
								// minLength="10"
								maxLength={validation.contact_no.length}
								type='tel'
								onKeyDown={numOnly} onKeyPress={noSpecial}
							/>
						}
						name="contact_no_1"
						error={errors && errors.contact}
						control={control}
					/>
					{!!errors.contact_no_1 && <Error>{errors.contact_no_1.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={
							<Input
								placeholder="Contact No. 2"
								label="Contact No. 2"
								// minLength="10"
								maxLength={validation.contact_no.length}
								type='tel'
								onKeyDown={numOnly} onKeyPress={noSpecial}
							/>
						}
						name="contact_no_2"
						error={errors && errors.contact}
						control={control}
					/>
					{!!errors.contact_no_2 && <Error>{errors.contact_no_2.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={
							<Input
								placeholder="Contact No. 3"
								label="Contact No. 3"
								// minLength="10"
								maxLength={validation.contact_no.length}
								type='tel'
								onKeyDown={numOnly} onKeyPress={noSpecial}
							/>
						}
						name="contact_no_3"
						error={errors && errors.contact}
						control={control}
					/>
					{!!errors.contact_no_3 && <Error>{errors.contact_no_3.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={<Input placeholder="GST No" maxLength={validation.GST.length} label="GST No" />}
						name="GSTIN"
						error={errors && errors.GSTIN}
						control={control}
					/>
					{!!errors.GSTIN && <Error>{errors.GSTIN.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={
							<Input label="IRDA Number" placeholder="IRDA Number" readOnly={true} />
						}
						name="irda_registration_number"
						control={control}
					/>
				</Col>
				<Col sm="12" md="6" lg="4" xl="4">
					<Controller
						as={<Input label="CIN" placeholder="CIN" readOnly={true} />}
						name="cin_no"
						control={control}
					/>
				</Col>
				<Col sm="12" md="12" lg="6" xl="6" className="mt-3 mb-3">
					<AttachFile2
						fileRegister={register}
						name={`logo`}
						title="Attach Logo"
						key="logo"
						accept=".jpeg, .png, .jpg"
						description="File Formats: jpeg, png, jpg"
						nameBox
					/>
				</Col>
			</Row>
			<Row className="d-flex justify-content-center">
				<Col sm="12" md="6" lg="6" xl="6">
					<Controller
						as={
							<Input
								placeholder="Address Line 1"
								label="Address Line 1"
								maxLength={validation.address_line.max}
								isRequired={true}
							/>
						}
						name="address_line_1"
						control={control}
						error={errors && errors.address_line_1}
					/>
					{!!errors.address_line_1 && <Error>{errors.address_line_1.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="6" xl="6">
					<Controller
						as={
							<Input
								placeholder="Address Line 2"
								label="Address Line 2"
								maxLength={validation.address_line.max}
								isRequired={true}
							/>
						}
						name="address_line_2"
						error={errors && errors.address_line_2}
						control={control}
					/>
					{!!errors.address_line_2 && <Error>{errors.address_line_2.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="3" xl="3">
					<Input placeholder="Country" label="Country" value={"India"} />
					<input type="hidden" name="country" value={1} ref={register} />
					{!!errors.country && <Error>{errors.country.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="3" xl="3" className="mb-4">
					<Controller
						as={
							<Input
								placeholder="Pincode"
								label="Pincode"
								isRequired={true}
								// minLength="6"
								maxLength={validation.pincode.length}
								required={false}
							/>
						}
						name="pincode"
						error={errors && errors.pincode}
						control={control}
					/>
					{!!errors.pincode && <Error>{errors.pincode.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="3" xl="3">
					<Controller
						as={
							<Select
								placeholder="State"
								label="State"
								isRequired={true}
								required={false}
								readOnly={true}
								options={[
									{
										id: statecity.length && statecity[0]?.state_id,
										name: statecity.length && statecity[0]?.state_name,
										value: statecity.length && statecity[0]?.state_id,
									},
								]}
							/>
						}
						name="state"
						error={errors && errors.state}
						control={control}
					/>
					{!!errors.state && <Error>{errors.state.message}</Error>}
				</Col>
				<Col sm="12" md="6" lg="3" xl="3">
					<Controller
						as={
							<Select
								placeholder="City"
								label="City"
								isRequired={true}
								required={false}
								readOnly={true}
								options={[
									{
										id: statecity.length && statecity[0]?.city_id,
										name: statecity.length && statecity[0]?.city_name,
										value: statecity.length && statecity[0]?.city_id,
									},
								]}
							/>
						}
						name="city"
						error={errors && errors.city}
						control={control}
					/>
					{!!errors.city && <Error>{errors.city.message}</Error>}
				</Col>
				<Col
					sm="12"
					md="12"
					lg="12"
					xl="12"
					className="mt-2 d-flex justify-content-end mb-2"
				>
					<Button type="submit">Submit</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default Edit;
