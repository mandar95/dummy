import React, { useEffect } from "react";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import {
    memberSync,
    clear
} from "../wellness/wellness.slice"

const WellnessHeaps = () => {

    const dispatch = useDispatch();
    const { memberSyncData, error } = useSelector((state) => state.wellness);
    const { userType } = useSelector(state => state.login);

    useEffect(() => {
        if (userType) {
            dispatch(memberSync({
                wellness_partner_id: 1,
                user_type_name: userType,
                // policy_id: 124,
                // // broker_id: 1
            }));
        }
        //eslint-disable-next-line
    }, [userType]);

    useEffect(() => {
        if (error) {
            swal(error, "", "warning");
        }
        return () => {
            dispatch(clear());
        };
        //eslint-disable-next-line
    }, [error]);

    // const handleScroll = () => {
    //     // window.scrollTo(0, 0);
    // }
    // useEffect(() => {
    //     if (memberSyncData?.url) {
    //         var iframe = document.getElementById("myFrame");
    //         var elmnt = iframe.contentWindow.document.getElementsByTagName("button")[0];
    //         elmnt.style.display = "none";
    //     }

    // }, [memberSyncData?.url])

    //window.addEventListener('scroll', handleScroll)
    return (
        <div>
            <iframe id="myFrame" title="myFrame" src={memberSyncData?.url} style={{
                width: '100%',
                border: 'none',
                height: '100vh',
            }} />
        </div>
    );
}

export default WellnessHeaps;
