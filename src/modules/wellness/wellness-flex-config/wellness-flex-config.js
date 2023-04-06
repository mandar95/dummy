import React, { useEffect } from "react";
import { CardBlue, Button, SelectComponent, Error, Head } from "../../../components";
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { CustomControl } from "../../user-management/AssignRole/option/style";
import Table from "./table.js";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllWF,
	createWF,
	clear,
	getBrokers,
	getEmployers,
	ExportWF,
	setPageData,
} from "../wellness.slice";
import swal from "sweetalert";
import { downloadFile } from "../../../utils";
import { useParams } from "react-router";

const WellnessFlexConfig = ({ myModule }) => {

	const dispatch = useDispatch();
	const { userType } = useParams();
	const { globalTheme } = useSelector(state => state.theme)
	const { WFs, success, brokers,
		employers, export_wf, error,
		firstPage,
		lastPage } = useSelector(
			(state) => state.wellness
		);
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
		employer_id: yup.object().shape({
			id: yup.string().required('Employer Required'),
		}),
		...(userType === "admin" && {
			broker_id: yup.object().shape({
				id: yup.string().required('Broker Required'),
			})
		}),
	});
	/*----x-----validation schema-----x----*/

	const { control, errors, handleSubmit, register, watch, setValue } = useForm({
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
			dispatch(getAllWF({ broker_id: brokerId || currentUser?.broker_id }));
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
					getAllWF({
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
				ExportWF({
					broker_id: userType === "broker" ? currentUser?.broker_id : brokerId,
				})
			);
		} else {
			swal("Please select broker", "", "info");
		}
	};

	//virtual anchor tag
	useEffect(() => {
		if (export_wf) {
			downloadFile(export_wf);
			dispatch(clear("wellness-flex-config-export"));
		}
		//eslint-disable-next-line
	}, [export_wf]);
	/*----x---- Export excel -----x----*/

	const resetValues = () => {
		setValue([{ "employer_id": undefined }, { "flex_applicable": "1" },{ "wellness_redirection": "1" }]);
	};

	const onSubmit = ({ employer_id, flex_applicable, wellness_redirection }) => {
		const formdata = new FormData();
		formdata.append("employer_id", employer_id?.value);
		formdata.append("flex_applicable", flex_applicable);
		formdata.append("wellness_redirection", wellness_redirection);
		formdata.append(
			"broker_id",
			userType === "broker" ? currentUser?.broker_id : brokerId
		);
		dispatch(createWF(formdata));
		resetValues();
	};
	return (
		<>
			{((!!myModule?.canwrite && userType === "broker") ||
				(userType === "admin")) &&
				<CardBlue title="Wellness & Flex Configurator">
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
								<Col sm="12" md="12" lg="4" xl="4">
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
								{/*---Flex Applicable---*/}
								<Col sm="12" md="12" lg="4" xl="4">
									<Head className="text-center">Flex Benefit Applicable</Head>
									<div
										className="d-flex justify-content-around flex-wrap mt-2"
										style={{ margin: "0 39px 40px -12px" }}
									>
										<CustomControl className="d-flex mt-4 mr-0">
											<p
												style={{
													fontWeight: "600",
													paddingLeft: "27px",
													marginBottom: "0px",
												}}
											>
												{"Yes"}
											</p>
											<input
												ref={register}
												name={"flex_applicable"}
												type={"radio"}
												value={1}
												defaultChecked={true}
											/>
											<span></span>
										</CustomControl>
										<CustomControl className="d-flex mt-4 ml-0">
											<p
												style={{
													fontWeight: "600",
													paddingLeft: "27px",
													marginBottom: "0px",
												}}
											>
												{"No"}
											</p>
											<input
												ref={register}
												name={"flex_applicable"}
												type={"radio"}
												value={0}
											/>
											<span></span>
										</CustomControl>
									</div>
								</Col>
								{/*-x-Flex Applicable-x-*/}
								{/*---Wellness-redirection---*/}
								<Col sm="12" md="12" lg="4" xl="4">
									<Head className="text-center">Wellness Redirection Applicable</Head>
									<div
										className="d-flex justify-content-around flex-wrap mt-2"
										style={{ margin: "0 39px 40px -12px" }}
									>
										<CustomControl className="d-flex mt-4 mr-0">
											<p
												style={{
													fontWeight: "600",
													paddingLeft: "27px",
													marginBottom: "0px",
												}}
											>
												{"Yes"}
											</p>
											<input
												ref={register}
												name={"wellness_redirection"}
												type={"radio"}
												value={1}
												defaultChecked={true}
											/>
											<span></span>
										</CustomControl>
										<CustomControl className="d-flex mt-4 ml-0">
											<p
												style={{
													fontWeight: "600",
													paddingLeft: "27px",
													marginBottom: "0px",
												}}
											>
												{"No"}
											</p>
											<input
												ref={register}
												name={"wellness_redirection"}
												type={"radio"}
												value={0}
											/>
											<span></span>
										</CustomControl>
									</div>
								</Col>
								{/*-x-Wellness-redirection-x-*/}
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
					data={brokerId || currentUser?.broker_id ? WFs : []} />
			</CardBlue>
		</>
	);
};

export default WellnessFlexConfig;
