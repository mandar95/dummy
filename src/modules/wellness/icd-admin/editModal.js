import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Input, Error } from "../../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { editIA, updateIA, clear, success as Success } from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
// import { Switch } from "../../user-management/AssignRole/switch/switch";

const EditModal = (props) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		icd_name: yup.string().required("Please enter ICD name"),
		icd_code: yup.string().required("Please enter ICD code"),
	});
	/*----x-----validation schema-----x----*/

	const { edit_ia, iaUpdate } = useSelector((state) => state.wellness);
	const dispatch = useDispatch();

	//prefill
	useEffect(() => {
		if (props?.id) {
			dispatch(editIA(props?.id));
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!_.isEmpty(edit_ia)) {
			setValue("icd_name", edit_ia[0]?.icd_name);
			setValue("icd_code", edit_ia[0]?.icd_code);
			// setValue("status", edit_ia[0]?.status ? 1 : 0);
		}
		//eslint-disable-next-line
	}, [edit_ia]);

	const { control, errors, handleSubmit, setValue } = useForm({
		validationSchema,
	});

	const onSubmit = ({ icd_name, icd_code, image, status }) => {
		const formdata = new FormData();
		formdata.append("icd_name", icd_name);
		formdata.append("icd_code", icd_code);
		// formdata.append("status", status);
		formdata.append("_method", "PATCH");
		dispatch(updateIA(props?.id, formdata));
	};

	useEffect(() => {
		if (iaUpdate) {
			dispatch(Success(iaUpdate));
			props.onHide();
		}

		return () => {
			dispatch(clear("icd-admin"));
		};
		//eslint-disable-next-line
	}, [iaUpdate]);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Edit ICD</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm="12" md="12" lg="6" xl="6">
							<Controller
								as={
									<Input
										label="ICD Name"
										placeholder="ICD Name"
										isRequired={true}
									/>
								}
								name="icd_name"
								control={control}
								defaultValue={""}
								error={errors && errors.icd_name}
							/>
							{!!errors?.icd_name && <Error>{errors?.icd_name?.message}</Error>}
						</Col>
						<Col sm="12" md="12" lg="6" xl="6">
							<Controller
								as={<Input label="ICD code" placeholder="ICD code" isRequired={true} />}
								name="icd_code"
								control={control}
								defaultValue={""}
								error={errors && errors.icd_code}
							/>
							{!!errors?.icd_code && <Error>{errors?.icd_code?.message}</Error>}
						</Col>
						{/* <Col sm="12" md="12" lg="12" xl="12">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={edit_ia[0]?.status ? 1 : 0}
							/>
						</Col> */}
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
