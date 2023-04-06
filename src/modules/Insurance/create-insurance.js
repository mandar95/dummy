import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Card, Button, Input, Error } from "components";
import { AttachFile2 } from "modules/core";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { getInsurance, createInsurance, clear } from "./BuyInsurance.slice";
import Table from "./table";
import swal from "sweetalert";
import { Switch } from "modules/user-management/AssignRole/switch/switch";
import { insurer } from 'config/validations'

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

const CreateInsurance = ({ userType, myModule }) => {
	const dispatch = useDispatch();
	const { success, error, insurance } = useSelector(
		(state) => state.buyInsurance
	);
	const [resetFile, setResetFile] = useState(false);
	const { currentUser } = useSelector((state) => state.login);

	const { control, errors, handleSubmit, register, setValue } = useForm({
		validationSchema,
	});

	//load insurance
	useEffect(() => {
		if (currentUser.broker_id || currentUser.ic_id)
			dispatch(getInsurance(userType === 'broker' ?
				{ broker_id: currentUser.broker_id } :
				{ ic_id: currentUser.ic_id }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	const resetValues = () => {
		setValue([{ "name": "" }, { "image": "" }, { "url": "" }]);
		setResetFile(true);
	};

	//onSuccess
	useEffect(() => {
		if (success) {
			swal(success, "", "success").then();
			dispatch(getInsurance(userType === 'broker' ?
				{ broker_id: currentUser.broker_id } :
				{ ic_id: currentUser.ic_id }));
			resetValues();
		}
		return () => {
			dispatch(clear("success"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success]);

	//onError
	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	const onSubmit = ({ name, image, url, status }) => {
		const formdata = new FormData();
		formdata.append("name", name);
		formdata.append("url", url);
		formdata.append("image", image[0]);

		userType === 'broker' ?
			formdata.append("broker_id", currentUser?.broker_id) :
			formdata.append("ic_id", currentUser?.ic_id);

		formdata.append("status", status);
		dispatch(createInsurance(formdata));
	};

	return (
		<>
			{!!myModule?.canwrite && <Card title="Create Retail Insurance">
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col sm="12" md="12" lg="4" xl="4">
							<Controller
								as={<Input label="Name" placeholder="name"
									required={false}
									// minLength={2}
									maxLength={validation.name.max}
									isRequired={true} />}
								name="name"
								control={control}
								error={errors && errors.name}
							/>
							{!!errors?.name && <Error>{errors?.name?.message}</Error>}
						</Col>
						<Col sm="12" md="12" lg="4" xl="4">
							<Controller
								as={<Input label="Url" placeholder="Url"
									required={false}
									isRequired={true} />}
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
								defaultValue={0}
							/>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12" className="mt-2">
							<AttachFile2
								fileRegister={register}
								required
								name={`image`}
								title="Upload Icon/Image"
								key="premium_file"
								{...validation.file}
								resetValue={resetFile}
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
					</Row>
				</Form>
			</Card>}
			{!!insurance.length &&
				<Card title="Retail Insurance">
					<Table myModule={myModule} data={insurance || []} />
				</Card>
			}
		</>
	);
};

export default CreateInsurance;
