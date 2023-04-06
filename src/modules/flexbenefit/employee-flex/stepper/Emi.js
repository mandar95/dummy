import React from "react";
import styled from "styled-components";
import { NumberInd } from "../../../../utils";

const EmiInfo = ({ TotalPremium }) => {
  return (
    <EMIBar className="d-flex">
      <h2 className="m-0">TO PAY</h2>
      <div>
        <p>₹ {NumberInd(Math.abs(TotalPremium))} <small> (Incl GST)</small></p>
        {/* <span className="emi">EMI 300x2</span> */}
      </div>
    </EMIBar>
  );
};

const EMIBar = styled.div`
  justify-content: space-between;
  align-items: center;
  background: #f2f7f8;
  padding: 7px 1.1rem;
  border-radius: 10px;
  margin: 0px 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 0.6rem;
  width: auto;
  height: auto;
  h2 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #68868d;
  }
  p {
    margin-bottom: 0;
    font-weight: 600;
    /* font-size: 1.1rem; */
    line-height: 14px;
    font-size: 1.2rem;
    color: #56697c;
  }
  .emi {
    margin-top: 0.3rem;
    font-size: 12px;
    font-weight: 500;
    color: #3088f6;
    float: right;
  }
`;

export default EmiInfo;
