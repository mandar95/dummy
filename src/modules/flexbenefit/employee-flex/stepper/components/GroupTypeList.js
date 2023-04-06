import React from "react";
import AddOnToggle from "./AddOns/Add-on";
import GroupTypeCard from "./GroupTypeCard";
import styled from "styled-components";

const GroupTypeList = ({ label,
  employee_premium, policy_suminsured,
  is_parent_plan, product_id,
  benefits_features }) => {
  return (
    <Wrapper>
      <div className="title-wrapper">
        {!is_parent_plan && product_id === 1 && <div className="floating-title mx-auto">{/* Group  */}Mediclaim</div>}
        {!is_parent_plan && product_id === 2 && <div className="floating-title mx-auto">{/* Group  */}Personal Accident</div>}
        {!is_parent_plan && product_id === 3 && <div className="floating-title mx-auto">{/* Group  */}Term Life</div>}
      </div>
      <h2 className={'card-label-summary'}>{label}</h2>
      <GroupTypeCard
        label={label}
        premium={employee_premium} sum_insured={policy_suminsured} />
      {!!benefits_features.length && <AddOnToggle benefits_features={benefits_features} />}
    </Wrapper>
  );
};

export default GroupTypeList;

const Wrapper = styled.div`

.card-label-summary{
  font-size: 1.2em;
  font-weight: 401;
  margin: 0.27em 0;
  color: ${({ theme }) => theme?.Tab?.color};
  padding: 0 30px;
}
.title-wrapper{
  margin-top: -2px;
  background: white;
}
.floating-title{
  /* margin-top: -33px; */
  background: ${({ theme }) => theme?.Tab?.color}bd;
  color: #ffffff;
  padding: 6px 17px;
  border-radius: 10px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};  
  width: max-content;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
  z-index: 1;
  font-weight: 600;

}`
