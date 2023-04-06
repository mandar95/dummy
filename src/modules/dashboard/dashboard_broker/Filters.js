import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { SelectComponent, Button, Error, DatePicker } from "components";
// import { FieldContainer } from "./style";
import {
	getPoliciesData,
	selectPolicyData,
	// getEmployerData,
	// selectEmployerData,
} from "./dashboard_broker.slice";
import {
	fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import * as yup from "yup";
import { DateFormate } from 'utils'
import { format } from 'date-fns'
import { Prefill } from "../../../custom-hooks/prefill";

/*----------validation schema----------*/
const validationSchema = yup.object().shape({
	till_date: yup.string().required("Please enter End Date"),
	from_date: yup.string().required("Please enter Start Date"),
	// employer_id: yup.string().required("Please select Employer"),
	employer_id: yup.object().shape({
		id: yup.string().required('Please select Employer'),
	}),
	policy_id: yup.object().shape({
		id: yup.string().required('Please select Policy'),
	}).nullable(),
});
/*----x-----validation schema-----x----*/

const Filters = (props) => {
	//Selectors
	const dispatch = useDispatch();
	const { handleSubmit, control, errors, setValue, watch } = useForm({ validationSchema });

	const PolicyData = useSelector(selectPolicyData);
	// const employers = useSelector(selectemployers);
	const { employers,
		firstPage,
		lastPage, } = useSelector(
			(state) => state.networkhospitalbroker
		);
	const { userType } = useSelector((state) => state.login);
	const { currentUser } = useSelector(state => state.login);
	const [empId, setEmpId] = useState(null);
	// const [policyId, setPolicyId] = useState(null);
	// const [policy, setPolicy] = useState({ start_date: '', end_date: '' });

	const from_date = watch('from_date') || '';
	const policyId = watch('policy_id')?.id || '';
	// const till_date = watch('till_date') || '';
	//Api calls  --------
	useEffect(() => {
		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// useEffect(() => {
	// 	if (currentUser.broker_id) {
	// 		dispatch(getEmployerData(currentUser?.broker_id));
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [currentUser]);
	useEffect(() => {
		if ((currentUser?.broker_id)) {
			if (lastPage >= firstPage) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstPage, currentUser]);

	useEffect(() => {
		if (policyId) {
			props.getTypeId(policyId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyId])

	useEffect(() => {
		if (policyId && PolicyData?.data?.data) {
			const policy = PolicyData?.data?.data?.find(({ id }) => id === Number(policyId));
			setValue([
				{ till_date: DateFormate(policy?.policy_end_date || '', { dateFormate: true }) || '' },
				{ from_date: DateFormate(policy?.policy_start_date || '', { dateFormate: true }) || '' }
			])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyId, PolicyData?.data?.data])

	useEffect(() => {
		if (empId) {
			const data = { employer_id: empId, user_type_name: userType };
			dispatch(getPoliciesData(data));
			setValue([
				{ till_date: undefined },
				{ from_date: undefined },
				{ policy_id: undefined }
			])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [empId]);
	//---------------------------------

	// Prefill 
	Prefill(employers, setValue, 'employer_id')
	Prefill(PolicyData?.data?.data, setValue, 'policy_id', 'policy_number')


	return (
		<form onSubmit={handleSubmit(props.getData)}>
			<Row>
				<Col xs={12} sm={12} md={6} lg={4} xl={3}>
					<Controller
						as={
							<SelectComponent
								label="Employer"
								placeholder="Select Employer"
								required={false}
								isRequired={true}
								options={employers?.map((item) => ({
									id: item?.id,
									label: item?.name,
									value: item?.id,
								})) || []}
								error={errors?.employer_id?.id}
							/>
						}
						onChange={([selected]) => {
							setEmpId(selected?.value);
							return selected;
						}}
						name="employer_id"
						control={control}
					/>
					{!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
				</Col>
				<Col xs={12} sm={12} md={6} lg={4} xl={3}>
					<Controller
						as={
							<SelectComponent
								label="Policy Name"
								placeholder="Select Policy Name"
								required={false}
								isRequired={true}
								options={PolicyData?.data?.data?.map((item) => ({
									id: item?.id,
									label: item?.policy_number,
									value: item?.id,
								})) || []}
								error={errors?.policy_id?.id}
							/>
						}
						name="policy_id"
						control={control}
					/>
					{!!errors?.policy_id?.id && <Error>{errors?.policy_id?.id?.message}</Error>}
				</Col>
				<Col xs={12} sm={12} md={6} lg={4} xl={3}>
					<Controller
						as={
							<DatePicker
								minDate={new Date(DateFormate(/* policy.start_date || */ '01-01-1900', { dateFormate: true }))}
								maxDate={new Date(DateFormate(/* till_date || policy.end_date || */ '01-01-2200', { dateFormate: true }))}
								name={'from_date'}
								label={'Date Range From'}
								required={false}
								isRequired={true}
								error={errors && errors?.from_date}
							/>
						}
						onChange={([selected]) => {
							setValue('till_date', '')
							return selected ? format(selected, 'dd-MM-yyyy') : '';
						}}
						name="from_date"
						control={control}
					/>
					{!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
				</Col>
				<Col xs={12} sm={12} md={6} lg={4} xl={3}>
					<Controller
						as={
							<DatePicker
								minDate={new Date(DateFormate(from_date || /* policy.start_date || */ '01-01-1900', { dateFormate: true }))}
								maxDate={new Date(DateFormate(/* policy.end_date || */ '01-01-2200', { dateFormate: true }))}
								name={'till_date'}
								label={'Date Range To'}
								required={false}
								isRequired={true}
								error={errors && errors?.till_date}
							/>
						}
						onChange={([selected]) => {
							return selected ? format(selected, 'dd-MM-yyyy') : '';
						}}
						name="till_date"
						control={control}
					/>
					{!!errors?.till_date && <Error>{errors?.till_date?.message}</Error>}
				</Col>
			</Row>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<Button type="submit">Next</Button>
			</div>
		</form>
	);
};
export default Filters;
