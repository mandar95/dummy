import React, { Fragment } from "react";
import { Row, Col, Table, Button as Btn } from "react-bootstrap";
import styled from "styled-components";
import _ from "lodash";
import { Button, Head, Text, Typography, Marker, Input, Error, Select } from "components";
import { Card } from "../select-plan/style";
import { Vline, CardWrap, Content } from "../plan-configuration/style";
import { _renderDocument } from "../../../components";
import { AttachFile } from "modules/core";

import { insurer } from 'config/validations'

const validation = insurer.faq


/*----------uw view quote---------*/

export const customStatus = {
	"Won": "success",
	"Reject": "danger",
	"Lost": "secondary",
	"Deficiency": "warning",
	"Open": "primary",
	"Pending For Approval": "warning",
	"Pending Approval": "warning",
	"Active": "success",
	"Approved": "primary",
};

/*---x------uw view quote-----x---*/

const _renderStatusActionDef = (cell) => {
	return (
		<Btn disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value === 'Open' ? "success" : "secondary"}>
			{cell?.value || '-'}
		</Btn>
	);
}

/*-----------view quote----------*/
//lister

export const exclude = [
	"id",
	"quote_id",
	"cover_type",
	"industry_id",
	"subindustry_id",
	"policy_sub_type_id",
	"premium_type_id",
	"sum_insured_type_id",
	"industry_subtype_id",
	"industry_type_id",
	"is_fresh_policy",
	"policy_type_id",
	// 'enquiry_id',
	"indivdual_rate_sheet",
	"has_indivdual",
	"family_floater_rate_sheet",
	"has_family_floater",
	"city_id",
	"state_id",
	"premium_file",
	"suminusred_file",
	"document",
	"logo",
	"broker_ic_id",
	// "created_at",
	'status'
];

const exceptions = ["document", "logo"];

export const Lister = (obj, keyIndex, ageData) => {
	//getting keys and values
	let sum = ageData?.reduce((n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)), 0)
	let keys = !_.isEmpty(obj) ? Object.keys(obj) : [];
	let values = !_.isEmpty(obj) ? Object.values(obj) : [];
	return (
		<div key={"view-" + keyIndex} className="d-flex flex-wrap">
			<Row
				xs={1}
				sm={1}
				md={2}
				lg={2}
				xl={3}
				style={{ width: "100%", marginTop: "-10px" }}
				className="d-flex"
			>
				{!_.isEmpty(keys) ? (
					keys.map((item, index) => (
						<Fragment key={index + "lister" + keyIndex}>
							{!!values[`${index}`] &&
								typeof values[`${index}`] !== "object" &&
								!exclude.includes(keys[`${index}`]) && (
									<Col
										sm={12}
										xs={12}
										md={6}
										lg={6}
										xl={4}
										className="py-2 px-0 text-nowrap"
									>
										<>
											<Head>{keys[index].replace(/_/g, " ").toUpperCase()}</Head>
											<Text style={{ whiteSpace: "break-spaces" }}>
												{/* {(!!values[index] && values[index].toString()) || "-"} */}
												{(item === 'sum_insured' && !_.isEmpty(ageData)) ? sum : (!!values[index] && values[index].toString()) || "-"}
											</Text>
										</>
									</Col>
								)}
							{!!values[`${index}`] && exceptions.includes(keys[`${index}`]) && (
								<Col
									sm={12}
									xs={12}
									md={6}
									lg={6}
									xl={4}
									className="py-2 px-0 text-nowrap"
								>
									<DivValue>
										{!!values[index] && typeof values[index] === "string" && (
											<>
												<Head>{keys[index].replace(/_/g, " ").toUpperCase()}</Head>
												<Button
													buttonStyle="outline"
													onClick={() => window.open(values[index])}
												>
													{keys[index].replace(/_/g, " ").toUpperCase()}{" "}
													<i className="ti-download" />
												</Button>
											</>
										)}
									</DivValue>
								</Col>
							)}
						</Fragment>
					))
				) : (
					<p style={{ color: "red" }}>Data not available.</p>
				)}
			</Row>
		</div>
	);
};

const style = {
	PageButton: {
		background: "rgb(222, 142, 240, 0.74)",
		borderRadius: "50%",
		minWidth: "34px",
		minHeight: "34px",
	},
	Table: { border: "solid 1px #e6e6e6", background: "#00000000" },
	HeadRow: { background: "#353535", color: "#FFFFFF" },
	TableHead: {
		minWidth: "120px",
	},
	td: {
		color: "#666666",
	},
};

export const ListerRater = ({
	indivdual_rate_sheet,
	family_floater_rate_sheet,
	has_indivdual,
	has_family_floater,
}) => (
	<Row className="d-flex flex-wrap">
		{!!has_indivdual && (
			<Col md={6} lg={12} xl={6} sm={12} className="">
				<Marker />
				<Typography>{'\u00A0'}Individual Rater</Typography>
				<Button
					className="d-block mt-3 mb-4"
					buttonStyle="outline"
					onClick={() => window.open(indivdual_rate_sheet)}
				>
					Individual Rater File <i className="ti-download" />
				</Button>
			</Col>
		)}

		{!!has_family_floater && (
				<Col md={6} lg={12} xl={6} sm={12} className="">
					<Marker />
					<Typography>{'\u00A0'}Family Rater</Typography>
					<Button
						className="d-block mt-3 mb-4"
						buttonStyle="outline"
						onClick={() => window.open(family_floater_rate_sheet)}
					>
						Family Rater File <i className="ti-download" />
					</Button>
				</Col>
		)}
	</Row>
);

export const ListerFamily = (relations, general_flag) => (
	<Table className="text-center" style={style.Table} responsive>
		<thead>
			<tr style={style.HeadRow}>
				<th style={style.TableHead} scope="col">
					Relation Selected
				</th>
				{general_flag && (
					<>
						{relations?.some((person) => person.max_age || person.min_age) && (
							<>
								<th scope="col">Min Age</th>
								<th scope="col">Max Age</th>
							</>
						)}
						<th scope="col">Age Limit</th>
					</>
				)}
			</tr>
		</thead>
		<tbody>
			{relations?.map((person, index) => (
				<tr key={index + 'relations-5525'}>
					<th scope="row">{person.relation_name}</th>
					{general_flag && (
						<>
							{relations?.some((person) => person.max_age || person.min_age) && (
								<>
									<td>{(person.min_age || person.min_age === 0) ? `${person.min_age} Yrs` : "-"}</td>
									<td>{person.max_age ? `${person.max_age} Yrs` : "-"}</td>
								</>
							)}
							<td>{person.max_age ? "Yes" : "No"}</td>
						</>
					)}
				</tr>
			))}
		</tbody>
	</Table>
);

const DivValue = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
	white-space: pre-wrap;
	word-wrap: break-word;
`;

//RFQ status side card
export const TableData = (customer) => [
	{
		Header: "Deficiency Type",
		accessor: "deficiency_type",
	},
	{
		Header: "Deficiency Sub Type",
		accessor: "deficiency_sub_type",
	},
	{
		Header: "Created at",
		accessor: "deficiency_created_at",
	},
	{
		Header: "Status",
		disableFilters: true,
		disableSortBy: true,
		accessor: "status",
		Cell: _renderStatusActionDef
	},
	{
		Header: "Operations",
		accessor: "operations",
	},
];

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

//side-card
export const RFQStatus = (status, data) => {
	return (
		<Row style={{ marginTop: "-30px" }}>
			<Col xs="12" sm="12" md="12" lg="12" xl="12" className="">
				<H4Tag>RFQ Status</H4Tag>
			</Col>
			<Col
				xs="12"
				sm="12"
				md="12"
				lg="12"
				xl="12"
				className="d-flex justify-content-center"
			>
				<Button buttonStyle="outline-solid" className="mt-3 mb-2" disabled={true}>
					{status || "N/A"}
				</Button>
			</Col>
		</Row>
	);
};

const H4Tag = styled.h4`
	
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
	text-align: center;
`;


//product details features
export const FeaturesFn = ({
	content,
	product_feature_name,
	product_feature_id,
	premium,
	sum_insured,
	is_waived_off,
	no_of_days,
}, index_prop) => {
	let data, type;
	if (sum_insured && premium) {
		const sumIns = sum_insured.split(",");
		const prem = premium.split(",");
		type = "table";
		data = sumIns.map((_, index) => ({
			sumInsured: sumIns[index],
			premium: prem[index],
		}));
	} else if (no_of_days) {
		const noOfDays = no_of_days.split(",");
		if (noOfDays.length === 2) {
			data = { pre: noOfDays[0], post: noOfDays[1] };
			type = "pre_post";
		} else {
			data = {
				deluxe: noOfDays[0],
				shared_ac: noOfDays[1],
				shared_twin: noOfDays[2],
				single_ac: noOfDays[3],
			};
			type = "room_type";
		}
	} else {
		data = Number(is_waived_off) ? true : false;
		type = "waiver";
	}

	return (
		<Col key={index_prop + 'feature'} xl={6} lg={12} md={12} sm={12} className="pr-3 pb-3">
			<Card
				borderRadius="10px"
				minHeight
				boxShadow="1px 1px 14px 5px rgb(142 142 142 / 10%)"
			>
				<Vline />
				<CardWrap>
					<div className="header">
						<h2>{product_feature_name}</h2>
					</div>
					{type === "waiver" && (
						<div className="waiver">
							<span>Waiver</span>
							<span>: &nbsp; &nbsp;{data ? "Yes" : "No"}</span>
						</div>
					)}
					{type === "table" && (
						<Table striped={false} responsive>
							<tr>
								<th>SI:</th>
								<th>Premium</th>
							</tr>
							{Array.isArray(data) &&
								data?.map(({ sumInsured, premium }, index) => (
									<tr key={index + "pre-sum"}>
										<td>{sumInsured}</td>
										<td>{premium}</td>
									</tr>
								))}
						</Table>
					)}
					{type === "room_type" && (
						<div className="pre-post">
							Shared / Twin : <span>{Number(data.shared_twin) || "No Premium"}</span>{" "}
							<br />
							Shared A/C. : <span>{Number(data.shared_ac) || "No Premium"}</span>{" "}
							<br />
							Single A/c : <span>{Number(data.single_ac) || "No Premium"}</span> <br />
							Deluxe : <span>{Number(data.deluxe) || "No Premium"}</span>
						</div>
					)}
					{type === "pre_post" && (
						<div className="pre-post">
							Pre : <span>{data.pre} days</span> <br />
							Post : <span>{data.post} days</span>
						</div>
					)}
				</CardWrap>
				{!!content && <Content>{content}</Content>}
			</Card>
		</Col>
	);
};

/*---x-------view quote------x---*/
export const editDetails = (Controller, hookObj, otherProps) => {
	return (
		<>
			<Row xs={1} sm={2} md={2} lg={2} xl={2}>
				<div className="p-2">
					<Controller
						as={
							<Input
								label="Work Email ID"
								placeholder="Work Email ID"
								required={false}
								isRequired={true}
							/>}
						name="work_email"
						defaultValue={""}
						control={hookObj.control}
						error={hookObj.errors && hookObj.errors.work_email}
					/>
					{!!hookObj.errors?.work_email && <Error className="mt-0">{hookObj.errors?.work_email?.message}</Error>}
				</div>
				<div className="p-2">
					<Controller
						as={<Input
							label="Company Name"
							placeholder="Company Name"
							required={false}
							isRequired={true}
						/>}
						name="company_name"
						defaultValue={""}
						control={hookObj.control}
						error={hookObj.errors && hookObj.errors.company_name}

					/>
					{!!hookObj.errors?.company_name && <Error className="mt-0">{hookObj.errors?.company_name?.message}</Error>}
				</div>
				<div className="p-2">
					<Controller
						as={
							<Input
								label="Pincode"
								placeholder="Pincode"
								type="number"
								required={false}
								isRequired={true}

							/>}
						name="pincode"
						defaultValue={""}
						control={hookObj.control}
						error={hookObj.errors && hookObj.errors.pincode}
					/>
					{!!hookObj.errors?.pincode && <Error className="mt-0">{hookObj.errors?.pincode?.message}</Error>}
				</div>
				<div className="p-2">
					<Controller
						as={
							<Select
								label="State"
								placeholder="State"
								required={false}
								isRequired={true}
								options={[
									{
										id: otherProps.statecity.length && otherProps.statecity[0]?.state_id,
										name: otherProps.statecity.length && otherProps.statecity[0]?.state_name,
										value: otherProps.statecity.length && otherProps.statecity[0]?.state_id,
									},
								]}

							/>}
						defaultValue={""}
						control={hookObj.control}
						name="state_id"
						error={hookObj.errors && hookObj.errors.state_id}
					/>
					{!!hookObj.errors?.state_id && <Error className="mt-0">{hookObj.errors?.state_id?.message}</Error>}
				</div>
				<div className="p-2">
					<Controller
						as={
							<Select
								label="City"
								placeholder="City"
								required={false}
								isRequired={true}
								options={[
									{
										id: otherProps.statecity.length && otherProps.statecity[0]?.city_id,
										name: otherProps.statecity.length && otherProps.statecity[0]?.city_name,
										value: otherProps.statecity.length && otherProps.statecity[0]?.city_id,
									},
								]}
							/>}
						defaultValue={""}
						control={hookObj.control}
						name="city_id"
						error={hookObj.errors && hookObj.errors.city_id}
					/>
					{!!hookObj.errors?.city_id && <Error className="mt-0">{hookObj.errors?.city_id?.message}</Error>}
				</div>
				<div className="p-2">
					<Controller
						as={
							<Input
								label="Contact No"
								placeholder="Contact No"
								required={false}
								isRequired={true}
							/>}
						name="contact_no"
						defaultValue={""}
						control={hookObj.control}
						error={hookObj.errors && hookObj.errors.contact_no}
					/>
					{!!hookObj.errors?.contact_no && <Error className="mt-0">{hookObj.errors?.contact_no?.message}</Error>}
				</div>
				{/* <div className="p-2">
					<Controller
						as={
							<Select
								label="Industry Type"
								placeholder="Industry Type"
								required={false}
								isRequired={true}
								options={
									otherProps.industry_data?.industries?.map((item) => ({
										id: item?.id,
										name: item?.name,
										value: item?.id,
									})) || []
								}
							/>}
						defaultValue={""}
						control={hookObj.control}
						name="industry_type_id"
						error={hookObj.errors && hookObj.errors.industry_type_id}
					/>
					{!!hookObj.errors?.industry_type_id && <Error className="mt-0">{hookObj.errors?.industry_type_id?.message}</Error>}
				</div> */}
				{otherProps.uwSingle.no_of_employees &&
					<div className="p-2">
						<Controller
							as={
								<Input
									label="No Of Employees"
									placeholder="No Of Employees"
									required={false}
									isRequired={true}
								/>}
							defaultValue={""}
							control={hookObj.control}
							name="no_of_employees"
							error={hookObj.errors && hookObj.errors.no_of_employees}
						/>
						{!!hookObj.errors?.no_of_employees && <Error className="mt-0">{hookObj.errors?.no_of_employees?.message}</Error>}
					</div>
				}
				{/* {otherProps.uwSingle?.rfq_selected_plan?.final_premium &&
					<div className="p-2">
						<Controller
							as={
								<Input
									label="Final Premium"
									placeholder="Enter Final Premium"
									required={false}
									isRequired={true}
								/>}
							name="final_premium"
							defaultValue={""}
							control={hookObj.control}
							error={hookObj.errors && hookObj.errors.final_premium}
						/>
						{!!hookObj.errors?.final_premium && <Error className="mt-0">{hookObj.errors?.final_premium?.message}</Error>}
					</div>
				} */}
				{/* {otherProps.uwSingle?.rfq_selected_plan?.sum_insured &&
					<div className="p-2">
						<Controller
							as={
								<Input
									label="Sum Insured"
									placeholder="Enter Sum Insured"
									required={false}
									isRequired={true}
								/>}
							name="sum_insured"
							defaultValue={""}
							control={hookObj.control}
							error={hookObj.errors && hookObj.errors.sum_insured}
						/>
						{!!hookObj.errors?.sum_insured && <Error className="mt-0">{hookObj.errors?.sum_insured?.message}</Error>}
					</div>
				} */}
			</Row>
			{otherProps.uwSingle.document &&
				<Row>
					<Col sm="12" md="12" lg="12" xl="12">
						<AttachFile
							name="document_type"
							title="Attach File"
							key="premium_file"
							{...validation.file}
							control={hookObj.control}
							fileRegister={hookObj.register}
							onUpload={(files) => otherProps.setFile(files[0])}
							nameBox
						// required
						/>
					</Col>
				</Row>
			}
		</>
	)
}
