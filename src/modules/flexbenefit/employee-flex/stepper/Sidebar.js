import React, { Fragment } from "react";
import { Col } from "react-bootstrap";
import styled from "styled-components";
// import { ModuleControl } from "../../../../config/module-control";
import GroupTypeList from "./components/GroupTypeList";

import EmiInfo from "./Emi";

const SideBar = ({ flex_details }) => {

  const TotalPremium = flex_details?.reduce((total, { employee_premium = 0, benefits_premium = 0 }) => total + employee_premium + benefits_premium, 0)
  return (
    <>
      <StyledSideBar className="p-0 pt-1 mt-2">
        <StyledBlueBox>
          <div className="summary">Summary</div>
        </StyledBlueBox>
        <EmiInfo TotalPremium={TotalPremium} />
        {flex_details.map(({ /* policy_name, */ plan_name,
          employee_premium, policy_suminsured, product_id, is_parent_plan, benefits_features/*, sum_with_base_policy */ }, index) => {
          // const basePolicy = flex_details.find(({ is_parent_plan: parentPlan, product_id: baseProductID }) => !parentPlan && (baseProductID === product_id - 3));
          return <Fragment key={index + '-flex_details'}>
            {<GroupTypeList
              label={plan_name}
              employee_premium={employee_premium} policy_suminsured={policy_suminsured}
              is_parent_plan={is_parent_plan} product_id={product_id}
              benefits_features={benefits_features} />}
          </Fragment>
        })}
        <div className="title-wrapper-dummy"></div>
      </StyledSideBar>
    </>
  );
};

const StyledSideBar = styled(Col)`
  background: white;
  height: 97.4%;
  border-radius: 18px;
  box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
  display: flex;
  flex-direction: column;
  .line {
    margin: 0 20px;
    border: 1px dotted #c8c4c4;
    /* border-top: 2px dotted rgba(0, 0, 0, 0.1); */
  }
  .title-wrapper-dummy{
    margin-top: -2px !important;
    background: #ffffff;
    height: 5px;
    width: 94%;
    margin: auto;
  }
`;

const StyledBlueBox = styled.div`
  height: 2.8rem;
    width: 9px;
    background: ${({ theme }) => theme?.Tab?.color};
    margin-top: 8px;
    border-radius: 8px 148px 48px -62px;
    padding-top: 0px;
    border-top-left-radius: 5px;
    border-top-right-radius: 13px 15px;
    border-bottom-left-radius: -20px;
    border-bottom-right-radius: 13px 15px;

  .summary {
    color: #56697c;
    font-size: 1.4rem;
    margin-left: 1.6rem;
    font-weight: 500;
    margin-top: 5px;
  }
`;

export default SideBar;
