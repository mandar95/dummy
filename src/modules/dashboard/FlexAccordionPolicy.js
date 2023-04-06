import React from "react";
import classesone from "modules/enrollment/index.module.css";
import image1 from "modules/dashboard/1and4.png";
import styled from "styled-components";
import { comma } from "modules/enrollment/NewDesignComponents/ForthStep.js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { GetSumInsuredType } from "../flexbenefit/employee-flex/flex.plan";


const Amount = styled.h6`
  color: ${({ theme }) => theme.Tab?.color || "#FF0000"};
  @media (max-width: 600px) {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    margin-left: 2px;
    margin-right: 2px;
  }
`;

const FlexAccordionPolicy = ({ summary }) => {

  const { benefit, cover, sum_insured, name, premium, benefit_name, feature_description, feature_name, feature_cover_type } = summary

  const { globalTheme } = useSelector(state => state.theme)

  return (
    <div className="ml-1 col-12 mb-1 w-100">
      <div
        className={`row justify-content-around align-items-center p-1 ${classesone.backPink}`}
      >
        <div className="col-4">
          <div className="d-flex align-items-center mr-1 mr-sm-0">
            <div style={{ marginRight: "5px" }}>
              <img
                style={{ height: "45px" }}
                src={image1}
                alt=""
              />
            </div>
            <div>
              <h6
                style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                className="ml-1"
              >
                {!!summary && (`${benefit || benefit_name}` + ((name || feature_name) ? `: ${(name || feature_name)}` : ''))}
                {!!(feature_description && feature_description !== '-') && <OverlayTrigger
                  key={"home-india" + (benefit || benefit_name)}
                  placement={"top"}
                  overlay={<Tooltip id={"tooltip-home-india" + (benefit || benefit_name)} style={{ whiteSpace: 'pre-line' }}>
                    <span>
                      {feature_description}
                    </span>
                  </Tooltip>}>
                  <svg
                    style={{
                      height: '15px',
                      marginLeft: '6px'
                    }}
                    className="icon icon-info cursor-help"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35 35"
                    fill="#8D9194">
                    <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                    <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                    <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                  </svg>
                </OverlayTrigger>
                }
              </h6>
            </div>
          </div>
        </div>
        <div className="col-4">
          {!!Number(cover || (sum_insured && [1, 2].includes(feature_cover_type))) && <>
            <small>
              {[1, 2].includes(feature_cover_type) && GetSumInsuredType[feature_cover_type]} Cover
            </small>
            <Amount>
              {comma(cover || sum_insured) || 0}
            </Amount>
          </>}
        </div>
        <div className="col-4">
          <div className="row align-items-center">
            <div className="col-6 flex-column text-center">
              {!!Number(premium) && <>
                <small>Annual   {Number(premium) < 0 ? 'Amount (Credit)' : 'Premium'}</small>
                <Amount>
                  {comma(Math.abs(premium))}
                </Amount>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlexAccordionPolicy;
