import React, { useState, useEffect } from "react";
import _ from "lodash";

import Column from "./LocalComponent/Column";
import Row from "./LocalComponent/Row";

import style from "./style.module.css";

const Table = ({ dataFromAPI, columns }) => {
    const [dataFormAPIState, setDataFromAPIState] = useState([]);
    const [currentPageNo, setCurrentPageNo] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (dataFromAPI) {
            setDataFromAPIState(dataFromAPI)
        }
    }, [dataFromAPI]);

    useEffect(() => {
        if (!_.isEmpty(dataFormAPIState)) {
            setData(data => _.chunk(dataFormAPIState, 5))
        }
    }, [dataFormAPIState]);

    const handelPageUp = () => {
        setCurrentPageNo(currentPageNo => currentPageNo + 1);
    }
    const handelPageDown = () => {
        setCurrentPageNo(currentPageNo => currentPageNo - 1);
    }

    return (
        <div className={style.outerContainer}>
            <div className={style.tableContainer}>
                <table className={style.table}>
                    <thead>
                        <tr className={style.trstyle}>
                            <Column columns={columns} />
                        </tr>
                    </thead>
                        <tbody>
                            {data[currentPageNo]?.map((item, index) => {
                                const currentRowData = columns?.map((innerItem, i) => <Row
                                    key={innerItem.accessor + "cell" + i}
                                    innerItem={innerItem}
                                    item={item}
                                />)
                                return <tr key={"list-item" + index}>
                                    {currentRowData}
                                </tr>
                            })}
                        </tbody>
                </table>
            </div>
            {Boolean(data.length > 1) && <div className={style.footer}>
                <span
                    className={currentPageNo <= 0 ? style.disablearrow : style.arrow}
                    onClick={currentPageNo <= 0 ? () => { } : handelPageDown}
                >
                    <i className="fa fa-caret-left" aria-hidden="true"></i>
                </span>
                <span
                    className={style.page}
                >
                    {(currentPageNo + 1) + " of " + data.length}
                </span>
                <span
                    className={(data.length - 1 === currentPageNo || data.length < 1) ? style.disablearrow : style.arrow}
                    onClick={(data.length - 1 === currentPageNo || data.length < 1) ? () => { } : handelPageUp}
                >
                    <i className="fa fa-caret-right" aria-hidden="true"></i>
                </span>
            </div>}
        </div>
    );
}

export default Table;