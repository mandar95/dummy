import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Input, Error, MultiSelect } from "components";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import swal from "sweetalert";
import * as yup from "yup";
import {
	clear,
	updateBucket,
	editBucket,
	updateSuccess,
	Replace,
} from "../home/home.slice";
import { insurer } from 'config/validations'

const validation = insurer.industry_bucket

/*----------validation schema----------*/
const validationSchema = yup.object().shape({
	name: yup.string().required("Please enter bucket name")
		.min(validation.name.min, `Minimum ${validation.name.min} character required`)
		.max(validation.name.max, `Maximum ${validation.name.max} character available`)
		.matches(validation.name.regex, 'Must contain only alphabets'),
	industry_id: yup.array().required("Please select Industries"),
});
/*----x-----validation schema-----x----*/

const ContentModal = (props) => {
	const dispatch = useDispatch();
	const { control, handleSubmit, errors, setValue } = useForm({
		validationSchema,
	});

	const { industries, bucketUpdate, bucketEdit, replaceUpdate } = useSelector(
		(state) => state.RFQHome
	);

	let Industries = industries || [];
	let options = Industries.map((item) => ({ value: item?.id, label: item?.name, id: item?.id, ...item }));

	const [dataReq, setDataReq] = useState({});
	const { globalTheme } = useSelector(state => state.theme)

	//fetch prefill data
	useEffect(() => {
		if (props?.id) dispatch(editBucket(props?.id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props?.id]);

	useEffect(() => {
		if (!_.isEmpty(bucketEdit)) {
			setValue("name", bucketEdit[0]?.bucket_name);
			let selected_options = !_.isEmpty(bucketEdit[0]?.industry_list)
				? !_.isEmpty(bucketEdit[0]?.industry_list) &&
				options.filter(({ id }) =>
					bucketEdit[0]?.industry_list.some(
						({ industry_id }) => Number(id) === Number(industry_id)
					)
				)
				: [];
			!_.isEmpty(selected_options) && setValue("industry_id", selected_options);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bucketEdit]);

	//onSuccess
	useEffect(() => {
		if (bucketUpdate) {
			dispatch(updateSuccess(bucketUpdate));
			props.onHide();
		}
		return () => {
			dispatch(clear("update-bucket"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bucketUpdate]);

	//submit after delete
	useEffect(() => {
		if (replaceUpdate) {
			!_.isEmpty(dataReq) && dispatch(updateBucket(props?.id, dataReq));
			setDataReq({});
		}
		return () => {
			dispatch(clear("replace-update"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [replaceUpdate]);

	const onSubmit = ({ name, industry_id }) => {
		let industry_type_id = industry_id.map((item) => item?.id) || [];

		let included_industries = industry_id.filter(
			({ is_included, id }) => ((is_included * 1 === 1) &&
				(bucketEdit?.length && bucketEdit[0]?.industry_list?.length &&
					!bucketEdit[0]?.industry_list.some(({ industry_id }) => industry_id === id)))
		);

		if (!_.isEmpty(industry_type_id)) {
			let request = {
				name: name,
				industry_type_id: industry_type_id,
			};
			if (_.isEmpty(included_industries)) {
				dispatch(updateBucket(props?.id, request));
			} else {
				setDataReq(request);
			}
		} else {
			swal("Please select required industries", "", "warning");
		}

		//replace logic
		let reformat = _.compact(included_industries)
			.map(({ name }) => name)
			.toString();

		if (reformat) {
			swal({
				title: "Confirm Action",
				text: `The following industries are already included in another bucket(s) :- ${reformat}. Continuing this action will remove them from their previous bucket`,
				icon: "warning",
				buttons: {
					cancel: "Cancel",
					catch: {
						text: "Confirm",
						value: "confirm",
					},
				},
				dangerMode: true,
			}).then((caseValue) => {
				switch (caseValue) {
					case "confirm":
						let industry = included_industries.map(({ id }) => id);
						let bucket_id = included_industries.map(
							({ risk_bucket_id }) => risk_bucket_id
						);
						dispatch(
							Replace({
								risk_bucket_id: bucket_id,
								industry_id: industry,
							}, false)
						);
						break;
					default:
				}
			});
		}
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Update</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm="12" md="12" lg="12" xl="12">
							<Controller
								as={
									<Input
										label="Bucket Name"
										placeholder="Enter Bucket Name"
										maxLength={validation.name.max}
									/>
								}
								name="name"
								control={control}
							/>
							{!!errors?.name && <Error>{errors?.name?.message}</Error>}
						</Col>
						<Col sm="12" md="12" lg="12" xl="12" className="text-center pt-2">
							<label style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>Industries</label>
							<Controller
								as={
									<MultiSelect
										options={options}
										placeholder="Select Industries"
										name="industry_id"
									/>
								}
								name={"industry_id"}
								control={control}
							/>
							{!!errors?.industry_id && (
								<Error className="pt-3">{errors?.industry_id?.message}</Error>
							)}
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button  onClick={props.onHide}>
						Close
					</Button>
					<Button type="submit">Update</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default ContentModal;
