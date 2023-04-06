import React from "react";
import Modal from "react-bootstrap/Modal";
import classesone from "../index.module.css";
import vector from "./Vectors/Vector-1.png";
import styled from "styled-components";
// import image1 from "../../dashboard/1and4.png";
// import image2 from "../../dashboard/2and5.png";
// import image3 from "../../dashboard/3and6.png";
import AccordionPolicy from "./subComponent/AccordionPolicy";
// import AccordionTopUp from "./subComponent/AccordionTopUp";
import classes from "../../contact-us/index.module.css";
// import { useSelector } from 'react-redux';
// import { enrollment } from "../enrollment.slice";
import { useState } from "react";
// import { useSelector } from 'react-redux';
// import { enrollment } from "../enrollment.slice";
import { comma } from "./ForthStep";
import { useSelector } from "react-redux";
import { CheckInstalmentType, getNoGST } from "../../dashboard/EmployeeSummary";
const BenefitSummaryDiv = styled.div`
  background: ${({ theme }) => theme.Tab?.color || "#FF0000"};
  color: #ffffff;
`;

const CloseButton = styled.button`
position: absolute;
top: -10px;
right: -11px;
display: flex;
justify-content: center;
width: 35px;
height: 35px;
border-radius: 50%;
color: #ff1717;
text-shadow: none;
opacity: 1;
z-index: 1;
border: 1px solid #bfbfbf;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.7rem + ${fontSize - 92}%)` : '1.7rem'};

background: white;
    &:focus{
        outline:none;
    }
`

const ViewBenifitModal = ({ data, show, onHide, totalPremium, summary, summaryTitle, policy, dashboard, nomineeSummary = [] }) => {

  // const { topup } = useSelector(enrollment);
  // const [more, showMore] = useState(false);
  // const [moreTopup, showMoreTopUp] = useState(false);
  const { globalTheme } = useSelector(state => state.theme)
  const [premiumToPay, setPremiumToPay] = useState(0);
  const [installment, setInstallment] = useState(0);
  const [notAllGST] = useState(getNoGST(summary));
  const EmployerWiseInstalment = CheckInstalmentType(summary)
  return (

    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex"
    >
      <Modal.Body>
        <CloseButton onClick={onHide}>×</CloseButton>
        <div className={`mx-0 mx-sm-3 border border-danger d-flex flex-column ${classesone.card}`}>



          <div className="m-0 row justify-content-between">
            <div className="col-12 col-lg-8 w-100">
              <div className="mt-2 row justify-content-between align-items-baseline w-100">
                <BenefitSummaryDiv
                  className={`${classesone.flagborder} col-12 col-lg-4 col-md-6 text-center mt-2 py-1 px-5 h5`}
                >
                  Benefit Summary
                </BenefitSummaryDiv>
                {Boolean(premiumToPay || data?.flex_balance?.flex_utilized_amt) && <div className="col-12 col-lg-8 col-md-6">
                  <div className="d-flex justify-content-end">
                    <h6>
                      {premiumToPay > 0 ? 'Premium To Pay' : 'Amount Credit'}: ₹ {comma(Math.abs(premiumToPay))}{Boolean(!premiumToPay && data?.flex_balance?.flex_utilized_amt) && ' from Flex Wallet'}
                      {EmployerWiseInstalment && Boolean(Number(installment)) && ` in ${installment} month${Number(installment) > 1 ? "s" : ""} installment`}
                      {(!notAllGST) && <sub> (Incl GST)</sub>}<br />
                      <span className="font-weight-normal text-primary">{Boolean(premiumToPay && data?.flex_balance?.flex_utilized_amt) && `(₹ ${comma(Number(premiumToPay) - Number(data?.flex_balance.flex_utilized_amt))} from Salary & ₹ ${comma(data?.flex_balance.flex_utilized_amt)} from Flex Wallet)`}</span>
                    </h6>
                  </div>
                </div>}
              </div>
              <div className={`${classes.autoscroll}`}>
                <div className={"row justify-content-center"}>
                  {(summary?.length > 0 ? summary.map((elem, parendIndex) => {

                    let summaryTitle = [];
                    let sum_base_topup = null;
                    for (const key in elem) {
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
                          <AccordionPolicy sum_base_topup={sum_base_topup} summaryTitle={summaryTitle} notAllGST={notAllGST} EmployerWiseInstalment={EmployerWiseInstalment} parendIndex={parendIndex} nomineeSummary={nomineeSummary} key={"summ" + i} id={i + 1} title={title} data={data} summary={elem} setPremiumToPay={setPremiumToPay} setInstallment={setInstallment} />
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
                          return (<AccordionPolicy sum_base_topup={sum_base_topup} summaryTitle={summaryTitle} notAllGST={notAllGST} EmployerWiseInstalment={EmployerWiseInstalment} key={"summ2" + index2} parendIndex={parendIndex} title={title} summary={summary}
                            setPremiumToPay={setPremiumToPay}
                            setInstallment={setInstallment} nomineeSummary={nomineeSummary} />
                          )
                        })

                      }
                    })

                  }) : <span style={{
                    fontWeight: '500',
                    fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px',
                    marginTop: '52px'

                  }}>No Benefit Summary Found</span>

                  )}
                </div>
                {/* <AccordionTopUp /> */}
              </div>
            </div>
            <div className="col-12 col-lg-4 w-100 align-self-start">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div style={{
                  minHeight: 61,
                  maxHeight: 81
                }} className={`${classesone.autoscroll}`}>
                  {/* {!more && Boolean(policy?.description?.length) && <p style={{ wordBreak: "break-word" }}>
                    {policy?.description?.slice(0, 125)}
                    {(policy?.description?.length > 125) && <a style={{ cursor: "pointer" }} className="text-primary" onClick={() => showMore(true)}> View More</a>}

                  </p>}
                  {more && <p style={{ wordBreak: "break-word" }}>
                    {policy?.description}
                    <a style={{ cursor: "pointer" }} className="text-primary" onClick={() => showMore(false)}> View Less</a>
                  </p>} */}
                </div>
                <div>
                  <img style={{ height: "150px" }} src={vector} alt="" />
                </div>
                {/* {Boolean(topup[0]?.policy_description?.length) && <div style={{
                  minHeight: 61,
                  maxHeight: 61
                }} className={`${classesone.autoscroll}`}>
                  {!moreTopup && <p style={{ wordBreak: "break-word" }}>
                    {topup[0]?.policy_description?.slice(0, 80)}
                    {(topup[0]?.policy_description?.length > 80) && <a style={{ cursor: "pointer" }} className="text-primary" onClick={() => showMoreTopUp(true)}> View More</a>}

                  </p>}
                  {moreTopup && <p style={{ wordBreak: "break-word" }}>
                    {topup[0]?.policy_description}
                    <a style={{ cursor: "pointer" }} className="text-primary" onClick={() => showMoreTopUp(false)}> View Less</a>
                  </p>}
                </div>} */}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewBenifitModal;
