import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Input, Error } from "../../../components";
import { AttachFile2 } from "../../core";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
	// editPartner,
	updatePartner,
	clear,
	success as Success,
} from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { _UI } from "../../Dashboard_Card_Config/helper";

const EditModal = ({ show, onHide }) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		wellness_partner: yup.string().required("Please select wellness partner"),
		url: yup.string().required("Please enter URL"),
	});
	/*----x-----validation schema-----x----*/

	const { /* editpartner, */ partnerUpdate } = useSelector((state) => state.wellness);
	const dispatch = useDispatch();

	//prefill
	// useEffect(() => {
	// 	if (id) {
	// 		dispatch(editPartner(id));
	// 	}
	// 	//eslint-disable-next-line
	// }, []);

	useEffect(() => {
		if (!_.isEmpty(show)) {
			setValue("wellness_partner", show?.wellness_partner);
			setValue("url", show?.url);
			setValue("status", show?.status ? 1 : 0);
		}
		//eslint-disable-next-line
	}, []);

	const { control, errors, handleSubmit, register, setValue } = useForm({
		validationSchema,
	});

	const onSubmit = ({ wellness_partner, url, logo, status }) => {
		const formdata = new FormData();
		formdata.append("wellness_partner", wellness_partner);
		formdata.append("url", url);
		!_.isEmpty(logo) && formdata.append("logo", logo[0]);
		formdata.append("status", status);
		formdata.append("_method", "PATCH");
		dispatch(updatePartner(show.id, formdata));
	};

	useEffect(() => {
		if (partnerUpdate) {
			dispatch(Success(partnerUpdate));
			onHide();
		}

		return () => {
			dispatch(clear("wellness-partner"));
		};
		//eslint-disable-next-line
	}, [partnerUpdate]);

	return (
		<Modal
			show={!!show}
			onHide={onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal">
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Edit</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={
									<Input
										label="Wellness Partner"
										placeholder="Wellness Partner"
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
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={<Input label="URL" placeholder="URL" isRequired={true} />}
								name="url"
								control={control}
								defaultValue={""}
								error={errors && errors.url}
							/>
							{!!errors?.url && <Error>{errors?.url?.message}</Error>}
						</Col>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={show?.status ? 1 : 0}
							/>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12" className="mt-4 mb-4">
							<AttachFile2
								fileRegister={register}
								name={`logo`}
								title="Upload Logo"
								key="premium_file"
								accept=".jpeg, .png, .jpg"
								description="File Formats: jpeg, png, jpg"
								nameBox
								attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
								fileDataUI={() => _UI(show?.logo)}
							/>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button className="btn btn-danger" onClick={onHide}>
						Close
					</Button>
					<Button type="submit">Update</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditModal;
