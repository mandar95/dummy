import React from "react";

// import Button from "../../../Button";
import style from "../../style.module.css";

const Row = ({ innerItem, item }) => {
    return (
        !Object.keys(innerItem).includes("cell") ? <td className={style.td}>
            {item[innerItem?.accessor] || "-"}
        </td> : <td className={style.td}>
            {innerItem?.cell(item) || "-"}
        </td>
        // <tbody>
        //     <tr>
        //         <td className={style.td}>Eve</td>
        //         <td className={style.td}>Jackson</td>
        //         <td className={style.td}>
        //             <Button />
        //         </td>
        //         <td className={style.td}>94</td>
        //     </tr>
        //     <tr>
        //         <td className={style.td}>Eve</td>
        //         <td className={style.td}>Jackson</td>
        //         <td className={style.td}>
        //             <Button type="danger" />
        //         </td>
        //         <td className={style.td}>94</td>
        //     </tr>
        //     <tr>
        //         <td className={style.td}>Eve</td>
        //         <td className={style.td}>Jackson</td>
        //         <td className={style.td}>
        //             <Button />
        //         </td>
        //         <td className={style.td}>94</td>
        //     </tr>
        //     <tr>
        //         <td className={style.td}>Eve</td>
        //         <td className={style.td}>Jackson</td>
        //         <td className={style.td}>
        //             <Button />
        //         </td>
        //         <td className={style.td}>94</td>
        //     </tr>
        //     <tr>
        //         <td className={style.td}>Eve</td>
        //         <td className={style.td}>Jackson</td>
        //         <td className={style.td}>
        //             <Button />
        //         </td>
        //         <td className={style.td}>94</td>
        //     </tr>
        // </tbody>
    );
}

export default Row;