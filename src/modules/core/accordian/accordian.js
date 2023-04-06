
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './accordian.css';


export default function Accordian(props) {
    const [showDetailes, setShowDetailes] = useState(false);
    const [iconDown, setIconDown] = useState(true);


    let onClickMethod = () => {
        setShowDetailes(!showDetailes)
        setIconDown(!iconDown)
    }

    return (
        <div className="customAcc " style={{ borderRadius: `${props.borderRadius}` }}>
            <div className="topDiv" onClick={onClickMethod} style={{ height: `${props.height}` }}>
                <span className="iconHolder"  >
                    <span className="left-side">
                        <img className={iconDown ? "iconDown" : "iconUp"} src="/assets/images/inputs/arrow-accordin.svg" alt="dropdown" />
                        <label forhtml="coustomcheck" className="span-label-accordian">{props.label} </label>
                    </span>
                    {props.icon ? <img className="familyIcon" src={props.icon} alt="img" style={{ border: `${props.iconBorder}` }} /> : null}
                </span>
            </div>
            <div className="bottomInfo">
                {
                    showDetailes ? <> {props.children} </> : null
                }
            </div>
        </div>
    )
}

// default props
Accordian.defaultProps = {
    label: "label",
    borderRadius: "",
    height: "",
    iconBorder: ""
}

// props types
Accordian.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    borderRadius: PropTypes.string,
    height: PropTypes.string,
    iconBorder: PropTypes.string,
};
