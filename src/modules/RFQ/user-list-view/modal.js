import React, { useEffect } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { Input, Select } from "components";
import { Controller, useForm } from "react-hook-form";
import { UpdateList, clear, userList } from "../rfq.slice";
import { useDispatch, useSelector } from "react-redux";
import { Head } from "../plan-configuration/style";
import swal from "sweetalert";
import _ from "lodash";
import { Switch } from "modules/user-management/AssignRole/switch/switch";

export const EditModal = ({
	show,
	onHide,
	data,
	ic,
	brokerId,
	userType,
	trigger,
	access,
}) => {
	const dispatch = useDispatch();
	const { updatelist } = useSelector((state) => state.rfq);
	const { control, handleSubmit, setValue } = useForm({});

	//prefill Values
	useEffect(() => {
		if (data.status) {
			switch (data.status) {
				case "Open":
					setValue("rfq_lead_status", 1);
					break;
				case "Deficiency":
					setValue("rfq_lead_status", 2);
					break;
				case "Lost":
					setValue("rfq_lead_status", 3);
					break;
				case "Reject":
					setValue("rfq_lead_status", 4);
					break;
				case "Won":
					setValue("rfq_lead_status", 5);
					break;
				default:
			}
		}
		setValue("approve", data?.is_approve ? 1 : 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	//onSuccess
	useEffect(() => {
		if (updatelist) {
			swal(updatelist, "", "success").then(() => {
				if (userType === "admin") {
					dispatch(
						userList(trigger === "insurer" ? { ic_id: ic } : { broker_id: brokerId })
					);
				} else if (userType !== "admin") {
					dispatch(
						userList(userType === "insurer" ? { ic_id: ic } : { broker_id: brokerId })
					);
				}
			});
			onHide();
		}
		return () => {
			dispatch(clear("update"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updatelist]);

	const onSubmit = ({ rfq_lead_status, remarks, approve }) => {
		let Req = {
			rfq_lead_id: data?.rfq_leads_id || data?.id,
			...(rfq_lead_status && {rfq_lead_status: rfq_lead_status}),
			remarks,
			...((userType === "insurer" ||
				(userType === "admin" && trigger === "insurer")) && { ic_id: ic }),
			...((userType === "broker" ||
				(userType === "admin" && trigger === "broker")) && { broker_id: brokerId }),
			is_approve: approve,
		};
		dispatch(UpdateList(Req));
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="sm"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<Head>Edit</Head>
				</Modal.Title>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body className="text-center mr-5 ml-5">
					<Row>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={
									<Input label="Remarks" placeholder="Enter Remarks" name="remarks" />
								}
								name="remarks"
								control={control}
							/>
						</Col>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={
									<Select
										label="Status"
										placeholder="Select Status"
										required={false}
										options={_.compact([
											...[access?.can_approve && { id: 1, name: "Open", value: 1 }],
											// ...[
											// 	(access?.can_raise_deficiency || access?.can_approve) && {
											// 		id: 2,
											// 		name: "Deficiency",
											// 		value: 2,
											// 	},
											// ],
											...[access?.can_approve && { id: 3, name: "Lost", value: 3 }],
											...[
												(access?.can_reject || access?.can_approve) && {
													id: 4,
													name: "Reject",
													value: 4,
												},
											],
											...[access?.can_approve && { id: 5, name: "Won", value: 5 }],
										])}
									/>
								}
								name={"rfq_lead_status"}
								control={control}
							/>
						</Col>
						<Col sm="12" md="6" lg="4" xl="4">
							<Controller
								as={<Switch />}
								label="Approve"
								name="approve"
								control={control}
								defaultValue={data?.is_approve}
							/>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button type="button" variant="danger" onClick={() => onHide()}>
						Close
					</Button>
					<Button type="submit">Save</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
