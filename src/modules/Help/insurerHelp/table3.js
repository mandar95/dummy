import React, { useState } from "react";
import { sortType, _renderImage } from "../../../components";
import { DataTable } from "../../user-management";
import { _renderStatusAction } from "../component.helper";
import { QueryReplyModal } from 'modules/Help/insurerHelp/editModal5';
import { Button } from 'react-bootstrap';
import { DateFormate } from "../../../utils";

const TableData = (_renderQueryReply, myModule) => [
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
    ...(myModule?.canwrite ? [{
        Header: "Query Reply",
        accessor: "reply",
        disableFilters: true,
        disableSortBy: true,
        Cell: _renderQueryReply
    }] : []),
    {
        Header: "Status",
        disableFilters: true,
        disableSortBy: true,
        accessor: "status",
        Cell: _renderStatusAction
    }
];

const Table = ({ data, myModule }) => {
    const [queryReplyModal, setQueryReplyModal] = useState(false);

    const _renderQueryReply = (cell) => {
        return (cell.row.original.status) ?
            (<Button size="sm" className="shadow m-1 rounded-lg" variant={"primary"} onClick={() => { setQueryReplyModal(cell.row.original) }}>
                Reply
            </Button>)
            : (<Button size="sm" className="shadow m-1 rounded-lg" variant={"secondary"} disabled>
                Resolved
            </Button>)
    };
    return (
        <>
            <DataTable
                columns={TableData(_renderQueryReply, myModule)}
                data={data ? data.map((elem) => ({
                    ...elem,
                    raised_on: DateFormate(elem.raised_on),
                    resolved_on: DateFormate(elem.resolved_on)
                })) : []}
                noStatus={true}
                pageState={{ pageIndex: 0, pageSize: 5 }}
                pageSizeOptions={[5, 10]}
                rowStyle
            // deleteFlag={`delete-insurer-query`}
            // editInsurerQuery={true}
            // queryStatus
            />

            {/* Insurer FAQ Reply Modal */}
            {!!queryReplyModal &&
                <QueryReplyModal
                    id={queryReplyModal.id}
                    replyText={queryReplyModal.reply || ""}
                    show={!!queryReplyModal}
                    onHide={() => setQueryReplyModal(false)}
                />
            }
        </>
    );
};

export default Table;
