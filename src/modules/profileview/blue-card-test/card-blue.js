import React from "react";
import "./card-blue.css";

const BlueCard = ({ children, title }) => (
    <div className="card-blue">
        <div className="block-blue">

            <div className="row-blue">
                <div className="containerblue2">
                    <div className="header-blue">
                        <span className="icon-blue"></span> {title}
                        <div className="bottom-header-blue"></div>
                    </div>
                </div>
                <div className="children-blue">
                    {children}
                </div>
            </div>


        </div>
    </div>
)

export default BlueCard