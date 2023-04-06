import React, { useState, useEffect } from 'react';
import { DataTable } from '../../user-management';
import { Card, NoDataFound, sortType, _renderDocument } from '../../../components';
import { Button as Btn } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { getEmpOrganizationQuery, setEmployeeComments, setEmployeeQuery, setEmployeeSubQuery } from "../help.slice";
import { AddQuery } from "./Modal";
import { QueryComplaintEmployerOrg } from '../helper';
import { RenderReply, _renderStatusAction } from '../component.helper';
import { DateFormate } from '../../../utils';

export const Queries = ({ data, myModule }) => {
    const dispatch = useDispatch();
    const { emp_org_queries_complaint } = useSelector((state) => state.help);
    const [show, setShow] = useState(false);
    const { currentUser } = useSelector(state => state.login);


    useEffect(() => {
        if (currentUser.employer_id)
            dispatch(getEmpOrganizationQuery(currentUser.is_super_hr))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    return (
        <>
            <Card title={
                <div className="d-flex justify-content-between">
                    <span>Organization Queries & Complaints</span>
                    <div>
                        <Btn size="sm" onClick={() => { setShow(true) }} className="shadow-sm m-1 rounded-lg">
                            <strong>Register Query +</strong>
                        </Btn>
                    </div>
                </div>
            }
            >
                {emp_org_queries_complaint.length ?
                    <DataTable
                        columns={QueryComplaintEmployerOrg(myModule?.canwrite ? true : false, true)}
                        data={emp_org_queries_complaint ? emp_org_queries_complaint.map((elem) => ({
                            ...elem,
                            raised_on: DateFormate(elem.raised_on),
                            resolved_on: DateFormate(elem.resolved_on)
                        })) : []}
                        noStatus={true}
                        // queryStatus
                        // type={employeeId}
                        rowStyle
                    // isReply
                    /> :
                    <NoDataFound text='No Queries or Complaint Found' />}
            </Card>
            <Card title={<div>Employee Queries & Complaints</div>}>
                <DataTable
                    columns={EmployerQCsModel((myModule?.canwrite ? true : false))}
                    data={data ? data.map((elem) => ({
                        ...elem,
                        raised_on: DateFormate(elem.raised_on),
                        resolved_on: DateFormate(elem.resolved_on)
                    })) : []}
                    noStatus={true}
                    // queryStatus
                    pageState={{ pageIndex: 0, pageSize: 5 }}
                    pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                    rowStyle
                />
            </Card>
            {!!show && <AddQuery
                show={show}
                onHide={() => {
                    setShow(false);
                    dispatch(setEmployeeQuery(''));
                    dispatch(setEmployeeSubQuery(''));
                    dispatch(setEmployeeComments(''));
                }}
            />}
        </>
    )
}

const EmployerQCsModel = (write) => [{
    Header: "Query",
    accessor: "query_id",
},
{
    Header: "Query Type",
    accessor: "query_type",
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
    Header: "Document",
    accessor: "document",
    Cell: _renderDocument
},
{
    Header: "Raised To",
    accessor: "raise_to",
    className: "text-nowrap",
},
{
    Header: "Raised On",
    accessor: "raised_on",
    sortType: sortType
},
{
    Header: "Raised By",
    accessor: "raised_by"
},
{
    Header: "Resolution",
    accessor: "resolution"
},
{
    Header: "Resolved On",
    accessor: "resolved_on",
    sortType: sortType
},
...(write ? [{
    Header: "Reply",
    accessor: "resolve",
    disableFilters: true,
    disableSortBy: true,
    Cell: RenderReply
}] : []),
{
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderStatusAction
},
// {
//     Header: "Document",
//     accessor: "document",
// Cell: _renderDocument
// disableFilters: true,
// disableSortBy: true,
// },
{
    Header: "Resolution TAT",
    accessor: "resolution_tat"
},
]
