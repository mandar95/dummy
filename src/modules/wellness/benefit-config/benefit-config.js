import React, { useEffect } from "react";
import { CardBlue, Button, Input, Error, Select } from "../../../components";
import { AttachFile2 } from "modules/core";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import Table from "./table.js";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllBenefit,
	createBenefit,
	clear,
	getBrokers,
} from "../wellness.slice";
import swal from "sweetalert";
import { useParams } from "react-router";

const BenefitConfig = ({ myModule }) => {

	const { userType } = useParams();
	const dispatch = useDispatch();
	const { benefits, success, brokers, error } = useSelector((state) => state.wellness);
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
	const { globalTheme } = useSelector(state => state.theme)

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
		benefit_name: yup.string().required("Please enter benefit name"),
		button_name: yup.string().notRequired().nullable(),
		content: yup.string().required("Please enter content"),
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
		setValue("broker_id", "");
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			dispatch(getBrokers(userTypeName));
		}
		if (userType === "broker" && currentUser?.broker_id) {
			dispatch(getAllBenefit({ broker_id: currentUser?.broker_id }));
		}
		//eslint-disable-next-line
	}, [userType, currentUser, userTypeName]);

	useEffect(() => {
		if (brokerId) {
			dispatch(getAllBenefit({ broker_id: brokerId }));
		}
		//eslint-disable-next-line
	}, [brokerId]);

	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				resetValues();
				dispatch(
					getAllBenefit({
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
		setValue([{ "benefit_name": "" },
		{ "button_name": "" },
		{ "content": "" },
		{ "image": null }])
	};

	const onSubmit = ({ benefit_name, content, image, button_name }) => {
		const formdata = new FormData();
		formdata.append("benefit_name", benefit_name);
		button_name && formdata.append("button_name", button_name);
		formdata.append("content", content);
		formdata.append("image", image[0]);
		formdata.append(
			"broker_id",
			userType === "broker" ? currentUser?.broker_id : brokerId
		);
		dispatch(createBenefit(formdata));

	};
	return (
		<>
			{((!!myModule?.canwrite && userType === "broker") ||
				(userType === "admin")) &&
				<CardBlue title="Benefit Configurator">
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
								<Col sm="12" md="12" lg="6" xl="6">
									<Controller
										as={<Input label="Benefit Name" placeholder="Enter Benefit Name" isRequired={true} />}
										name="benefit_name"
										control={control}
										defaultValue={""}
										error={errors && errors.benefit_name}
									/>
									{!!errors?.benefit_name && (
										<Error>{errors?.benefit_name?.message}</Error>
									)}
								</Col>
								<Col sm="12" md="12" lg="6" xl="6">
									<Controller
										as={<Input label="Redirection Button Name" placeholder="Enter Button Name" isRequired={true} />}
										name="button_name"
										control={control}
										defaultValue={""}
										error={errors && errors.button_name}
									/>
									{!!errors?.button_name && (
										<Error>{errors?.button_name?.message}</Error>
									)}
								</Col>
								<Col sm="12" md="12" lg="12" xl="12" className="text-center">
									<div className="my-2 py-2">
										<label style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>
											Content
											<sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
										</label>
										<Controller
											as={<Form.Control as="textarea" rows="3" required={true} />}
											name="content"
											control={control}
											defaultValue={""}
											error={errors && errors.content}
										/>
									</div>
									{!!errors?.content && <Error>{errors?.content?.message}</Error>}
								</Col>
								<Col sm="12" md="12" lg="12" xl="12" className="mt-4 mb-4">
									<AttachFile2
										fileRegister={register}
										required
										name={`image`}
										title="Upload Icon/Image"
										key="premium_file"
										accept=".jpeg, .png, .jpg"
										description="File Formats: jpeg, png, jpg"
										nameBox
									/>
								</Col>
								<Col
									sm="12"
									md="12"
									lg="12"
									xl="12"
									className="d-flex justify-content-end"
								>
									<Button type="submit" variant="success">
										Submit
									</Button>
								</Col>
							</>}
						</Row>
					</Form>
				</CardBlue>
			}
			<CardBlue title="Details">
				<Table
					myModule={myModule}
					data={watch("broker_id") || currentUser?.broker_id ? benefits : []}
				/>
			</CardBlue>
		</>
	);
};

export default BenefitConfig;
