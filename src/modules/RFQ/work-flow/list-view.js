import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import _ from "lodash";
import swal from "sweetalert";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Select, Tab, TabWrapper, Error } from "components";
import {
	clear,
	InsurerAll,
	ListView,
	updateFlow,
	deleteFlow,
	getBroker,
} from "../rfq.slice";
import { DataTable } from "modules/user-management";
import { TableData } from "./helper.js";
import EditFlow from "./edit-flow";

export const FlowList = ({ myModule }) => {
	const dispatch = useDispatch();
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
	const { error, ins, listview, updateflow, success, brkr } = useSelector(
		(state) => state.rfq
	);
	const { userType } = useParams();
	const [show, setShow] = useState(false);
	const [trigger, setTrigger] = useState("insurer");

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		...(userType === "admin" && {
			ic: yup.string().required("Please select insurer"),
		}),
		flow: yup.string().required("Please select the work flow"),
	});
	/*----x-----validation schema-----x----*/

	const { control, watch, errors, setValue } = useForm({
		validationSchema,
	});

	const IcId = watch("ic");
	const brokerId = watch("brokerId");
	const ListId = watch("flow");

	const WorkFlow = listview?.filter(({ id }) => Number(id) === Number(ListId));
	let Data = !_.isEmpty(WorkFlow) ? WorkFlow[0]?.work_flow_journey : [];

	useEffect(() => {
		setValue("ic", "");
		setValue("brokerId", "");
		setShow(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trigger]);

	//Load data
	useEffect(() => {
		dispatch(clear("listview"));
		if (currentUser?.ic_id || IcId || currentUser?.broker_id || brokerId) {
			if (userType === "admin") {
				if ((trigger === "insurer" && IcId) || (trigger === "broker" && brokerId)) {
					dispatch(
						ListView(
							trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
						)
					);
				}
			} else {
				if (userType !== "admin")
					dispatch(
						ListView(
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
			dispatch(InsurerAll({}, true));
		}
		if (userType === "admin" && trigger === "broker" && userTypeName) {
			dispatch(getBroker(userTypeName, true));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userType, trigger, userTypeName]);

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
	//onUpdate
	useEffect(() => {
		if (updateflow) {
			swal(updateflow, "", "success").then(() => {
				if (userType === "admin") {
					dispatch(
						ListView(
							trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
						)
					);
				} else if (userType !== "admin") {
					dispatch(
						ListView(
							userType === "insurer"
								? { ic_id: currentUser?.ic_id }
								: { broker_id: currentUser?.broker_id }
						)
					);
				}
			});
		}
		return () => {
			dispatch(clear("updateflow"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateflow]);

	//onSuccess
	useEffect(() => {
		if (success) {
			swal(success, "", "success").then(() => {
				if (userType === "admin") {
					dispatch(
						ListView(
							trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
						)
					);
				} else if (userType !== "admin") {
					dispatch(
						ListView(
							userType === "insurer"
								? { ic_id: currentUser?.ic_id }
								: { broker_id: currentUser?.broker_id }
						)
					);
				}
			});
		}
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success]);

	//Approve
	const approve = (actionType) => {
		swal({
			title: "Alert",
			text: `Sure about ${actionType === "disable" ? "disabling" : "approving"} the construct?`,
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
					const formData = new FormData();
					formData.append("_method", "PATCH");
					formData.append("status", actionType === "disable" ? 0 : 1);
					dispatch(updateFlow(WorkFlow[0]?.id, formData));
					break;
				default:
			}
		});
	};

	const deleteAction = () => {
		swal({
			title: "Alert",
			text: `Sure about deleting the construct?`,
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
					dispatch(deleteFlow(WorkFlow[0]?.id));
					break;
				default:
			}
		});
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
			<Card title={"Work Flow List View"}>
				<Row>
					{userType === "admin" && (
						trigger === "insurer" ? (
							<Col sm="12" md="12" lg="6" xl="6">
								<Controller
									as={
										<Select
											label={"Insurer"}
											placeholder={"Select Insurer"}
											options={
												ins.map(({ id, name }) => ({
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
							<Col sm="12" md="12" lg="6" xl="6">
								<Controller
									as={
										<Select
											label={"Broker"}
											placeholder={"Select Broker"}
											options={
												brkr.map(({ id, name }) => ({
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
					<Col
						sm="12"
						md="12"
						lg={userType === "admin" ? "6" : "12"}
						xl={userType === "admin" ? "6" : "12"}
					>
						<Controller
							as={
								<Select
									label="Work Flow"
									placeholder="Select Work Flow"
									options={
										listview.map(({ id, name }) => ({
											id,
											name,
											value: id,
										})) || []
									}
								/>
							}
							control={control}
							name="flow"
						/>
						{!!errors?.flow && <Error>{errors?.flow?.message}</Error>}
					</Col>
					{!_.isEmpty(Data) && !show && (
						<Col
							sm="12"
							md="12"
							lg="12"
							xl="12"
							style={{ borderTop: "1px dotted black", paddingTop: "20px" }}
							className="mt-3"
						>
							{(currentUser?.ic_user_type === "Admin" ||
								userType === "admin" ||
								userType === "broker") && (
									<div className="d-flex justify-content-end py-1 mx-2">
										{/* <span>
									<Button
										size="sm"
										className="shadow-lg rounded"
										disabled
										variant={WorkFlow[0]?.status === "Active" ? "success" : "danger"}
									>
										{WorkFlow[0]?.status || "N/A"}
									</Button>
								</span> */}
										{!!(myModule?.canwrite || myModule?.candelete) &&
											<div className="d-flex flex-wrap">
												{!!myModule?.canwrite && <>
													<Button
														size="sm"
														className="mx-1"
														variant={
															WorkFlow[0]?.status === "Inactive" ? "primary" : "secondary"
														}
														onClick={() =>
															approve(WorkFlow[0]?.status === "Active" ? "disable" : "enable")
														}
													>
														{WorkFlow[0]?.status === "Inactive" ? "Approve" : "Disable"}
													</Button>
													<Button
														size="sm"
														onClick={() => {
															setShow(true);
														}}
														variant="warning"
														className="mx-1 strong"
													>
														<i className="ti-pencil-alt" />
													</Button>
												</>}
												{!!myModule?.candelete && <Button
													size="sm"
													className="mx-1 strong"
													variant="danger"
													onClick={() => deleteAction()}
												>
													<i className="ti-trash" />
												</Button>}
											</div>
										}
									</div>
								)}
						</Col>
					)}
				</Row>
				{!_.isEmpty(Data) && (
					!show ? (
						<DataTable
							columns={TableData || []}
							data={Data}
							noStatus={true}
							pageState={{ pageIndex: 0, pageSize: 5 }}
							pageSizeOptions={[5, 10]}
							rowStyle
						/>
					) : (
						<EditFlow
							WorkFlow={WorkFlow}
							ic={currentUser?.ic_id || IcId}
							onhide={() => setShow(false)}
							brokerId={currentUser?.broker_id || brokerId}
							userType={userType}
							trigger={trigger}
						/>
					)
				)}
			</Card>
		</>
	);
};
