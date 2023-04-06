import React from "react";
import { DataTable } from "modules/user-management";
import { useParams } from 'react-router-dom';


const TableData = [
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Type",
        accessor: "type",
    },
    {
        Header: "Declaration Count",
        accessor: "count",
    },
    {
        Header: "Operations",
        accessor: "operations",
    },
];

const Table = ({ data, onEdit }) => {
    const { userType } = useParams();
    return (
        <DataTable
            columns={TableData}
            data={data || []}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
            // deleteFlag={`delete-insurer-declration`}
            // editDeclaration={true}
            // EditFlag={true}
            // EditFunc={onEdit}
            editLink={`/${userType}/edit-Declaration`}
        />
    );
};

export default Table;
