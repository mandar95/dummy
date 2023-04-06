import React, { useEffect, useState } from "react";
import { Select, Input, Error, CardBlue, Button, DatePicker } from "components";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
	// Employees,
	clear,
	// Policies,
	createNominee,
	getAllNominee,
	clearList,
	loadPolicyType,
	loadPolicyId,
	loadEmployee,
	policy_id as setpolicy_id,
	employee as setemployee,
	nom_list,
} from "./addMember.slice";
import swal from "sweetalert";
import * as yup from "yup";
import moment from "moment";
import Table from "./table";
// import { formatDate } from "../enrollment/enrollment.help";
import { loadRelationMaster } from "modules/policies/policy-config.slice";
import { NoDataFound, SelectComponent } from "../../components";
import { subYears } from "date-fns";

// import { DateFormate } from 'utils'
import { format } from 'date-fns'


const AddNominee = () => {
	const dispatch = useDispatch();
	const { error, nomineeList, success,
		policy_type, policy_id, employee, loading } = useSelector(
			(state) => state.addMember
		);

	const { familyLabels: relations } = useSelector(state => state.policyConfig);
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
	const [guardian, setGuardian] = useState(false);
	const [employerId, setEmployerId] = useState(null);

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		emp_id: yup.string().required("Please select employee"),
		policy_id: yup.string().required("Please select policy"),
		nominee_relation_id: yup.string().required("Please select nominee relation"),
		nominee_dob: yup
			.string()
			.required("Please enter dob"),
		nominee_fname: yup
			.string()
			.required("Please enter first name")
			.min(2, "Minimum 2 chars required")
			.matches(/^([A-Za-z\s])+$/, "Must contain only alphabets"),
		nominee_lname: yup
			.string()
			// .required("Please enter last name")
			// .min(2, "Minimum 2 chars required")
			.matches(/^([A-Za-z\s])+$/, { message: 'Name must contain only alphabets', excludeEmptyString: true })
			.notRequired().nullable(),
		share_per: yup
			.string()
			.required("Please enter share %")
			.test(
				"general",
				"share must cannot be greater than 100 %",
				(value) => value * 1 <= 100
			),
		...(guardian && {
			guardian_relation_id: yup
				.string()
				.required("Please select guardian relation"),
			guardian_dob: yup
				.string()
				.required("Please enter dob")
				.test(
					"adult",
					"guardian age should be above 18 years",
					(value) => Age(value) >= 18
				),
			guardian_fname: yup
				.string()
				.required("Please enter first name")
				.min(2, "Minimum 2 chars required")
				.matches(/^([A-Za-z\s])+$/, "Must contain only alphabets"),
			guardian_lname: yup
				.string()
				// .required("Please enter last name")
				// .min(2, "Minimum 2 chars required")
				.matches(/^([A-Za-z\s])+$/, { message: 'Name must contain only alphabets', excludeEmptyString: true })
				.notRequired().nullable(),
		}),
	});
	/*----x-----validation schema-----x----*/

	const { watch, setValue, handleSubmit, control, errors, reset } = useForm({
		validationSchema,
	});

	/*----------Employee & policy----------*/
	const employeeId = watch("emp_id");
	const policyId = watch("policy_id");

	//get employee
	useEffect(() => {
		if (currentUser?.employer_id) {
			dispatch(loadPolicyType({ employer_id: currentUser?.employer_id }))
			dispatch(setemployee([]));
			dispatch(nom_list([]))
		}
		// 	dispatch(Employees({ employer_id: currentUser?.employer_id }));
		//eslint-disable-next-line
	}, [currentUser]);

	useEffect(() => {
		dispatch(loadRelationMaster());
		dispatch(clearList())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	/*---x------Employee & policy------x---*/

	//validation merge
	const nomineeAge = moment().diff(
		moment(watch("nominee_dob"), "DDMMYYYY"),
		"years"
	);

	useEffect(() => {
		if (nomineeAge <= 18) {
			setGuardian(true);
		} else {
			setGuardian(false);
		}
	}, [nomineeAge]);

	//get age
	const Age = (dob) => {
		return moment().diff(moment(dob, "DDMMYYYY"), "years");
	};


	//error handling
	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}

		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	useEffect(() => {
		if (policyId && employeeId)
			dispatch(getAllNominee({ policy_id: policyId, employee_id: employeeId }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyId, employeeId])

	//on success
	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				dispatch(getAllNominee({ policy_id: policyId, employee_id: employeeId }));
			});
		}

		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success]);

	const resetValues = () => {
		setValue([
			{ "nominee_fname": "" },
			{ "nominee_lname": "" },
			{ "nominee_relation_id": "" },
			{ "nominee_dob": "" },
			{ "share_per": "" },
			{ "guardian_fname": "" },
			{ "guardian_lname": "" },
			{ "guardian_relation_id": "" },
			{ "guardian_dob": "" }
		]);
	};

	const onSubmit = ({
		emp_id,
		policy_id,
		nominee_fname,
		nominee_lname,
		nominee_relation_id,
		nominee_dob,
		share_per,
		guardian_fname,
		guardian_lname,
		guardian_relation_id,
		guardian_dob,
	}) => {
		const request = {
			emp_id: employerId || currentUser?.employer_id,
			employee_id: emp_id,
			policy_id: policy_id,
			nominee_fname: [nominee_fname],
			...(nominee_lname && { nominee_lname: [nominee_lname] }),
			nominee_relation_id: [nominee_relation_id],
			nominee_dob: [nominee_dob],
			share_per: [share_per],
			...(guardian_fname &&
				guardian_dob &&
				guardian_relation_id &&
			{
				guardian_fname: [guardian_fname || ""],
				...guardian_lname && { guardian_lname: [guardian_lname || ""] },
				guardian_relation_id: [guardian_relation_id || ""],
				guardian_dob: [guardian_dob || ""],
			})

		};
		dispatch(createNominee(request));
		resetValues();
	};

	const getPolicyId = ([e]) => {
		dispatch(setemployee([]));
		dispatch(nom_list([]))
		if (e.target.value) {
			dispatch(loadPolicyId({
				employer_id: employerId || currentUser?.employer_id,
				policy_sub_type_id: e.target.value,
				user_type_name: userTypeName
			}));
		}
		return e.target.value;
	}

	const getEmployee = ([e]) => {
		dispatch(nom_list([]))
		if (e.target.value) {
			dispatch(loadEmployee({
				employer_id: employerId || currentUser?.employer_id,
				policy_id: e.target.value
			}));
		}
		return e.target.value
	}

	const getEmployerId = ([e]) => {
		reset({
			'policy_type': '',
			'policy_id': '',
			'emp_id': ''
		})
		dispatch(setpolicy_id([]));
		dispatch(setemployee([]));
		dispatch(nom_list([]))
		if (e.value) {
			setEmployerId(e.value)
			dispatch(loadPolicyType({ employer_id: e.value }))
		}
		return e
	};

	return (
		<>
			<CardBlue title="Add Nominee">
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row>
						{!!(currentUser.is_super_hr && currentUser.child_entities.length) && (
							<Col sm="12" md="6" lg="6" xl="6">
								<Controller
									as={
										<SelectComponent
											label="Employer"
											placeholder='Select Employer'
											options={currentUser.child_entities.map(item => (
												{
													id: item.id,
													label: item.name,
													value: item.id
												}
											)) || []}
											id="employer_id"
											required
										/>
									}
									defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
									onChange={getEmployerId}
									name="employer_id"
									control={control}
								/>
							</Col>
						)}
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={<Select
									label="Policy Type"
									placeholder='Select Policy Type'
									options={policy_type?.filter(({ id }) => id <= 3).map(({ id, name }) => ({
										name: name, id: id, value: id
									}))}
									// valueName="policy_sub_type_name"
									// valueId="policy_sub_type_id"
									id="policy_type"
									required
								/>}
								onChange={getPolicyId}
								name="policy_type"
								control={control}
							/>
						</Col>
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={<Select
									label="Policy Name"
									placeholder='Select Policy Name'
									options={policy_id.map(({ policy_no, id }) => ({
										name: policy_no, id, value: id
									}))}
									// valueName="policy_no"
									id="policy_id"
									required
								/>}
								onChange={getEmployee}
								name="policy_id"
								control={control}
							/>
						</Col>
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={<Select
									label="Employee"
									placeholder='Select Employee'
									options={employee.map(({ employee_name, employee_id }) => ({
										name: employee_name, id: employee_id, value: employee_id
									}))}
									// valueName="employee_name"
									// valueId="employee_id"
									id="emp_id"
									required
								/>}
								// onChange={getMember}
								name="emp_id"
								control={control}
							/>
						</Col>
						{/* <Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={
									<Select
										label="Employee"
										placeholder="Select Employee"
										required={false}
										options={
											employees?.map((item) => ({
												id: item?.id,
												name: item?.name,
												value: item?.id,
											})) || []
										}
									/>
								}
								error={errors && errors.employee}
								name="employee"
								control={control}
							/>
							{!!errors?.employee && <Error>{errors?.employee.message}</Error>}
						</Col>
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={
									<Select
										label="Policy Type"
										placeholder="Select Policy Type"
										required={false}
										options={
											policy?.map((item) => ({
												id: item?.id,
												name: `${item?.name}`,
												value: item?.id,
											})) || []
										}
									/>
								}
								error={errors && errors.policy_id}
								name="policy_id"
								control={control}
							/>
							{!!errors?.policy_id && <Error>{errors?.policy_id.message}</Error>}
						</Col> */}
					</Row>
					<Row style={{ borderTop: "1px dashed black" }} className="mt-2">
						<Col sm="12" md="12" lg="12" xl="12" className="text-center mt-2">
							<h5>Details</h5>
						</Col>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={
									<Select
										label="Relation with Employee"
										placeholder="Relation with Employee"
										required={false}
										isRequired={true}
										options={relations?.map(item => ({
											id: item.id,
											name: item.name,
											value: item.id
										})) || []}
									/>
								}
								error={errors && errors.nominee_relation_id}
								name="nominee_relation_id"
								control={control}
							/>
							{!!errors?.nominee_relation_id && (
								<Error>{errors?.nominee_relation_id.message}</Error>
							)}
						</Col>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={<Input label="First Name" placeholder="First Name" />}
								name="nominee_fname"
								isRequired={true}
								error={errors && errors.nominee_fname}
								control={control}
							/>
							{!!errors?.nominee_fname && (
								<Error>{errors?.nominee_fname.message}</Error>
							)}
						</Col>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={<Input label="Last Name" placeholder="Last Name" />}
								name="nominee_lname"
								isRequired={false}
								error={errors && errors.nominee_lname}
								control={control}
							/>
							{!!errors?.nominee_lname && (
								<Error>{errors?.nominee_lname.message}</Error>
							)}
						</Col>
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={
									<DatePicker
										maxDate={new Date()}
										name={'nominee_dob'}
										label={'Date of birth'}
										error={errors && errors.nominee_dob}
										required
									/>
								}
								onChange={([selected]) => {
									return selected ? format(selected, 'dd-MM-yyyy') : '';
								}}
								name="nominee_dob"
								control={control}
							/>
							{!!errors?.nominee_dob && <Error>{errors?.nominee_dob.message}</Error>}
						</Col>
						<Col sm="12" md="6" lg="6" xl="6">
							{/*cannot be greater than 100*/}
							<Controller
								as={<Input label="Nominee Share %" max='100' placeholder="Share %" />}
								name="share_per"
								isRequired={true}
								error={errors && errors.share_per}
								control={control}
							/>
							{!!errors?.share_per && <Error>{errors?.share_per.message}</Error>}
						</Col>
					</Row>
					{Age(watch("nominee_dob")) <= 18 && (
						<Row style={{ borderTop: "1px dashed black" }} className="mt-2">
							<Col sm="12" md="12" lg="12" xl="12" className="text-center mt-2">
								<h5>Guardian details</h5>
							</Col>
							<Col sm="12" md="6" lg="6" xl="6">
								<Controller
									as={
										<Select
											label="Relation with Nominee"
											placeholder="Select Relation with Nominee"
											required={false}
											options={relations?.map(item => ({
												id: item.id,
												name: item.name,
												value: item.id
											})) || []}
										/>
									}
									isRequired={true}
									error={errors && errors.guardian_relation_id}
									name="guardian_relation_id"
									control={control}
								/>
								{!!errors?.guardian_relation_id && (
									<Error>{errors?.guardian_relation_id.message}</Error>
								)}
							</Col>

							<Col sm="12" md="6" lg="6" xl="6">
								<Controller
									as={<Input label="First name" placeholder="First name" />}
									name="guardian_fname"
									isRequired={true}
									error={errors && errors.guardian_fname}
									control={control}
								/>
								{!!errors?.guardian_fname && (
									<Error>{errors?.guardian_fname.message}</Error>
								)}
							</Col>
							<Col sm="12" md="6" lg="6" xl="6">
								<Controller
									as={<Input label="Last name" placeholder="Last name" />}
									name="guardian_lname"
									isRequired={false}
									error={errors && errors.guardian_lname}
									control={control}
								/>
								{!!errors?.guardian_lname && (
									<Error>{errors?.guardian_lname.message}</Error>
								)}
							</Col>
							<Col sm="12" md="6" lg="6" xl="6">
								<Controller
									as={
										<DatePicker
											maxDate={subYears(new Date(), 18)}
											name={'guardian_dob'}
											label={'Date of birth'}
											required
										/>
									}
									onChange={([selected]) => {
										return selected ? format(selected, 'dd-MM-yyyy') : '';
									}}
									name="guardian_dob"
									control={control}
								/>
								{!!errors?.guardian_dob && (
									<Error>{errors?.guardian_dob.message}</Error>
								)}
							</Col>
						</Row>
					)}
					<Row>
						<Col sm="12" md="12" lg="12" xl="12">
							<Button type="submit" style={{ float: "right" }}>
								Submit
							</Button>
						</Col>
					</Row>
				</Form>
			</CardBlue>
			{!!(policyId && employeeId) && <CardBlue title="Details">
				{loading ? <NoDataFound text='Loading Nominees' img='/assets/images/loading.jpg' /> : (nomineeList?.length ? <Table data={nomineeList} /> : <NoDataFound />)}
			</CardBlue>}
		</>
	);
};

export default AddNominee;
