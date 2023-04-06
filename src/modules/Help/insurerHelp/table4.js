import React from "react";
import { _renderRatings } from "../../../components";
import { DataTable } from "../../user-management";

const TableData = [
    {
        Header: "Customers",
        accessor: "name",
    },
    {
        Header: "Feedback",
        accessor: "feedback",
    },
    {
        Header: "Ratings",
        accessor: "ratings",
        Cell: _renderRatings,
        disableFilters: true,
        disableSortBy: true,
    }
];

const Table = ({ data }) => {
    return (
        <DataTable
            columns={TableData}
            data={data || []}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
        // deleteFlag={`delete-insurer-query`}
        // editInsurerQuery={true}
        // queryStatus
        />
    );
};

export default Table;
