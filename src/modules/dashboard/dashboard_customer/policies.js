import React, { useEffect } from "react";
import { Card, Loader, NoDataFound, Button } from "components";
import { DataTable } from "modules/user-management";
import { useDispatch, useSelector } from "react-redux";
import { Searches, BoughtPolicies, clear } from "./dashboard_customer.slice";
import { TableSearches as TableData } from "./helper.js";
import { useHistory } from "react-router";
// import swal from "sweetalert";

const Table = ({ type }) => {
	const dispatch = useDispatch();
	const { searches, bought, error, loading } = useSelector((state) => state.CustDash);
	const history = useHistory();

	//load data
	useEffect(() => {
		if (type === "search") {
			dispatch(Searches());
		} else {
			dispatch(BoughtPolicies());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type]);

	//OnError
	useEffect(() => {
		// if (error) {
		// 	swal(error, "", "warning");
		// }
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);



	return !loading ? (
		<Card
			title={<div className="d-flex justify-content-between">
				<span>{type === "search" ? "RFQ Quotes" : "Purchased Policies"}</span>
				{type === "search" && <Button type="button" onClick={() => {
					searches?.length ?
						history.push(`/company-details?enquiry_id=${encodeURIComponent(searches[0].enquiry_id)}`) :
						history.push('/company-details')
				}} buttonStyle="outline-secondary">
					Create Quote
				</Button>}
			</div>}>
			{!!(type === "search" ? searches.length : bought.length) ? <DataTable
				columns={TableData}
				data={type === "search" ? searches : bought || []}
				noStatus={true}
				pageState={{ pageIndex: 0, pageSize: 5 }}
				pageSizeOptions={[5, 10]}
				rowStyle
				viewLink={'quote-view'}
			// customStatus={customStatus}
			/> :
				<NoDataFound text='No Policies Found' />}
		</Card>
	) : <Loader />;
};

export default Table;
