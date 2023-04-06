import React from "react";
import styled from "styled-components";
import { NumberInd } from "../../../../../utils";

const GroupTypeCard = ({ premium, sum_insured }) => {
  return (
    <StyledGM>
      <PolicyName>
        <div className="d-flex justify-content-between ">
          <p>Sum Insured:</p>
          <p>₹ {NumberInd(sum_insured)}</p>
        </div>
        {!!premium && <div className="d-flex justify-content-between ">
          <p>Premium {premium < 0 && <sub>(Credit)</sub>}: </p>
          <p>₹ {NumberInd(Math.abs(premium))}
            <br />
            <small className="float-right mt-1"> (Incl GST)</small>
          </p>
        </div>}
      </PolicyName>
      <hr className="line" />
    </StyledGM>
  );
};

const PolicyName = styled.div`
  margin-top: 0;
  padding: 0 30px;
  line-height: 15px;
  p {
    /* margin-top: 0; */
    /* margin-bottom: 0; */
    font-weight: 500;
    color: #56697c;
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
  }
`;

const StyledGM = styled.div`
  .line {
    margin: 0 20px;
    border: 1px dotted #c8c4c4;
  }
`;

export default GroupTypeCard;
