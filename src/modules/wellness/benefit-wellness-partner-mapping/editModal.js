import React, { useLayoutEffect, useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Input, Error, SelectComponent } from "../../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
	editBWPM,
	updateBWPM,
	clear,
	success as Success,
} from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Switch } from "../../user-management/AssignRole/switch/switch";

const EditModal = (props) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		partner_id: yup.object().shape({
			id: yup.string().required('Wellness Partner Required'),
		}),
		benefit_id: yup.object().shape({
			id: yup.string().required('Benefit Required'),
		}),
		url: yup.string().url().required("Please select URL"),
	});
	/*----x-----validation schema-----x----*/

	const { editbwpm, bwpmUpdate, partners, benefits } = useSelector(
		(state) => state.wellness
	);
	const dispatch = useDispatch();

	//prefill
	useEffect(() => {
		if (props?.id) {
			dispatch(editBWPM(props?.id));
		}
		//eslint-disable-next-line
	}, []);

	useLayoutEffect(() => {
		if (!_.isEmpty(editbwpm)) {
			setValue("partner_id", partners?.map((item) => ({
				id: item?.id,
				label: item?.wellness_partner,
				value: item?.id,
			})).find(({ id }) => id === editbwpm[0]?.wellness_partner_id)
			);
			setValue("benefit_id", benefits?.filter((item) => item.status === 1)?.map((item) => ({
				id: item?.id,
				label: item?.name,
				value: item?.id,
			})).find(({ id }) => id === editbwpm[0]?.benefit_id));
			setValue("url", editbwpm[0]?.wellness_partner_url);
			setValue("status", editbwpm[0]?.status ? 1 : 0);
		}
		//eslint-disable-next-line
	}, [editbwpm]);

	const { control, errors, handleSubmit, setValue } = useForm({
		validationSchema,
	});

	const onSubmit = ({ partner_id, benefit_id, url, status }) => {
		const formdata = new FormData();
		formdata.append("partner_id", partner_id?.value);
		formdata.append("benefit_id", benefit_id?.value);
		formdata.append("url", url);
		formdata.append("status", status);
		formdata.append("_method", "PATCH");
		dispatch(updateBWPM(props?.id, formdata));
	};

	useEffect(() => {
		if (bwpmUpdate) {
			dispatch(Success(bwpmUpdate));
			props.onHide();
		}

		return () => {
			dispatch(clear("benefit-wellness-partner-mapping"));
		};
		//eslint-disable-next-line
	}, [bwpmUpdate]);

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
						<Col sm="12" md="6" lg="6" xl="6">
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
						<Col sm="12" md="6" lg="6" xl="6">
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
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={<Input label="URL" placeholder="URL" isRequired={true} />}
								name="url"
								control={control}
								defaultValue={""}
								error={errors && errors.url}
							/>
							{!!errors?.url && <Error>{errors?.url?.message}</Error>}
						</Col>
						<Col sm="12" md="6" lg="6" xl="6">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={editbwpm[0]?.status ? 1 : 0}
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
