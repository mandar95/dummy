import React, { useEffect, useState } from 'react';
import Table from "./table3";
import swal from "sweetalert";
// import _ from "lodash";
import { Button as Btn } from "react-bootstrap";
import { CardBlue, Loader, Card, NoDataFound } from "components";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router";
import { getAllInsurerQuery, clear, getInsOrganizationQuery, getOrganizationQuery, setEmployeeQuery, setEmployeeSubQuery, setEmployeeComments } from "../help.slice";
// import { get } from 'lodash';
import { DataTable } from "../../user-management";
import { AddQuery } from "./AddQueryModal/Modal";
import { QueryComplaintInsurerOrg } from '../helper';
import { DateFormate } from '../../../utils';


export const Queries = ({ currentUser, userType, myModule }) => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const { success, error, loading, insurerQueryData, ins_org_queries_complaint, org_queries_complaint } = useSelector((state) => state.help);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (userType === 'broker') {
            dispatch(getOrganizationQuery())
        }
        else {
            dispatch(getInsOrganizationQuery())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (currentUser?.ic_id || currentUser?.broker_id)
            dispatch(getAllInsurerQuery(userType === 'broker' ?
                { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                dispatch(getAllInsurerQuery(userType === 'broker' ?
                    { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    const title = (
        <div className="d-flex justify-content-between">
            <span>Queries & Complaints</span>
            {/* <div>
                <Btn
                    size="sm"
                    onClick={() => history.push(`/${userType}/query-config`)}
                    className="shadow-sm m-1 rounded-lg"
                >
                    <strong>Add Query +</strong>
                </Btn>
            </div> */}
        </div>
    );

    return (
        <>
            <Card title={<div className="d-flex justify-content-between">
                <span>Organization Queries & Complaints</span>
                {!!myModule?.canwrite && <div>
                    <Btn size="sm" onClick={() => { setShow(true) }} className="shadow-sm m-1 rounded-lg">
                        <strong>Add Query +</strong>
                    </Btn>
                </div>}
            </div>}
            >
                {ins_org_queries_complaint.length || org_queries_complaint.length ?
                    <DataTable
                        columns={QueryComplaintInsurerOrg(true, myModule)}
                        data={ins_org_queries_complaint.length > 0 ? (ins_org_queries_complaint ? ins_org_queries_complaint.map((elem) => ({
                            ...elem,
                            raised_on: DateFormate(elem.raised_on),
                            resolved_on: DateFormate(elem.resolved_on)
                        })) : []) : (org_queries_complaint ? org_queries_complaint.map((elem) => ({
                            ...elem,
                            raised_on: DateFormate(elem.raised_on),
                            resolved_on: DateFormate(elem.resolved_on)
                        })) : [])}
                        noStatus={true}
                        // queryStatus
                        // type={employeeId}
                        rowStyle
                    // isReply
                    /> :
                    <NoDataFound text='No Queries or Complaint Found' />}
            </Card>
            <CardBlue
                title={title}>
                <Table myModule={myModule} data={insurerQueryData} />
            </CardBlue>

            {!!show && <AddQuery
                show={show}
                onHide={() => {
                    setShow(false);
                    dispatch(setEmployeeQuery(''));
                    dispatch(setEmployeeSubQuery(''));
                    dispatch(setEmployeeComments(''));
                }}
                userType={userType}
            />}
            {loading && <Loader />}
        </>
    )
}
