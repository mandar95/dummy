import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteInsurerQueryType } from "../help.slice";
import InsurerQueryModal from './editModal1';

const TableData = (myModule) => [
    {
        Header: "Query Type",
        accessor: "name"
    },
    ...((myModule?.canwrite || myModule?.candelete) ? [{
        Header: "Operations",
        accessor: "operations",
    }] : [])
];

const Table = ({ data, myModule }) => {

    const [editModal, setEditModal] = useState();

    const onEdit = (id, data) => {
        setEditModal(data);
    };

    return (
        <>
            <DataTable
                columns={TableData(myModule)}
                data={data || []}
                noStatus={true}
                pageState={{ pageIndex: 0, pageSize: 5 }}
                pageSizeOptions={[5, 10]}
                rowStyle
                deleteFlag={!!myModule?.candelete && 'custom_delete'}
                removeAction={deleteInsurerQueryType}
                EditFlag={!!myModule?.canwrite}
                EditFunc={onEdit}
            // deleteFlag={`delete-insurer-query`}
            // editInsurerQuery={true}
            />

            {!!editModal &&
                <InsurerQueryModal
                    show={!!editModal}
                    id={editModal.id}
                    onHide={() => setEditModal(false)}
                />
            }
        </>
    );
};

export default Table;
