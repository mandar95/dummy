import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styled from "styled-components";
import { NumberInd } from "../../../../../../utils";
import { GetSumInsuredType } from "../../../flex.plan";

const AddOnFeature = ({ benefit_feature_name, benefit_description,
  benefit_feature_suminsured, benefit_feature_premium,
  benefit_feature_suminsured_text, benefit_feature_cover_type,
  benefit_feature_sub_name }) => {
  return (
    <>
      <Head>
        <h1>{benefit_feature_name}
          {!!(benefit_description) && <OverlayTrigger
            key={"home-india"}
            placement={"top"}
            overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>
              <>
                {benefit_feature_sub_name}
                <hr className="my-1" style={{ borderColor: '#fff' }} />
                {benefit_description}
              </>
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
          </OverlayTrigger>}
        </h1>
        <div className="row d-flex justify-content-between">
          {!!Number(benefit_feature_suminsured || benefit_feature_suminsured_text) &&
            <p className="col col-12 col-md-6">
              Cover: <span className="amount">
                ₹ {NumberInd(benefit_feature_suminsured || benefit_feature_suminsured_text)}
                <br /><small>{GetSumInsuredType[benefit_feature_cover_type]}</small>
              </span>
            </p>}
          {!!benefit_feature_premium && <p className="col col-12 col-md-6 pl-md-0 pr-0">
            {Number(benefit_feature_premium) < 0 ? 'Amount' : 'Premium'}{Number(benefit_feature_premium) < 0 && '(Credit)'} : <span className="amount">
              ₹ {NumberInd(benefit_feature_premium)}
            </span>
            <br /><span className="gst">(Incl GST)</span>
          </p>}
        </div>
      </Head>
    </>
  );
};

const Head = styled.div`
  padding: 0;

  h1 {
    font-weight: 500;
    color: #56697c;
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  p {
    color: #56697c;
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
    margin-top: 0;
    /* margin-bottom: 1rem; */
    line-height: 17px;
    /* font-size: 14px; */
    font-weight: 300;
    .amount {
      font-weight: 500;
    }
    .gst {
      font-size: 10px;
      padding: 0 4px;
    }
  }
`;

export default AddOnFeature;
