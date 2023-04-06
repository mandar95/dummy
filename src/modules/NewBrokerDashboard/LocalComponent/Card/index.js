import React from "react";
import styled from "styled-components";

import style from "./style.module.css";

const BlueBox = styled.div`
    border-radius: 30px;
    width: 10px;
    height: 30px;
    /* background-color: ${({ theme }) => (theme.Card?.color || '#f2c9fb')}; */
    background-color: ${({ theme }) => (theme.CardBlue?.color || '#6334e3')};
`;

const Card = ({
    children, filterOptions, cardTitle, shadow = true, headerBorder = true,
    isOnClickFilter = false, filterFuntion
}) => {
    return <div className={shadow ? style.container : style.containerWithoutShadow}>
        <div className={headerBorder ? style.header : style.headerWithoutBorder}>
            <div className={style.titleBox}>
                <BlueBox></BlueBox>
                <div>
                    <p className={style.title}>{cardTitle}</p>
                </div>
            </div>
            {!!filterOptions?.length && <div className={style.filterIconBox}>
                <img className={style.filterIcon} src="/assets/images/newbrokerdashboard/filter.png" alt="" />
                <div className={style.filterDropDown}>
                    {filterOptions?.map((item, index) => {
                        return <p
                            key={"filteroptions" + index}
                            onClick={item.handleOnClick.bind(null, item.id)}
                            className={style.filterOptionText}
                        >
                            {item.text}
                        </p>
                    })}
                </div>
            </div>}
            {isOnClickFilter && <div onClick={filterFuntion} className={style.filterIconBox}>
                <img className={style.filterIcon} src="/assets/images/newbrokerdashboard/filter.png" alt="" />
            </div>}
        </div>
        <div className={style.body}>
            {children}
        </div>
    </div>
}

export default Card;