import React, { useEffect, useState } from "react";
import { Button as Btn } from "react-bootstrap";
import Table from "./table";
import swal from "sweetalert";
// import _ from "lodash";
import AddMember from "./editModal2";
import { CardBlue, Loader } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerProfileData, clear } from '../customerProfile.slice';

const ShowMemberDetails = (props) => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const { editCustomerProfileData, success, error, loading } = useSelector((state) => state.customerProfile);

    useEffect(() => {
        if (success) {
            swal(success, "", "success")
                .then(() => {
                    dispatch(getCustomerProfileData());
                    setShow(false)
                });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    useEffect(() => {
        dispatch(getCustomerProfileData())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            <CardBlue
                title={
                    <div className="d-flex justify-content-between">
                        <span>Team Details</span>
                        <div>
                            <Btn
                                size="sm"
                                onClick={() => {
                                    setShow(true);
                                }}
                                className="shadow-sm m-1 rounded-lg"
                            >
                                <strong>Add Member +</strong>
                            </Btn>
                        </div>
                    </div>
                }>
                <Table data={editCustomerProfileData?.team_details} />
            </CardBlue>
            <AddMember show={show} onHide={() => setShow(false)} />
            {loading && <Loader />}
        </>
    );
};

export default ShowMemberDetails;
