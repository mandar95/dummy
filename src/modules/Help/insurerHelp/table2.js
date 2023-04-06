import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteInsurerSubQueryType } from "../help.slice";
import InsurerSubQueryModal from './editModal2';

const TableData = (myModule) => [
    {
        Header: "Query Sub Type",
        accessor: "name"
    },
    {
        Header: "Master Query",
        accessor: "master_query"
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
                removeAction={deleteInsurerSubQueryType}
                EditFlag={!!myModule?.canwrite}
                EditFunc={onEdit}
            // deleteFlag={`delete-insurer-sub-query`}
            // editInsurerSubQuery={true}
            />

            {!!editModal &&
                <InsurerSubQueryModal
                    show={!!editModal}
                    id={editModal.id}
                    onHide={() => setEditModal(false)}
                />
            }
        </>
    );
};

export default Table;
