import { _checkAlowed } from "../../../components";

export const TableData = [
	{
		Header: "Step",
		accessor: "step",
	},
	{
		Header: "User type name",
		accessor: "ic_user_type_name",
	},
	{
		Header: "Can approve",
		accessor: "can_approve",
		Cell: _checkAlowed,
		disableFilters: true,
		disableSortBy: true,
	},
	{
		Header: "Can raise deficiency",
		accessor: "can_raise_deficiency",
		Cell: _checkAlowed,
		disableFilters: true,
		disableSortBy: true,
	},
	{
		Header: "Can reject",
		accessor: "can_reject",
		Cell: _checkAlowed,
		disableFilters: true,
		disableSortBy: true,
	},
	{
		Header: "Pass Handle To",
		accessor: "pass_to_next_user_type_name",
	},
];
