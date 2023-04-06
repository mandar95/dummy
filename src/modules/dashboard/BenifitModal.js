import React, { useEffect, useState, useReducer } from "react";
import Modal from "react-bootstrap/Modal";
import { Typography } from "@material-ui/core";
import classes from "./Dashboard.module.css";
import classesone from "modules/Health_Checkup/index.module.css";
import "./style.css";
const initialState = {
  loading: true,
  features: [],
};
const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ON_FETCH":
      return {
        ...state,
        loading: false,
        features: [...payload],
      };
    case "ON_ERROR":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
const BenifitModal = ({ lgShow, onHide, v, description }) => {
  const [state, reducerDispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    reducerDispatch({
      type: "ON_FETCH",
      payload: v.product_features,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [tabIsSet /* , setTab */] = useState(true);
  return (
    <div>
      <Modal
        size="lg"
        show={lgShow}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-lg"
        className="special_modalasdsa mr-4 mr-sm-0"
      >

        <Modal.Body className={`${classes.modalborder}`}>
          <div
            className={`px-3 py-2 d-flex justify-content-between ${classesone.borderDashed}`}
          >
            <div>
              <p className={`h5`}>
                Benefit Details
              </p>
            </div>
            <div onClick={onHide} className={classesone.redColorCross}>
              <i className="fas fa-times"></i>
            </div>
          </div>
          {v.policy_name !== "" && (
            <div className={`p-2 my-2 ${classes.linerGradient}`}>
              {v.policy_name}
            </div>
          )}
          {Boolean(description) && <p style={{ color: "black" }} className="my-2 small text-wrap">{description}</p>}
          <div className="w-100 border border-gray rounded-lg">
            <div className={`m-2 rounded-lg ${classes.secondHeading}`}>
              <Typography className="mx-3 ">
                {tabIsSet && "Product Features"}
                {!tabIsSet && "What's not covered?"}
              </Typography>
            </div>
            {/* if tab is set */}
            {tabIsSet && (
              <>
                {state.loading && (
                  <div className="d-flex justify-content-center p-5">
                    <Typography variant={"h6"} component={"h6"}>
                      Loading ...
                    </Typography>
                  </div>
                )}
                {!state.loading && state?.features?.length <= 0 && (
                  <div className="d-flex justify-content-center p-5">
                    <Typography variant={"h6"} component={"h6"}>
                      Product Features Not Found
                    </Typography>
                  </div>
                )}
                {state?.features.map((data, i) => {
                  return (
                    <div
                      className={`media m-1 my-2 ${state?.features.length === i + 1
                          ? ``
                          : `border-bottom`
                        }`}
                      key={"asdasdas" + i}
                    >
                      <img
                        style={{ height: "60px", maxWidth: "100px" }}
                        className="mr-3"
                        src={data.image}
                        alt={""}
                      />
                      <div className="media-body">
                        <Typography>
                          <small
                            style={{
                              wordBreak: "break-word",
                              fontWeight: "600",
                            }}
                          >
                            {data.title}
                          </small>
                        </Typography>
                        <small
                          style={{ wordBreak: "break-word" }}
                          className="text-secondary"
                        >
                          {data.content}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {!tabIsSet && (
              <div className="d-flex justify-content-center p-5">
                <Typography variant={"h6"} component={"h6"}>
                  What's not covered Section?
                </Typography>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BenifitModal;
