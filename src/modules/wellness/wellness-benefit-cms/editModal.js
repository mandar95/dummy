import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Error, SelectComponent } from "../../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
	editCMS,
	updateCMS,
	clear,
	success as Success,
} from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Switch } from "../../user-management/AssignRole/switch/switch";

const EditModal = (props) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		employer_id: yup.object().shape({
			id: yup.string().required('Employer Required'),
		}),
		icd_id: yup.object().shape({
			id: yup.string().required('ICD Required'),
		}),
	});
	/*----x-----validation schema-----x----*/

	const { employers, edit_cms, cmsUpdate, ICDData, BrokerICDData } = useSelector(
		(state) => state.wellness
	);
	const { globalTheme } = useSelector(state => state.theme)
	const { userType } = useSelector((state) => state.login);
	const dispatch = useDispatch();
	const [contentCount, setContentCount] = useState(null)

	const { control, errors, handleSubmit, setValue, watch } = useForm({
		validationSchema,
	});

	const dynamic_Content = watch("dynamic_content");

	useEffect(() => {
		if (dynamic_Content?.length) {
			const contentLimit = (800 - dynamic_Content.length);
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
	}, [dynamic_Content]);
	//prefill
	useEffect(() => {
		if (props?.id) {
			dispatch(editCMS(props?.id));
		}
		//eslint-disable-next-line
	}, []);
	useEffect(() => {
		if (!_.isEmpty(edit_cms)) {
			setValue("employer_id", employers?.map((item) => ({
				id: item?.id,
				label: item?.name,
				value: item?.id,
			})).find(({ id }) => id === edit_cms[0]?.employer_id));
			setValue("icd_id", (userType === "Broker" ? BrokerICDData : ICDData)?.map((item) => ({
				id: item?.id,
				label: `${item?.icd_code} - ${item?.icd_name}`,
				value: userType === "Broker" ? item?.icd_id : item?.id,
			})).find(({ value }) => value === Number(edit_cms[0]?.icd_id)));
			setValue("status", edit_cms[0]?.status ? 1 : 0);
			setValue("dynamic_content", edit_cms[0]?.dynamic_content);
		}
		//eslint-disable-next-line
	}, [edit_cms]);

	const onSubmit = ({
		employer_id,
		// static_content,
		dynamic_content,
		status,
		icd_id,
	}) => {
		const formdata = new FormData();
		formdata.append("employer_id", employer_id?.value);
		formdata.append("icd_id", icd_id?.value);
		dynamic_content && formdata.append("dynamic_content", dynamic_content);
		formdata.append("status", status);
		formdata.append("_method", "PATCH");
		dispatch(updateCMS(props?.id, formdata));
	};

	useEffect(() => {
		if (cmsUpdate) {
			dispatch(Success(cmsUpdate));
			props.onHide();
		}

		return () => {
			dispatch(clear("wellness-benefit-cms"));
		};
		//eslint-disable-next-line
	}, [cmsUpdate]);

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
						<Col sm="12" md="12" lg="6" xl="6">
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
						<Col sm="12" md="12" lg="6" xl="6">
							<Controller
								as={
									<SelectComponent
										label="ICD"
										placeholder="Select ICD"
										required={false}
										isRequired={true}
										options={
											(userType === "Broker" ? BrokerICDData : ICDData)?.map((item) => ({
												id: item?.id,
												label: `${item?.icd_code} - ${item?.icd_name}`,
												value: userType === "Broker" ? item?.icd_id : item?.id,
											})) || []
										}
									/>
								}
								name="icd_id"
								control={control}
								error={errors && errors.icd_id?.id}
							/>
							{!!errors?.icd_id?.id && <Error>{errors?.icd_id?.id?.message}</Error>}
						</Col>
						<Col sm="12" md="12" lg="12" xl="12" className="text-center">
							<div className="my-2 py-2">
								<label style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>Dynamic Content</label>
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
									as={<Form.Control as="textarea" rows="2" required={false} />}
									name="dynamic_content"
									control={control}
									defaultValue={""}
								/>
							</div>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={edit_cms[0]?.status ? 1 : 0}
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
