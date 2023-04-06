import React from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import classesone from "modules/Health_Checkup/index.module.css";
import "modules/Health_Checkup/index.module.css";
import Map from "modules/NewBrokerDashboard/LocalComponent/Map";
import style from "../../style.module.css";
import { NumberInd } from "utils";

const MapModal = ({ show, onHide, statesFromAPI = [], handleLocationOnClick }) => {
    const { currentStateInfo } = useSelector(state => state.NewBrokerDashboard);
    const locationOnClick = (id) => {
        handleLocationOnClick(id);
        onHide();
    }

    return (
        <Modal
            size="lg"
            show={!!show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
            className="special_modalasdsa_flex"
        >
            <Modal.Body>
                <>
                    <div
                        className={`px-3 py-2 mb-2 d-flex justify-content-between`}
                    >
                        <div>
                            <p className={`h5 font-weight-bold`}>
                                Map
                            </p>
                        </div>
                        <div onClick={onHide} className={classesone.redColorCross}>
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <div style={{ width: "400px" }}>
                            {!!currentStateInfo?.length && <div className={style.stateDetailsModal}>
                                <span className={style.mapSpan}>State: <b>{currentStateInfo[0]?.state_name}</b></span>
                                {!!(+currentStateInfo[0]?.premium + +currentStateInfo[0]?.opd_premium) &&
                                    <span className={style.mapSpan}>
                                        Total Premium: <b>{NumberInd(+currentStateInfo[0]?.premium + +currentStateInfo[0]?.opd_premium)}</b>
                                    </span>}
                                {/* <span className={style.mapSpan}>OPD Premium: {currentStateInfo[0]?.opd_premium}</span> */}
                            </div>}
                            <Map statesFromAPI={statesFromAPI} handleOnLocationClick={locationOnClick} />
                        </div>
                    </div>
                </>
            </Modal.Body>
        </Modal>
    );
};

export default MapModal;