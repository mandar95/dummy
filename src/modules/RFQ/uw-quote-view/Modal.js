import React from "react";

import { Modal, Row, Col } from "react-bootstrap";
import { Button, Input } from "components";
import { Head } from "../plan-configuration/style";
import { Switch } from "modules/user-management/AssignRole/switch/switch";
import { Controller, useForm } from "react-hook-form";
import { addDeficiency, updateDeficiency } from "../rfq.slice";
import { useDispatch } from "react-redux";
import { AttachFile2 } from "../../core";
import _ from "lodash";

export const EditModal = ({ show, onHide, Data, ic, brokerId }) => {
	const dispatch = useDispatch();
	const { control, handleSubmit, register, watch } = useForm({
		defaultValues: {
			status: Data.status === "Open" ? 0 : 1,
			deficiency_remarks: Data.deficiency_remarks,
		},
	});

	const doc = watch("document");
	const doc_name = watch("document_name");

	const onSubmit = (data) => {
		const formData = new FormData();
		formData.append("enquiry_id", Data.enquiry_id);
		formData.append("rfq_leads_id", Data.rfq_leads_id);
		brokerId && formData.append("broker_remark", data.deficiency_remarks);
		ic && formData.append("ic_remark", data.deficiency_remarks);
		formData.append("status", data.status ? 0 : 1);
		!_.isEmpty(data?.document) && formData.append("document", data.document[0]);
		data?.document_name && formData.append("document_name", data.document_name);

		//only for update
		Data.deficiency_type && formData.append("_method", "PATCH");

		//not for update
		!Data.deficiency_type &&
			formData.append("deficiency_type", data.deficiency_type);
		!Data.deficiency_type &&
			formData.append("deficiency_sub_type", data.deficiency_sub_type);

		!Data.deficiency_type
			? dispatch(addDeficiency(formData, Data.rfq_leads_id))
			: dispatch(updateDeficiency(formData, Data.id, Data.rfq_leads_id));
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
						{Data.deficiency_type ? "Update Deficiency" : "Create Deficiency"}
					</Head>
				</Modal.Title>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body className="text-center mr-5 ml-5">
					<Row className="d-flex justify-content-center flex-wrap">
						{Data.deficiency_type ||
							Data.deficiency_sub_type ||
							Data.deficiency_remarks ? (
							<Col md={6} lg={5} xl={4} sm={12}>
								<Controller
									as={<Switch label={"Deficiency Done"} />}
									name="status"
									control={control}
								/>
							</Col>
						) : (
							<>
								<Col md={6} lg={5} xl={4} sm={12}>
									<Controller
										as={
											<Input
												label="Deficiency Type"
												placeholder="Enter Deficiency Type"
												required
											/>
										}
										name="deficiency_type"
										control={control}
									/>
								</Col>
								<Col md={6} lg={5} xl={4} sm={12}>
									<Controller
										as={
											<Input
												label="Deficiency Sub Type"
												placeholder="Enter Deficiency Sub Type"
												required
											/>
										}
										name="deficiency_sub_type"
										control={control}
									/>
								</Col>
							</>
						)}
						<Col md={6} lg={5} xl={4} sm={12}>
							<Controller
								as={
									<Input
										label="Remarks"
										placeholder="Enter Deficiency Remarks"
										required
									/>
								}
								name="deficiency_remarks"
								control={control}
							/>
						</Col>
					</Row>
					<Row className="d-flex justify-content-center flex-wrap">
						<Col sm={12} md={6} lg={5} xl={4} className="mt-2">
							<AttachFile2
								required={doc_name ? true : false}
								fileRegister={register}
								name={`document`}
								title={`Upload Document`}
								key="premium_file"
								accept=" .pdf, .doc, .docx, .jpeg, .png, .pdf"
								description={"File Formats:pdf, doc, docx, jpeg, png, pdf "}
							/>
						</Col>
						<Col sm={12} md={6} lg={5} xl={4}>
							<Controller
								as={
									<Input
										label={"Document name"}
										placeholder={"Enter Document name"}
										required={!_.isEmpty(doc) ? true : false}
									/>
								}
								name={`document_name`}
								control={control}
							/>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit">Save</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
