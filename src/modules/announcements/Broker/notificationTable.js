import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "../../user-management";
import { useParams } from 'react-router-dom';
import {
    deleteNotification,
    getNotification,
} from "../announcement.slice";
import { _renderAIStatus } from "../../../components";
import { DateFormate } from "../../../utils";


const _renderConditionalText = (cell) => {
    let _actionUrl = cell.row.original.action_url
    return _actionUrl && _actionUrl !== "undefined" ? _actionUrl : cell?.value || "-";
}

const notificationModal = (myModule) => [
    {
        Header: "Notification Type",
        accessor: "notification_type_name",
    },
    {
        Header: "Action Type",
        accessor: "action_type_name"
    },
    {
        Header: "Title",
        accessor: "title",
    },
    {
        Header: "Content",
        accessor: "content"
    },
    {
        Header: "Link",
        accessor: "link",
        Cell: _renderConditionalText
    },
    // {
    //     Header: "Color",
    //     accessor: "color"
    // },
    // {
    //     Header: "Time to live",
    //     accessor: "time_to_live"
    // },
    {
        Header: "Start Date",
        accessor: "start_date"
    },
    {
        Header: "End Date",
        accessor: "end_date"
    },
    {
        Header: "Status",
        disableFilters: true,
        disableSortBy: true,
        accessor: "status",
        Cell: _renderAIStatus
    },
    ...((myModule?.canwrite || myModule?.candelete) ? [{
        Header: "Operations",
        accessor: "operations",
    }] : []),
]


const Table = ({ myModule }) => {
    const dispatch = useDispatch();
    const { userType } = useParams();

    //selectors
    const { NotificationDetails } = useSelector(state => state.announcement);


    //api calls ------------------------------------------
    useEffect(() => {
        dispatch(getNotification());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //----------------------------------------------------


    return (
        <DataTable
            columns={notificationModal(myModule)}
            data={NotificationDetails ? NotificationDetails.map((elem) => ({
                ...elem,
                start_date: DateFormate(elem.start_date),
                end_date: DateFormate(elem.end_date)
            })) : []}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            editLink={!!myModule?.canwrite && `/${userType}/edit-notification`}
            deleteFlag={!!myModule?.candelete && 'custom_delete'}
            removeAction={deleteNotification}
            // deleteFlag={'notificationDelete'}
            rowStyle
        />
    );
};

export default Table;
