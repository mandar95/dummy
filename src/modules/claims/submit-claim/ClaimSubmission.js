import React, { useEffect, useState } from "react";
import { Button, Chip, Input } from "components";
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import { AttachFile, AttachFile2 } from "modules/core";
import {
	StyledProgressBar,
	ProgressText,
	ProgressCount,
	FileList,
	CaneclDiv,
} from "./style";
import { useSelector, useDispatch } from "react-redux";
import { getDocs, clear } from "../claims.slice";
import _ from "lodash";
import { common_module } from 'config/validations'

const validation = common_module.submit_claim

const getreimbursementTypeID = (reimburmentType) => {
	let reimburmentTypeObj = {
		'Pre-hospitalization': 1,
		'Post-hospitalization': 2,
		'Hospitalization': 3,
		'opd': 4

	}
	return reimburmentType.map((item) => reimburmentTypeObj[item])
}
export const ClaimSubmission = (props) => {

	const dispatch = useDispatch();
	const { globalTheme } = useSelector(state => state.theme)
	const { docs } = useSelector((state) => state.claims);
	const [count, setCount] = useState(0);
	const { Controller, control, register, accepted_extensions } = props;
	let indx = 0;

	let reimbursementTypeID = getreimbursementTypeID(props.data.tableBill.reimburment_type);
	let _docs = docs.filter((e) => reimbursementTypeID.some(item => e.document_type?.split(',').some(item2 => +item2 === +item)))

	const onSubmit = (e) => {
		e.preventDefault();
		props.submitData(3, {});
	};

	const removeFile = (id) => {
		props.deleteFile(id);
	};

	const sendFiles = (data) => {
		if (data) {
			props.postFiles(data);
		}
	};

	useEffect(() => {
		dispatch(clear('docs'))
		if (props.policy_id) dispatch(getDocs({ policy_id: props.policy_id?.value }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.policy_id]);

	const AcceptFileFormat = accepted_extensions.length ? accepted_extensions.reduce((total, type) => total ? `${total}, .${type}` : `.${type}`, '') : ".png, .jpeg, .jpg, .pdf"
	const FileDescription = `File Formats: ${accepted_extensions.length ? accepted_extensions.reduce((total, type) => total ? `${total}, ${type}` : `${type}`, '') : 'jpg, jpeg, pdf, png'} - Max File Size: 5MB`

	return (
		<>
			<Form onSubmit={onSubmit}>
				{/* {props.type !== "opd" && ( */}
				<Row className="d-flex flex-wrap" style={{ margin: "0px" }}>
					<Col md={6} lg={6} xl={6} sm={12}>
						<AttachFile
							reset
							name="filenames"
							title={props.type !== "opd" ? "Upload Medical Bills & Discharge Summary" : 'OPD Bills'}
							onUpload={(file) => sendFiles(file[0])}
							// {...validation.file.type}
							accept={AcceptFileFormat}
							description={FileDescription}
							required={!props?.data?.filenames.length}
						/>
					</Col>
					<Col md={6} lg={6} xl={6} sm={12}>
						{props?.data?.filenames && props?.data?.filenames.length ? (
							<FileList>
								{props?.data?.filenames.map((file, index) => (< Chip
									id={index}
									name={`${file?.name}`}
									onDelete={(id) => removeFile(id)}
									key={'file' + index}
								/>
								))}
							</FileList>
						) : (
							""
						)}
					</Col>
				</Row>
				{/* )} */}
				{!_.isEmpty(_docs) &&
					typeof _docs === "object" &&
					_docs.map((elem, index) => (
						<Row key={'docs' + index} className="d-flex flex-wrap" style={{ margin: "10px 0px 10px 0px" }}>
							{elem?.document_name !== "others" ? (
								<Col md={6} lg={6} xl={6} sm={12}>
									<AttachFile2
										required={elem?.is_mandatory * 1 ? true : false}
										fileRegister={register}
										name={`document_path[${index}]`}
										title={`${elem?.document_name}`}
										key="premium_file"
										// {...validation.file.type}
										accept={AcceptFileFormat}
										description={FileDescription}
										nameBox
									/>
									{(elem?.sample_document_url || elem?.sample_opd_document_url) && (
										<div
											style={{ cursor: "pointer", color: "blue" }}
											className="my-1 ml-1"
											onClick={() =>
												window.open(
													elem?.sample_document_url || elem?.sample_opd_document_url
												)
											}
										>
											<i
												className="ti-cloud-down attach-i"
												style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: '5px' }}
											></i>
											<span style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
												Download Sample Format
											</span>
										</div>
									)}
									<input
										type="hidden"
										ref={register}
										name={`document_name[${index}]`}
										value={elem?.document_name}
									/>
									<input
										type="hidden"
										ref={register}
										name={`document_type[${index}]`}
										value={elem?.document_type}
									/>
								</Col>
							) : (
								<noscript />
							)}
						</Row>
					))}
				{Array.apply(null, { length: count }).map((index) => {
					indx++;
					return (
						<Row key={'doc1' + index} className="d-flex flex-wrap" style={{ margin: "10px 0px 10px 0px" }}>
							<Col md={6} lg={6} xl={6} sm={12}>
								<AttachFile2
									required={true}
									fileRegister={register}
									name={`others_path[${indx - 1}]`}
									title={`Document`}
									key="premium_file"
									// {...validation.file.type}
									accept={AcceptFileFormat}
									description={FileDescription}
									nameBox
								/>
							</Col>
							<Col md={6} lg={6} xl={6} sm={12}>
								<Controller
									as={
										<Input
											label={"Document name"}
											placeholder={"Enter Document name"}
											maxLength={validation.file.name_length}
											required
										/>
									}
									name={`others_name[${indx - 1}]`}
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
									style={{ background: "red", color: "white", fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}
								/>
								<i
									className="btn ti-plus"
									onClick={() => setCount(count * 1 + 1)}
									style={{ background: "lightgreen", color: "white", fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}
								/>
							</Col>
						)}
					</Row>
				)}
				<div className="mt-4 d-flex flex-wrap justify-content-between">
					<div md={4} className="text-center">
						<StyledProgressBar now={props.progress} />
						<ProgressText>
							<ProgressCount>{`${props.progress}% `}</ProgressCount>
							of 100 Completed
						</ProgressText>
					</div>
					<div className="d-flex flex-wrap h-50 justify-content-end">
						<CaneclDiv>
							<Button
								type="button"
								onClick={() => props.previousPage(2)}
								buttonStyle="outline-secondary"
							>
								Previous
							</Button>
						</CaneclDiv>
						<Button type="submit" className="ml-4 h-50">
							Submit
						</Button>
					</div>
				</div>
			</Form>
		</>
	);
};
