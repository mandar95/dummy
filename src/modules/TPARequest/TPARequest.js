import React from "react";
import { useSelector } from "react-redux";
import BulkMember from "./memberUpload"
import { useParams } from 'react-router-dom';

const TPARequest = ({ myModule }) => {
    const { userType } = useParams();
    const response = useSelector((state) => state.login);

    return ['admin', 'broker'].includes(userType) && (
        <BulkMember
            brokerId={response?.currentUser?.broker_id}
            userType={userType}
            myModule={myModule}
        />
    )
};

export default TPARequest;
