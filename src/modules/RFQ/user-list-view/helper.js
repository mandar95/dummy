import React, { Fragment } from "react";
import { Row, Col, Table, Button as Btn } from "react-bootstrap";
import styled from "styled-components";
import _ from "lodash";
import { Button, Head, Text, Typography, Marker, Input, Error, Select } from "components";
import { sortTypeWithTime, _renderDocument } from "../../../components";
import { AttachFile } from "modules/core";
import { insurer } from 'config/validations'
import { noMultipleAdd } from "modules/RFQ/plan-configuration/helper";
// import { useHistory } from "react-router";


const validation = insurer.faq


const CustomStatus = {
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


const _renderStatusAction = (cell) => {
	return (
		<Btn disabled size="sm" className="shadow m-1 rounded-lg" variant={CustomStatus[cell?.value] || "secondary"}>
			{cell?.value || "-"}
		</Btn>
	);
}

const _renderStatusActionDef = (cell) => {
	return (
		<Btn disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value === 'Open' ? "success" : "secondary"}>
			{cell?.value || '-'}
		</Btn>
	);
}

const _renderStatusActionAssigne = (cell) => {
	return (
		<Btn disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value === 0 ? "secondary" : "success"}>
			{cell?.value ? 'Assigned' : 'Removed'}
		</Btn>
	);
}

// const _renderCreatePolicy = ({ row }) => {
// 	const status = row.original.status === 'Won';
// 	const history = useHistory();

// 	const onClick = () => {
// 		history.push(`/onboard-employer?enquiry_id=${row.original.enquiry_id}`);
// 		// history.push(`policy-create/${row.original.enquiry_id}`)
// 	}

// 	return (
// 		<Btn type='button' onClick={onClick} disabled={!status} size="sm" className="shadow m-1 rounded-lg" variant={!status ? "secondary" : "success"}>
// 			{status ? 'Onboard Client & Create Policy' : 'Pending'}
// 		</Btn>
// 	);
// }


export const TableData = (
	_renderActiveHandle,
	myModule
) => [
		{
			Header: "Company Name",
			accessor: "company_name",
		},
		{
			Header: "Industry type",
			accessor: "industry_type_name",
		},
		{
			Header: "Enquiry Id",
			accessor: "enquiry_id",
		},
		{
			Header: "Contact",
			accessor: "contact_no",
		},
		{
			Header: "Email",
			accessor: "work_email",
		},
		{
			Header: "Quote Name",
			accessor: "plan_name",
		},
		{
			Header: "Final Premium",
			accessor: "final_premium",
		},
		{
			Header: "Sum Insured",
			accessor: "sum_insured",
		},
		{
			Header: "Approval Remarks",
			accessor: "remarks",
		},
		{
			Header: "Document",
			accessor: "document",
			disableFilters: true,
			disableSortBy: true,
			Cell: _renderDocument
		},
		...(myModule?.canwrite ? [{
			Header: "Active Handle",
			accessor: "ic_user_bucket",
			Cell: _renderActiveHandle
		}] : []),
		{
			Header: "Created at",
			accessor: "created_at",
			sortType: sortTypeWithTime
		},
		{
			Header: "Status",
			accessor: "status",
			Cell: _renderStatusAction
		},
		// {
		// 	Header: "Create Policy",
		// 	disableFilters: true,
		// 	disableSortBy: true,
		// 	accessor: "create_policy",
		// 	Cell: _renderCreatePolicy
		// },
		{
			Header: "Operations",
			accessor: "operations",
		}
	];

export const customStatus = [
	{ name: "Won", variant: "success" },
	{ name: "Reject", variant: "danger" },
	{ name: "Lost", variant: "secondary" },
	{ name: "Deficiency", variant: "warning" },
	{ name: "Open", variant: "primary" },
	{ name: "Pending For Approval", variant: "warning" },
	{ name: "Pending Approval", variant: "warning" },
	{ name: "Active", variant: "success" },
	{ name: "Approved", variant: "primary" },
];

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
	'indivdual_rate_sheet',
	'has_indivdual',
	'family_floater_rate_sheet',
	'has_family_floater',
	"city_id",
	"state_id",
	"premium_file",
	"suminusred_file",
	"document",
	'display_lead_to_current_user',
	'to_allow_actions',
	'general_config',
	'rfq_leads_id',
	'created_at',
	'is_approve',
	'ic_user_bucket'
];

const exceptions = ["document"];

export const Lister = (obj, keyIndex, ageData) => {
	//getting keys and values
	let keys = !_.isEmpty(obj) ? Object.keys(obj) : [];
	let values = !_.isEmpty(obj) ? Object.values(obj) : [];
	return (
		<div key={'view-' + keyIndex} className="d-flex flex-wrap">
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
						<Fragment key={index + 'lister' + keyIndex}>
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
											<Text style={{ whiteSpace: 'break-spaces' }}>
												{(!!values[index] && values[index].toString()) || "-"}
												{/* {(!!values[index] && values[index].toString()) || "-"} */}
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
											<Button buttonStyle="outline" onClick={() => window.open(values[index])}>
												{keys[index].replace(/_/g, " ").toUpperCase()} <i className="ti-download" />
											</Button>

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
		minHeight: "34px"
	},
	Table: { border: "solid 1px #e6e6e6", background: "#00000000" },
	HeadRow: { background: "#353535", color: "#FFFFFF" },
	TableHead: {
		minWidth: "120px",
	},
	td: {
		color: "#666666"
	}
}

export const ListerRater = ({
	indivdual_rate_sheet, family_floater_rate_sheet,
	has_indivdual, has_family_floater }) => (
	<Row className="d-flex flex-wrap">
		{!!has_indivdual && <>
			<Col md={6} lg={12} xl={6} sm={12} className="">
				<Marker />
				<Typography>{'\u00A0'}Individual Rater</Typography>
				<Button className='d-block mt-3 mb-4' buttonStyle="outline" onClick={() => window.open(indivdual_rate_sheet)}>
					Individual Rater File <i className="ti-download" />
				</Button>
			</Col>
		</>}

		{!!has_family_floater && <>
			<Col md={6} lg={12} xl={6} sm={12} className="">
				<Marker />
				<Typography>{'\u00A0'}Family Rater</Typography>
				<Button className='d-block mt-3 mb-4' buttonStyle="outline" onClick={() => window.open(family_floater_rate_sheet)}>
					Family Rater File <i className="ti-download" />
				</Button>
			</Col>
		</>}
	</Row>
)


export const ListerFamily = (relations, general_flag) => <Table className="text-center" style={style.Table} responsive>
	<thead >
		<tr style={style.HeadRow}>
			<th style={style.TableHead} scope="col">Relation Selected</th>
			{general_flag && relations?.some((person) => person.max_age || person.min_age) &&
				<>
					<th scope="col">Min Age</th>
					<th scope="col">Max Age</th>
				</>}
			<th scope="col">Age Limit</th>

		</tr>
	</thead>
	<tbody>
		{relations?.map((person, index) =>
		(
			<tr key={index + 'relation'}>
				<th scope="row">{person.relation_name}</th>
				{general_flag && <>
					{relations?.some((person) => person.max_age || person.min_age) &&
						<>
							<td>{person.min_age ? `${person.min_age} Yrs` : "-"}</td>
							<td>{person.max_age ? `${person.max_age} Yrs` : "-"}</td>
						</>}
					<td>{person.max_age ? "Yes" : "No"}</td>
				</>}
			</tr>
		))}
	</tbody>
</Table>


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
				{otherProps.view.no_of_employees &&
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
				{/* {otherProps.view?.rfq_selected_plan?.final_premium &&
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
				}
				{otherProps.view?.rfq_selected_plan?.sum_insured &&
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
			{otherProps.view.document &&
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


const DivValue = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
	white-space: pre-wrap;
	word-wrap: break-word;
`;

export const TableDataDef = [
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

export const TableDataDg = [
	{
		Header: "Max Age",
		accessor: "max_age",
	},
	{
		Header: "Min Age",
		accessor: "min_age",
	},
	{
		Header: "Sum Insured",
		accessor: "sum_insured",
	},
	{
		Header: "No. of employees",
		accessor: "no_of_employees",
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

export const TableDataLeadAssigne = [
	{
		Header: "Lead Assignee",
		accessor: "user_name",
	},
	{
		Header: "Role Type",
		accessor: "role_type_name",
	},
	{
		Header: "Created at",
		accessor: "start_date",
	},
	{
		Header: "updated at",
		accessor: "end_date",
	},
	{
		Header: "Status",
		disableFilters: true,
		disableSortBy: true,
		accessor: "status",
		Cell: _renderStatusActionAssigne
	}
]

export const FilterProductData = (quotes) => {
	let features = quotes?.map(({ product_features }) => {
		return product_features;
	});
	let ProcessedFeatures = {};
	let e = [];

	// let PlanArray = [...Array(features.length)];
	(features || []).forEach((elem, index) => {
		elem.forEach((data) => {
			let Plan_ids = [
				...(ProcessedFeatures?.[`${data?.product_feature_id}`]?.plan_ids || []),
			];
			Plan_ids[index] = data?.id;
			if (!e.includes(data?.product_feature_id * 1)) {
				e.push(data?.product_feature_id * 1);
				ProcessedFeatures = {
					...ProcessedFeatures,
					[`${data?.product_feature_id}`]: { ...data, plan_ids: Plan_ids },
				};
			} else {
				ProcessedFeatures = {
					...ProcessedFeatures,
					[`${data?.product_feature_id}`]: {
						...ProcessedFeatures?.[`${data?.product_feature_id}`],
						plan_ids: Plan_ids,
						is_mandantory: ProcessedFeatures?.[`${data?.product_feature_id}`].is_mandantory && data?.is_mandantory,
						product_detail: [
							...ProcessedFeatures?.[`${data?.product_feature_id}`]
								?.product_detail,
							...data?.product_detail,
						],
					},
				};
			}
		});
	});


	let prelistdata = _.map(ProcessedFeatures);

	let unsorted_list = !_.isEmpty(prelistdata) ? [...prelistdata] : [];
	unsorted_list.sort(
		(a, b) => Number(a.order) - Number(b.order)
	);

	prelistdata = unsorted_list;
	const filterData = prelistdata.map(({ product_detail, ...rest }) => {
		const tempFilter = [];

		// let plan_feature_mapping_ids = product_detail.map(
		// 	({ plan_feature_mapping_id }) => plan_feature_mapping_id
		// );

		// plan_feature_mapping_ids = plan_feature_mapping_ids.filter(onlyUnique);

		product_detail.forEach((elem, indexElem) => {
			// if (rest.product_type === 1 || rest.product_type === 5) {
			// 	if (!tempFilter.length) {
			// 		let ids = [];
			// 		ids[rest.plan_ids.indexOf(rest.id)] = elem.id;
			// 		let premiums = [];
			// 		premiums[rest.plan_ids.indexOf(rest.id)] = elem.premium;
			// 		tempFilter.push({ ...elem, premiums: premiums, ids: ids });
			// 	} else {
			// 		tempFilter[0].premiums[
			// 			// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
			// 			rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
			// 		] = elem.premium;

			// 		tempFilter[0].ids[
			// 			// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
			// 			rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
			// 		] = elem.id;
			// 	}
			// } else
			if (!tempFilter.length) {
				let ids = [];
				ids[rest.plan_ids.indexOf(elem.plan_feature_mapping_id)] = elem.id;
				let premiums = [];
				premiums[rest.plan_ids.indexOf(elem.plan_feature_mapping_id)] =
					elem.premium;
				tempFilter.push({ ...elem, premiums: premiums, ids: ids });
			} else {
				let ids = [];
				ids[rest.plan_ids.indexOf(rest.id)] = elem.id;
				let premiums = [];
				premiums[rest.plan_ids.indexOf(rest.id)] = elem.premium;
				tempFilter.forEach((elem1, index) => {
					if (
						((((elem1.duration_value &&
							elem.duration_value) || (elem1.duration_value === 0 &&
								elem.duration_value === 0)) &&
							elem1.duration_value === elem.duration_value &&
							elem1.duration_unit === elem.duration_unit) ||
							(elem1.name && elem.name && elem1.name === elem.name) ||
							(elem1.is_wavied_off &&
								elem.is_wavied_off &&
								elem1.is_wavied_off === elem.is_wavied_off) ||
							rest.product_type === 1 ||
							rest.product_type === 5) &&
						elem1.sum_insured === elem.sum_insured
					) {
						tempFilter[index].premiums[
							// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
							rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
						] = elem.premium;

						tempFilter[index].ids[
							// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
							rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
						] = elem.id;
					} else if (
						!tempFilter.some(
							(elem3) =>
								((((elem3.duration_value &&
									elem.duration_value) || (elem3.duration_value === 0 &&
										elem.duration_value === 0)) &&
									elem3.duration_value === elem.duration_value &&
									elem3.duration_unit === elem.duration_unit) ||
									(elem3.name && elem.name && elem3.name === elem.name) ||
									(elem3.is_wavied_off &&
										elem.is_wavied_off &&
										elem3.is_wavied_off === elem.is_wavied_off) ||
									rest.product_type === 1 ||
									rest.product_type === 5) &&
								elem3.sum_insured === elem.sum_insured
						)
					) {
						let ids = [];
						ids[
							// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
							rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
						] = elem.id;
						let premiums = [];
						premiums[
							// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
							rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
						] = elem.premium;
						tempFilter.push({ ...elem, premiums, ids });
					}
				});
			}
		});
		return { ...rest, product_detail: tempFilter };
	});

	return filterData;
};

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

export const sumInsuredMember = (deductible, sumMemberCount) => {
	if (deductible && sumMemberCount.some(({ sum_insured }) => deductible === sum_insured))
		return sumMemberCount.find(({ sum_insured }) => deductible === sum_insured).no_of_member
	else
		return sumMemberCount.reduce((total, { no_of_member }) => total + no_of_member, 0)
}

export const calculatePremium = ({ quotes, parent, member_details }) => {
	let sumInsureds = member_details.map(({ sum_insured }) => Number(sum_insured));
	sumInsureds = sumInsureds.filter(onlyUnique)
	const sumMemberCount = sumInsureds.map(sumIns => ({
		no_of_member: member_details.reduce((total, { sum_insured, no_of_employees }) => {
			if (Number(sumIns) === Number(sum_insured)) {
				return total + no_of_employees
			}
			else return total
		}, 0),
		sum_insured: sumIns
	}))


	const s_child = _.compact(parent.map(({ child }) => Number(child)));

	const Mapped_Child = _.compact(
		_.compact(parent).map((item) => {
			if (s_child.includes(Number(item?.child))) {
				return item;
			} else {
				return null;
			}
		})
	)
		.map((item) => item?.child_ids)
		.map((item) => item && item.split(","));

	let TempPlanPremiums = []
	quotes.forEach((data, index) => {
		let premiumVal = 0;
		let C_Ids = (Mapped_Child || []).map(
			(item) => !_.isEmpty(item) && item[index]
		);

		data.product_features.forEach(({ id, product_type, product_detail, product_feature_id }) => {
			if (!_.isEmpty(parent[product_feature_id])) {
				if (
					Number(parent[product_feature_id]?.id) ===
					Number(product_feature_id)
				) {

				}
			}

			// const isPresent = Parent_Ids.some(parent_id => Number(parent_id) === id);
			// if (isPresent) {
			const selectedProductDetail = product_detail.find(({ id: childId }) => {
				return C_Ids.some((child_id) => Number(child_id) === childId)
			})
			selectedProductDetail && product_detail.forEach((elem) => {

				if ([1, 5].includes(product_type)) {
					if (selectedProductDetail.sum_insured === elem.sum_insured) {
						C_Ids.push(String(elem.id))
					}
				}
				if (product_type === 2) {
					if (selectedProductDetail.duration_value === elem.duration_value &&
						selectedProductDetail.duration_unit === elem.duration_unit &&
						selectedProductDetail.duration_type === elem.duration_type &&
						selectedProductDetail.sum_insured === elem.sum_insured) {
						C_Ids.push(String(elem.id))
					}
				}
				if (product_type === 3) {
					if (selectedProductDetail.name === elem.name &&
						selectedProductDetail.sum_insured === elem.sum_insured) {
						C_Ids.push(String(elem.id))
					}
				}
			})
		})

		C_Ids = C_Ids.filter(onlyUnique);

		(data?.product_features || []).forEach((elem) => {

			if (!_.isEmpty(parent[elem?.product_feature_id])) {
				if (
					Number(parent[elem?.product_feature_id]?.id) ===
					Number(elem?.product_feature_id)
				) {
					return elem?.product_detail.forEach((item) => {
						if (noMultipleAdd.includes(elem.product_feature_id)) {
							if (
								Number(parent[elem?.product_feature_id]?.id) ===
								Number(elem?.product_feature_id)
							) {
								premiumVal = Number(premiumVal) + (Number(item?.premium) * sumInsuredMember(item.deductible_from, sumMemberCount));
							}
						} else {
							if (
								!_.isEmpty(parent[elem?.product_feature_id].child) &&
								C_Ids.includes(String(item?.id))
							) {
								premiumVal = Number(premiumVal) + (Number(item?.premium) * sumInsuredMember(item.deductible_from, sumMemberCount));
							}
						}
					});
				}
			}
		});
		TempPlanPremiums.push(premiumVal);
	});

	return TempPlanPremiums

}
