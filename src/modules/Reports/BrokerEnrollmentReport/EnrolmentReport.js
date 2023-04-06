import React, { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import CardBlue from "components/GlobalCard/CardBlue";
import { Row, Col } from "react-bootstrap";
import { Button, SelectComponent, DatePicker, Loader, Error } from "components";
import { format } from 'date-fns'
import { Controller, useForm } from "react-hook-form";
import { DateFormate } from "utils";
import {
	loadPolicyTypes,
	exportDetails,
	loadPolicies,
	loadEmployers,
	loadBroker,
	loadBrokerEmployer,
	initialState, reducer
} from "../Report.action";
import { DivButton } from "./style";
import { ProgressBar } from "../../EndorsementRequest/progressbar";
import { useParams } from "react-router";
import { reportValidationSchema } from "../validation";
import { Prefill } from "../../../custom-hooks/prefill";


const EnrolmentReport = () => {

	const [{ lastpage, firstpage,
		brokers, employers, policy_subtypes, policies,
		loading, loadingReport }, dispatch] = useReducer(reducer, initialState);
	const { userType } = useParams();
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);

	const { handleSubmit, control, setValue, watch, errors } = useForm({
		validationSchema: reportValidationSchema(userType)
	});
	const getSubPolicy_id = watch("policy_sub_type_id")?.value || '';
	const getEmployer_id = watch("employer_id")?.value || '';
	const policy_id = watch("policy_id")?.value || '';
	const from_date = watch('from_date') || '';
	const to_date = watch('to_date') || '';

	//api call for broker data -----
	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			loadBroker(dispatch, userTypeName);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userTypeName]);
	//---------------

	useEffect(() => {
		if (lastpage >= firstpage && currentUser?.broker_id && userType === "broker") {
			var _TimeOut = setTimeout(_callback, 250);
		}
		function _callback() {
			loadEmployers(dispatch, { broker_id: currentUser?.broker_id }, firstpage);
		}
		return () => {
			clearTimeout(_TimeOut)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstpage, currentUser]);

	useEffect(() => {
		if (policy_id) {
			const policy = policies?.find(({ id }) => id === Number(policy_id));
			setValue([
				{ to_date: DateFormate(policy?.end_date || '', { dateFormate: true }) || "" },
				{ from_date: DateFormate(policy?.start_date || '', { dateFormate: true }) || "" }
			])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policy_id])

	// Prefill 
	Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
	Prefill(policy_subtypes, setValue, 'policy_sub_type_id')
	Prefill(policies, setValue, 'policy_id', 'number')


	useEffect(() => {
		if ((getEmployer_id || currentUser?.employer_id)) {
			setValue([
				{ policy_sub_type_id: undefined },
				{ policy_id: undefined },
				{ to_date: undefined },
				{ from_date: undefined }
			])
			loadPolicyTypes(dispatch, { employer_id: getEmployer_id || currentUser?.employer_id, });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getEmployer_id, currentUser]);

	useEffect(() => {
		if ((getEmployer_id || currentUser?.employer_id) && getSubPolicy_id) {
			const data = {
				...(currentUser?.broker_id && { broker_id: currentUser?.broker_id }),
				employer_id: getEmployer_id || currentUser?.employer_id,
				policy_sub_type_id: getSubPolicy_id,
				user_type_name: userTypeName
			};
			setValue([
				{ policy_id: undefined },
				{ to_date: undefined },
				{ from_date: undefined }
			])
			loadPolicies(dispatch, data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getSubPolicy_id]);

	const getAdminEmployer = ([e]) => {
		if (e?.value) {
			loadBrokerEmployer(dispatch, e.value);
			setValue([
				{ employer_id: undefined },
				{ policy_sub_type_id: undefined },
				{ policy_id: undefined },
				{ to_date: undefined },
				{ from_date: undefined }
			])
		}
		return e;
	};

	const onSubmitDetails = (data) => {
		//Api Call for exportDetails
		exportDetails(dispatch, {
			...data, policy_id: data.policy_id?.value,
			employer_id: data.employer_id?.value || currentUser?.employer_id,
			is_super_hr: currentUser.is_super_hr,
			report_filter_key: data.report_filter_key?.value,
			report_endorsement_filter_key: data.report_endorsement_filter_key?.value,
		});
	};

	return (
		<CardBlue title="Enrolment Report" round>
			<form onSubmit={handleSubmit(onSubmitDetails)}>
				<Row>
					{userType === "admin" && (
						<Col xs={12} sm={12} md={6} lg={4} xl={3}>
							<Controller
								as={
									<SelectComponent
										label="Broker"
										placeholder="Select Broker"
										options={brokers.map((item) => ({
											id: item?.id,
											label: item?.name,
											value: item?.id,
										}))}
										id="id"
										isRequired
									/>
								}
								onChange={getAdminEmployer}
								name="broker_id"
								error={errors && errors?.broker_id?.id}
								control={control}
							/>
							{!!errors?.broker_id?.id && <Error>{errors?.broker_id?.id?.message}</Error>}
						</Col>
					)}
					{(userType === "broker" || userType === "admin") && (
						<Col xs={12} sm={12} md={6} lg={4} xl={3}>
							<Controller
								as={
									<SelectComponent
										label="Employer"
										placeholder="Select Employer"
										options={
											employers?.map((item) => ({
												id: item?.id,
												label: item?.name || item?.company_name,
												value: item?.id,
											})) || []
										}
										isRequired
									/>
								}
								name="employer_id"
								error={errors && errors?.employer_id?.id}
								control={control}
							/>
							{!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
						</Col>
					)}

					{!!(currentUser.is_super_hr && currentUser.child_entities.length) && (
						<Col xs={12} sm={12} md={6} lg={4} xl={3}>
							<Controller
								as={
									<SelectComponent
										label="Employer"
										placeholder="Select Employer"
										options={currentUser.child_entities.map(item => (
											{
												id: item.id,
												label: item.name,
												value: item.id
											}
										)) || []}
										isRequired
									/>
								}
								defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
								name="employer_id"
								error={errors && errors?.employer_id?.id}
								control={control}
							/>
							{!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
						</Col>
					)}

					<Col xs={12} sm={12} md={6} lg={4} xl={3}>
						<Controller
							as={
								<SelectComponent
									label="Policy Type"
									placeholder="Select Policy"
									options={
										policy_subtypes?.map((item) => ({
											id: item?.id,
											label: item?.name,
											value: item?.id,
										})) || []
									}
									isRequired
								/>
							}
							name="policy_sub_type_id"
							error={errors && errors?.policy_sub_type_id?.id}
							control={control}
						/>
						{!!errors?.policy_sub_type_id?.id && <Error>{errors?.policy_sub_type_id?.id?.message}</Error>}
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={3}>
						<Controller
							as={
								<SelectComponent
									label="Policy Name"
									placeholder="Policy Name"
									options={
										policies?.map((item) => ({
											id: item?.id,
											label: item?.number,
											value: item?.id,
										})) || []
									}
									isRequired
								/>
							}
							name="policy_id"
							error={errors && errors?.policy_id?.id}
							control={control}
						/>
						{!!errors?.policy_id?.id && <Error>{errors?.policy_id?.id?.message}</Error>}
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={3}>
						<Controller
							as={
								<DatePicker
									maxDate={new Date(DateFormate(to_date || '01-01-2200', { dateFormate: true }))}
									name={'from_date'}
									label={'Start Date'}
									required={false}
									isRequired
								/>
							}
							onChange={([selected]) => {
								return selected ? format(selected, 'dd-MM-yyyy') : '';
							}}
							name="from_date"
							error={errors && errors?.from_date}
							control={control}
						/>
						{!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={3}>
						<Controller
							as={
								<DatePicker
									minDate={new Date(DateFormate(from_date || '01-01-1900', { dateFormate: true }))}
									name={'to_date'}
									label={'End Date'}
									required={false}
									isRequired
								/>
							}
							onChange={([selected]) => {
								return selected ? format(selected, 'dd-MM-yyyy') : '';
							}}
							name="to_date"
							error={errors && errors?.to_date}
							control={control}
						/>
						{!!errors?.to_date && <Error>{errors?.to_date?.message}</Error>}
					</Col>

					<Col xs={12} sm={12} md={6} lg={4} xl={3}>
						<Controller
							as={
								<SelectComponent
									label="Live Status"
									placeholder="Select Live Status"
									options={[
										{ label: 'All', value: 0 },
										{ label: 'Active', value: 1 },
										{ label: 'In-Active', value: 2 }]}
									id="report_filter_key"
									isRequired
								/>
							}
							name="report_filter_key"
							error={errors && errors?.report_filter_key?.id}
							control={control}
							defaultValue={{ label: 'All', value: 0 }}
						/>
						{!!errors?.report_filter_key?.id && <Error>{errors?.report_filter_key?.id?.message}</Error>}
					</Col>
					<Col xs={12} sm={12} md={6} lg={4} xl={3}>
						<Controller
							as={
								<SelectComponent
									label="Upload Type"
									placeholder="Select Upload Type"
									options={[
										{ label: 'All', value: 0 },
										{ label: 'Endorsement', value: 1 },
										{ label: 'Inception', value: 2 }
									]}
									id="report_endorsement_filter_key"
									isRequired
								/>
							}
							name="report_endorsement_filter_key"
							error={errors && errors?.report_endorsement_filter_key?.id}
							control={control}
							defaultValue={{ label: 'All', value: 0 }}
						/>
						{!!errors?.report_endorsement_filter_key?.id && <Error>{errors?.report_endorsement_filter_key?.id?.message}</Error>}
					</Col>
				</Row>
				<DivButton>
					<Button type="submit">
						<span style={{ marginLeft: "-5px", marginRight: "-2px" }}>Export</span>
						<i className="ti ti-file" style={{ paddingLeft: "8px" }}></i>
					</Button>
				</DivButton>
			</form>
			{loadingReport && <ProgressBar text='Fetching Data...' />}
			{loading && <Loader />}
		</CardBlue>
	);
};

export default EnrolmentReport;
