import React from "react";
import { DataTable } from "modules/user-management";
import _ from "lodash";
// import { Button } from "react-bootstrap";

const Topup = ({ topup, showTopupPolicyName }) => {

	return (
		<>
			{!_.isEmpty(topup) ? (
				<DataTable
					columns={TableData(showTopupPolicyName)}
					data={!_.isEmpty(topup) ? topup.filter(({ top_up_added }) => top_up_added) : []}
					noStatus={true}
					pageState={{ pageIndex: 0, pageSize: 5 }}
					pageSizeOptions={[5, 10]}
					rowStyle={true}
				/>
			) : (
				<h3
					className="text-center display-4 text-secondary"
					style={{ marginTop: "-10px" }}
				>
					No Top Up Cover for This Policy
				</h3>
			)}
		</>
	);
};

export default Topup;

// const _renderDeductionType = ({ row }) => (
// 	<Button
// 		size="sm"
// 		variant={(row.original.has_flex || row.original.has_payroll) ? 'primary' : 'secondary'}>
// 		{row.original.has_flex ? 'Flex' : (row.original.has_payroll ? 'Payroll' : 'Payroll')}
// 	</Button>
// )

const _renderCoverType = ({ row }) => (
	<span>
		{Boolean(row.original.main_suminsured_type_id === 1) ? 'Individual' : 'Floater'}
	</span>
)


const TableData = (showTopupPolicyName) => [
	// {
	// 	Header: "Premium Type",
	// 	accessor: "premium_type",
	// },
	{
		Header: "Cover Type",
		accessor: "main_suminsured_type_id",
		Cell: _renderCoverType
	},
	...!showTopupPolicyName ? [{
		Header: "Policy sub type",
		accessor: "policy_sub_type_name",
	}] : [],
	{
		Header: "Premium",
		accessor: "top_up_premium",
	},
	{
		Header: "Sum Insured",
		accessor: "top_up_suminsured",
	},
	// {
	// 	Header: "Deduction From",
	// 	accessor: "has_flex",
	// 	Cell: _renderDeductionType
	// },
	// {
	// 	Header: "Has Flex",
	// 	accessor: "has_flex",
	// 	Cell: _renderFlex
	// },
	// {
	// 	Header: "Has Payroll",
	// 	accessor: "has_payroll",
	// 	Cell: _renderFlex
	// },
];
