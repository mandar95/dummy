import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form, Button as Btn } from "react-bootstrap";
import { Error } from "../../../components";
import { AttachFile2 } from "../../core";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
	Deficiency,
	clear,
} from "modules/dashboard/dashboard_customer/dashboard_customer.slice";
import swal from "sweetalert";
import { Input } from "components";
import { downloadFile } from "utils";

const EditModal = ({ show, onHide, def, Redispatch }) => {
	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		remark: yup.string().required("Please enter the remarks"),
	});
	/*----x-----validation schema-----x----*/

	const dispatch = useDispatch();
	const { globalTheme } = useSelector(state => state.theme)
	const { deficiency, error } = useSelector((state) => state.CustDash);
	const [count, setCount] = useState(0);
	const { control, errors, handleSubmit, register, watch } = useForm({
		validationSchema,
	});
	let indx = 0;

	//on Success
	useEffect(() => {
		if (deficiency) {
			swal(deficiency, "", "success");
			Redispatch()
			onHide();
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
				(item) ? data?.document_title[index] : false
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

		dispatch(Deficiency(def?.id, formdata));
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						{"Resolve Deficiency"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						{!_.isEmpty(def) && (
							<Col
								sm="12"
								md="12"
								lg="12"
								xl="12"
								className="p-0 mx-0 d-flex justify-content-center flex-wrap"
							>
								{def?.deficiency_sub_type && (
									<Col sm="6" md="4" lg="4" xl="4" className="text-center p-0 mx-0 my-1">
										<p className="m-0" style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
											{"Deficiency Sub Type"}
										</p>
										<p className="m-0">{def?.deficiency_sub_type}</p>
									</Col>
								)}
								{!_.isEmpty(def?.deficiency_sample_documents) &&
									def?.deficiency_sample_documents && (
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
													downloadFile(def?.deficiency_sample_documents[0]?.document)
												}
											>
												{def?.deficiency_sample_documents[0]?.document_name}
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
								accept=".ppt, .pptx, .pdf, .doc, .docx, .jpeg, .png, .jpg"
								description="File Formats: ppt, pptx, pdf, doc, docx, jpeg, png, jpg"
								nameBox
								required={Number(count) === 0 && docstitle?.length ? true : false}
							/>
						</Col>
						<Col md={6} lg={6} xl={6} sm={12}>
							<Controller
								as={
									<Input
										label={"Document name"}
										placeholder={"Enter Document name"}
										required={
											Number(count) > 0 || (Number(count) === 0 && docs?.length)
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
										nameBox
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
				<Modal.Footer>
					<Button type="submit">Resolve</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditModal;
