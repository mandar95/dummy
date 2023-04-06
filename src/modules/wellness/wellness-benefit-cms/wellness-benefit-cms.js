import React, { useEffect } from "react";
import { CardBlue, Button, SelectComponent, Error } from "../../../components";
import Table from "./table";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllCMS,
	createCMS,
	clear,
	getBrokers,
	getEmployers,
	getAllICD,
	getAllBrokerICD,
	setPageData
} from "../wellness.slice";
import swal from "sweetalert";


const WellnessCMS = ({ userType, myModule }) => {

	const dispatch = useDispatch();
	const {
		CMSs,
		success,
		brokers,
		employers,
		error,
		ICDData,
		BrokerICDData,
		firstPage,
		lastPage
	} = useSelector((state) => state.wellness);
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);

	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}
		return () => {
			dispatch(clear());
		};
		//eslint-disable-next-line
	}, [error]);

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		employer_id: yup.object().shape({
			id: yup.string().required('Employer Required'),
		}),
		icd_id: yup.object().shape({
			id: yup.string().required('ICD Required'),
		}),
		...(userType === "admin" && {
			broker_id: yup.object().shape({
				id: yup.string().required('Broker Required'),
			}),
		}),
	});
	/*----x-----validation schema-----x----*/

	const { control, errors, handleSubmit, watch, setValue } = useForm({
		validationSchema,
	});

	//broker feild
	const brokerId = watch("broker_id")?.value;

	useEffect(() => {
		setValue("broker_id", "");

		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			dispatch(getBrokers(userTypeName));
		}
		//eslint-disable-next-line
	}, [userType, userTypeName]);

	useEffect(() => {
		if (brokerId || (userType === "broker" && currentUser?.broker_id)) {
			dispatch(getAllCMS({ broker_id: brokerId || currentUser?.broker_id }));
		}
		if (brokerId) {
			dispatch(getAllICD({ broker_id: brokerId || currentUser?.broker_id }));
		}
		if (userType === "broker" && currentUser?.broker_id) {
			dispatch(getAllBrokerICD({ broker_id: currentUser?.broker_id }));
		}
		//eslint-disable-next-line
	}, [brokerId, currentUser]);

	useEffect(() => {
		if (brokerId || (userType === "broker" && currentUser?.broker_id)) {
			if (lastPage >= firstPage) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				dispatch(getEmployers({ broker_id: brokerId || currentUser?.broker_id }, firstPage));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstPage, brokerId, currentUser]);


	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				dispatch(
					getAllCMS({
						broker_id: userType === "broker" ? currentUser?.broker_id : brokerId,
					})
				);
			});
		}

		return () => {
			dispatch(clear());
		};
		//eslint-disable-next-line
	}, [success]);

	const resetValues = () => {
		setValue([{ "employer_id": undefined }, { "icd_id": undefined }]);
	};

	const onSubmit = ({ employer_id, icd_id }) => {
		const formdata = new FormData();
		formdata.append("employer_id", employer_id?.value);
		formdata.append("icd_id", icd_id?.value);
		formdata.append(
			"broker_id",
			userType === "broker" ? currentUser?.broker_id : brokerId
		);
		dispatch(createCMS(formdata));
		resetValues();
	};

	return (
		<>
			{((!!myModule?.canwrite && userType === "broker") ||
				(userType === "admin")) &&
				<CardBlue title="Wellness Benefit CMS">
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Row style={{ marginTop: "-10px" }}>
							{(userType === "admin") && (
								<Col sm="12" md="12" lg="12" xl="12">
									<Controller
										as={
											<SelectComponent
												label="Broker"
												placeholder="Select Broker"
												required={false}
												isRequired={true}
												options={
													brokers?.map((item) => ({
														id: item?.id,
														label: item?.name,
														value: item?.id,
													})) || []
												}
											/>
										}
										name="broker_id"
										control={control}
										error={errors && errors.broker_id?.id}
									/>
									{!!errors?.broker_id?.id && <Error>{errors?.broker_id?.id?.message}</Error>}
								</Col>
							)}
							{!!myModule?.canwrite && <>
								<Col sm="12" md="12" lg="6" xl="6">
									<Controller
										as={
											<SelectComponent
												label="Employer"
												placeholder="Select Employer"
												required={false}
												isRequired={true}
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
										error={errors && errors.employer_id?.id}
									/>
									{!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
								</Col>
								<Col sm="12" md="12" lg="6" xl="6">
									<Controller
										as={
											<SelectComponent
												label="ICD"
												placeholder="Select ICD"
												required={false}
												isRequired={true}
												options={
													(userType === "broker" ? BrokerICDData : ICDData)?.map((item) => ({
														id: item?.id,
														label: `${item?.icd_code} - ${item?.icd_name}`,
														value: userType === "broker" ? item?.icd_id : item?.id,
													})) || []
												}
											/>
										}
										name="icd_id"
										control={control}
										error={errors && errors.icd_id?.id}
									/>
									{!!errors?.icd_id?.id && <Error>{errors?.icd_id?.id?.message}</Error>}
								</Col>
								<Col
									sm="12"
									md="12"
									lg="12"
									xl="12"
									className="d-flex justify-content-end"
								>
									<Button type="submit">Submit</Button>
								</Col>
							</>}
						</Row>
					</Form>
				</CardBlue>
			}
			<CardBlue title="Details">
				<Table
					myModule={myModule}
					data={brokerId || currentUser?.broker_id ? CMSs : []} />
			</CardBlue>
		</>
	);
};

export default WellnessCMS;
