import React, { useEffect } from "react";
import { CardBlue, Button, SelectComponent, Error, Input } from "../../../components";
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Table from "./table.js";
import * as yup from "yup";
import {
	createBWPM,
	getAllBWPM,
	clear,
	getBrokers,
	getAllBenefit,
	getAllPartner,
	ExportBWPM
} from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { downloadFile } from "../../../utils";
import { useParams } from "react-router";
import { Prefill } from "../../../custom-hooks/prefill";

const BenefitWellnessMap = ({ myModule }) => {

	const dispatch = useDispatch();
	const { userType } = useParams();
	const { BWPMs, success, brokers, benefits, partners, export_bwpm, error } = useSelector(
		(state) => state.wellness
	);
	const { globalTheme } = useSelector(state => state.theme)
	const { currentUser, userType: userTypeName } = useSelector(state => state.login);


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
		partner_id: yup.object().shape({
			id: yup.string().required('Wellness Partner Required'),
		}),
		benefit_id: yup.object().shape({
			id: yup.string().required('Benefit Required'),
		}),
		url: yup.string().url().required("Please select URL"),
		...(userType === "admin" && {
			broker_id: yup.string().required("Please select broker"),
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
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			dispatch(getBrokers(userTypeName));
		}
		if (userType === "broker" && currentUser?.broker_id) {
			dispatch(getAllBenefit({ broker_id: currentUser?.broker_id }));
			dispatch(getAllPartner({ broker_id: currentUser?.broker_id }));
			dispatch(getAllBWPM({ broker_id: currentUser?.broker_id }));
		}
		//eslint-disable-next-line
	}, [currentUser, userTypeName]);

	useEffect(() => {
		if (brokerId) {
			dispatch(getAllPartner({ broker_id: brokerId }));
			dispatch(getAllBenefit({ broker_id: brokerId }));
			dispatch(getAllBWPM({ broker_id: brokerId }));
		}
		//eslint-disable-next-line
	}, [brokerId]);

	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				dispatch(
					getAllBWPM({
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

	/*--------- Export excel ----------*/
	//card title

	const title = (
		<div className="d-flex w-100">
			<p className="p-0 m-0 w-100">Details</p>
			<div className="d-flex justify-content-end">
				<Btn
					size="sm"
					varient="primary"
					onClick={() => {
						exportExcel();
					}}
				>
					<p
						style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', fontWeight: "600", wordBreak: "keep-all" }}
						className="p-0 m-0"
					>
						Export
					</p>
				</Btn>
			</div>
		</div>
	);

	const exportExcel = () => {
		if (currentUser?.broker_id || brokerId) {
			dispatch(
				ExportBWPM({
					broker_id: userType === "broker" ? currentUser?.broker_id : brokerId,
				})
			);
		} else {
			swal("Please select broker", "", "info");
		}
	};

	//virtual anchor tag
	useEffect(() => {
		if (export_bwpm) {
			downloadFile(export_bwpm)
			dispatch(clear('benefit-wellness-partner-mapping-export'))
		}
		//eslint-disable-next-line
	}, [export_bwpm])
	/*----x---- Export excel -----x----*/

	// Prefill 
	Prefill(partners, setValue, 'partner_id', 'wellness_partner');
	Prefill(benefits, setValue, 'benefit_id');

	const resetValues = () => {
		setValue([{ "partner_id": undefined }, { "benefit_id": undefined }, { "url": null }]);
	};

	const onSubmit = (data) => {
		let request = {
			partner_id: data?.partner_id?.value,
			benefit_id: data?.benefit_id?.value,
			url: data?.url,
			broker_id: userType === "broker" ? currentUser?.broker_id : brokerId,
		};
		dispatch(createBWPM(request));
		resetValues();
	};

	return (
		<>
			{((!!myModule?.canwrite && userType === "broker") ||
				(userType === "admin")) &&
				<CardBlue title="Benefit & Wellness Partner Mapping">
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
								<Col sm="12" md="6" lg="4" xl="4">
									<Controller
										as={
											<SelectComponent
												label="Wellness Partner"
												placeholder="Select Wellness Partner"
												required={false}
												isRequired={true}
												options={
													partners?.filter((item) => item.status === 1)?.map((item) => ({
														id: item?.id,
														label: item?.wellness_partner,
														value: item?.id,
													})) || []
												}
											/>
										}
										name="partner_id"
										control={control}
										error={errors && errors.partner_id?.id}
									/>
									{!!errors?.partner_id?.id && <Error>{errors?.partner_id?.id?.message}</Error>}
								</Col>
								<Col sm="12" md="6" lg="4" xl="4">
									<Controller
										as={
											<SelectComponent
												label="Benefit"
												placeholder="Select Benefit"
												required={false}
												isRequired={true}
												options={
													benefits?.filter((item) => item.status === 1)?.map((item) => ({
														id: item?.id,
														label: item?.name,
														value: item?.id,
													})) || []
												}
											/>
										}
										name="benefit_id"
										control={control}
										error={errors && errors.benefit_id?.id}
									/>
									{!!errors?.benefit_id?.id && <Error>{errors?.benefit_id?.id?.message}</Error>}
								</Col>
								<Col sm="12" md="6" lg="4" xl="4">
									<Controller
										as={<Input label="URL" placeholder="Enter URL" isRequired={true} />}
										name="url"
										control={control}
										defaultValue={""}
										error={errors && errors.url}
									/>
									{!!errors?.url && <Error>{errors?.url?.message}</Error>}
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
			<CardBlue title={title}>
				<Table
					myModule={myModule}
					data={brokerId || currentUser?.broker_id ? BWPMs : []} />
			</CardBlue>
		</>
	);
};

export default BenefitWellnessMap;
