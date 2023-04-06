import React from "react";
import { sortType, _renderImage } from "../../../components";
import { DataTable } from "../../user-management";
import { Button } from 'react-bootstrap';
import { DateFormate } from "../../../utils";
// import { _renderStatusAction } from "../component.helper";

const _renderStatusAction = (cell) => {
    return (
        <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value ? "success" : "secondary"}>
            {cell?.value ? "Active" : "Closed"}
        </Button>
    );
}


const TableData = [
    {
        Header: "Query ID",
        accessor: "query_id"
    },
    {
        Header: "Query Type",
        accessor: "query_type"
    },
    {
        Header: "Subtype",
        accessor: "query_sub_type"
    },
    {
        Header: "Comments",
        accessor: "comments"
    },
    {
        Header: "Image",
        accessor: "document",
        Cell: _renderImage,
        disableFilters: true,
        disableSortBy: true,
    },
    {
        Header: "Raised On",
        accessor: "raised_on",
        sortType: sortType
    },
    {
        Header: "Resolution",
        accessor: "resolution"
    },
    {
        Header: "Resolution TAT",
        accessor: "resolution_tat"
    },
    {
        Header: "Resolved On",
        accessor: "resolved_on",
        sortType: sortType
    },
    // {
    //     Header: "Reply",
    //     accessor: "reply",
    // disableFilters: true,
    // disableSortBy: true,
    // },
    {
        Header: "Status",
        disableFilters: true,
        disableSortBy: true,
        accessor: "status",
        Cell: _renderStatusAction
    }
];

const Table = ({ data }) => {
    return (
        <DataTable
            columns={TableData}
            data={data ? data.map((elem) => ({
                ...elem,
                raised_on: DateFormate(elem.raised_on),
                resolved_on: DateFormate(elem.resolved_on)
            })) : []}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
        // queryStatus
        // deleteFlag={`delete-customer-document`}
        // editCustomerDoc={true}
        />
    );
};

export default Table;
