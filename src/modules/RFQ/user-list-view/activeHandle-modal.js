import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { Button, Select, Error } from "components";
import * as yup from "yup";
import { Head } from "../plan-configuration/style";
import { Controller, useForm } from "react-hook-form";
import { createRFQAssignment } from "../rfq.slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import {
	RoleData, selectRoleData, loadInsurerUser, brokerReportingData, insurerReportingData
} from '../../user-management/user.slice'

const validationSchema = yup.object().shape({
	role_type_id: yup.string().required("Please select role type"),
	role_id: yup.string().required("Please select role"),
	user_id: yup.string().required("Please select user"),
});
export const EditModal = ({ show, onHide, Data, ic, brokerId }) => {
	const dispatch = useDispatch();
	const { userType } = useParams();
	const [_Role, setRole] = useState([]);

	const Roles = useSelector(selectRoleData);
	const { reportingICData, reportingData } = useSelector(state => state.userManagement);
	//const { currentUser } = useSelector(state => state.login);

	const { control, handleSubmit, errors, watch } = useForm({
		validationSchema
	});

	const _RoleType = watch('role_type_id');
	const Role = watch('role_id');

	useEffect(() => {
		if (_RoleType) {
			setRole(Roles.filter((item) => item[userType === "broker" ? 'role_type_id' : 'ic_user_type_id'] === Number(_RoleType)))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_RoleType])

	useEffect(() => {
		if (Role) {
			if (userType === "broker") {
				dispatch(brokerReportingData({
					broker_id: brokerId,
					role_id: Role
				}));
			}
			if (userType === "insurer") {
				dispatch(insurerReportingData({
					ic_id: ic,
					role_id: Role
				}));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Role])

	useEffect(() => {
		dispatch(loadInsurerUser())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (brokerId) {
			dispatch(RoleData(brokerId, 'broker', '1'))
		}
		if (ic) {
			dispatch(RoleData(ic, 'insurer', '1'))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [brokerId, ic])

	const onSubmit = (data) => {
		let _Data = {
			user_id: data.user_id,
			role_type_id: data.role_type_id,
			rfq_lead_id: Data.id,
			...userType === 'broker' ?
				{ broker_role_id: data.role_id } :
				{ ic_role_id: data.role_id }
		}
		dispatch(createRFQAssignment(_Data))
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<Head>
						Create RFQ Assignment
					</Head>
				</Modal.Title>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body className="text-center mr-5 ml-5">
					<Row className="d-flex justify-content-center flex-wrap">
						{(
							<>
								<Col md={6} lg={5} xl={4} sm={12}>
									<Controller
										as={
											<Select
												label="Role Type"
												placeholder="Select Role Type"
												required={false}
												isRequired={true}
												options={reportingICData?.data?.map((item) => ({
													id: item?.id,
													name: item?.name,
													value: item?.id,
												}))}
											/>
										}
										// onChange={([selected]) => {
										//   return selected;
										// }}
										name="role_type_id"
										control={control}
										defaultValue={""}
										error={errors && errors.role_type_id}
									/>
									{!!errors?.role_type_id && <Error>{errors?.role_type_id?.message}</Error>}
								</Col>
								<Col md={6} lg={5} xl={4} sm={12}>
									<Controller
										as={<Select
											label="Role"
											placeholder="Select Role"
											options={_Role}
											required={false} isRequired={true}
											id="role_id"
										/>}
										name="role_id"
										error={errors && errors.role_id}
										control={control}
									/>
									{!!errors.role_id &&
										<Error>
											{errors.role_id.message}
										</Error>}
								</Col>
								<Col md={6} lg={5} xl={4} sm={12}>
									<Controller
										as={<Select
											label="User"
											placeholder="Select User"
											options={reportingData?.data?.map((item) => ({
												id: item?.user_id,
												name: item?.user_name,
												value: item?.user_id,
											})) || []}
											required={false} isRequired={true}
											id="user_id"
										/>}
										name="user_id"
										error={errors && errors.user_id}
										control={control}
									/>
									{!!errors.user_id &&
										<Error>
											{errors.user_id.message}
										</Error>}
								</Col>
							</>
						)}

					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit">Save</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
