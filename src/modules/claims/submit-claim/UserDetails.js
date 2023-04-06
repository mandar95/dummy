import React, { useState, useEffect } from "react";
import * as yup from "yup";
import {
	addDays,
	// isAfter, isEqual
} from "date-fns";

import { Input, Button, Error, Select, DatePicker } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";
import {
	StyledProgressBar,
	ProgressText,
	ProgressCount,
	CaneclDiv,
} from "./style";

import { useDispatch, useSelector } from "react-redux";
import { claim, claimAvailable, loadIntimateClaimId } from "../claims.slice";
import _ from "lodash";
import { numOnly, noSpecial, DateFormate } from "utils";
import { common_module } from 'config/validations'
import { format } from 'date-fns'
// import { SelectComponent } from "../../../components";
import swal from "sweetalert";
import { useHistory } from "react-router";

const validation = common_module.submit_claim

const validationSchema = (isIpd, is_claim_intimation_mandatory) => yup.object().shape({
	relation: yup.string().required("Relation required"),
	mobile_no: yup.string()
		.required('Mobile No. is required')
		.min(validation.mobile_no.length, "Mobile No. should be 10 digits")
		.max(validation.mobile_no.length, "Mobile No. should be 10 digits")
		.matches(validation.mobile_no.regex, 'Not valid number'),
	// .test('invalid', 'Not valid number', (value) => {
	// 	return !/^[9]{10}$/.test(value);
	// }),
	email: yup.string().email("must be a valid email")
		.required("Email required")
		.min(validation.email.min, `Minimum ${validation.email.min} character required`)
		.max(validation.email.max, `Maximum ${validation.email.max} character available`),
	// ...isIpd && /* ClaimSubType */ {
	// 	claim_hospitalization_type: yup.array().of(yup.object().shape({
	// 		id: yup.string().required('Sum Insured Required'),
	// 	})).required('Sum Insured Required')
	// },
	// ...is_claim_intimation_mandatory && {
	// 	intimate_claim_id: yup.object().shape({
	//     id: yup.string().required('Employer Required'),
	//   })
	// }
});

export const UserDetail = (props) => {

	const { control, errors, reset, handleSubmit, register, setValue/* , watch */ } = useForm({
		defaultValues: props.data ? {
			...props.data,
		} : {},
		validationSchema: validationSchema(props.type !== "opd"),
	});

	// const claim_hospitalization_type = watch('claim_hospitalization_type') || [];

	const [memberId, setMemberId] = useState(props.data?.member_id);
	const { members, is_date_valid, intimateClaimId } = useSelector(claim);
	const dispatch = useDispatch();
	const history = useHistory();


	const onSubmit = (data) => {
		if (currentPolicyDetail.is_claim_intimation_mandatory && props.type !== "opd") {
			if (!intimateClaimId.length) {
				swal('Validation', 'Claim Intimation is not submitted, please click here for claim intimation', 'info').then(() => {
					history.push('intimate-claim')
				});
				return
			}
			if (!data.intimate_claim_id) {
				swal('Validation', 'Intimation Claim Is Required Before Submit Claim', 'info');
				return
			}
		} else {
			data.intimate_claim_id = ''
		}
		props.submitData(1, data);
	};
	const memberData = members.find(
		(member) => Number(member.member_id) === Number(props.watch("member_id"))
	);

	useEffect(() => {
		if (!_.isEmpty(memberData)) {
			setValue([{
				"tpa_member_id":
					memberData?.tpa_member_id ? memberData?.tpa_member_id : ""
			},
			{
				"tpa_member_name":
					memberData?.tpa_member_name ? memberData?.tpa_member_name : ""
			},
			{
				"tpa_emp_id":
					memberData?.tpa_emp_id ? memberData?.tpa_emp_id : ""
			}
			]);

		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memberData]);

	useEffect(() => {
		if (props.data?.member_id) {
			setMemberId(props.data?.member_id);
			// selectMember(props.data?.member_id)
			reset({
				...props.data,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.data]);

	useEffect(() => {
		setMemberId()
		setValue([
			{ member_id: '' },
			{ tpa_member_id: '' },
			{ tpa_member_name: '' },
			{ tpa_emp_id: '' },
			{ relation: '' },
			{ mobile_no: '' },
			{ email: '' },
			{ intimate_claim_id: '' },
			{ discharge_date: '' },
			{ admit_date: '' },
			// ClaimSubType
			// { claim_hospitalization_type: [] }
		])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.refresh]);

	useEffect(() => {
		if (members && memberId) {
			const member = members.find((member) => member.member_id === Number(memberId));
			const oldDetail = member?.relation_name === props.data?.relation && Number(memberId) === member?.member_id;
			setValue([
				{ relation: oldDetail ? props.data?.relation : member?.relation_name || props.data?.relation },
				{ mobile_no: oldDetail ? props.data?.mobile_no : member?.mobile || props.data?.mobile_no || '' },
				{ email: oldDetail ? props.data?.email : member?.email || props.data?.email },
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memberId, members]);

	const selectMember = (id) => {
		if (id) setMemberId(id);
	};

	const currentPolicyDetail = props.policyData.find(({ id }) => id === Number(props.policyId)) || {}
	useEffect(() => {
		if (
			(/* (props.maxDate && memberId && props.policyId && props.minDate) || */
				(props.type === "opd" && memberId && props.minDate)) /* ClaimSubType *//* &&
			(props.type === 'opd' ? true : claim_hospitalization_type.some(({ label }) => label === 'Hospitalization')) */
		) {
			dispatch(
				claimAvailable({
					member_id: memberId,
					policy_id: props.policyId,
					admit_date: props.minDate,
					...(props.type !== "opd" && { discharge_date: props.maxDate }),
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [/* props.maxDate, */ memberId, props.policyId, props.minDate, dispatch/* ClaimSubType *//* , claim_hospitalization_type */]);


	useEffect(() => {
		if (currentPolicyDetail.is_claim_intimation_mandatory && props.type !== "opd" && memberId) {
			dispatch(loadIntimateClaimId({
				policy_id: props.policyId,
				member_id: memberId
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memberId, (currentPolicyDetail.is_claim_intimation_mandatory && props.type !== "opd")])

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Row className="d-flex flex-wrap" style={{ margin: "0px" }}>
				<Col md={6} lg={6} xl={4} sm={12}>
					<Controller
						as={
							<Select
								label="Patient Name"
								placeholder="Select Patient"
								options={
									members.map((item) => ({
										id: item.member_id,
										name: item.name,
										value: item.member_id,
									})) || []
								}
								id="patient_name"
								required
							/>
						}
						// selected={Number(props.data.member_id) || ""}
						defaultValue
						onChange={([e]) => {
							selectMember(e.target.value);
							setValue([{ discharge_date: '' }, { admit_date: '' } /* ClaimSubType *//* , { claim_hospitalization_type: [] } */])
							return e.target.value;
						}}
						name="member_id"
						control={control}
					/>
					<input
						type="hidden"
						ref={register}
						name="tpa_member_id"
					/>
					<input
						type="hidden"
						ref={register}
						name={"tpa_member_name"}
					/>
					<input
						type="hidden"
						ref={register}
						name={"tpa_emp_id"}
					/>
				</Col>
				<Col md={6} lg={6} xl={4} sm={12}>
					<Controller
						as={
							<Input
								label="Relation With Employee"
								placeholder="Relation With Employee"
							/>
						}
						name="relation"
						disabled
						isRequired
						labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
						error={errors && errors.relation}
						control={control}
					/>
					{!!errors.relation && <Error>{errors.relation.message}</Error>}
				</Col>
				<Col md={6} lg={6} xl={4} sm={12}>
					<Controller
						as={
							<Input
								label="Mobile Number"
								min={0}
								type='tel'
								maxLength={validation.mobile_no.length}
								onKeyDown={numOnly} onKeyPress={noSpecial}
								placeholder="Mobile Number"
								required
							/>
						}
						name="mobile_no"
						value={members[memberId]?.mobile || ""}
						error={errors && errors.mobile_no}
						control={control}
					/>
					{!!errors.mobile_no && <Error>{errors.mobile_no.message}</Error>}
				</Col>
				<Col md={6} lg={6} xl={4} sm={12}>
					<Controller
						as={
							<Input
								label="Email Id"
								type="email"
								maxLength={validation.email.max}
								placeholder="Enter Email Id"
								required
							/>
						}
						name="email"
						value={members[memberId]?.email || ""}
						error={errors && errors.email}
						control={control}
					/>
					{!!errors.email && <Error>{errors.email.message}</Error>}
				</Col>
				<Col md={6} lg={6} xl={4} sm={12}>
					{/* <Controller
							as={
								<Input
									label={props.type !== "opd" ? "Hospitalisation Date" : "OPD Date"}
									required
								/>
							}
							onBlur={([e]) => {
								props.setMinDate(e.target.value);
								if (props.maxDate) {
									// if (isAfter(new Date(e.target.value.split("-")), new Date(props.maxDate.split("-"))) ||
									//   isEqual(new Date(e.target.value.split("-")), new Date(props.maxDate.split("-")))) {
									reset({ discharge_date: "" });
									props.setMaxDate();
									// }
								}
							}}
							onChange={([e]) => {
								return e;
							}}
							min={props.formatDate(subYears(new Date(), 1))}
							max={props.formatDate(addDays(new Date(), 0))}
							name="admit_date"
							control={control}
						/> */}
					<Controller
						as={
							<DatePicker
								minDate={/* subYears(new Date(), 1) */ new Date(currentPolicyDetail.start_date || '2000-01-01')}
								maxDate={(currentPolicyDetail.end_date && new Date() > new Date(currentPolicyDetail.end_date)) ? new Date(currentPolicyDetail.end_date) : new Date()}
								name={'admit_date'}
								label={props.type !== "opd" ? "Hospitalization Date" : "OPD Date"}
								required
								noInput
							/>
						}
						onSelect={(selected) => {
							selected && props.setMinDate(format(selected, 'dd-MM-yyyy'));
							if (props.maxDate) {
								setValue('discharge_date', "");
								props.setMaxDate();
							}
						}}
						onChange={([selected]) => {
							(!memberId && props.data?.member_id) && setMemberId(props.data?.member_id);
							return selected ? format(selected, 'dd-MM-yyyy') : '';
						}}
						name="admit_date"
						control={control}
					/>
				</Col>
				{props.type !== "opd" && (
					<Col md={6} lg={6} xl={4} sm={12}>
						{/* <Controller
								as={<Input label="Discharge Date" required />}
								onBlur={([e]) => props.setMaxDate(e.target.value)}
								onChange={([e]) => {
									return e;
								}}
								min={props.formatDate(addDays(new Date(props.minDate), 0))}
								max={props.formatDate(addDays(new Date(), 0))}
								name="discharge_date"
								control={control}
							/> */}
						<Controller
							as={
								<DatePicker
									minDate={addDays(new Date(props.minDate ? DateFormate(props.minDate || '01-01-1900', { dateFormate: true }) : currentPolicyDetail.start_date), 0)}
									maxDate={(currentPolicyDetail.end_date && new Date() > new Date(currentPolicyDetail.end_date)) ? new Date(currentPolicyDetail.end_date) : new Date()}
									name={'discharge_date'}
									label={'Discharge Date'}
									required
									noInput
								/>
							}
							onSelect={(selected) => props.setMaxDate(format(selected, 'dd-MM-yyyy'))}
							onChange={([selected]) => {
								(!setMemberId && props.data?.member_id) && setMemberId(props.data?.member_id);
								return selected ? format(selected, 'dd-MM-yyyy') : '';
							}}
							name="discharge_date"
							control={control}
						/>
					</Col>
				)}
				{/* ClaimSubType */}
				{/* {props.type !== "opd" &&
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<SelectComponent
									label="Claim Sub Type"
									placeholder="Select Claim Sub Type"
									required
									options={[
										{ id: 'Pre-hospitalization', label: 'Pre-hospitalization', value: 'Pre-hospitalization' },
										{ id: 'Post-hospitalization', label: 'Post-hospitalization', value: 'Post-hospitalization' },
										{ id: 'Hospitalization', label: 'Hospitalization', value: 'Hospitalization' },
									]}
									isRequired={true}
									multi={true}
									closeMenuOnSelect={false}
									closeMenuOnScroll={false}
									hideSelectedOptions={true}
									isClearable={false}
								/>
							}
							name="claim_hospitalization_type"
							control={control}
							error={errors && errors.claim_hospitalization_type}
						/>
					</Col>} */}

				{!!(currentPolicyDetail.is_claim_intimation_mandatory && props.type !== "opd") && <Col md={6} lg={6} xl={4} sm={12}>
					<Controller
						as={
							<Select
								label="Intimate Claim ID"
								placeholder="Select Intimate Claim "
								options={
									intimateClaimId || []
								}
								id="intimate_claim_id"
								isRequired
								required={false}
							/>
						}
						name="intimate_claim_id"
						control={control}
					/>
				</Col>}
			</Row>
			<div className="mt-4 d-flex flex-wrap justify-content-between">
				<div md={4} className="text-center">
					<StyledProgressBar now={props.progress} />
					<ProgressText>
						<ProgressCount>{`${props.progress}% `}</ProgressCount>
						of 100 Completed
					</ProgressText>
				</div>
				<div className="d-flex flex-wrap h-50 justify-content-end">
					<CaneclDiv>
						{/* <Button type="button" buttonStyle="danger" >
                Cancel
              </Button> */}
					</CaneclDiv>
					<Button
						type={(is_date_valid /* ClaimSubType *//* || !claim_hospitalization_type.some(({ label }) => label === 'Hospitalization') */) ? "submit" : "button"}
						buttonStyle={(is_date_valid /* ClaimSubType *//* || !claim_hospitalization_type.some(({ label }) => label === 'Hospitalization') */) ? "" : "submit-disabled"}
					>
						Save & Next
					</Button>
				</div>
			</div>
		</Form>
	);
};
