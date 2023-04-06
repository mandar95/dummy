import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form, Button as Btn } from "react-bootstrap";
import { Select, Error, _renderDocument } from "../../../components";
import { AttachFile2 } from "../../core";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Deficiency, clear } from "./dashboard_customer.slice";
import swal from "sweetalert";
import { Input } from "components";
import { downloadFile } from "utils";
import { DataTable } from "modules/user-management";

export const TableDataDefView = [
	{
		Header: "Document Name",
		accessor: "document",
	},
	{
		Header: "Customer Document",
		accessor: "document_url",
		Cell: _renderDocument,
		disableFilters: true,
		disableSortBy: true,
	},
	{
		Header: "Customer Remark",
		accessor: "customer_remark",
	},
	{
		Header: "Broker Remark",
		accessor: "broker_remark",
	},
	{
		Header: "IC Remark",
		accessor: "ic_remark",
	},
];

const EditModal = (props) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		remark: yup.string().required("Please enter the remarks"),
		deficiency_id: yup.string().required("Please select the deficiency type"),
	});
	/*----x-----validation schema-----x----*/

	const dispatch = useDispatch();
	const { globalTheme } = useSelector(state => state.theme)
	const { deficiency, error } = useSelector((state) => state.CustDash);
	const [count, setCount] = useState(0);
	const { control, errors, handleSubmit, register, watch } = useForm({
		validationSchema,
	});
	const Def_id = watch("deficiency_id");
	const def = (props?.data || [])?.filter(
		({ id }) => Number(id) === Number(Def_id)
	);
	const [view, setView] = useState(false);
	let indx = 0;

	//on Success
	useEffect(() => {
		if (deficiency) {
			swal(deficiency, "", "success");
			props.onHide();
		}
		return () => {
			dispatch(clear("deficiency"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deficiency]);

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

	const docs = watch("document") || [];
	const docstitle = watch("document_title") || [];

	const onSubmit = (data) => {
		const other_docs_name = _.compact(
			data?.document_title?.map((item, index) =>
				item ? data?.document_title[index] : false
			)
		);
		const other_docs = _.compact(
			data?.document?.map((item, index) =>
				item ? data?.document[index][0] : false
			)
		);
		const formdata = new FormData();
		formdata.append("remark", data?.remark);
		formdata.append("_method", "PATCH");
		other_docs_name.forEach((elem, index) => {
			formdata.append(`documents[${index}][name]`, elem);
		});
		other_docs.forEach((elem, index) => {
			formdata.append(`documents[${index}][document]`, elem);
		});

		dispatch(Deficiency(data?.deficiency_id, formdata));
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(onSubmit)}>
				{/* {!view} */}
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						{!view ? "Update Deficiency" : "Deficiency Trail"}
					</Modal.Title>
				</Modal.Header>
				{!view ? (
					<Modal.Body>
						<Row>
							<Col sm="12" md="12" lg="12" xl="12">
								<Controller
									as={
										<Select
											label="Deficiency Type"
											placeholder="Select Deficiency Type"
											options={
												props.data?.map((item) => ({
													id: item?.id,
													name: item?.deficiency_type,
													value: item?.id,
												})) || []
											}
										/>
									}
									name="deficiency_id"
									control={control}
								/>
								{!!errors?.deficiency_id && (
									<Error>{errors?.deficiency_id?.message}</Error>
								)}
							</Col>
							{!_.isEmpty(def) && (
								<Col
									sm="12"
									md="12"
									lg="12"
									xl="12"
									className="p-0 mx-0 d-flex justify-content-center flex-wrap"
								>
									{def[0]?.deficiency_sub_type && (
										<Col
											sm="6"
											md="4"
											lg="4"
											xl="4"
											className="text-center p-0 mx-0 my-1"
										>
											<p className="m-0" style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
												{"Deficiency Sub Type"}
											</p>
											<p className="m-0">{def[0]?.deficiency_sub_type}</p>
										</Col>
									)}
									{!_.isEmpty(def[0]?.deficiency_sample_documents) &&
										def[0]?.deficiency_sample_documents && (
											<Col
												sm="6"
												md="4"
												lg="4"
												xl="4"
												className="text-center p-0 mx-0 my-1"
											>
												<p className="m-0" style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
													{"Sample Document"}
												</p>
												<Button
													size="sm"
													onClick={() =>
														downloadFile(def[0]?.deficiency_sample_documents[0]?.document)
													}
												>
													{def[0]?.deficiency_sample_documents[0]?.document_name}
												</Button>
											</Col>
										)}
									{!_.isEmpty(def[0]) && (
										<Col
											sm="6"
											md="4"
											lg="4"
											xl="4"
											className="text-center p-0 mx-0 my-1"
										>
											<p className="m-0" style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
												{"Deficiency Trail"}
											</p>
											<Button
												size="sm"
												type="button"
												onClick={() => setView(def[0]?.deficiency_documents)}
												disabled={!_.isEmpty(def[0]?.deficiency_documents) ? false : true}
												variant={
													!_.isEmpty(def[0]?.deficiency_documents) ? "primary" : "secondary"
												}
											>
												View Trail
											</Button>
										</Col>
									)}
								</Col>
							)}
							<Col sm="12" md="12" lg="12" xl="12" className="text-center">
								<div className="my-2 py-2">
									<label style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>
										Comments
										<sup>
											<img alt="important" src="/assets/images/inputs/important.png" />
										</sup>
									</label>
									<Controller
										as={<Form.Control as="textarea" rows="3" isRequired={true} />}
										name="remark"
										control={control}
										defaultValue={""}
										error={errors && errors.remark}
									/>
								</div>
								{!!errors?.remark && <Error>{errors?.remark?.message}</Error>}
							</Col>
						</Row>
						<Row
							key={"doc" + 0}
							className="d-flex flex-wrap"
							style={{ margin: "10px 0px 10px 0px" }}
						>
							<Col sm="12" md="6" lg="6" xl="6" className="mt-4 mb-4">
								<AttachFile2
									fileRegister={register}
									name={`document[${0}]`}
									title="Upload Document"
									key="premium_file"
									accept=".ppt, .pptx, .pdf, .doc, .docx"
									description="File Formats: ppt, pptx, pdf, doc, docx"
									nameBox
									required={Number(count) === 0 && docs.length ? true : false}
								/>
							</Col>
							<Col md={6} lg={6} xl={6} sm={12}>
								<Controller
									as={
										<Input
											label={"Document name"}
											placeholder={"Enter Document name"}
											required={
												Number(count) > 0 || (Number(count) === 0 && docstitle.length)
													? true
													: false
											}
										/>
									}
									name={`document_title[${0}]`}
									control={control}
								/>
							</Col>
						</Row>
						{Array.apply(null, { length: count }).map((index) => {
							indx++;
							return (
								<Row
									key={"doc" + index}
									className="d-flex flex-wrap"
									style={{ margin: "10px 0px 10px 0px" }}
								>
									<Col md={6} lg={6} xl={6} sm={12}>
										<AttachFile2
											required={true}
											fileRegister={register}
											name={`document[${indx}]`}
											title={`Upload Document`}
											key="premium_file"
											accept=".ppt, .pptx, .pdf, .doc, .docx"
										/>
									</Col>
									<Col md={6} lg={6} xl={6} sm={12}>
										<Controller
											as={
												<Input
													label={"Document name"}
													placeholder={"Enter Document name"}
													required
												/>
											}
											name={`document_title[${indx}]`}
											control={control}
										/>
									</Col>
								</Row>
							);
						})}
						{true && (
							<Row>
								{count * 1 === 0 ? (
									<Col
										sm="12"
										md="12"
										lg="12"
										xl="12"
										className="d-flex justify-content-end"
									>
										<Btn type="button" size="sm" onClick={() => setCount(count * 1 + 1)}>
											<span style={{ whiteSpace: "no-wrap" }}>+ Add Other Documents</span>
										</Btn>
									</Col>
								) : (
									<Col
										sm="12"
										md="12"
										lg="12"
										xl="12"
										className="d-flex justify-content-end"
									>
										<i
											className="btn ti-trash mr-2"
											onClick={() => setCount(count * 1 - 1)}
											style={{
												background: "red",
												color: "white",
												fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px',
											}}
										/>
										<i
											className="btn ti-plus"
											onClick={() => setCount(count * 1 + 1)}
											style={{
												background: "lightgreen",
												color: "white",
												fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px',
											}}
										/>
									</Col>
								)}
							</Row>
						)}
					</Modal.Body>
				) : (
					<Modal.Body className="text-center mr-5 ml-5">
						<Row>
							<Col
								sm={12}
								lg={12}
								md={12}
								xl={12}
								className="d-flex justify-content-start p-0 m-0"
							>
								<Button
									variant="dark"
									type="button"
									onClick={() => setView(false)}
									size="sm"
								>
									Back
								</Button>
							</Col>
						</Row>
						<Row className="d-flex justify-content-center flex-wrap">
							<Col sm={12} lg={12} md={12} xl={12}>
								<DataTable
									columns={TableDataDefView || []}
									data={view || []}
									noStatus={true}
									pageState={{ pageIndex: 0, pageSize: 5 }}
									pageSizeOptions={[5, 10]}
									rowStyle
								/>
							</Col>
						</Row>
					</Modal.Body>
				)}

				<Modal.Footer>
					<Button variant="danger" onClick={props.onHide}>
						Close
					</Button>
					<Button type="submit">Update</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditModal;
