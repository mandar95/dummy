import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Error, Head, SelectComponent } from "../../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { editEM, updateEM, clear, success as Success } from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { CustomControl } from "../../user-management/AssignRole/option/style";

const EditModal = (props) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		employer_id: yup.object().shape({
			id: yup.string().required('Employer Required'),
		}),
		benefit_id: yup.object().shape({
			id: yup.string().required('Benefit Required'),
		}),
		wellness_partner_id: yup.object().shape({
			id: yup.string().required('Wellness Partner Required'),
		})
	});
	/*----x-----validation schema-----x----*/

	const { edit_em, emUpdate, benefits, partners, employers } = useSelector(
		(state) => state.wellness
	);
	const dispatch = useDispatch();

	//prefill
	useEffect(() => {
		if (props?.id) {
			dispatch(editEM(props?.id));
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!_.isEmpty(edit_em)) {
			setValue("employer_id", employers?.map((item) => ({
				id: item?.id,
				label: item?.name,
				value: item?.id,
			})).find(({ id }) => id === edit_em[0]?.employer_id));
			setValue("wellness_partner_id", partners?.filter((item) => item.status === 1)?.map((item) => ({
				id: item?.id,
				label: item?.wellness_partner,
				value: item?.id,
			})).find(({ id }) => id === edit_em[0]?.wellness_partner_id));
			setValue("benefit_id", benefits?.filter((item) => item.status === 1)?.map((item) => ({
				id: item?.id,
				label: item?.name,
				value: item?.id,
			})).find(({ id }) => id === edit_em[0]?.benefit_id));
			setValue("flex", edit_em[0]?.flex === "Yes" ? "1" : "0");
			setValue("non_flex", edit_em[0]?.non_flex === "Yes" ? "1" : "0");
			setValue("complimentary", edit_em[0]?.complementary === "Yes" ? "1" : "0");
			setValue("status", edit_em[0]?.status ? 1 : 0);
		}
		//eslint-disable-next-line
	}, [edit_em]);

	const { control, errors, handleSubmit, register, setValue, watch } = useForm({
		validationSchema,
	});

	const onSubmit = ({
		employer_id,
		benefit_id,
		wellness_partner_id,
		flex,
		non_flex,
		complimentary,
		status,
	}) => {
		const formdata = new FormData();
		formdata.append("employer_id", employer_id?.value);
		formdata.append("benefit_id", benefit_id?.value);
		formdata.append("wellness_partner_id", wellness_partner_id?.value);
		flex && formdata.append("flex", flex);
		non_flex && formdata.append("non_flex", non_flex);
		formdata.append("complimentary", complimentary);
		formdata.append("status", status);
		formdata.append("_method", "PATCH");
		dispatch(updateEM(props?.id, formdata));
	};

	useEffect(() => {
		if (emUpdate) {
			dispatch(Success(emUpdate));
			props.onHide();
		}

		return () => {
			dispatch(clear("benefit-employer-mapping"));
		};
		//eslint-disable-next-line
	}, [emUpdate]);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Edit</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row style={{ marginTop: "-10px" }}>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={
									<SelectComponent
										label="Employer"
										placeholder="Select  Employer"
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
								defaultValue={""}
								error={errors && errors.employer_id?.id}
							/>
							{!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
						</Col>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={
									<SelectComponent
										label="Benefit"
										placeholder="Select  Benefit"
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
								as={
									<SelectComponent
										label="Wellness Partner"
										placeholder="Select  Wellness Partner"
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
								name="wellness_partner_id"
								control={control}
								defaultValue={""}
								error={errors && errors.wellness_partner_id?.id}
							/>
							{!!errors?.wellness_partner_id?.id && (
								<Error>{errors?.wellness_partner_id?.id?.message}</Error>
							)}
						</Col>
						{/*---complementary---*/}
						<Col sm="12" md="12" lg="4" xl="4">
							<Head className="text-center">Complementary</Head>
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
										name={"complimentary"}
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
										name={"complimentary"}
										type={"radio"}
										value={0}
									/>
									<span></span>
								</CustomControl>
							</div>
						</Col>
						{/*-x-complementary-x-*/}
						{/*---Flex---*/}
						{watch("complimentary") * 1 !== 1 && (
							<>
								<Col sm="12" md="12" lg="4" xl="4">
									<Head className="text-center">Flex</Head>
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
												name={"flex"}
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
											<input ref={register} name={"flex"} type={"radio"} value={0} />
											<span></span>
										</CustomControl>
									</div>
								</Col>
								{/*-x-Flex-x-*/}
								{/*---Non-Flex---*/}
								<Col sm="12" md="12" lg="4" xl="4">
									<Head className="text-center">Non-Flex</Head>
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
												name={"non_flex"}
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
											<input ref={register} name={"non_flex"} type={"radio"} value={0} />
											<span></span>
										</CustomControl>
									</div>
								</Col>
								{/*-x-Non-Flex-x-*/}
							</>
						)}
						<Col sm="12" md="12" lg="12" xl="12">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={edit_em[0]?.status ? 1 : 0}
							/>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button className="btn btn-danger" onClick={props.onHide}>
						Close
					</Button>
					<Button type="submit">Update</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditModal;
