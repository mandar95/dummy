import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Error, Head, SelectComponent } from "../../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { editWF, updateWF, clear, success as Success } from "../wellness.slice";
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
	});
	/*----x-----validation schema-----x----*/

	const { employers, edit_wf, wfUpdate } = useSelector(
		(state) => state.wellness
	);
	const dispatch = useDispatch();

	//prefill
	useEffect(() => {
		if (props?.id) {
			dispatch(editWF(props?.id));
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!_.isEmpty(edit_wf)) {
			setValue("employer_id", employers?.map((item) => ({
				id: item?.id,
				label: item?.name,
				value: item?.id,
			})).find(({ id }) => id === edit_wf[0]?.employer_id));
			setValue(
				"flex_applicable",
				edit_wf[0]?.flex_applicable === "Yes" ? "1" : "0"
			);
			setValue(
				"wellness_redirection",
				edit_wf[0]?.wellness_redirection === "Yes" ? "1" : "0"
			);
			setValue("status", edit_wf[0]?.status ? 1 : 0);
		}
		//eslint-disable-next-line
	}, [edit_wf]);

	const { control, errors, handleSubmit, register, setValue } = useForm({
		validationSchema,
	});

	const onSubmit = ({
		employer_id,
		flex_applicable,
		wellness_redirection,
		status,
	}) => {
		const formdata = new FormData();
		formdata.append("employer_id", employer_id?.value);
		formdata.append("flex_applicable", flex_applicable);
		formdata.append("wellness_redirection", wellness_redirection);
		formdata.append("status", status);
		formdata.append("_method", "PATCH");
		dispatch(updateWF(props?.id, formdata));
	};

	useEffect(() => {
		if (wfUpdate) {
			dispatch(Success(wfUpdate));
			props.onHide();
		}

		return () => {
			dispatch(clear("wellness-flex-config"));
		};
		//eslint-disable-next-line
	}, [wfUpdate]);

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
					<Row>
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
						<Col sm="12" md="12" lg="12" xl="12">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={edit_wf[0]?.status ? 1 : 0}
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
