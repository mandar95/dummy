import React, { useEffect, useState } from "react";
import { Input, SelectComponent, Error, Loader } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import {
	fetchBrokers,
	fetchEmployers,
	fetchPoliciesST,
	fetchPolicies,
	fetchStates,
	fetchCities,
	fetchHosp,
	fetchHospByName,
	fetchHospByZip,
	setPageData,
	networkHospitalDownload,
	clearDD
} from "./networkhospitalbroker.slice";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import swal from "sweetalert";
import { common_module } from 'config/validations'
import { Prefill } from "../../custom-hooks/prefill";

const validation = common_module.network_hospital

const Filters = () => {
	const dispatch = useDispatch();
	const { currentUser, userType } = useSelector((state) => state.login);
	const {
		brokers,
		employers,
		policiesST,
		policies,
		cities,
		states,
		firstPage,
		lastPage,
		loading
	} = useSelector((state) => state.networkhospitalbroker);
	const [policy, setPolicy] = useState(null);

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		by_name: yup
			.string()
			.test("name", "Policy Name is required", (value) => (policy ? true : false))
			.max(validation.name, 'Max character reached'),
		by_pincode: yup
			.string()
			.test("name", "Policy Name is required", (value) => (policy ? true : false))
			.max(validation.pincode, 'Max character reached')
	});
	/*----x-----validation schema-----x----*/

	const { errors, watch, control, setValue } = useForm({
		validationSchema,
	});

	/*---broker ID ---*/

	useEffect(() => {
		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	//get broker
	useEffect(() => {
		if (userType === "Admin" || userType === "Super Admin") {
			dispatch(fetchBrokers(userType));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userType]);

	const brokerId = watch("broker_id")?.value || null;
	/*-x-broker ID -x-*/

	/*---Employer ID ---*/
	//get employer
	useEffect(() => {
		if ((currentUser?.broker_id || brokerId) && !['Employee', 'Employer'].includes(userType)) {
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
	}, [firstPage, brokerId, currentUser]);


	const employerId = watch("employer_id")?.value || null;
	/*-x-Employer ID -x-*/

	/*---Policy Type ID ---*/
	//get policy type id
	useEffect(() => {
		if (currentUser?.employer_id || employerId) {
			dispatch(clearDD("policy"));
			dispatch(clearDD("state"));
			dispatch(clearDD("city"));
			dispatch(clearDD("Hosp"));

			setValue([
				{ policy_sub_type_id: undefined },
				{ policy_id: undefined },
				{ state_id: undefined },
				{ city_id: undefined },
				{ by_name: '' },
				{ by_pincode: '' },
			])
			dispatch(
				fetchPoliciesST({ employer_id: employerId || currentUser?.employer_id })
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, employerId]);

	const policyTypeID = watch("policy_sub_type_id")?.value;
	/*-x-Policy Type ID -x-*/

	/*---Policy ID ---*/
	//get policy id
	useEffect(() => {
		if (policyTypeID && (currentUser?.employer_id || employerId)) {
			dispatch(clearDD("state"));
			dispatch(clearDD("city"));
			dispatch(clearDD("Hosp"));

			setValue([
				{ policy_id: undefined },
				{ state_id: undefined },
				{ city_id: undefined },
				{ by_name: '' },
				{ by_pincode: '' },
			])
			dispatch(
				fetchPolicies({
					user_type_name: userType,
					employer_id: employerId || currentUser?.employer_id,
					policy_sub_type_id: policyTypeID,
					...(currentUser.broker_id && { broker_id: currentUser.broker_id })
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyTypeID]);

	const policyId = watch("policy_id")?.value;
	/*-x-Policy ID -x-*/

	/*---State ID ---*/
	//get state
	useEffect(() => {
		if (policyId) {
			dispatch(clearDD("city"));
			dispatch(clearDD("Hosp"));

			setValue([
				{ state_id: undefined },
				{ city_id: undefined },
				{ by_name: '' },
				{ by_pincode: '' },
			])
			dispatch(fetchStates({ policy_id: policyId, }));
		}
		//set policy for validation
		setPolicy(policyId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyId]);

	const stateName = watch("state_id")?.value;
	/*-x-State ID -x-*/

	/*---City ID ---*/
	//get city
	useEffect(() => {
		if (stateName) {
			dispatch(clearDD("Hosp"));
			setValue('city_id', undefined);
			dispatch(fetchCities({ state_name: stateName, policy_id: policyId, }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateName]);

	const cityName = watch("city_id")?.value;
	const Name = watch("by_name");
	/*-x-City ID -x-*/

	/*---Hospital Data ---*/
	//get city
	useEffect(() => {
		if (cityName && !(Name && Name.length > 3 && Name.length % 3 === 0))
			dispatch(
				fetchHosp({
					state_name: stateName,
					city_name: cityName,
					policy_id: policyId,
				})
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cityName]);

	//By Name
	useEffect(() => {
		if (policyId) {
			if (Name && Name.length > 3 && Name.length % 3 === 0)
				dispatch(
					fetchHospByName({
						...!!stateName && { state_name: stateName },
						...!!cityName && { city_name: cityName },
						hospital_name: Name,
						policy_id: policyId,
					})
				);
		} else {
			if (Name) swal("Please select policy name", "", "warning");
			setValue("by_name", "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Name, cityName, stateName]);

	//By Pincode
	const pincode = watch("by_pincode");
	useEffect(() => {
		if (policyId) {
			if (pincode && pincode.length > 3 && pincode.length % 3 === 0)
				dispatch(
					fetchHospByZip({
						pincode: pincode,
						pin_code: pincode,
						policy_id: policyId,
					})
				);
		} else {
			if (pincode) swal("Please select policy name", "", "warning");
			setValue("by_pincode", "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pincode]);

	// Prefill 
	Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
	Prefill(policiesST, setValue, 'policy_sub_type_id', 'policy_sub_type_name', 'policy_sub_type_id')
	Prefill(policies, setValue, 'policy_id', 'policy_no')

	/*-x-Hospital Data -x-*/
	const downloadHandler = () => {
		const data = {
			...(Boolean(policyId) && { policy_id: policyId }),
			...(Boolean(stateName) && { state_name: stateName }),
			...(Boolean(cityName) && { city_name: cityName }),
			...(Boolean(pincode) && { pin_code: pincode }),
			...(Boolean(Name) && { hospital_name: Name }),
		}
		dispatch(networkHospitalDownload(data));
	}

	return (
		<Row style={{ marginTop: "-10px" }}>
			{(userType === "Admin" || userType === "Super Admin") && (
				<Col sm="12" md="12" lg="12" xl="12">
					<Controller
						as={
							<SelectComponent
								label="Broker"
								placeholder="Select Broker"
								required={false}
								options={
									brokers?.map((item) => ({
										id: item?.id,
										label: item?.name,
										value: item?.id,
									})) || []
								}
							/>
						}
						onChange={([e]) => {
							dispatch(clearDD("policyST"));
							dispatch(clearDD("policy"));
							dispatch(clearDD("state"));
							dispatch(clearDD("city"));
							dispatch(clearDD("Hosp"));

							setValue([
								{ employer_id: undefined },
								{ policy_sub_type_id: undefined },
								{ policy_id: undefined },
								{ state_id: undefined },
								{ city_id: undefined },
								{ by_name: '' },
								{ by_pincode: '' },
							])
							return e
						}}
						name="broker_id"
						control={control}
						error={errors && errors.broker_id}
					/>
				</Col>
			)}
			{(userType === "Admin" ||
				userType === "Super Admin" ||
				userType === "Broker") && (
					<Col sm="12" md="12" lg="12" xl="12">
						<Controller
							as={
								<SelectComponent
									label="Employer"
									placeholder="Select Employer"
									required={false}
									options={
										employers?.map((item) => ({
											id: item?.id,
											label: item?.name,
											value: item?.id,
										})) || []
									}
								/>
							}
							name="employer_id"
							control={control}
						/>
					</Col>
				)}

			{!!(currentUser.is_super_hr && currentUser.child_entities.length) && (

				<Col sm="12" md="12" lg="12" xl="12">
					<Controller
						as={
							<SelectComponent
								label="Employer"
								placeholder="Select Employer"
								required={false}
								options={currentUser.child_entities.map(item => (
									{
										id: item.id,
										label: item.name,
										value: item.id
									}
								)) || []}
							/>
						}
						defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
						name="employer_id"
						control={control}
					/>
				</Col>
			)}

			<Col sm="12" md="12" lg="12" xl="12">
				<Controller
					as={
						<SelectComponent
							label="Policy Type"
							placeholder="Select Policy Type"
							required={false}
							options={
								policiesST?.map((item) => ({
									id: item?.policy_sub_type_id,
									label: item?.policy_sub_type_name,
									value: item?.policy_sub_type_id,
								})) || []
							}
						/>
					}
					name="policy_sub_type_id"
					control={control}
				/>
			</Col>
			<Col sm="12" md="12" lg="12" xl="12">
				<Controller
					as={
						<SelectComponent
							label="Policy Name"
							placeholder="Select Policy Name"
							required={false}
							options={
								policies?.map((item) => ({
									id: item?.id,
									label: item?.policy_no,
									value: item?.id,
								})) || []
							}
						/>
					}
					name="policy_id"
					control={control}
				/>
			</Col>
			<Col sm="12" md="12" lg="12" xl="12">
				<Controller
					as={
						<SelectComponent
							isClearable
							label="State"
							placeholder="Select State"
							required={false}
							options={
								states?.map((item) => ({
									id: item?.state_name,
									label: item?.state_name,
									value: item?.state_name,
								})) || []
							}
						/>
					}
					name="state_id"
					control={control}
				/>
			</Col>
			<Col sm="12" md="12" lg="12" xl="12">
				<Controller
					as={
						<SelectComponent
							isClearable
							label="City"
							placeholder="Select City"
							required={false}
							options={
								cities?.map((item) => ({
									id: item?.CITY_NAME,
									label: item?.CITY_NAME,
									value: item?.CITY_NAME,
								})) || []
							}
						/>
					}
					name="city_id"
					control={control}
				/>
			</Col>
			{!(cityName || stateName) && <Col sm="12" md="12" lg="12" xl="12" className='text-center'> OR</Col>}
			<Col sm="12" md="12" lg="12" xl="12">
				<Controller
					as={<Input label="Search by Name" maxLength={validation.name} placeholder="Search by Name" />}
					name="by_name"
					control={control}
				/>
				{!!errors?.by_name && <Error>{errors?.by_name?.message}</Error>}
			</Col>
			<Col sm="12" md="12" lg="12" xl="12" className='text-center'> OR</Col>
			<Col sm="12" md="12" lg="12" xl="12">
				<Controller
					as={<Input label="Search by Zip Code" maxLength={validation.pincode} placeholder="Search by Zip Code" />}
					name="by_pincode"
					control={control}
				/>
				{!!errors?.by_pincode && <Error>{errors?.by_pincode?.message}</Error>}
			</Col>
			{Boolean(policyId) && <Col sm="12" md="12" lg="12" xl="12">
				<button type="button" className="btn btn-primary w-100" onClick={downloadHandler}>Download</button>
			</Col>}
			{loading && <Loader />}
		</Row>
	);
};

export default Filters;
