import React from "react";
import styled from "styled-components";
import { addOnFeatures } from "../stepper/Flex-moudle";
import AddOnFeature from "./AddOnFeatures";

const AddOnFeatureList = () => {
  return (
    <>
      <StyledAddOnFeature>
        {addOnFeatures.map((item, i) => (
          <AddOnFeature
            key={i}
            feature_name={item.feature_name}
            cover={item.cover}
            premium={item.premium}
          />
        ))}
        {/* <hr className="line" /> */}
      </StyledAddOnFeature>
    </>
  );
};

const StyledAddOnFeature = styled.div`
  .line {
    margin: 2px 0px;
    border: 1px dotted #c8c4c4;
    /* border-top: 2px dotted rgba(0, 0, 0, 0.1); */
  }
`;

export default AddOnFeatureList;
