import React, { useEffect } from "react";
import { Input, Button, MultiSelect, Error } from "components";
import { updateFlow, Roles } from "../rfq.slice";
import { Controller, useForm } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ChildCheckBox } from "./option/Option";
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import _ from "lodash";
import * as yup from "yup";

const EditFlow = ({ WorkFlow, ic, onhide, brokerId, userType, trigger }) => {
	const dispatch = useDispatch();
	const { roles } = useSelector((state) => state.rfq);

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter name")
			.matches(/^([A-Za-z\s])+$/, "Name must contain only alphabets"),
		steps: yup.array().required("Please allocate steps").nullable(),
	});
	/*----x-----validation schema-----x----*/
	const { globalTheme } = useSelector(state => state.theme)

	const { control, handleSubmit, watch, register, setValue, errors } = useForm({
		validationSchema,
	});

	let options = roles.map((item) => {
		return (item = { value: item?.id, label: item?.name, ...item });
	});

	const StepList =
		!_.isEmpty(watch("steps")) && watch("steps") ? watch("steps") : [];

	//prefill
	const Def = !_.isEmpty(WorkFlow)
		? WorkFlow[0]?.work_flow_journey?.map(({ can_raise_deficiency }) =>
			can_raise_deficiency ? 1 : 0
		)
		: [];
	const Rej = !_.isEmpty(WorkFlow)
		? WorkFlow[0]?.work_flow_journey?.map(({ can_reject }) =>
			can_reject ? 1 : 0
		)
		: [];
	const Aprv = !_.isEmpty(WorkFlow)
		? WorkFlow[0]?.work_flow_journey?.map(({ can_approve }) =>
			can_approve ? 1 : 0
		)
		: [];

	useEffect(() => {
		if (!_.isEmpty(WorkFlow)) {
			setValue("name", WorkFlow[0]?.name);
			let selected_options = !_.isEmpty(WorkFlow[0]?.work_flow_journey)
				? WorkFlow[0]?.work_flow_journey?.map(
					({ ic_user_type_id, ic_user_type_name }) => {
						return {
							id: ic_user_type_id,
							value: ic_user_type_id,
							name: ic_user_type_name,
							label: ic_user_type_name,
						};
					}
				)
				: [];

			!_.isEmpty(selected_options) && setValue("steps", selected_options);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [WorkFlow]);

	//load roles
	useEffect(() => {
		if (userType !== "admin" && (ic || brokerId)) {
			dispatch(
				Roles(userType === "insurer" ? { ic_id: ic } : { broker_id: brokerId })
			);
		} else if (userType === "admin" && (ic || brokerId)) {
			dispatch(
				Roles(trigger === "insurer" ? { ic_id: ic } : { broker_id: brokerId })
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ic, brokerId, trigger]);

	const resetValues = () => {
		setValue([{ "name": "" }, { "steps": [] }]);
	};

	const onSubmit = (data) => {
		const Deficiency = data.canraisedeficieny?.map((item) => (item ? 1 : 0));
		const Approve = data.canapprove?.map((item) => (item ? 1 : 0));
		const Reject = data.canreject?.map((item) => (item ? 1 : 0));
		const PassNext = _.compact(data.pass_to_next_user_type_id);
		const Steps = data?.user_type_id;

		const formdata = new FormData();

		formdata.append("name", data?.name);
		ic && formdata.append("ic_id", ic);
		brokerId && formdata.append("broker_id", brokerId);
		Steps.forEach((item, index) => {
			formdata.append("ic_user_type_id[]", item);
		});
		Steps.forEach((item, index) => {
			formdata.append("step[]", index + 1);
		});
		Reject.forEach((item, index) => {
			formdata.append("can_reject[]", item);
		});
		Deficiency.forEach((item, index) => {
			formdata.append("can_raise_deficiency[]", item);
		});
		Approve.forEach((item, index) => {
			formdata.append("can_approve[]", item);
		});
		Steps.forEach((item, index) => {
			formdata.append(
				"pass_to_next_user_type_id[]",
				Number(Steps.length) - 1 !== index ? PassNext[index] : 0
			);
		});
		formdata.append("_method", "PATCH");
		formdata.append("status", WorkFlow[0]?.status === "Active" ? 1 : 0);
		dispatch(updateFlow(WorkFlow[0]?.id, formdata));
		resetValues();
		onhide();
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Row className="pt-2 mt-2" style={{ borderTop: "1px dotted black" }}>
				<Col sm="12" md="12" lg="12" xl="12" className="my-2 text-center">
					<h4 style={{ fontWeight: "600" }}>Edit Work Flow</h4>
				</Col>
				<Col sm="12" md="12" lg="12" xl="12">
					<Controller
						as={<Input label="Name" placeholder="Enter Name" />}
						control={control}
						name="name"
					/>
					{!!errors?.name && <Error>{errors?.name?.message}</Error>}
				</Col>
				<Col sm="12" md="12" lg="12" xl="12" className="text-center pt-2">
					<label style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>Step Allocation</label>
					<Controller
						as={
							<MultiSelect
								options={options}
								placeholder="Select Roles"
								name="steps"
								closeOnSelect={true}
							/>
						}
						name={"steps"}
						control={control}
					/>
					{!!errors?.steps && (
						<Error className="pt-3">{errors?.steps?.message}</Error>
					)}
				</Col>
			</Row>
			<Row>
				{!_.isEmpty(StepList) &&
					StepList.map(({ id, name }, index) => (
						<Col
							key={index + 'step-list'}
							sm="12"
							md="12"
							lg="12"
							xl="12"
							className="d-flex flex-wrap"
							style={
								Number(StepList.length) - 1 === Number(index)
									? { padding: "10px" }
									: { borderBottom: "1px dotted black", padding: "10px" }
							}
						>
							<Col sm="12" md="12" lg="3" xl="3" className="px-0 m-0">
								<CustomControl className="d-flex mt-4">
									<h5 className="m-0" style={{ paddingLeft: "33px" }}>
										{name}
									</h5>
									<input
										name={name}
										type={"checkbox"}
										value={id}
										checked={true}
										readOnly={true}
									/>
									<span style={{ top: "-2px" }}></span>
								</CustomControl>
							</Col>
							{true && (
								<>
									<Col sm="4" md="4" lg="2" xl="2" className="px-0 mb-3 mx-0 mb-0 mt-3">
										<Controller
											as={<ChildCheckBox id={id} text="Reject" />}
											name={`canreject[${index}]`}
											control={control}
											defaultValue={Rej[index]}
										/>
									</Col>
									<Col sm="4" md="4" lg="2" xl="2" className="px-0 mb-3 mx-0 mb-0 mt-3">
										<Controller
											as={<ChildCheckBox id={id} text="Deficiency" />}
											name={`canraisedeficieny[${index}]`}
											control={control}
											defaultValue={Def[index]}
										/>
									</Col>
									<Col sm="4" md="4" lg="2" xl="2" className="px-0 mb-3 mx-0 mb-0 mt-3">
										<Controller
											as={<ChildCheckBox id={id} text="Approve" />}
											name={`canapprove[${index}]`}
											control={control}
											defaultValue={Aprv[index]}
										/>
									</Col>
									{Number(StepList.length) - 1 !== Number(index) && (
										<Col
											sm="12"
											md="12"
											lg="3"
											xl="3"
											className="px-0 mb-3 mx-0 mb-0 mt-3"
										>
											<Input
												readOnly={true}
												value={StepList[index + 1]?.name}
												label={"Pass Handle To"}
												placeholder="Select"
											/>
											<input
												type={"hidden"}
												ref={register}
												name={`pass_to_next_user_type_id[${index}]`}
												value={StepList[index + 1]?.id}
											/>
										</Col>
									)}
									<input
										type={"hidden"}
										ref={register}
										name={`user_type_id[${index}]`}
										value={id}
									/>
								</>
							)}
						</Col>
					))}
			</Row>
			<Row>
				<Col
					sm="12"
					md="12"
					lg="12"
					xl="12"
					className="d-flex justify-content-end mt-3"
				>
					<Button
						type="button"
						className="mx-2"
						buttonStyle={"outline"}
						onClick={() => onhide()}
					>
						Close
					</Button>
					<Button type="submit" className="mx-2">
						Submit
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default EditFlow;
