import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Input, Error } from "../../../components";
import { AttachFile2 } from "../../core";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
	editBenefit as benefit,
	updateBenefit,
	clear,
	success as Success,
} from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Switch } from "../../user-management/AssignRole/switch/switch";

const EditModal = (props) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		benefit_name: yup.string().required("Please enter benefit name"),
		content: yup.string().required("Please enter the content"),
	});
	/*----x-----validation schema-----x----*/

	const { editbenefit, benefitUpdate } = useSelector((state) => state.wellness);
	const dispatch = useDispatch();
	const { globalTheme } = useSelector(state => state.theme)

	//prefill
	useEffect(() => {
		if (props?.id) {
			dispatch(benefit(props?.id));
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!_.isEmpty(editbenefit)) {
			setValue([
				{ "benefit_name": editbenefit[0]?.name },
				{ "button_name": editbenefit[0]?.button_name },
				{ "content": editbenefit[0]?.content },
				{ "status": editbenefit[0]?.status ? 1 : 0 }]);
		}
		//eslint-disable-next-line
	}, [editbenefit]);

	const { control, errors, handleSubmit, register, setValue } = useForm({
		validationSchema,
	});

	const onSubmit = ({ benefit_name, content, image, status, button_name }) => {
		const formdata = new FormData();
		formdata.append("benefit_name", benefit_name);
		button_name && formdata.append("button_name", button_name);
		formdata.append("content", content);
		!_.isEmpty(image) && formdata.append("image", image[0]);
		formdata.append("status", status);
		formdata.append("_method", "PATCH");
		dispatch(updateBenefit(props?.id, formdata));
	};

	useEffect(() => {
		if (benefitUpdate) {
			dispatch(Success(benefitUpdate));
			props.onHide();
		}

		return () => {
			dispatch(clear("benefit-config"));
		};
		//eslint-disable-next-line
	}, [benefitUpdate]);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Edit Benefit</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm="12" md="12" lg="6" xl="6">
							<Controller
								as={<Input label="Benefit Name" placeholder="Benefit Name" isRequired={true} />}
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
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={editbenefit[0]?.status ? 1 : 0}
							/>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12" className="text-center">
							<div className="my-2 py-2">
								<label style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>
									Content
									<sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
								</label>
								<Controller
									as={<Form.Control as="textarea" rows="3" isRequired={true} />}
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
								name={`image`}
								title="Upload Icon/Image"
								key="premium_file"
								accept=".jpeg, .png, .jpg"
								description="File Formats: jpeg, png, jpg"
								nameBox
							/>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button buttonStyle="danger" onClick={props.onHide}>
						Close
					</Button>
					<Button type="submit">Update</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditModal;
