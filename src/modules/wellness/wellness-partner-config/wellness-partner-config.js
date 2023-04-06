import React, { useEffect, useState } from "react";
import { CardBlue, Button, Input, Error, Select } from "../../../components";
import { AttachFile2 } from "../../core";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import Table from "./table.js";
import {
	createPartner,
	getAllPartner,
	clear,
	getBrokers,
} from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useParams } from "react-router";

const WellnessPartnerConfig = ({ myModule }) => {

	const dispatch = useDispatch();
	const { userType } = useParams();
	const { partners, success, brokers, error } = useSelector((state) => state.wellness);
	const { currentUser, userType: userTypeName } = useSelector(state => state.login);
	const [resetFile, setResetFile] = useState(false);


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
		wellness_partner: yup.string().required("Please select wellness partner"),
		url: yup.string().required("Please enter URL"),
		...(userType === "admin" && {
			broker_id: yup.string().required("Please select broker"),
		}),
	});
	/*----x-----validation schema-----x----*/

	const { control, errors, handleSubmit, register, setValue, watch } = useForm({
		validationSchema,
	});

	//broker feild
	const brokerId = watch("broker_id");

	useEffect(() => {
		setValue('broker_id', "");
		//eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			dispatch(getBrokers(userTypeName));
		}
		if (userType === "broker" && currentUser?.broker_id) {
			dispatch(getAllPartner({ broker_id: currentUser?.broker_id }));
		}
		//eslint-disable-next-line
	}, [userType, currentUser, userTypeName]);

	useEffect(() => {
		if (brokerId) {
			dispatch(getAllPartner({ broker_id: brokerId }));
		}
		//eslint-disable-next-line
	}, [brokerId]);

	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				dispatch(
					getAllPartner({
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
		setValue([{ "wellness_partner": "" }, { "url": "" }, { "logo": null }]);
		setResetFile(true);
	};

	const onSubmit = ({ wellness_partner, url, logo }) => {
		const formdata = new FormData();
		formdata.append("wellness_partner", wellness_partner);
		formdata.append("url", url);
		formdata.append("logo", logo[0]);
		formdata.append(
			"broker_id",
			userType === "broker" ? currentUser?.broker_id : brokerId
		);
		// formdata.append("_method", "PATCH");
		dispatch(createPartner(formdata));
		resetValues();
	};
	return (
		<>
			{((!!myModule?.canwrite && userType === "broker") ||
				(userType === "admin")) &&
				<CardBlue title="Wellness Partner Configurator">
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Row style={{ marginTop: "-10px" }}>
							{(userType === "admin") && (
								<Col sm="12" md="12" lg="12" xl="12">
									<Controller
										as={
											<Select
												label="Broker"
												placeholder="Select Broker"
												required={false}
												isRequired={true}
												options={
													brokers?.map((item) => ({
														id: item?.id,
														name: item?.name,
														value: item?.id,
													})) || []
												}
											/>
										}
										name="broker_id"
										control={control}
										defaultValue={""}
										error={errors && errors.broker_id}
									/>
									{!!errors?.broker_id && <Error>{errors?.broker_id?.message}</Error>}
								</Col>
							)}
							{!!myModule?.canwrite && <>
								<Col sm="12" md="6" lg="6" xl="6">
									<Controller
										as={
											<Input
												label="Wellness Partner"
												placeholder="Select Wellness Partner"
												required={false}
												isRequired={true}
											/>
										}
										name="wellness_partner"
										control={control}
										defaultValue={""}
										error={errors && errors.wellness_partner}
									/>
									{!!errors?.wellness_partner && (
										<Error>{errors?.wellness_partner?.message}</Error>
									)}
								</Col>
								<Col sm="12" md="6" lg="6" xl="6">
									<Controller
										as={<Input label="URL" placeholder="Enter URL" isRequired={true} />}
										name="url"
										control={control}
										defaultValue={""}
										error={errors && errors.url}
									/>
									{!!errors?.url && <Error>{errors?.url?.message}</Error>}
								</Col>
								<Col sm="12" md="12" lg="12" xl="12" className="mt-4 mb-4">
									<AttachFile2
										fileRegister={register}
										required
										name={`logo`}
										title="Upload Logo"
										key="premium_file"
										accept=".jpeg, .png, .jpg"
										description="File Formats: jpeg, png, jpg"
										nameBox
										resetValue={resetFile}
									/>
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
					data={watch("broker_id") || currentUser?.broker_id ? partners : []} />
			</CardBlue>
		</>
	);
};

export default WellnessPartnerConfig;
