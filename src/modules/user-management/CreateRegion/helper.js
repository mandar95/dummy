import React from "react";
import { Button } from "react-bootstrap";

export const TableData = (
    _renderStatusAction,
    _renderCitiesBtn,
    myModule
) => [
        {
            Header: "Region Name",
            accessor: "name",
        },
        {
            Header: "Cities",
            disableSortBy: true,
            filter: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const cities = row.values[id];
                    return cities.some(({ city_name }) => String(city_name)
                        .toLowerCase()
                        .includes(String(filterValue).trimStart().toLowerCase()))
                });
            },
            accessor: "cities",
            Cell: _renderCitiesBtn
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
            return cell.value.map(({ city_name }, index) =>
                <Button key={city_name + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
                    {city_name}
                </Button>)
        }
    }
}
