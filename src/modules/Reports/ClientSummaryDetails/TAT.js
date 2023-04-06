import React from "react";
import { CardBlue } from "../../../components";
import Table from "react-bootstrap/Table";
// import _ from "lodash";

const PolicyPlanPeriod = (props) => {
	const Data = props.Data;
	// header list
	const List = Data?.calender_days.map((item, index) => (
		<th key={index + 'th-calendar'}>{item ? item[0].toUpperCase() + item.substr(1) : <noscript />}</th>
	));

	//INTERNAL_PROCESSING row
	let InternalProcessing = Object.assign(
		{
			CALENDAR_DAYS: "Internal Processing",
		},
		Data?.Internal_processing
	);

	//External processing row

	let ExternalProcessing = Object.assign(
		{
			CALENDAR_DAYS: "External Processing",
		},
		Data?.External_Processing
	);

	let OverallProcessing = Object.assign(
		{
			CALENDAR_DAYS: "Overall TAT",
		},
		Data?.Overall_Proceesing
	);
	const TableData = [InternalProcessing, ExternalProcessing, OverallProcessing];

	const renderTableData = (TableData, index) => {
		const List2 = Data?.calender_days?.map((item, index2) => (
			<th key={index2 + 'calendar-days2'}>
				{TableData[`${item}`] !== undefined
					? String(TableData[`${item}`]).includes('.')
						? TableData[`${item}`].toFixed(2)
						: TableData[`${item}`]
					: "-"}
			</th>
		));
		return (
			<tr key={index + 'calendar-days1'}>
				<th>{TableData.CALENDAR_DAYS}</th>
				{List2}
			</tr>
		);
	};
	return (
		<CardBlue title="TAT Report">
			<div style={{ marginLeft: "20px", marginRight: "20px" }}>
				<Table striped bordered hover size="xl" responsive>
					<thead style={{ background: "#6334e3", color: "white" }}>
						<tr>
							<th>Calender days</th>
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
