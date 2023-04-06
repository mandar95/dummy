import React from "react";

import style from "./button.module.css";

const Button = ({ type = "success" }) => {
    return (
        // <div className={type === "success" ? style.buttonSuccess : style.buttonDanger}>
        //     <p className={type === "success" ? style.pSuccess : style.pDanger}>
        //         {type === "success" ? "Approved" : type === "pending" ? "Pending" : "Rejected"}
        //     </p>
        // </div>
        <div className={style.buttonSuccess}>
            <p className={style.pSuccess}>
                {type}
            </p>
        </div>
    );
}

export default Button;