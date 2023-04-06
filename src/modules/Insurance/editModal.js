import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Input, Error } from "components";
import { AttachFile2 } from "modules/core";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
	updateInsurance,
	editInsurance,
	success,
	clear,
} from "./BuyInsurance.slice";
import { Switch } from "modules/user-management/AssignRole/switch/switch";
import { insurer } from 'config/validations'
import styled from 'styled-components';


const DownloadBtn = styled.span`
// background: #ffc926;
// background:#347cff;
color: #3b5ec3 !important;
text-decoration:underline;
padding: 5px 10px;
border-radius: 5px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
margin-right: 10px;
`

const validation = insurer.insurance

/*----------validation schema----------*/
const validationSchema = yup.object().shape({
	name: yup.string().required("Please enter name")
		.min(validation.name.min, `Minimum ${validation.name.min} character required`)
		.max(validation.name.max, `Maximum ${validation.name.max} character available`)
		.matches(validation.name.regex, 'Must contain only alphabets'),
	url: yup.string().required("Please enter url").url('Not a valid url'),
});
/*----x-----validation schema-----x----*/

const EditModal = (props) => {
	const { edit, update } = useSelector((state) => state.buyInsurance);

	const dispatch = useDispatch();


	const { control, errors, handleSubmit, register, setValue } = useForm({
		validationSchema,
	});

	//prefill
	useEffect(() => {
		dispatch(editInsurance(props.id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.id]);

	useEffect(() => {
		if (!_.isEmpty(edit)) {
			setValue("name", edit[0]?.name);
			setValue("url", edit[0]?.url);
			setValue("status", edit[0]?.status ? 1 : 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [edit]);

	//onSuccess
	useEffect(() => {
		if (update) {
			dispatch(success(update));
			props.onHide();
		}
		return () => {
			dispatch(clear("update"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [update]);

	const onSubmit = ({ name, image, url, status }) => {
		const formdata = new FormData();
		formdata.append("name", name);
		formdata.append("url", url);
		formdata.append("status", status);
		if (!_.isEmpty(image)) {
			formdata.append("image", image[0]);
		}
		// formdata.append('_method', 'patch')
		dispatch(updateInsurance(props.id, formdata));
	};

	const exportPolicy = (URL) => {
		if (URL) {
			const link = document.createElement('a');
			link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(URL));
			link.setAttribute('target', 'blank');

			link.href = URL;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	const _UI = () => {
		return (
			<DownloadBtn
				role='button'
				onClick={() => exportPolicy(edit[0]?.media)}>
				{edit[0]?.media || 'File Name'}
				{/* &nbsp;&nbsp;
				<i className="ti ti-download"></i> */}
			</DownloadBtn>
		)
	}

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
								as={<Input label="Name" maxLength={validation.name.max} placeholder="name" />}
								name="name"
								control={control}
								error={errors && errors.name}
							/>
							{!!errors?.name && <Error>{errors?.name?.message}</Error>}
						</Col>
						<Col sm="12" md="12" lg="4" xl="4">
							<Controller
								as={<Input label="Url" placeholder="Url" />}
								name="url"
								control={control}
								error={errors && errors.url}
							/>
							{!!errors?.url && <Error>{errors?.url?.message}</Error>}
						</Col>
						<Col sm="12" md="12" lg="4" xl="4">
							<Controller
								as={<Switch />}
								name="status"
								control={control}
								defaultValue={edit[0]?.status ? 1 : 0}
							/>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12" className="mt-2">
							<AttachFile2
								fileRegister={register}
								name={`image`}
								title="Upload Icon/Image"
								key="premium_file"
								{...validation.file}
								nameBox
								fileDataUI={_UI}
							/>
						</Col>
						{/* <Col sm="12" md="12" lg="12" xl="12" className="mt-2">
							<DownloadBtn
								role='button'
								onClick={() => exportPolicy(edit[0]?.media)}>
								{edit[0]?.media_name || 'File Name'}
								<i className="ti ti-download"></i>
							</DownloadBtn>
						</Col> */}
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
