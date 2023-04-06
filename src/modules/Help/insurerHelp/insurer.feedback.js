import React, { useEffect } from 'react';
import Table from "./table4";
import swal from "sweetalert";
// import _ from "lodash";
import { CardBlue, Loader } from "components";
import { useDispatch, useSelector } from "react-redux";
import { getAllInsurerFeedback, clear } from "../help.slice";


export const InsurerFeedback = ({ currentUser, userType }) => {
    const dispatch = useDispatch();
    const { success, error, loading, insurerFeedbackData } = useSelector((state) => state.help);

    useEffect(() => {
        if (currentUser?.ic_id || currentUser?.broker_id)
            dispatch(getAllInsurerFeedback(userType === 'broker' ?
                { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                dispatch(getAllInsurerFeedback(userType === 'broker' ?
                    { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    return (
        <CardBlue
            title={<div className="d-flex justify-content-between">
                <span>Feedback</span>
            </div>}>
            <Table data={insurerFeedbackData} />
            {loading && <Loader />}
        </CardBlue>
    )
}
