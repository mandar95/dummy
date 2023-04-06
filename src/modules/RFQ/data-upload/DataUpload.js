import React, { useState, useRef, useContext, useEffect } from "react";
import { FileDrop } from "react-file-drop";
import * as yup from "yup";
// import swal from "sweetalert";
import swal from "@sweetalert/with-react";
import { AttachFile2 } from 'modules/core';
import { NavBar, RFQRelationCard, Error, Footer, Loader, NoDataFound } from "components";
import { Row, Col, Accordion, Card as BSCard, Button as Btn } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
	Wrapper,
	InfoCard,
	Button,
	Stepper,
	Carousal,
	StyledButton,
} from "./style";
import { Title, Button as BTN, Card } from "../select-plan/style";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";
import { DataTable } from "modules/user-management";
import { Input } from "../components";
import { MemberModal } from "./Modal";
import { InviteTeamModal } from "./Moadal2";
// import { Completed } from "./thankyouModal";

import {
	saveCompanyData, clear, uploadSheet, employeeSheetData,
	getMembers, loadCompanyData, getIndustry, removeMember, set_company_data,
	getConfigData
} from "../home/home.slice.js";
import { MemberColumn, MapMember } from "../rfq.help";
import { useParams, useHistory, useLocation } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { downloadSampleFile, clearDownloadSampleSuccess } from 'modules/policies/policy-config.slice';
import { downloadFile } from 'utils';
import InputForm from "../home/steps/customize-plan/InputForm";
import { DefaultValue, AboutText } from "../home/steps";
import { doesHasIdParam, giveProperId } from "../home/home";

const ContextAwareToggle = ({ eventKey, callback }) => {
	const currentEventKey = useContext(AccordionContext);
	const decoratedOnClick = useAccordionToggle(
		eventKey,
		() => callback && callback(eventKey)
	);
	const isCurrentEventKey = currentEventKey === eventKey;
	return (
		<StyledButton
			variant="link"
			className="open-button"
			onClick={decoratedOnClick}
		>
			{isCurrentEventKey ? (
				<i className="arrow up"></i>
			) : (
				<i className="arrow down"></i>
			)}
		</StyledButton>
	);
};

const validationSchema = yup.object().shape({
	cname: yup
		.string()
		.required("Name Required")
		.min(2, "Please enter name more than 2 character")
		.matches(/^([A-Za-z.\s])+$/, "Must contain only alphabets or dot"),
	address: yup.string()
		.required("Address Required")
		.min(5, "Please enter name more than 5 character"),
	pan: yup
		.string()
		.required("Pan no. is required")
		.matches(
			/[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/,
			"PAN no. invalid(e.g. ALWPG5809L)"
		)
		.max(10, "Please enter a valid pan number"),
	gst: yup
		.string()
		.required("GST no. required")
		.matches(
			/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
			"GST no. invalid(e.g. 22AABCU9603R1ZX)"
		),
});

export const DataUpload = () => {
	// const [display, setDisplay] = useState(1);
	const dispatch = useDispatch();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const enquiry_id = decodeURIComponent(query.get("enquiry_id"));
	const utm_source = query.get("utm_source");
	const brokerId = query.get("broker_id");
	const insurerId = query.get("insurer_id");
	const { globalTheme } = useSelector(state => state.theme)
	const fileInputRef = useRef(null);
	const [file, setFile] = useState();
	const [modal, setModal] = useState();
	const [inviteTeamModal, setInviteTeamModal] = useState();
	// const [done] = useState(false);
	const { id } = useParams();
	const history = useHistory();
	const { success, error, employee_sheet_data,
		company_data, industry_data, members_data, widgets,
		loading, configDataload, customerDataLoad, logo, inviteSuccess, Sheetsuccess } = useSelector((state) => state.RFQHome);
	const { sampleURL } = useSelector(state => state.policyConfig);
	const { errors, register, handleSubmit, setValue, control, watch } = useForm({
		validationSchema,
	});

	useEffect(() => {
		if (inviteSuccess) {
			swal('Success', inviteSuccess, "success");
			setInviteTeamModal(false)
		}
		return () => {
			dispatch(clear('inviteSuccess'));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inviteSuccess])

	useEffect(() => {
		if (enquiry_id) {
			dispatch(getIndustry())
			dispatch(getConfigData(giveProperId({ brokerId, insurerId })))
			dispatch(loadCompanyData({
				enquiry_id: enquiry_id
			}));
		}
		else {
			swal("Alert", 'No enquiry id found!', "info").then(() => {
				history.push('/company-details')
			});
		}

		// if (payment === 'done') {
		// 	setDone(true)
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (company_data.company_name && Number(id) === 5) {
			// reset({
			// 	cname: company_data.company_name,
			// 	// address: company_data,
			// 	// pan: company_data,
			// 	// gst: company_data
			// })
			setValue([{ cname: company_data.company_legal_name ? company_data.company_legal_name : company_data.company_name },
			{ address: company_data.address },
			{ pan: company_data.pan_number },
			{ gst: company_data.gstin_number }
			])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data, id])


	useEffect(() => {

		switch (Number(id)) {
			case 2:
			case 3: dispatch(employeeSheetData({ enquiry_id }));
				return;
			case 4: dispatch(getMembers({ enquiry_id }));
				return;
			default:
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	useEffect(() => {
		if (sampleURL) {
			downloadFile(sampleURL);
		}
		return () => { dispatch(clearDownloadSampleSuccess()) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sampleURL]);

	useEffect(() => {
		if (Sheetsuccess) {
			if (Sheetsuccess.uploaded_sheet && Sheetsuccess.error_sheet) {
				swal(<div>
					<h1 style={{
						fontSize: globalTheme.fontSize ? `calc(25px + ${globalTheme.fontSize - 92}%)` : '25px',
						color: 'dimgrey',
						marginBottom: '30px'
					}}>{Sheetsuccess.message}</h1>
					<div className="col-12 mt-2 mt-lg-0 text-right d-flex justify-content-between">
						<Btn
							size="sm"
							variant="success"
							onClick={() => { exportPolicy(Sheetsuccess.uploaded_sheet); }}
							className="shadow-sm m-1 rounded-lg"
							style={{ padding: '10px', border: 'none' }}
						>
							Uploaded Sheet Document
							<i className="ti ti-download" style={{ marginLeft: '10px' }}></i>
						</Btn>
						<Btn
							size="sm"
							variant="danger"
							onClick={() => { exportPolicy(Sheetsuccess.error_sheet); }}
							className="shadow-sm m-1 rounded-lg"
							style={{ padding: '10px', border: 'none' }}
						>
							Error Sheet Document
							<i className="ti ti-download" style={{ marginLeft: '10px' }}></i>
						</Btn>
					</div>
				</div>);
			}
			else {
				swal('Success', Sheetsuccess.message, "success").then(() => {
					history.push(`/data-upload/3?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
				});
			}
		}
		return () => {
			dispatch(clear('Sheetsuccess'));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Sheetsuccess])

	useEffect(() => {
		if (success) {
			switch (Number(id)) {
				case 2: history.push(`/data-upload/3?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
					setFile(false);
					break;
				case 3: break;
				case 4:
					swal('Success', success, "success");
					dispatch(getMembers({ enquiry_id }))
					setModal(null);
					break;
				default:
					(company_data?.is_fresh_policy === 1 ?
						history.push(`/declaration?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
						:
						history.push(`/upload-policy-claim-detail?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
					)

				// setDone(true);
			}
		}
		if (error) {
			swal("Alert", error, "warning");
		}
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, error]);

	const downloadSample = () => {
		dispatch(downloadSampleFile({ sample_type_id: 32 }));
	}

	const onFileInputChange = (event) => {
		const { files } = event.target;
		if (files.length && (files[0]?.name.endsWith(".xlsx") || files[0]?.name.endsWith(".xls"))) setFile(files);
	};

	const onTargetClick = () => {
		fileInputRef.current.click();
	};

	const EditMember = (id, data) => {
		setModal(data);
	};

	const AddMember = () => {
		setModal(true);
	};

	const onFileSubmit = () => {
		if (!file && !employee_sheet_data.data.length) {
			setFile(false);
			return;
		}
		if (!file && employee_sheet_data.data.length) {
			history.push(`/data-upload/3?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
			return
		}

		const formData = new FormData();
		formData.append("enquiry_id", enquiry_id);
		formData.append("employee_data", file[0]);
		if (employee_sheet_data.data.length) {
			swal({
				title: 'Upload Data',
				text: 'Uploading this data will override previous data',
				icon: 'warning',
				buttons: {
					cancel: "Cancel",
					// 'Append': 'Append Data',
					'Override': 'Upload Data'
				},
				dangerMode: true
			}).then((caseValue) => {
				switch (caseValue) {
					// case 'Append': formData.append("is_override", 0);
					// 	dispatch(uploadSheet(formData))
					// 	break;

					case 'Override': formData.append("is_override", 1);
						dispatch(uploadSheet(formData))
						break;
					default:
				}
			})
		} else {
			dispatch(uploadSheet(formData))

		}

	};

	const onSubmit = (data) => {
		if (data.gstn_doc.length && data.pan_doc.length) {
			const formdata = new FormData();
			formdata.append("step", 17);
			formdata.append("enquiry_id", enquiry_id);
			formdata.append("address", data.address);
			formdata.append("company_legal_name", data.cname);
			formdata.append("gstin_number", data.gst);
			formdata.append("pan_number", data.pan);
			formdata.append("gstn_doc", data.gstn_doc[0]);
			formdata.append("pan_doc", data.pan_doc[0]);
			// let request = {
			// 	step: 17,
			// 	enquiry_id: enquiry_id,
			// 	address: data.address,
			// 	company_legal_name: data.cname,
			// 	gstin_number: data.gst,
			// 	pan_number: data.pan,
			// 	gstin_doc:data.gstn_doc[0],
			// 	pan_doc:data.pan_doc[0]
			// };
			dispatch(saveCompanyData(formdata));
			dispatch(set_company_data({
				address: data.address,
				company_legal_name: data.cname,
				gstin_number: data.gst,
				pan_number: data.pan,
			}));
		}
		else {
			swal("Alert", "Please attach required document", "warning");
		}
	};

	const Info = (
		<Col xl={8} lg={8} md={12} sm={12}>
			<Title className="mb-2" fontSize="1.7rem">Upload your data & validate in minutes!</Title>
			<Title color="#555555" fontSize="1.15rem">
				Easily upload your data & validate if your data is correct in minutes!
			</Title>
			<Col className="p-0" xl={4} lg={4} md={12} sm={12}>
				<BTN
					width={"190px"}
					padding="15px"
					fontSize='1.5rem'
					onClick={() => {
						history.push(`/data-upload/2?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
					}}
				>
					Proceed <i className="fa fa-long-arrow-right" aria-hidden="true" />
				</BTN>
			</Col>
			<Col className="p-0" xl={12} lg={12} md={12} sm={12}>
				<Card className="mt-5 p-3 pr-5 pl-5" noShadow bgColor="#FEF3EB">
					<Title fontSize="1.1rem">Why do we need this?</Title>
					<Title fontSize="0.9rem">
						Insurance pricing is dependent on the age & gender of the members.
						To get the final price, we need your employee details. The data you
						upload is completely secure and private.
					</Title>
				</Card>
			</Col>
		</Col>
	);

	const Upload = (
		<Col xl={8} lg={8} md={12} sm={12}>
			<Title
				color="#687b92"
				fontWeight="500"
				className="d-block"
				fontSize="1rem"
			>
				Upload sheet
			</Title>
			<Title className="mb-2 mt-1" fontSize="1.7rem">Upload XLS or CSV file</Title>
			<br />
			<Title color="#555555" fontSize="1.15rem">
				Upload the list of employees and their dependents. Mandatory fields
				include name, email, date of birth, gender and relationship
			</Title>
			<Col className="p-0" xl={12} lg={12} md={12} sm={12}>
				<FileDrop
					// onFrameDragEnter={(event) => console.warn('onFrameDragEnter', event)}
					// onFrameDragLeave={(event) => console.warn('onFrameDragLeave', event)}
					// onFrameDrop={(event) => console.warn('onFrameDrop', event)}
					// onDragOver={(event) => console.warn('onDragOver', event)}
					// onDragLeave={(event) => console.warn('onDragLeave', event)}
					onDrop={(files, event) => {
						if (files.length && (files[0]?.name.endsWith(".xlsx") || files[0]?.name.endsWith(".xls")))
							setFile(files);
					}}
				>
					<Card
						className="mt-3 p-4 text-center"
						noShadow
						borderRadius="10px"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%2386B4EEFF' stroke-width='3' stroke-dasharray='12' stroke-dashoffset='6' stroke-linecap='square'/%3e%3c/svg%3e")`,
							wordBreak: "break-word",
						}}
						bgColor={(file === false && !employee_sheet_data.data.length) ? "#ffc8c0" : "#F6F9FF"}
					>
						{!!file ? (
							<>
								<img
									className="mx-auto"
									width="80px"
									src="/assets/images/excel_logo.png"
									alt="Your File"
								/>
								<Title
									fontWeight="500"
									color="#555555"
									className="d-block"
									fontSize="1rem"
								>
									{file[0]?.name}
								</Title>
								<Title
									fontWeight="500"
									color="#555555"
									className="d-block"
									fontSize="1rem"
								>
									<span className="browse" onClick={onTargetClick}>
										Browse
									</span>
								</Title>
							</>
						) : (
							<>
								<img
									className="mx-auto"
									width="60px"
									src="/assets/images/RFQ/Group 6577@2x.png"
									alt="Drop File Here"
								/>
								<Title
									fontWeight="500"
									color="#555555"
									className="d-block"
									fontSize="0.8rem"
								>
									Drop your file here.
								</Title>
								<Title
									fontWeight="500"
									color="#555555"
									className="d-block"
									fontSize="1rem"
								>
									or{" "}
									<span className="browse" onClick={onTargetClick}>
										Browse
									</span>
								</Title>
								{!!employee_sheet_data.data.length && <Title
									fontWeight="500"
									color="#009b23"
									className="d-block"
									fontSize="1rem"
								>
									You have already submitted excel sheet before <br /> (Adding excel sheet again will override previous members)
								</Title>}
							</>
						)}
						<input
							onChange={onFileInputChange}
							ref={fileInputRef}
							onClick={(event) => {
								event.target.value = null
							}}
							type="file"
							accept={".xlsx, .xls"}
							className="hidden"
							style={{ display: "none" }}
						/>
					</Card>
				</FileDrop>
				{(file === false && !employee_sheet_data.data.length) && (
					<Title
						className="d-block"
						fontWeight="500"
						color="#ff1717"
						fontSize="1.1rem"
					>
						File Required
					</Title>
				)}
				<Title fontWeight="500" color="#555555" fontSize="0.9rem">
					If you are not sure about the spreadsheet format, you can download a
					template <span className="link" onClick={downloadSample}>here</span>
				</Title>
			</Col>
			<Col className="p-0" xl={4} lg={4} md={12} sm={12}>
				<BTN width={"190px"} padding="15px" fontSize='1.5rem' onClick={onFileSubmit}>
					Proceed <i className="fa fa-long-arrow-right" aria-hidden="true" />
				</BTN>
			</Col>
		</Col>
	);

	const Mapping = (
		<Col xl={12} lg={12} md={12} sm={12}>
			<Title
				color="#687b92"
				fontWeight="500"
				className="d-block"
				fontSize="1rem"
			>
				Map columns
			</Title>
			<Title className="mb-2 mt-1" fontSize="1.7rem">Map the fields in your sheet</Title>
			{employee_sheet_data.data.length ? <>
				<Carousal>
					{MapMember.map(({ title, eventKey, mapName, subTitle }, index) => MappingCard({
						title, subTitle, eventKey, mapName, employee_sheet_data, index
					}))}
				</Carousal>
				{/* <Title fontWeight="500" color="#555555" fontSize="1.3rem">
					Please note that you cannot proceed without mapping with 3 required
					columns: Relationship, Date of birth, Gender
			</Title> */}
				<Col className="p-0 pt-5" xl={3} lg={3} md={12} sm={12}>
					<BTN
						width={"190px"}
						padding="15px"
						fontSize='1.5rem'
						onClick={() => {
							history.push(`/data-upload/4?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
						}}
					>
						Proceed <i className="fa fa-long-arrow-right" aria-hidden="true" />
					</BTN>
				</Col>
			</> : <>
				<Title fontWeight="500" color="#555555" fontSize="1.7rem">
					You haven't uploaded your members, go back & upload excel
				</Title>
				<Col className="p-0 pt-5" xl={3} lg={3} md={12} sm={12}>
					<BTN
						width={"190px"}
						padding="15px"
						fontSize='1.5rem'
						onClick={() => {
							history.push(`/data-upload/2?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
						}}
					>
						Upload Excel <i className="fa fa-long-arrow-right" aria-hidden="true" />
					</BTN>
				</Col>
			</>
			}
		</Col >
	);

	const Confirm = (
		<>
			<Col xl={7} lg={7} md={12} sm={12}>
				<Title
					color="#687b92"
					fontWeight="500"
					className="d-block"
					fontSize="1rem"
				>
					Validate
				</Title>
				<Title className="mb-2 mt-1" fontSize="1.7rem">Confirm the data</Title><br />
				<Title color="#555555" fontSize="1.15rem">
					We have made some corrections to your data. Please confirm the data to
					proceed.
				</Title>
			</Col>
			<Col xl={5} lg={5} md={12} sm={12} className="my-auto">
				{Number(company_data.no_of_employees) > Number(widgets.total_lives) && <BTN
					className="mr-4 mb-4"
					color={'#2a97ed'}
					width={"190px"}
					padding="15px"
					fontSize='1.2rem'
					onClick={AddMember}
				>
					Add member <i className="fa fa-plus" aria-hidden="true" />
				</BTN>}
				<BTN
					width={"190px"}
					padding="15px"
					fontSize='1.2rem'
					onClick={() => {
						if (Number(company_data.suminsured_type_id) === 2 && Number(company_data.premium_type) === 2 ?
							Number(widgets.total_employees) !== Number(company_data.no_of_employees) :
							Number(company_data.no_of_employees) !== Number(widgets.total_lives)) {
							const defaultValue = DefaultValue(company_data, company_data.family_construct)
							swal({
								title: 'No. of Lives Incorrect',
								text: AboutText(company_data, company_data.family_construct?.length) + ' should be ' + defaultValue,
								icon: 'warning',
								buttons: {
									cancel: "Update Member Data",
									// 'Continue': 'Continue Anyway'
								},
								dangerMode: true
							}).then((caseValue) => {
								switch (caseValue) {
									// case "Continue":
									// 	history.push(`/company-detail/5?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
									// 	break;
									default:
								}
							})
							return null
						}
						history.push(`/company-detail/5?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
					}}
				>
					Next <i className="fa fa-long-arrow-right" aria-hidden="true" />
				</BTN>
			</Col>
			<Col xl={12} lg={12} md={12} sm={12} style={{ zoom: '0.85' }} className="d-flex flex-wrap pt-5">
				{widgets.total_lives ? <RFQRelationCard
					margin={"0 1.3rem 1rem"}
					imgSrc="/assets/images/RFQ/Live.png"
					memberCount={widgets.total_lives}
					memeberType="Lives"
				/> : <noscript />}

				{widgets.total_employees ? <RFQRelationCard
					margin={"0 1.3rem 1rem"}
					imgSrc="/assets/images/RFQ/Employee.png"
					memberCount={widgets.total_employees}
					memeberType="Employee"
				/> : <noscript />}

				{widgets.total_spouse ? <RFQRelationCard
					margin={"0 1.3rem 1rem"}
					imgSrc="/assets/images/RFQ/Spouse.png"
					memberCount={widgets.total_spouse}
					memeberType="Spouse"
				/> : <noscript />}

				{widgets.total_children ? <RFQRelationCard
					margin={"0 1.3rem 1rem"}
					imgSrc="/assets/images/RFQ/Children.png"
					memberCount={widgets.total_children}
					memeberType="Children"
				/> : <noscript />}

				{widgets.total_parents ? <RFQRelationCard
					margin={"0 1.3rem 1rem"}
					imgSrc="/assets/images/RFQ/Parent.png"
					memberCount={widgets.total_parents}
					memeberType="Parents"
				/> : <noscript />}

			</Col>
			<Card margin="30px" padding="10px 41px" minWidth="300px" width="100%">
				{members_data?.length ? <DataTable
					columns={MemberColumn}
					data={members_data || []}
					noStatus={true}
					pageState={{ pageIndex: 0, pageSize: 5 }}
					pageSizeOptions={[5, 10, 20, 50]}
					deleteFlag={'custom_delete'}
					removeAction={removeMember}
					// deleteFlag={'rfqMemberDelete'}
					EditFlag
					EditFunc={EditMember}
				/> :
					<NoDataFound />}
			</Card>
		</>
	);

	const CompanyDetails = (
		<Col xl={8} lg={8} md={12} sm={12}>
			<Title className="mb-2 d-block" fontSize="1.7rem">Add company details</Title>
			<Title color="#555555" fontSize="1.15rem">
				Provide you company details for smooth experience
			</Title>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Row className="d-flex flex-wrap mt-5 mb-5">
					<Col md={12} lg={6} xl={5} sm={12} className="mb-3">
						<Input
							name="cname"
							label="Company legal name"
							autoComplete="none"
							id="cname"
							type="text"
							inputRef={register}
							maxLength="50"
							// defaultValue={"Fyntune"}
							error={errors.cname}
							isRequired={true}
							required={false}
						/>
						{!!errors.cname && <Error top="4px">{errors.cname.message}</Error>}
					</Col>

					<Col md={12} lg={6} xl={5} sm={12} className="mb-3">
						<Input
							name="address"
							label="Complete address"
							autoComplete="none"
							type="text"
							id="address"
							maxLength="200"
							inputRef={register}
							// defaultValue={"Akshar Blue Chip IT Park"}
							error={errors.address}
							isRequired={true}
							required={false}
						/>
						{!!errors.address && (
							<Error top="4px">{errors.address.message}</Error>
						)}
					</Col>

					<Col md={12} lg={6} xl={5} sm={12} className="mb-3">
						<Input
							name="gst"
							label="GSTIN number"
							maxLength="15"
							onInput={(e) =>
								(e.target.value = ("" + e.target.value).toUpperCase())
							}
							autoComplete="none"
							type="text"
							id="gst"
							inputRef={register}
							// defaultValue={"18AABCU9603R1ZM"}
							error={errors.gst}
							isRequired={true}
							required={false}
						/>
						{!!errors.gst && <Error top="4px">{errors.gst.message}</Error>}
					</Col>

					<Col md={12} lg={6} xl={5} sm={12} className="mb-3">
						<Input
							name="pan"
							label="PAN number"
							maxLength="10"
							onInput={(e) =>
								(e.target.value = ("" + e.target.value).toUpperCase())
							}
							autoComplete="none"
							type="text"
							id="pan"
							inputRef={register}
							// defaultValue={"AESPF1234F"}
							error={errors.pan}
							isRequired={true}
							required={false}
						/>
						{!!errors.pan && <Error top="4px">{errors.pan.message}</Error>}
					</Col>

					<Col md={12} lg={6} xl={5} sm={12} className="mb-3">
						<div className="p-2">
							<AttachFile2
								fileRegister={register}
								control={control}
								defaultValue={""}
								name="gstn_doc"
								title="Attach GSTN File"
								key="premium_file"
								accept={".jpeg, .png, .jpg, .pdf"}
								description="File Formats: jpeg, png, jpg pdf"
								required
								//resetValue={resetFile}
								nameBox
							/>
							{/* {!!errors?.document_type && <Error>{errors?.document_type?.message}</Error>} */}
						</div>
					</Col>

					<Col md={12} lg={6} xl={5} sm={12} className="mb-3">
						<div className="p-2">
							<AttachFile2
								fileRegister={register}
								control={control}
								defaultValue={""}
								name="pan_doc"
								title="Attach PAN File"
								key="premium_file"
								accept={".jpeg, .png, .jpg, .pdf"}
								description="File Formats: jpeg, png, jpg pdf"
								required
								//resetValue={resetFile}
								nameBox
							/>
							{/* {!!errors?.document_type && <Error>{errors?.document_type?.message}</Error>} */}
						</div>
					</Col>
				</Row>

				<Col className="p-0" xl={4} lg={4} md={12} sm={12}>
					<BTN width={"190px"}
						padding="15px"
						fontSize='1.5rem' type="submit">
						Next <i className="fa fa-long-arrow-right" aria-hidden="true" />
					</BTN>
				</Col>
			</form>
		</Col>
	);

	return (
		<>
			<NavBar noLink logo={logo} />
			<Row className="d-flex justify-content-center p-0 m-0">
				<Col className="mt-4" xl={12} lg={12} md={12} sm={12}>
					<InputForm
						register={register}
						errors={errors}
						prefill={company_data}
						setValue={setValue}
						enquiry_id={encodeURIComponent(enquiry_id)}
						Controller={Controller}
						control={control}
						watch={watch}
					// quotes={quotes}
					// getType={getType}
					// selectedType={type}
					/>
				</Col>
				{Number(company_data?.is_demography) === 1 &&
					<Col xl={8} lg={10} md={10} sm={12}>
						<Card className="px-3 pt-3 pb-2" borderRadius="10px">
							<Stepper>
								<div className="list">
									<button
										type="button"
										className="btn btn-circle btn-lg"
										onClick={() =>
											history.push(`/customize-plan?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
										}
									>
										<i className="fa fa-check" />
									</button>
									<span>Customise your estimate</span>
								</div>
								<div className="list">
									{Number(id) === 5 ? (
										<button type="button" className="btn btn-circle btn-lg">
											<i
												className="fa fa-check"
												onClick={() =>
													history.push(`/data-upload/1?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
												}
											/>
										</button>
									) : (
										<button
											type="button"
											className="btn btn-circle number btn-lg"
										>
											<span className={'numbering'}>2</span>
										</button>
									)}

									<span>Data Upload</span>
								</div>
								<div className="list">
									{/* {done ? (
									<button type="button" className="btn btn-circle btn-lg">
										<i
											className="fa fa-check"
											onClick={() =>
												history.push(`/data-upload/1?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
											}
										/>
									</button>
								) : ( */}
									<button
										type="button"
										className="btn btn-circle number btn-lg"
									>
										<span className={'numbering'}>3</span>
									</button>
									{/* )} */}
									<span>Add Company Details</span>
								</div>
							</Stepper>
						</Card>
					</Col>
				}
			</Row>

			<Wrapper
				bgposition={"top right"}
				bgsize={"1060px"}
				bgimage={"/assets/images/landing-page/bg-2.png"}
			>
				<Row>
					{Number(id) === 1 && Info}
					{Number(id) === 2 && Upload}
					{Number(id) === 3 && Mapping}
					{Number(id) === 4 && Confirm}
					{Number(id) === 5 && CompanyDetails}

					{[1, 2, 5].includes(Number(id)) && (
						<Col xl={4} lg={4} md={12} sm={12}>
							<InfoCard>
								<Title fontSize="1.2rem">What to have ready:</Title>
								<div className="list">
									<button type="button" className="btn btn-circle btn-lg">
										<i className="fa fa-check" />
									</button>
									<span>Employee full name</span>
								</div>
								<div className="list">
									<button type="button" className="btn btn-circle btn-lg">
										<i className="fa fa-check" />
									</button>
									<span>Gender</span>
								</div>
								<div className="list">
									<button type="button" className="btn btn-circle btn-lg">
										<i className="fa fa-check" />
									</button>
									<span>Date of birth</span>
								</div>
								<p>or</p>
								<h4>
									Do you know someone in your team who could add the data?
									Invite them here.
								</h4>
								<Button onClick={() => setInviteTeamModal(true)}>Invite a team member</Button>
							</InfoCard>
						</Col>
					)}
				</Row>
			</Wrapper>
			<Footer noLogin />
			{!!modal && (
				<MemberModal
					dispatch={dispatch}
					show={!!modal}
					onHide={() => setModal(null)}
					Data={modal}
					id={company_data.id}
					relations={industry_data?.relations}
				/>
			)}
			{!!inviteTeamModal && (
				<InviteTeamModal
					dispatch={dispatch}
					show={!!inviteTeamModal}
					onHide={() => setInviteTeamModal(null)}
					// Data={modal}
					id={company_data.id}
				// relations={industry_data?.relations}
				/>
			)}
			{/* {done && <Completed show={done} onHide={() => history.replace('/employer')} />} */}
			{(loading || configDataload || customerDataLoad) && <Loader />}
		</>
	);
};

const MappingCard = ({ title, eventKey, employee_sheet_data, mapName, subTitle, index }) => <Card
	key={index + '-MappingCard'}
	borderRadius="15px"
	className="mx-3 my-4 text-center"
	minWidth="260px"
>
	<button type="button" className="btn btn-circle btn-lg">
		<i className="fa fa-check" />
	</button>
	{/* <Title className="m-4 d-block" fontSize="1.1rem">
		{title}
	</Title> */}
	<Accordion defaultActiveKey={eventKey}>
		<BSCard>
			<Accordion.Toggle as={BSCard.Header} eventKey={eventKey}>
				<span className="accordian-header">{subTitle}</span>
				<ContextAwareToggle eventKey={eventKey} />
			</Accordion.Toggle>
			<Accordion.Collapse eventKey={eventKey}>
				<BSCard.Body>
					{employee_sheet_data?.data?.map((elem, index) =>
						<div key={index + 'sheet-data'} className="list">{(elem[mapName] === 'Self' && mapName === 'relation_name') ? 'Employee' : elem[mapName]}</div>
					)}
					<hr />
					<Title
						color="#687b92"
						className="d-block text-center"
						fontSize="0.7rem"
					>
						and {employee_sheet_data.total_employees - 3} more...
					</Title>
				</BSCard.Body>
			</Accordion.Collapse>
		</BSCard>
	</Accordion>
</Card>

const exportPolicy = (URL) => {
	if (URL) {
		const link = document.createElement('a');
		link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(URL));
		link.href = URL;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
