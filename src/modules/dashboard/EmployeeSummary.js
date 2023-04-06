import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import AccordionPolicy from '../enrollment/NewDesignComponents/subComponent/AccordionPolicy';
import classes from "modules/enrollment/index.module.css";
import classesone from "modules/enrollment/index.module.css";
import { comma } from "../enrollment/NewDesignComponents/ForthStep";
import vector from "modules/enrollment/NewDesignComponents/Vectors/Vector-1.png";
import { RightContainer } from "../core/layout/Layout";
import FlexAccordionPolicy from './FlexAccordionPolicy';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";

const BenefitSummaryDiv = styled.div`
  background: ${({ theme }) => theme.Tab?.color || "#FF0000"};
  color: #ffffff;
`;

const GlobalStyle = createGlobalStyle`
${RightContainer}{
  overflow: unset;
  @media (max-width: 992px) {
    overflow: hidden;
  }
}
.tooltip.show {
    opacity: 1 !important;
}
.tooltip-inner{
  height: auto;
  display: flex;
  background-color: #ffe0e0;
  pointer-events: none;
    color: #000000;
    border: 2px dotted #ccc;
}
`;

export const InstalmentTooltip = ({ installment, summaryPremium, globalTheme }) => <OverlayTrigger
  placement="top"
  overlay={<Tooltip>
    <strong className="m-auto px-3">₹{comma(Number(summaryPremium) / Number(installment))} X {installment} month</strong>
  </Tooltip>}>
  <button
    style={{
      outline: "none",
      background: "transparent",
      cursor: "pointer",
      border: '1px solid #9d9d9d',
      marginLeft: '7px',
      borderRadius: '20px',
      color: '#0082ff',
      fontSize: globalTheme.fontSize ? `calc(0.9rem + ${globalTheme.fontSize - 92}%)` : '0.9rem',
    }}
  >
    EMI
  </button>
</OverlayTrigger>

export const CheckInstalmentType = (summary = []) => {
  let installment_level = 0
  summary.forEach((elem) => {

    for (const key in elem) {
      if (elem[key][0].installment_level === 1 || elem[key][0].installment_level === undefined) {
        installment_level = 1
      }
    }
  })
  return !!installment_level
}

export const getNoGST = (summary) => {
  let doesAllHaveNoGST = false;
  summary.forEach((elem) => {
    for (const key in elem) {
      const summaryPremium = elem[key].reduce(
        (
          total,
          { employee_premium, opd_employee_contribution, enhance_employee_premium }
        ) =>
          total +
          Number(employee_premium) +
          Number(opd_employee_contribution) +
          Number(enhance_employee_premium),
        0
      )
      if (elem[key][0]?.show_gst_flag === 0 && summaryPremium !== 0) doesAllHaveNoGST = true
    }
  })
  return doesAllHaveNoGST
}

export const EmployeeSummary = ({ summary, summaryPremium, summaryFlex, nomineeSummary, flex_balance, currentYear }) => {

  const { globalTheme } = useSelector(state => state.theme)
  const [installment, setInstallment] = useState(0);
  const [notAllGST] = useState(getNoGST(summary));
  const EmployerWiseInstalment = CheckInstalmentType(summary);

  return (
    <div className={`mr-3 bg-white border border-danger d-flex flex-column w-100 ${classesone.card}`}>
      <div className="row justify-content-between m-0 mt-2">
        <div className="col-12 col-lg-8 w-100">
          <div className="row justify-content-between align-items-baseline w-100">
            <BenefitSummaryDiv
              className={`${classesone.flagborder} col-12 col-lg-4 col-md-6 text-center mt-2 py-1 px-5 h5`}
            >
              Benefit Summary
            </BenefitSummaryDiv>
            {Boolean(summaryPremium) && <div className="col-12 col-lg-8 col-md-6">
              <div className="d-flex justify-content-end">
                <h6>
                  {summaryPremium > 0 ? 'Premium To Pay' : 'Amount Credit'}: ₹ {comma(Math.abs(summaryPremium))}{Boolean(!currentYear && !summaryPremium && flex_balance?.flex_utilized_amt) && ' from Flex Wallet'}
                  {EmployerWiseInstalment && Boolean(Number(installment)) && ` in ${installment} month${Number(installment) > 1 ? "s" : ""} installment`}
                  {(!notAllGST) && <sub> (Incl GST)</sub>}{EmployerWiseInstalment && Boolean(summaryPremium && installment) &&
                    <InstalmentTooltip globalTheme={globalTheme} installment={installment} summaryPremium={summaryPremium} />} <br />
                  {!currentYear && <span className="font-weight-normal text-primary">{Boolean(summaryPremium && flex_balance?.flex_utilized_amt) && `(₹ ${comma(Number(summaryPremium) - Number(flex_balance?.flex_utilized_amt))} from Salary & ₹ ${comma(flex_balance.flex_utilized_amt)} from Flex Wallet)`}</span>}
                </h6>
              </div>
            </div>}
          </div>
          <div className={`${classes.autoscroll}`}>
            <div className={"row justify-content-center"}>
              {((summary?.length > 0 || summaryFlex?.length > 0) ? <>{summary?.map((elem, parentIndex) => {
                let summaryTitle = [];
                let sum_base_topup = null;
                for (const key in elem) {
                  const getYear = new Date(elem[key][0]?.policy_start_date).getFullYear();
                  if (elem[key][0]?.policy_start_date && currentYear && getYear !== currentYear && [1, 2, 3].includes(elem[key][0]?.policy_sub_type_id)) {
                    return null;
                  }
                  if (elem[key][0]?.sum_with_base_policy === 1) {
                    sum_base_topup = 1
                  }
                  elem[key][0]?.policy_sub_type_id > 3 ?
                    summaryTitle.push(key)
                    :
                    summaryTitle.unshift(key);
                }

                return summaryTitle.map((title, i) => {
                  if (elem[title].every(({ policy_id }) => policy_id === elem[title][0].policy_id)) {
                    return (
                      <AccordionPolicy sum_base_topup={sum_base_topup} summaryTitle={summaryTitle} notAllGST={notAllGST} EmployerWiseInstalment={EmployerWiseInstalment} key={"summ" + i} parendIndex={parentIndex} title={title} summary={elem}
                        setInstallment={setInstallment} nomineeSummary={nomineeSummary}
                        data={{ flex_balance }} />
                    )
                  } else {
                    const uniquePolicyIds = [];
                    elem[title].forEach(({ policy_id }) => { if (!uniquePolicyIds.includes(policy_id)) uniquePolicyIds.push(policy_id) })
                    const mapData = uniquePolicyIds.map((id) => {
                      return elem[title].filter(({ policy_id }) => policy_id === id)
                    })

                    return mapData.map((elem1, index2) => {
                      const summary = {}
                      summary[`${title}`] = elem1
                      return (<AccordionPolicy sum_base_topup={sum_base_topup} summaryTitle={summaryTitle} notAllGST={notAllGST} EmployerWiseInstalment={EmployerWiseInstalment} key={"summ2" + index2} parendIndex={parentIndex} title={title} summary={summary}
                        setInstallment={setInstallment} nomineeSummary={nomineeSummary} />
                      )
                    })

                  }
                })
              })}
                {summaryFlex?.map((elem, i) => {
                  const getYear = new Date(elem?.policy_start_date).getFullYear();
                  if (elem?.policy_start_date && currentYear && getYear !== currentYear) {
                    return null;
                  }
                  return <FlexAccordionPolicy key={"flexx" + i} summary={elem} setInstallment={setInstallment} />
                })}
              </> : <span style={{
                fontWeight: '500',
                fontSize: globalTheme.fontSize ? `18px + ${globalTheme.fontSize - 92}%)` : '18px',
                marginTop: '52px'

              }}>No Benefit Summary Found</span>

              )}

            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 w-100 align-self-start h-100">
          <div className="d-flex flex-column justify-content-center align-items-center position-sticky sticky-top">
            <div className={/* `${classesone.autoscroll}` */'mt-5'}>
              <div>
                <img style={{ height: "150px" }} src={vector} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalStyle />
    </div>
  );
};
