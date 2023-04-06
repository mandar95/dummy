import React from "react";
import { Col } from "react-bootstrap";
import styled from "styled-components";
import AddOnFeature from "./AddOnFeatures";

const AddOnFeatureList = ({ benefits_features }) => {
  return (
    <>
      <StyledAddOnFeature>
        {benefits_features.map(({ benefit_feature_name, benefit_description,
          benefit_feature_suminsured, benefit_feature_premium,
          benefit_feature_suminsured_text, benefit_feature_cover_type,
          benefit_feature_sub_name }, i) => (
          <AddOnFeature
            key={i + 'feature'}
            benefit_feature_name={benefit_feature_name} benefit_description={benefit_description}
            benefit_feature_suminsured={benefit_feature_suminsured} benefit_feature_premium={benefit_feature_premium}
            benefit_feature_suminsured_text={benefit_feature_suminsured_text} benefit_feature_cover_type={benefit_feature_cover_type}
            benefit_feature_sub_name={benefit_feature_sub_name}
          />
        ))}
      </StyledAddOnFeature>
    </>
  );
};

const StyledAddOnFeature = styled(Col)`
  padding: 0;
  .line {
    margin: 2px 0px;
    border: 1px dotted #c8c4c4;
    /* border-top: 2px dotted rgba(0, 0, 0, 0.1); */
  }
`;

export default AddOnFeatureList;
