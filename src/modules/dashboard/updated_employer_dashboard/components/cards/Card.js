import React from "react";
import { CardContainer } from "../../style";

const Card = ({ title1, value1, title2, value2, icon }) => {
  return (
    <CardContainer className="col-md-6 col-12 m-0 p-0">
      <div className="card align-items-center justify-content-center">
        <div className="d-flex align-items-center w-100 justify-content-around">
          <div className="mr-3">{icon}</div>
          <div className="d-flex flex-column">
            <div className="d-flex mb-2 flex-column">
              <p className="m-0">{title1}</p>
              <h5 className="font-weight-bold mb-0">{value1 || 0}</h5>
            </div>
            <div className="d-flex flex-column">
              <p className="m-0">{title2}</p>
              <h5 className="font-weight-bold mb-0">{value2 || 0}</h5>
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default Card;
