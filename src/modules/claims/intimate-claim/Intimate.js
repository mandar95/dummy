import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as yup from "yup";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router-dom";

import { Card, TabWrapper, Tab, Loader, SelectComponent } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";

import { ReimbursementClaim, CashlessClaim } from ".";

import { useDispatch, useSelector } from "react-redux";
import {
	clearEmployer,
	loadEmployee,
	clearEmployee,
	loadPolicyType,
	clear_policy_type,
	intimateClaim,
	claim,
	loadMembers,
	clearMembers,
	loadPolicyId,
	clear_policy_id,
	clearCity,
	clearHospital,
	loadBroker,
	loadBrokerEmployer,
	clear,
} from "../claims.slice";
import { common_module } from 'config/validations'
import {
	fetchEmployers,
	setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { Prefill } from "../../../custom-hooks/prefill";
const validation = common_module.reimb_cashless_claim

const validationSchema = (reimbursement) => {
	return (
		yup.object().shape({
			mobile_no: yup.string()
				.required('Mobile No. is required')
				.min(validation.mobile_no.length, "Mobile No. should be 10 digits")
				.max(validation.mobile_no.length, "Mobile No. should be 10 digits")
				.matches(validation.mobile_no.regex, 'Not valid number'),
			email: yup
				.string()
				.email("must be a valid email")
				.required("Email required")
				.min(validation.email.min, `Minimum ${validation.email.min} character required`)
				.max(validation.email.max, `Maximum ${validation.email.max} character available`),
			doctor_name: yup
				.string()
				.required("Doctor Name required")
				// .min(validation.doctor.min, `Minimum ${validation.doctor.min} character required`)
				.max(validation.doctor.max, `Maximum ${validation.doctor.max} character available`)
				.matches(validation.doctor.regex, 'Name must contain only alphabets & .(dots)'),
			reason: yup.string()
				.required("Reason Required")
				.min(validation.admitted_for.min, `Minimum ${validation.admitted_for.min} character required`)
				.max(validation.admitted_for.max, `Maximum ${validation.admitted_for.max} character available`)
				.matches(validation.admitted_for.regex, 'Must contain only alphabets'),
			member_id: yup.string().required('Patient Required'),
			planned_date: yup.string().required('Admission Date Required'),
			// discharge_date: yup.string().required('Discharge Date Required'),
			...reimbursement && {
				claim_amt: yup.string().required("Amount required")
					.min(validation.estimated_claim.min, `Minimum ${validation.estimated_claim.min} character required`)
					.max(validation.estimated_claim.max, `Maximum ${validation.estimated_claim.max} character available`),
				hospital_name: yup.string().required("Hospital Name required")
					.min(validation.hospital_name.min, `Minimum ${validation.hospital_name.min} character required`)
					.max(validation.hospital_name.max, `Maximum ${validation.hospital_name.max} character available`),
				hospital_address: yup.string().required("Hospital Addres required")
					.min(validation.hospital_address.min, `Minimum ${validation.hospital_address.min} character required`)
					.max(validation.hospital_address.max, `Maximum ${validation.hospital_address.max} character available`),
				remark: yup.string()
					// .required("Remark required")
					.min(validation.remark.min, `Minimum ${validation.remark.min} character required`)
					.max(validation.remark.max, `Maximum ${validation.remark.max} character available`)
					.matches(validation.remark.regex, 'Must contain only alphabets'),

			},
			...!reimbursement && {
				file_no: yup.string()
					// .required("File No required")
					.min(validation.file_no.min, `Minimum ${validation.file_no.min} character required`)
					.max(validation.file_no.max, `Maximum ${validation.file_no.max} character available`)
					.matches(validation.file_no.regex, 'Must contain only alphabets & numbers'),
				state_name: yup.string().required('State Required'),
				city_name: yup.string().required('City Required'),
				hospital_id: yup.string().required('Hospital Required')
			}
		}))
}

export const IntimitateClaim = () => {
	const history = useHistory();
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
	const { employers,
		firstPage,
		lastPage, } = useSelector(
			(state) => state.networkhospitalbroker
		);
	const { userType } = useParams();
	const [trigger, setTrigger] = useState("Reimbursement");
	const { control, errors, reset, handleSubmit, watch, setValue } = useForm({
		validationSchema: validationSchema(trigger === 'Reimbursement')
	});
	const brokerId = (watch("broker_id") || {})?.id;
	const dispatch = useDispatch();
	const {
		loading,
		error,
		success,
		employee,
		policy_type,
		policy_id,
		hospitals,
		members,
		broker,
	} = useSelector(claim);

	const employerId = watch('employer_id')?.value || currentUser?.employer_id;
	const employeeId = watch('emp_id')?.value || currentUser?.employee_id;
	const policyNo = watch('policy_type')?.value;
	const policyId = watch('policy_id')?.value;

	useEffect(() => {
		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
			if (lastPage >= firstPage) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstPage, currentUser]);

	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			dispatch(loadBroker(userTypeName));
			return () => {
				dispatch(clearEmployer());
				dispatch(clearEmployee());
				dispatch(clear_policy_type());
				dispatch(clearMembers());
				dispatch(clear_policy_id());
				dispatch(clearCity());
				dispatch(clearHospital());
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userTypeName]);

	useEffect(() => {
		if (employerId) {
			setValue([
				{ policy_type: undefined },
				{ policy_id: undefined },
				{ emp_id: undefined },
			])
			dispatch(loadPolicyType({ employer_id: employerId }));
			return () => {
				dispatch(clearEmployee());
				dispatch(clearMembers());
				dispatch(clear_policy_type());
				dispatch(clear_policy_id());
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employerId]);

	useEffect(() => {
		if (employerId && policyNo) {
			setValue([
				{ policy_id: undefined },
				{ emp_id: undefined },
			])
			dispatch(
				loadPolicyId({
					user_type_name: userTypeName,
					employer_id: employerId, policy_sub_type_id: policyNo,
					...(userType === "broker" && currentUser.broker_id && { broker_id: currentUser.broker_id })
				})
			);
			return () => {
				dispatch(clearEmployee());
				dispatch(clearMembers());
				dispatch(clear_policy_id());
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyNo]);

	useEffect(() => {
		if (
			(userType === "employer" || userType === "broker" || userType === "admin") &&
			employerId &&
			policyId
		) {
			setValue([
				{ emp_id: undefined },
				{ planned_date: '' },
				{ discharge_date: '' }
			])
			dispatch(loadEmployee({ employer_id: employerId, policy_id: policyId }));
			return () => {
				dispatch(clearEmployee());
				dispatch(clearMembers());
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyId]);

	useEffect(() => {
		if (employeeId && policyId)
			dispatch(loadMembers({ employee_id: employeeId, policy_id: policyId }));
		return () => {
			dispatch(clearMembers());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, userType === 'employee' ? [policyId] : [employeeId]);

	useEffect(() => {
		// if (trigger !== "OPD") {
		if (!loading && error) {
			swal("Alert", error, "warning");
		}
		if (!loading && success) {
			swal(success, "", "success");
			history.push(`/${userType}/overall-claim`);
		}
		// }
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, error, loading]);

	// Prefill 
	Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
	Prefill(policy_type, setValue, 'policy_type', 'policy_sub_type_name', 'policy_sub_type_id')
	Prefill(policy_id, setValue, 'policy_id', 'policy_no')
	useEffect(() => {
		if (employee.length === 1)
			setValue('emp_id', { id: employee[0].employee_id, label: employee[0].employee_name + ' : ' + employee[0].employee_code, value: employee[0].employee_id })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employee])

	const getAdminEmployer = ([e]) => {
		if (e?.value) {
			dispatch(loadBrokerEmployer(e.value));

			setValue([
				{ employer_id: undefined },
				{ policy_type: undefined },
				{ policy_id: undefined },
				{ emp_id: undefined },
			])
		}
		return e;
	};

	const onSubmit = (data) => {
		const {
			policy_id,
			member_id,
			claim_type,
			planned_date,
			discharge_date,
			email,
			mobile_no,
			reason,
			file_no,
			hospital_id,
			doctor_name,
			hospital_name,
			claim_amt,
			remark,
			state_name,
			city_name,
			hospital_address
		} = data;

		const memberData = members.find(
			(member) => member.member_id === Number(member_id)
		);

		if (claim_type === "cashless") {
			const {
				id,
				hospital_name,
				address1,
				address2
			} = hospitals.find((hospital) => {
				return hospital.id === Number(hospital_id);
			});

			dispatch(
				intimateClaim({
					policy_id: policy_id?.value,
					member_id,
					claim_type,
					planned_date,
					...(discharge_date && { discharge_date }),
					email,
					mobile_no,
					reason,
					file_no,
					hospital_id: id,
					hospital_name,
					hospital_address: `${address1 || ''} ${address2 || ''}`,
					doctor_name,
					state_name,
					city_name,
					tpa_member_id: memberData.tpa_member_id,
					tpa_member_name: memberData.tpa_member_name || memberData.name,
					tpa_emp_id: memberData.tpa_emp_id || employerId,
					status: 1,
				})
			);
		} else if (claim_type === "reimbursement") {
			dispatch(
				intimateClaim({
					policy_id: policy_id?.value,
					member_id,
					claim_type,
					planned_date,
					...(discharge_date && { discharge_date }),
					email,
					mobile_no,
					reason,
					hospital_name,
					hospital_address,
					doctor_name,
					claim_amt,
					remark,
					tpa_member_id: memberData.tpa_member_id,
					tpa_member_name: memberData.tpa_member_name || memberData.name,
					tpa_emp_id: memberData.tpa_emp_id || employerId,
					status: 1,
				})
			);
		}
	};

	const formatDate = (date) => {
		var d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	};


	return (
		<>
			{/* <TabWrapper> */}
			<TabWrapper width={"max-content"}>
				<Tab
					isActive={trigger === "Reimbursement"}
					onClick={() => setTrigger("Reimbursement")}
				>
					Reimbursement
				</Tab>
				<Tab
					isActive={trigger === "Cashless"}
					onClick={() => setTrigger("Cashless")}
				>
					Cashless
				</Tab>
			</TabWrapper>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ImageCard title="Intimate Claim" round>
					<Row className="d-flex flex-wrap">
						{userType === "admin" && (
							<Col md={6} lg={4} xl={3} sm={12}>
								<Controller
									as={
										<SelectComponent
											label="Broker"
											placeholder='Select Broker'
											options={broker.map(item => (
												{
													id: item.id,
													label: item.name,
													value: item.id
												}
											)) || []}
											id="id"
											required
										/>
									}
									onChange={getAdminEmployer}
									name="broker_id"
									control={control}
								/>
							</Col>
						)}
						{(userType === "broker" || userType === "admin") && (
							<Col md={6} lg={4} xl={3} sm={12}>
								<Controller
									as={
										<SelectComponent
											label="Employer"
											placeholder='Select Employer'
											options={employers.map(item => (
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
									// onChange={getPolicyType}
									name="employer_id"
									control={control}
								/>
							</Col>
						)}
						{!!(currentUser.is_super_hr && currentUser.child_entities.length) && (
							<Col md={6} lg={4} xl={3} sm={12}>
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
									// onChange={getPolicyType}
									name="employer_id"
									control={control}
								/>
							</Col>
						)}
						<Col md={6} lg={4} xl={3} sm={12}>
							<Controller
								as={
									<SelectComponent
										label="Policy Type"
										placeholder="Select Policy Type"
										options={policy_type.map((item) => ({
											id: item.policy_sub_type_id,
											label: item.policy_sub_type_name,
											value: item.policy_sub_type_id,
										})) || []}
										id="policy_id"
										required
									/>
								}
								// onChange={getPolicyId}
								name="policy_type"
								control={control}
							/>
						</Col>
						<Col md={6} lg={4} xl={3} sm={12}>
							<Controller
								as={
									<SelectComponent
										label="Policy Name"
										placeholder="Select Policy Name"
										options={
											policy_id.map((item) => ({
												id: item.id,
												label: item.policy_no,
												value: item.id,
											})) || []
										}
										id="policy_id"
										required
									/>
								}
								// onChange={getEmployee}
								name="policy_id"
								control={control}
							/>
						</Col>
						{userType !== "employee" && (
							<Col md={6} lg={4} xl={3} sm={12}>
								<Controller
									as={
										<SelectComponent
											label="Employee Name : Code"
											placeholder='Select Employee'
											options={employee.map(item => (
												{
													id: item.employee_id,
													label: item.employee_name + ' : ' + item.employee_code,
													value: item.employee_id
												}
											)) || []}
											id="emp_id"
											required
										/>
									}
									// onChange={([e]) => {
									// 	setEmployeeId(e?.value);
									// 	return e;
									// }}
									name="emp_id"
									control={control}
								/>
							</Col>
						)}
					</Row>
				</ImageCard>

				{trigger === "Reimbursement" && (
					<ReimbursementClaim
						control={control}
						errors={errors}
						Controller={Controller}
						formatDate={formatDate}
						validation={validation}
						policyId={policyId}
						watch={watch} setValue={setValue}
					/>
				)}
				{trigger === "Cashless" && (
					<CashlessClaim
						control={control}
						errors={errors}
						Controller={Controller}
						policyId={policyId}
						formatDate={formatDate}
						reset={reset}
						validation={validation}
						watch={watch} setValue={setValue}
					/>
				)}
			</Form>
			{loading && <Loader />}
		</>
	);
};

const ImageCard = styled(Card)`
	background: url("/assets/images/bg-4.png") no-repeat bottom right;
	background-color: #ffffff;
`;
