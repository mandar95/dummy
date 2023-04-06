import React from "react";

// import DeclrationConfig from "./declaration";
import AdminDeclrationConfig from "./admin/declaration";
import DeclrationCard from "./declarationCard";
import { useParams } from "react-router";
import { useSelector } from "react-redux";


const Declaration = () => {
    const { currentUser } = useSelector((state) => state.login);

    let { userType } = useParams();
    switch (userType) {
        case "admin":
            return <AdminDeclrationConfig />
        // case "insurer":
        //     return <DeclrationConfig Type={userType} IC_id={currentUser?.ic_id} />
        // case "broker":
        //     return <DeclrationConfig Type={userType} IC_id={currentUser?.broker_id} />
        case "insurer":
            return <DeclrationCard Type={userType} IC_id={currentUser?.ic_id} Name={currentUser?.ic_name ? currentUser.ic_name : currentUser.broker_name} />
        case "broker":
            return <DeclrationCard Type={userType} IC_id={currentUser?.broker_id} Name={currentUser?.ic_name ? currentUser.ic_name : currentUser.broker_name} />
        default:
            return <div>404 Page Not Found</div>
    }
}

export default Declaration;
