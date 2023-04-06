import React from "react";
import { WellcomeContainer } from "../../style";

const Wellcome = ({ title }) => {
  return (
    <WellcomeContainer>
      <div className="row m-0 p-0 align-items-center">
        <div className="col-8 m-0 p-0">
          <h3 className="font-weight-bold">Hello {title} !</h3>
          <p>
            The current situation with healthcare organizations is this. They're
            gathering lot of data and we mean a lot but much of it is lost in
            transiation.
          </p>
          <button>Read More</button>
        </div>
        <div className="col-4 m-0 p-0 d-flex justify-content-end">
          <img
            src="/assets/images/employer-dashboard-img/publicdomainq-girl_laptop.svg"
            alt=""
          />
        </div>
      </div>
    </WellcomeContainer>
  );
};

export default Wellcome;
