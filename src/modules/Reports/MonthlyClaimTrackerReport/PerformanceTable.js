import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const PolicyPlanPeriod = (props) => {
	const Data = props.Data;
	//headers
	let List = Data?.calender_days?.map((item, index) => {
		return item ? (
			<th key={index + 'policy-period'}>{item ? item[0].toUpperCase() + item.substr(1) : <noscript />}</th>
		) : (
			<noscript key={index + 'policy-period'} />
		);
	});
	//paid Claim row
	let PaidClaim = Object.assign(
		{
			PARTICULAR: "Paid Claims",
		},
		Data?.paid_claim
	);

	let Pending_with_employee = Object.assign(
		{
			PARTICULAR: "Pending with Employee",
		},
		Data?.pending_with_employee
	);

	let Pending_with_Insurer = Object.assign(
		{
			PARTICULAR: "Pending with Insurer",
		},
		Data?.pending_with_insurer
	);

	let Pending_with_TPA = Object.assign(
		{
			PARTICULAR: "Pending with TPA",
		},
		Data?.pending_with_tpa
	);

	let Deficiency_TAT = Object.assign(
		{
			PARTICULAR: "Deficiency TAT",
		},
		Data?.deficiency_tat
	);

	const TableData = [
		PaidClaim,
		Pending_with_employee,
		Pending_with_Insurer,
		Pending_with_TPA,
		Deficiency_TAT,
	];

	// let Rows;
	// if( Data?.calender_days !== null && Data?.calender_days !== undefined ) {
	// let Keys = Object.keys(Data?.calender_days)
	// for (var i = 0; i < Data?.calender_days?.length; i++) {
	//   for (var j = 0; j < TableData?.length; j++){
	//   }
	// }

	const renderTableData = (TableData, index) => {
		const List2 = Data?.calender_days?.map((item, index2) => (
			<th key={index2 + 'policy-period-1'}>{TableData[`${item}`] !== undefined ? TableData[`${item}`] : "-"}</th>
		));
		return (
			<tr key={index + 'policy-period-2'}>
				<th>{TableData.PARTICULAR}</th>
				{List2}
			</tr>
		);
	};

	return (
		<CardBlue title="Performance For The Selected Period">
			<div style={{ marginLeft: "20px", marginRight: "20px" }}>
				<Table striped bordered hover size="xl" responsive>
					<thead style={{ background: "#6334e3", color: "white" }}>
						<tr>
							<th>Particular</th>
							{List}
						</tr>
					</thead>
					<tbody>{TableData.map(renderTableData)}</tbody>
				</Table>
			</div>
		</CardBlue>
	);
};

export default PolicyPlanPeriod;
