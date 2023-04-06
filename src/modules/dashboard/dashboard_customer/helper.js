import React from 'react';
import { Button } from 'react-bootstrap';

const customStatus = {
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
		<Button disabled size="sm" className="shadow m-1 rounded-lg" variant={customStatus[cell?.value] || "success"}>
			{cell?.value || "-"}
		</Button>
	);
}

export const TableSearches = [
	{
		Header: "Company Name",
		accessor: "company_name",
	},
	{
		Header: "Enquiry Id",
		accessor: "enquiry_id",
	},
	{
		Header: "Industry Type",
		accessor: "industry_type_name",
	},
	{
		Header: "No. of employees",
		accessor: "no_of_employees",
	},
	// {
	// 	Header: "State",
	// 	accessor: "state_name",
	// },
	// {
	// 	Header: "City",
	// 	accessor: "city_name",
	// },
	// {
	// 	Header: "Pincode",
	// 	accessor: "pincode",
	// },
	{
		Header: "Email",
		accessor: "work_email",
	},
	{
		Header: "Phone No.",
		accessor: "contact_no",
	},
	{
		Header: "Status",
		disableFilters: true,
		disableSortBy: true,
		accessor: "status",
		Cell: _renderStatusAction
	},

	{
		Header: "Operations",
		accessor: "operations",
	}
];


export const PaymentHistoryColumn = [
	{
		Header: "Plan Name",
		accessor: "plan_name",
	},
	{
		Header: "Sum Insured",
		accessor: "final_suminsured",
	},
	{
		Header: "Premium",
		accessor: "final_premium",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
	{
		Header: "Transaction Number",
		accessor: "transaction_number",
	},
	// {
	// 	Header: "Status",
	// 	disableFilters: true,
	// 	disableSortBy: true,
	// 	accessor: "status",
	// 	// Cell remaining
	// }
];
