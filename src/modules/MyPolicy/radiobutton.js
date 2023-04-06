import React from "react";

import "./radiobutton.css";

const Radiobutton = (props) => {
  const Data = props?.Data;
  const List = Data?.map((item, index) => (
    <div key={'my-policy' + index} className="col-md-3 col-6 col-lg-2 col-button p-2">
      <div
        className="card"
        style={{
          borderRadius: "18px",
          boxShadow: "1px 1px 15px rgba(179, 179, 179, 0.5)",
        }}
      >
        <div className="card-body card-flex-em">
          <div
            className="row rowButton2"
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
                    id={`Check${item?.id}`}
                    value={item?.id}
                    onClick={(e) =>
                      props.getInsurerId(
                        e,
                        item?.has_car_info,
                        item?.has_bike_info,
                        item?.has_travel_info
                      )
                    }
                  />
                  <label
                    className="custom-control-label lbl-25"
                    htmlFor={`Check${item?.id}`}
                    value={item?.id}
                  >
                    <img src={item?.image} width="85" height="40" alt="img" />
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-12 text-center">{item?.name}</div>
          </div>
        </div>
      </div>
    </div>
  ));
  return (
    <div className="mt-4 mb-3" style={{ paddingBottom: "10px" }}>
      <div className="row rowButton rowButtonEven">{List}</div>
    </div>
  );
};

export default Radiobutton;
