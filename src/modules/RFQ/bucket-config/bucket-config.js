import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Card, Input, MultiSelect, Button, Error } from "components";
import { useDispatch, useSelector } from "react-redux";
import {
	clear,
	createBucket,
	getIndustries,
	getBucket,
	Replace,
} from "../home/home.slice";
import { Controller, useForm } from "react-hook-form";
import { View } from "./view";
import _ from "lodash";
import swal from "sweetalert";
import * as yup from "yup";
import { insurer } from 'config/validations'
import { useParams } from 'react-router-dom';

const validation = insurer.industry_bucket

/*----------validation schema----------*/
const validationSchema = yup.object().shape({
	name: yup.string().required("Please enter bucket name")
		.min(validation.name.min, `Minimum ${validation.name.min} character required`)
		.max(validation.name.max, `Maximum ${validation.name.max} character available`)
		.matches(validation.name.regex, 'Must contain only alphabets'),
	industry_id: yup.array().required("Please select Industries").nullable(),
});
/*----x-----validation schema-----x----*/

export const BucketConfig = ({ myModule }) => {
	const dispatch = useDispatch();
	const { userType } = useParams();
	const { globalTheme } = useSelector(state => state.theme)

	const { create_bucket, industries, error, buckets, replace } = useSelector(
		(state) => state.RFQHome
	);
	const { currentUser } = useSelector((state) => state.login);

	const { control, handleSubmit, errors, setValue } = useForm({
		validationSchema,
	});

	let Industries = industries || [];
	let options = Industries.map((item) => {
		return (item = { value: item?.id, label: item?.name, ...item });
	});

	const [dataReq, setDataReq] = useState({});

	//load industries & buckets

	useEffect(() => {
		if (userType === 'insurer' && currentUser?.ic_id) {
			dispatch(getBucket({ ic_id: currentUser?.ic_id }));
			dispatch(getIndustries({ ic_id: currentUser?.ic_id }));
		}
		if (userType === 'broker' && currentUser?.broker_id) {
			dispatch(getBucket({ broker_id: currentUser?.broker_id }));
			dispatch(getIndustries({ broker_id: currentUser?.broker_id }));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	//error handling
	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	//onSuccess
	useEffect(() => {
		if (create_bucket) {
			swal(create_bucket, "", "success").then(() => {
				if (userType === 'insurer') {
					dispatch(getBucket({ ic_id: currentUser?.ic_id }));
					dispatch(getIndustries({ ic_id: currentUser?.ic_id }));
				}
				if (userType === 'broker') {
					dispatch(getBucket({ broker_id: currentUser?.broker_id }));
					dispatch(getIndustries({ broker_id: currentUser?.broker_id }));
				}
			});
		}
		return () => {
			dispatch(clear("create-bucket"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [create_bucket]);

	//submit after delete
	useEffect(() => {
		if (replace) {
			!_.isEmpty(dataReq) && dispatch(createBucket(dataReq));
			setDataReq({});
		}
		return () => {
			dispatch(clear("replace"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [replace]);

	const resetValues = () => {
		setValue([{ "name": "" }, { "description": "" }, { "industry_id": "" }]);
	};

	const onSubmit = ({ name, industry_id }) => {
		let industry_type_id = industry_id.map((item) => item?.id) || [];

		let included_industries = industry_id.filter(
			({ is_included }) => is_included * 1 === 1
		);

		if (!_.isEmpty(industry_type_id)) {
			let request = {
				name: name,
				industry_type_id: industry_type_id,
				...userType === 'insurer' && { ic_id: currentUser?.ic_id },
				...userType === 'broker' && { broker_id: currentUser?.broker_id }
			};
			if (_.isEmpty(included_industries)) {
				dispatch(createBucket(request));
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
							}, true)
						);
						break;
					default:
				}
			});
		}
		resetValues();
	};

	return (
		<>
			{!!myModule?.canwrite && <Form onSubmit={handleSubmit(onSubmit)}>
				<Card title="Create Industry Bucket">
					<Row style={{ marginTop: "-10px" }}>
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
						<Col
							sm="12"
							md="12"
							lg="12"
							xl="12"
							className="d-flex mt-4 pt-2 justify-content-end"
						>
							<Button type="submit">Submit</Button>
						</Col>
					</Row>
				</Card>
			</Form>}
			{!!buckets.length && <Card title="Industries Bucket Data">
				<View myModule={myModule} buckets={buckets} />
			</Card>}
		</>
	);
};
