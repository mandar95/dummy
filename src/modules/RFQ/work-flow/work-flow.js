import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ChildCheckBox } from "./option/Option";
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import _ from "lodash";
import swal from "sweetalert";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import {
	Card,
	Input,
	Select,
	Button,
	MultiSelect,
	Error,
	Tab,
	TabWrapper,
} from "components";
import {
	Roles,
	Flow,
	flow as clearFlow,
	clear,
	InsurerAll,
	getBroker,
} from "../rfq.slice";

export const WorkFlow = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
	const { roles, flow, error, insurer, broker } = useSelector(
		(state) => state.rfq
	);

	const { userType } = useParams();
	const [trigger, setTrigger] = useState("insurer");
	const { globalTheme } = useSelector(state => state.theme)

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter name")
			.matches(/^([A-Za-z\s])+$/, "Name must contain only alphabets"),
		steps: yup.array().required("Please allocate steps").nullable(),
		...(userType === "admin" &&
			trigger === "insurer" && {
			ic: yup.string().required("Please select insurer"),
		}),
		...(userType === "admin" &&
			trigger === "broker" && {
			brokerId: yup.string().required("Please select broker"),
		}),
	});
	/*----x-----validation schema-----x----*/

	const { control, handleSubmit, watch, register, setValue, errors } = useForm({
		validationSchema,
	});

	let options = roles.map((item) => {
		return (item = { value: item?.id, label: item?.name, ...item });
	});
	const StepList =
		!_.isEmpty(watch("steps")) && watch("steps") ? watch("steps") : [];

	const IcId = watch("ic");
	const brokerId = watch("brokerId");

	useEffect(() => {
		setValue("ic", "");
		setValue("brokerId", "");
		resetValues();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trigger]);

	useEffect(() => {
		if (currentUser?.ic_id || IcId || currentUser?.broker_id || brokerId) {
			if (userType === "admin") {
				if ((trigger === "insurer" && IcId) || (trigger === "broker" && brokerId)) {
					dispatch(
						Roles(trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId })
					);
				}
			} else {
				if (userType !== "admin")
					dispatch(
						Roles(
							userType === "insurer"
								? { ic_id: currentUser?.ic_id }
								: { broker_id: currentUser?.broker_id }
						)
					);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser.ic_id, IcId, currentUser?.broker_id, brokerId]);

	useEffect(() => {
		if (userType === "admin" && trigger === "insurer") {
			dispatch(InsurerAll());
		}
		if (userType === "admin" && trigger === "broker" && userTypeName) {
			dispatch(getBroker(userTypeName));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userType, trigger, userTypeName]);

	const resetValues = () => {
		setValue([{ "name": "" }, { "steps": [] }]);
	};

	//onSuccess
	useEffect(() => {
		if (flow) {
			swal(flow, "", "success").then(() => {
				history.replace(`/${userType}/work-flow-list`);
			});
		}
		return () => {
			dispatch(clearFlow(null));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flow]);

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

	const onSubmit = (data) => {
		const Deficiency = data.canraisedeficieny?.map((item) => (item ? 1 : 0));
		const Approve = data.canapprove?.map((item) => (item ? 1 : 0));
		const Reject = data.canreject?.map((item) => (item ? 1 : 0));
		const PassNext = _.compact(data.pass_to_next_user_type_id);
		const Steps = data?.user_type_id;

		const formdata = new FormData();

		formdata.append("name", data?.name);
		currentUser?.ic_id && formdata.append("ic_id", currentUser?.ic_id || IcId);
		currentUser?.broker_id &&
			formdata.append("broker_id", currentUser?.broker_id || brokerId);
		IcId &&
			trigger === "insurer" &&
			formdata.append("ic_id", currentUser?.ic_id || IcId);
		brokerId &&
			trigger === "broker" &&
			formdata.append("broker_id", currentUser?.broker_id || brokerId);
		Steps.forEach((item, index) => {
			formdata.append("user_type_id[]", item);
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
		dispatch(Flow(formdata));
		resetValues();
	};

	return (
		<>
			{userType === "admin" && (
				<TabWrapper width={"max-content"}>
					<Tab
						isActive={trigger === "insurer"}
						onClick={() => setTrigger("insurer")}
					>
						Insurer
					</Tab>
					<Tab isActive={trigger === "broker"} onClick={() => setTrigger("broker")}>
						Broker
					</Tab>
				</TabWrapper>
			)}
			<Card title={"Work Flow Configurator"}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row className="mb-3">
						{userType === "admin" && (
							trigger === "insurer" ? (
								<Col sm="12" md="12" lg="12" xl="12">
									<Controller
										as={
											<Select
												label={"Insurer"}
												placeholder={"Select Insurer"}
												options={
													insurer.map(({ id, name }) => ({
														id,
														name,
														value: id,
													})) || []
												}
											/>
										}
										control={control}
										name={"ic"}
									/>
									{!!errors?.ic && <Error>{errors?.ic?.message}</Error>}
								</Col>
							) : (
								<Col sm="12" md="12" lg="12" xl="12">
									<Controller
										as={
											<Select
												label={"Broker"}
												placeholder={"Select Broker"}
												options={
													broker.map(({ id, name }) => ({
														id,
														name,
														value: id,
													})) || []
												}
											/>
										}
										control={control}
										name={"brokerId"}
									/>
									{!!errors?.brokerId && <Error>{errors?.brokerId?.message}</Error>}
								</Col>
							)
						)}
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
									key={'step-;ist-2' + index}
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
											<Col
												sm="4"
												md="4"
												lg="2"
												xl="2"
												className="px-0 mb-3 mx-0 mb-0 mt-3"
											>
												<Controller
													as={<ChildCheckBox id={id} text="Reject" />}
													name={`canreject[${index}]`}
													control={control}
												/>
											</Col>
											<Col
												sm="4"
												md="4"
												lg="2"
												xl="2"
												className="px-0 mb-3 mx-0 mb-0 mt-3"
											>
												<Controller
													as={<ChildCheckBox id={id} text="Deficiency" />}
													name={`canraisedeficieny[${index}]`}
													control={control}
												/>
											</Col>
											<Col
												sm="4"
												md="4"
												lg="2"
												xl="2"
												className="px-0 mb-3 mx-0 mb-0 mt-3"
											>
												<Controller
													as={<ChildCheckBox id={id} text="Approve" />}
													name={`canapprove[${index}]`}
													control={control}
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
							<Button type="submit">Submit</Button>
						</Col>
					</Row>
				</Form>
			</Card>
		</>
	);
};
