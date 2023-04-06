import React from "react";

import "./radiobutton.css";

const Radiobutton = (props) => {
  return (
    <div className="mt-4 mb-3" style={{ paddingBottom: "10px" }}>
      <div className="row rowButton">
        <div className="col-md-3 col-6 col-lg-2 col-button">
          <div
            className="card"
            style={{
              borderRadius: "18px",
              boxShadow: "2px 0px 7px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="card-body card-flex-em">
              <div
                className="row rowButton"
                style={{
                  marginRight: "-15px !important",
                  marginLeft: "-15px !important",
                }}
              >
                <div className="col-md-10 text-center">
                  <div className="mb-2">
                    <div className="custom-control custom-radio">
                      <input
                        name="a"
                        type="radio"
                        className="custom-control-input"
                        id="customCheck1"
                        onClick={props.onPress1}
                        defaultChecked
                      />
                      <label
                        className="custom-control-label lbl-25"
                        htmlFor="customCheck1"
                      >
                        <img
                          src="/assets/images/add-nominee.png"
                          width="38.5"
                          height="38.5"
                          alt="img"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 text-center">Add Nominee</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 col-lg-2 col-button">
          <div
            className="card"
            style={{
              borderRadius: "18px",
              boxShadow: "1px 1px 15px rgba(179, 179, 179, 0.5)",
            }}
          >
            <div className="card-body card-flex-em">
              <div className="row rowButton">
                <div className="col-md-10 text-center">
                  <div className="mb-2">
                    <div className="custom-control custom-radio">
                      <input
                        name="a"
                        type="radio"
                        className="custom-control-input"
                        id="customCheck2"
                        onClick={props.onPress2}
                      />
                      <label
                        className="custom-control-label lbl-25"
                        htmlFor="customCheck2"
                      >
                        <img
                          src="/assets/images/file-upload.png"
                          width="38.5"
                          height="38.5"
                          alt="img"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 text-center">Member Bulk Upload</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Radiobutton;
