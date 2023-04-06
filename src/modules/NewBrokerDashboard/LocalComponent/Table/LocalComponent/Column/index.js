import React from "react";

import style from "../../style.module.css"

const Column = ({ columns = [] }) => {
    return columns?.map((item, index) => (
        <th key={"tableColumn_" + index} className={style.th}>
            {item.Header}
        </th>
    ));
}

export default Column;