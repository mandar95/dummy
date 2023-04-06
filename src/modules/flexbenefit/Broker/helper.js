import React from "react";
// import { _colorCode } from "../../components";
import { Button } from "react-bootstrap";
import { sortTypeWithTime } from "../../../components";
// import { deleteTATQuery } from "./TATConfig.slice"


export const DataTableButtons = {

    _statusBtn: ({ value }) => {
        return (
            <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={value === 'Active' ? "success" : "secondary"}>
                {value}
            </Button>
        );
    },
    _flexAllocationType: ({ value }) => {
        return (
            <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={value === 'Monthly' ? "primary" : "warning"}>
                {value}
            </Button>
        );
    },
    _FlexType: ({ value }) => {
        return (
            <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={"info"}>
                {value}
            </Button>
        );
    },
    _Image: ({ value }) => {
        if (value) return <a style={{ textDecoration: "none" }} href={value || "#"} target="_blank" rel="noopener noreferrer"><img width='50px' src={value} alt='logo' /></a>
        else return "-"
    }

}

export const TableData = [
    {
        Header: "Benefit Name",
        accessor: "name",
    },
    {
        Header: "Benefit Code",
        accessor: "code"
    },
    {
        Header: "Benefit Description",
        accessor: "description",
    },
    {
        Header: "Image",
        accessor: "image",
        disableFilters: true,
        Cell: DataTableButtons._Image
    },
    {
        Header: "Benefit Allocation Type",
        accessor: "flex_allocation_type",
        Cell: DataTableButtons._flexAllocationType
    },
    {
        Header: "Benefit Type",
        accessor: "wellness_type",
        Cell: DataTableButtons._FlexType
    },
    {
        Header: "Created At",
        accessor: "created_at",
        sortType: sortTypeWithTime

    },
    {
        Header: "Updated At",
        accessor: "updated_at",
        sortType: sortTypeWithTime

    },
    {
        Header: "Status",
        disableFilters: true,
        disableSortBy: true,
        accessor: "status",
        Cell: DataTableButtons._statusBtn
    },
    {
        Header: "Operations",
        accessor: "operations",
    },
];
