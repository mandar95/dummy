import React from "react";
import { DataTable } from "modules/user-management";
import _ from "lodash";
import { DateFormate } from "../../../utils";

const TableData = (guardian) => [
	{
		Header: "First Name",
		accessor: "nominee_fname",
	},
	{
		Header: "Last Name",
		accessor: "nominee_lname",
	},
	{
		Header: "Date of birth",
		accessor: "nominee_dob",
	},
	{
		Header: "Relation Name",
		accessor: "nominee_relation",
	},
	{
		Header: "Share %",
		accessor: "share_per",
	},
	...(guardian ? [{
		Header: "Guardian First Name",
		accessor: "guardian_fname",
	},
	{
		Header: "Guardian Last Name",
		accessor: "guardian_lname",
	},
	{
		Header: "Guardian DOB",
		accessor: "guardian_dob",
	},
	{
		Header: "Guardian Relation",
		accessor: "guardian_relation",
	}] : []),
];

const Nominee = ({ nominees }) => {

	return !_.isEmpty(nominees) ? (
		<DataTable
			columns={TableData(nominees.some((elem) => elem.guardian_fname))}
			data={!_.isEmpty(nominees) ? nominees.map((elem) => ({
				...elem,
				nominee_dob: DateFormate(elem.nominee_dob),
				...(elem.guardian_fname && {
					guardian_dob: DateFormate(elem.guardian_dob)
				})
			})) : []}
			noStatus={true}
			pageState={{ pageIndex: 0, pageSize: 5 }}
			pageSizeOptions={[5, 10]}
			rowStyle={true}
		/>
	) : <h3
		className="text-center display-4 text-secondary"
		style={{ marginTop: "-10px" }}
	>
		No Nominee for This Policy
	</h3>;
};

export default Nominee;
