import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert";

import { Modal, Form, Row, Col } from "react-bootstrap";
import { Button } from "components";
import { AttachFile } from "modules/core";
import { AnchorTag } from "modules/policies/steps/premium-details/styles";
import { CustomControl } from "modules/user-management/AssignRole/option/style";

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { sampleFile, clearSampleURL, createINSFaqXls } from "../../help.slice";
import { downloadFile } from "utils";
import { insurer } from 'config/validations'

const validation = insurer.faq

const AddFAQ = ({ show, onHide, userType, currentUser }) => {
	const [file, setFile] = useState();
	const { control, handleSubmit } = useForm();
	const dispatch = useDispatch();
	const { sampleURL } = useSelector((state) => state.help);
	const { globalTheme } = useSelector(state => state.theme)

	useEffect(() => {
		if (sampleURL) {
			downloadFile(sampleURL);
			swal({
				title: "Downloading",
				text: "Sample Format",
				timer: 2000,
				button: false,
				icon: "info",
			});
		}

		return () => {
			dispatch(clearSampleURL());
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sampleURL]);

	const onSubmit = (data) => {
		if (file) {
			const formData = new FormData();
			formData.append(`file`, file);
			formData.append(`override`, data.override || "1");
			userType === 'broker' ?
				formData.append(`broker_id`, currentUser?.broker_id)
				: formData.append(`ic_id`, currentUser?.ic_id)
			dispatch(createINSFaqXls(formData));
			setTimeout(onHide, 500);
		}
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="xl"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">
					<Head>Add FAQ's</Head>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row className="d-flex flex-wrap">
						<Col
							md={12}
							lg={12}
							xl={12}
							sm={12}
							className="text-left"
							style={{ border: "1.5px dotted #0093ff", borderRadius: "10px" }}
						>
							<div className="d-flex justify-content-around flex-wrap p-2">
								<Controller
									as={
										<CustomControl className="d-flex mt-4">
											<h5 className="m-0" style={{ paddingLeft: "33px" }}>
												{"Overwrite file"}
											</h5>
											<input name={"override"} type={"radio"} value={1} defaultChecked />
											<span style={{ top: "-2px" }}></span>
										</CustomControl>
									}
									name={"override"}
									control={control}
								/>
								<Controller
									as={
										<CustomControl className="d-flex mt-4">
											<h5 className="m-0" style={{ paddingLeft: "33px" }}>
												{"Add into existing FAQs"}
											</h5>
											<input name={"override"} type={"radio"} value={0} />
											<span style={{ top: "-2px" }}></span>
										</CustomControl>
									}
									name={"override"}
									control={control}
								/>
							</div>
							<AttachFile
								name="premium_file"
								title="Attach File"
								key="premium_file"
								{...validation.file}
								onUpload={(files) => setFile(files[0])}
								nameBox
								required
							// error={errors && errors.premium_file}
							/>
							<AnchorTag href={"#"} onClick={() => dispatch(sampleFile("14"))}>
								<i
									className="ti-cloud-down attach-i"
									style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
								></i>
								<p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
									Download Sample Format
								</p>
							</AnchorTag>
						</Col>
					</Row>
					<Row>
						<Col md={12} className="d-flex justify-content-end mt-4">
							<Button buttonStyle="danger" type="button" onClick={onHide}>
								Cancel
							</Button>
							<Button type="submit">Save</Button>
						</Col>
					</Row>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default AddFAQ;

const Head = styled.span`
	text-align: center;
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
	
	letter-spacing: 1px;
	color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`;
