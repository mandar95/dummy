import React, { useEffect, useState } from "react";
import { CardBlue, Button, SelectComponent, Error } from "../../../components";
// import Table from "./static-content-subcomponent/table";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllStaticContent,
	createStaticContent,
	clear,
	getBrokers,
	getEmployers,
	setPageData
} from "../wellness.slice";
import swal from "sweetalert";

const WellnessStaticContent = ({ userType, myModule }) => {
	const dispatch = useDispatch();
	const { globalTheme } = useSelector(state => state.theme)
	const {
		StaticContent,
		success,
		brokers,
		employers,
		error,
		firstPage,
		lastPage
	} = useSelector((state) => state.wellness);
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
	const [contentCount, setContentCount] = useState(null)


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
		static_content: yup.string().required("Please enter static content")
			.max(800, 'content should be below 800'),
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
	const employerId = watch("employer_id")?.value;
	const static_Content = watch("static_content");

	useEffect(() => {
		if (static_Content?.length) {
			const contentLimit = (800 - static_Content.length);
			if (contentLimit >= 0) {
				setContentCount(contentLimit)
			}
			else {
				setContentCount(0)
			}
		}
		else {
			setContentCount(800)
		}
	}, [static_Content]);

	useEffect(() => {
		setValue("broker_id", undefined);
		setValue("employer_id", undefined);

		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			dispatch(getBrokers(userTypeName));
		}
		//eslint-disable-next-line
	}, [userType, userTypeName]);

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
		if (employerId) {
			dispatch(getAllStaticContent({ employer_id: employerId }));
		}
		//eslint-disable-next-line
	}, [employerId]);

	useEffect(() => {
		if (StaticContent.length !== 0) {
			setValue("static_content", StaticContent.static_content);
		}
		else {
			setValue("static_content", "");
		}
		//eslint-disable-next-line
	}, [StaticContent]);

	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				// dispatch(
				// 	getAllStaticContent({
				// 		broker_id: userType === "Broker" ? currentUser?.broker_id : brokerId,
				// 	})
				// );
				//dispatch(getAllStaticContent({ employer_id: employerId }));
			});
		}

		return () => {
			dispatch(clear());
		};
		//eslint-disable-next-line
	}, [success]);

	const resetValues = () => {
		setValue([{ "employer_id": undefined }, { "static_content": "" }]);
	};

	const onSubmit = ({ employer_id, static_content }) => {
		const formdata = new FormData();
		formdata.append("employer_id", employer_id?.value);
		formdata.append("static_content", static_content);
		// formdata.append(
		// 	"broker_id",
		// 	userType === "Broker" ? currentUser?.broker_id : brokerId
		// );
		dispatch(createStaticContent(formdata));
		resetValues();
	};

	return (
		<>
			<CardBlue title="Wellness Benefit Static Content">
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
						<Col sm="12" md="12" lg="12" xl="12">
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
						<Col sm="12" md="12" lg="12" xl="12" className="text-center">
							<div className="my-2 py-2">
								<label style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>
									Static Content
									<sup>
										<img alt="important" src="/assets/images/inputs/important.png" />
									</sup>
								</label>
								<div style={
									{
										position: 'absolute',
										right: '18px',
										top: '16px',
										background: '#e2e2e2',
										padding: '0px 5px'
									}
								}>
									{`${contentCount} / 800`}
								</div>
								<Controller
									as={<Form.Control as="textarea" rows="2" isRequired={true} disabled={!myModule?.canwrite} />}
									name="static_content"
									control={control}
									defaultValue={""}
									error={errors && errors.static_content}
								/>
							</div>
							{!!errors?.static_content && (
								<Error>{errors?.static_content?.message}</Error>
							)}
						</Col>
						{!!myModule?.canwrite &&
							<Col
								sm="12"
								md="12"
								lg="12"
								xl="12"
								className="d-flex justify-content-end"
							>
								<Button type="submit">Submit</Button>
							</Col>
						}
					</Row>
				</Form>
			</CardBlue>
			{/* <CardBlue title="Details">
				<Table data={watch("broker_id") || currentUser?.broker_id ? StaticContent : []} />
			</CardBlue> */}
		</>
	);
};

export default WellnessStaticContent;
