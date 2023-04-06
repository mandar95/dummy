import React, { useEffect } from "react";
import { CardBlue, Button, Input, Error } from "../../../components";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import Table from "./table.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllIA, createIA, clear } from "../wellness.slice";
import swal from "sweetalert";

const ICDConfig = ({ myModule }) => {


	const dispatch = useDispatch();
	const { IAs, success, error } = useSelector((state) => state.wellness);

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
		icd_name: yup.string().required("Please enter ICD name"),
		icd_code: yup.string().required("Please enter ICD code"),
	});
	/*----x-----validation schema-----x----*/

	const { control, errors, handleSubmit, setValue } = useForm({
		validationSchema,
	});
	//on load get as no broker id is needed
	useEffect(() => {
		dispatch(getAllIA());
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				dispatch(getAllIA());
			});
		}

		return () => {
			dispatch(clear());
		};
		//eslint-disable-next-line
	}, [success]);

	const resetValues = () => {
		setValue([{ "icd_name": "" }, { "icd_code": "" }]);
	};

	const onSubmit = ({ icd_name, icd_code }) => {
		const formdata = {
			icd_name: [icd_name],
			icd_code: [icd_code],
		};
		dispatch(createIA(formdata));
		resetValues();
	};

	return (
		<>
			{!!myModule?.canwrite &&
				<CardBlue title="ICD Configurator">
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Row style={{ marginTop: "-10px" }}>
							<Col sm="12" md="12" lg="6" xl="6">
								<Controller
									as={<Input label="ICD Name" placeholder="ICD Name" isRequired={true} />}
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
				</CardBlue>
			}
			<CardBlue title="Details">
				<Table myModule={myModule} data={IAs || []} />
			</CardBlue>
		</>
	);
};

export default ICDConfig;
