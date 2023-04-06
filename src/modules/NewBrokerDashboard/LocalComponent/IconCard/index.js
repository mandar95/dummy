import React from "react";
import { OverlayTrigger } from "react-bootstrap";

import style from "./style.module.css";

// const BackgroundColor = (bgc) => {
//     if (bgc === "yellow")
//         return style.bgYellow;
//     else if (bgc === "skyblue")
//         return style.bgSkyblue;
//     else if (bgc === "purple")
//         return style.bgPurple;
//     else if (bgc === "darkpink")
//         return style.bgDarkpink;
//     else if (bgc === "green")
//         return style.bgGreen;
//     else
//         return "";
// }
const renderTooltip = (props, data) => (
    <div
        id="button-tooltip"
        {...props}
        className={`bg-light p-3 rounded-lg shadow-lg ${style.divWidth}`}
    >
        {data}
    </div>
);

const RenderCard = (cardtype = 1, icon, text, boldText, bgc,
    img, Hex1, Hex2, corporateName, enrolmentEndDate,
    enrolmentProgressStatus, policyNumber, policyName, userTypeName, lossRatio, lives, cover, premium
) => {
    if (cardtype === 1) {
        // top card with left image right text
        return <div className={style.cardBody}>
            <div
                style={{
                    background: `linear-gradient(to bottom, ${Hex1} 0%, ${Hex2} 52%)`,
                    borderRadius: "50%",
                    padding: "5px",
                }}>
                <img className={style.icon} src={img} alt="" />
            </div>
            <div className={style.textBox}>
                <p className={style.text}>
                    {["Active Employee Lives", "Active Dependent Lives"].includes(text) ? text?.slice(0, 16) : text}
                </p>
                <p className={style.title}>{boldText}</p>
            </div>
        </div>
    } else if (cardtype === 2) {
        // enrolment in progress card
        return <div className={style.cardBodytype2}>
            <div className={style.textBoxtype2}>
                {(!!corporateName || !!policyName) && <p className={style.texttype2}>
                    {userTypeName === "Employer" ? `Policy Name: ${policyName}` : `Corporate Name: ${corporateName}`}
                </p>}
                {(!!enrolmentEndDate || !!policyNumber) && <p className={style.titletype2}>
                    {userTypeName === "Employer" ? `Policy Number: ${policyNumber}` : `Enrolment End Date: ${enrolmentEndDate}`}
                </p>}
            </div>
            {!!enrolmentProgressStatus && <div className={style.iconBoxtype2}>
                <p className={style.icontexttype2}>{parseInt(enrolmentProgressStatus) + "%"}</p>
            </div>}
        </div>
    } else if (cardtype === 3) {
        // total query card
        return <div className={style.cardBodytype3}>
            <div className={style.textBoxtype2}>
                <p className={style.texttype3}>Total Queries</p>
                <p className={style.titletype3}>{boldText || 0}</p>
            </div>
            <div className={style.iconBoxtype3}>
                <img className={style.icontype3} src="/assets/images/newbrokerdashboard/query.png" alt="" />
            </div>
        </div>
    } else if (cardtype === 4) {
        // query resolved/unresolved card
        return <div className={style.cardBodytype4}>
            <div className={style.iconBoxtype4}>
                <img className={style.icontype4} src={`/assets/images/newbrokerdashboard/${icon}.png`} alt="" />
            </div>
            <div className={style.textBoxtype4}>
                <p className={style.texttype4}>{text}</p>
                <p className={style.titletype4}>{boldText || 0}</p>
            </div>
        </div>
    } else if (cardtype === 5) {
        return <div className={style.policyCardContainer}>
            {boldText?.length > 60 ? <OverlayTrigger
                placement="top"
                overlay={(e) =>
                    renderTooltip(e, boldText)
                }
            >
                <p className={style.policyTitle}>
                    {boldText}
                </p>
            </OverlayTrigger> : <p className={style.policyTitle}>
                {boldText}
            </p>}
            <span className={style.policyChips}>
                Loss Ratio: <small className={style.policyChipsSmallText}>{lossRatio}%</small>
            </span>
            <div className={"row mt-2 justify-content-between align-items-center"}>
                <div className={"col-3 border-right"}>
                    <p className={style.policyColumnTitle}>Lives</p>
                    <p className={style.policyColumnText}>{!!lives ? `${lives}` : "-"}</p>
                </div>
                <div className={"col-4"}>
                    <p className={style.policyColumnTitle}>Cover</p>
                    <p className={style.policyColumnText}>{!!cover ? `₹ ${cover}` : "-"}</p>
                </div>
                <div className={"col-5 border-left"}>
                    <p className={style.policyColumnTitle}>Premium</p>
                    <p className={style.policyColumnText}>
                        {!!premium ? `₹ ${premium}` : "-"}
                        {!!premium && <small className={style.policyColumnSmallText}>Inc.Tax</small>}
                    </p>
                </div>
            </div>
        </div>
    }
}


const IconCard = ({
    cardType = 1, boldText = "", text = "",
    icon = "arrowup", bgc = "", img = "/assets/images/newbrokerdashboard/man.png",
    Hex1 = "#ff5674", Hex2 = "#ff8a61", corporateName = "", enrolmentEndDate = "", enrolmentProgressStatus = "",
    userTypeName = "Broker", policyName, policyNumber, lossRatio, lives, cover, premium
}) => {
    return RenderCard(
        cardType, icon, text, boldText, bgc, img,
        Hex1, Hex2, corporateName, enrolmentEndDate,
        enrolmentProgressStatus, policyNumber, policyName, userTypeName, lossRatio, lives, cover, premium
    )
}

export default IconCard;