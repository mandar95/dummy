import React from "react";
import { Button } from "react-bootstrap";

export const TableData = (
    _renderStatusAction,
    _renderStatesBtn,
    myModule
) => [
        {
            Header: "Zone Name",
            accessor: "name",
        },
        {
            Header: "States",
            disableSortBy: true,
            filter: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const cities = row.values[id];
                    return cities.some(({ state_name }) => String(state_name)
                        .toLowerCase()
                        .includes(String(filterValue).trimStart().toLowerCase()))
                });
            },
            accessor: "state_mapping",
            Cell: _renderStatesBtn
        },
        {
            Header: "Status",
            disableFilters: true,
            disableSortBy: true,
            accessor: "status",
            Cell: _renderStatusAction
        },
        ...((myModule?.canwrite || myModule?.candelete) ? [{
            Header: "Operations",
            accessor: "operations",
        }] : []),
    ];

export const DataTableButtons = () => {
    return {
        _statusBtn: (cell) => {
            return (
                <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value === 1 ? "success" : "secondary"}>
                    {cell?.value ? "Active" : "In Active"}
                </Button>
            );
        },
        _btnGroup: (cell) => {
            return cell.value.map(({ state_name }, index) =>
                <Button key={state_name + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
                    {state_name}
                </Button>)
        }
    }
}
