import React from "react";
import { DataTable } from "../user-management";
import { removeNominee } from "./addMember.slice";
// import _ from "lodash";

const TableData = (flag) => [
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
		Header: "Nominee Relation",
		accessor: "nominee_relation",
	},
	{
		Header: 'Share %',
		accessor: "share_per"
	}, ...(flag ? [{
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
		Header: "Guardian Relation with Nominee",
		accessor: "guardian_relation",
	}] : []),
	{
		Header: "Operations",
		accessor: "operations",
	},
];

const Table = ({ data }) => {
	// const deleteFlag = "nominee";

	return (
		<DataTable
			columns={data ? TableData(data.some(({ guardian_fname }) => guardian_fname)) : []}
			data={data || []}
			noStatus={true}
			pageState={{ pageIndex: 0, pageSize: 5 }}
			pageSizeOptions={[5, 10]}
			rowStyle
			deleteFlag={'custom_delete'}
			removeAction={removeNominee}
		/>
	);
};

export default Table;
