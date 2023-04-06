/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import classesone from "../../index.module.css";
import image1 from "../../../dashboard/1and4.png";
import image2 from "../../../dashboard/2and5.png";
import image3 from "../../../dashboard/3and6.png";
import styled from "styled-components";
import { comma } from "../ForthStep";
import { useSelector } from "react-redux";
import { ModuleControl } from "../../../../config/module-control";
import { InstalmentTooltip } from "../../../dashboard/EmployeeSummary";

const Amount = styled.h6`
  color: ${({ theme }) => theme.Tab?.color || "#FF0000"};
  @media (max-width: 600px) {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    margin-left: 2px;
    margin-right: 2px;
  }
`;

const Icone = styled.i`
  color: ${({ theme }) => theme.Tab?.color || "#FF0000"};
`;

const isHowden = ModuleControl.isHowden;
const SummarySelfSI = true;

const findAnyPremium = (member_array) => {
  const memberWithPremium = member_array.find(elem => (Number(elem.employee_premium) +
    Number(elem.opd_employee_contribution) +
    Number(elem.enhance_employee_premium)))

  return (Number(memberWithPremium.employee_premium) +
    Number(memberWithPremium.opd_employee_contribution) +
    Number(memberWithPremium.enhance_employee_premium))
}

const isSIPresent = (memberDetail, is_opd) => {
  return is_opd ? Number(getSI(memberDetail, true)) : Number(getSI(memberDetail)) +
    Number(memberDetail.enhance_suminsured)
}

const checkSelfMergeSI = (relations, is_opd) => {
  let count = 0;
  for (let i = 0; i < relations.length; ++i) {
    if (isSIPresent(relations[i], is_opd) && [2, 3, 4].includes(relations[i].relation_id)) {
      return 1
    }
    if ([1, 2, 3, 4].includes(relations[i].relation_id)) {
      ++count
    }
  }
  return count
}

const checkParentMergeSI = (relations, relation_ids, is_opd) => {
  const firstMember = relations.find(({ relation_id }) => relation_id === relation_ids[0]);
  const secondMember = relations.find(({ relation_id }) => relation_id === relation_ids[1]);

  if (firstMember && secondMember) {
    const firstMemberSI = isSIPresent(firstMember, is_opd);
    const secondtMemberSI = isSIPresent(secondMember, is_opd);
    if (firstMemberSI && !(secondtMemberSI)) {
      return firstMemberSI;
    }
    if (secondtMemberSI && !(firstMemberSI)) {
      return secondtMemberSI;
    }
    return false;
  }
  return false;
}

const isPrPresentIPD = (memberDetail) => {
  return Number(memberDetail.employee_premium) +
    // Number(memberDetail.opd_employee_contribution) +
    Number(memberDetail.enhance_employee_premium)
}

const isPrPresentOPD = (memberDetail) => {
  // return Number(memberDetail.employee_premium) +
  return Number(memberDetail.opd_employee_contribution) /* +
    Number(memberDetail.enhance_employee_premium) */
}

const checkSelfMergePrIPD = (relations) => {
  let count = 0;
  for (let i = 0; i < relations.length; ++i) {
    if (isPrPresentIPD(relations[i]) && [2, 3, 4].includes(relations[i].relation_id)) {
      return 1
    }
    if ([1, 2, 3, 4].includes(relations[i].relation_id)) {
      ++count
    }
  }
  return count
}

const checkSelfMergePrOPD = (relations) => {
  let count = 0;
  for (let i = 0; i < relations.length; ++i) {
    if (isPrPresentIPD(relations[i]) && [2, 3, 4].includes(relations[i].relation_id)) {
      return 1
    }
    if ([1, 2, 3, 4].includes(relations[i].relation_id)) {
      ++count
    }
  }
  return count
}

const checkParentMergePrIPD = (relations, relation_ids) => {
  const firstMember = relations.find(({ relation_id }) => relation_id === relation_ids[0]);
  const secondMember = relations.find(({ relation_id }) => relation_id === relation_ids[1]);

  if (firstMember && secondMember) {
    const firstMemberPr = isPrPresentIPD(firstMember);
    const secondtMemberPr = isPrPresentIPD(secondMember);
    if (firstMemberPr && !(secondtMemberPr)) {
      return firstMemberPr;
    }
    if (secondtMemberPr && !(firstMemberPr)) {
      return secondtMemberPr;
    }
    return false;
  }
  return false;
}

const checkParentMergePrOPD = (relations, relation_ids) => {
  const firstMember = relations.find(({ relation_id }) => relation_id === relation_ids[0]);
  const secondMember = relations.find(({ relation_id }) => relation_id === relation_ids[1]);

  if (firstMember && secondMember) {
    const firstMemberPr = isPrPresentOPD(firstMember);
    const secondtMemberPr = isPrPresentOPD(secondMember);
    if (firstMemberPr && !(secondtMemberPr)) {
      return firstMemberPr;
    }
    if (secondtMemberPr && !(firstMemberPr)) {
      return secondtMemberPr;
    }
    return false;
  }
  return false;
}

export const getSI = (v, is_opd) => is_opd ? (v.opd_total_cover || v.opd_suminsured) : (v.ipd_total_cover || v.suminsured);

const AccordionPolicy = ({ title, parendIndex, data = {},
  summary, setPremiumToPay = () => null, EmployerWiseInstalment,
  setInstallment = () => null, nomineeSummary = [], notAllGST,
  sum_base_topup, summaryTitle }) => {

  const [policyAccordion, setPolicyAccordion] = useState(false);
  const IndividualPlusFloater = Number(Number(summary[`${title}`]?.[0]?.suminsurued_type_id) === 3);
  const isIndividual = Boolean(Number(summary[`${title}`]?.[0]?.suminsurued_type_id) === 1) || summary[`${title}`].length === 1;
  const isIndividualOPD = Boolean([1, 0].includes(summary[`${title}`]?.[0]?.opd_suminsured_type_id === null ? 2 : Number(summary[`${title}`]?.[0]?.opd_suminsured_type_id || 0)));
  const { currentUser } = useSelector((state) => state.login);
  const { globalTheme } = useSelector(state => state.theme)
  const UdaanLogicActivate = isHowden &&
    ((((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('robin software development') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('rakuten')) &&
      Number(summary[`${title}`]?.[0]?.number_of_time_salary) === 3)) &&
    summary[`${title}`]?.[0]?.policy_sub_type_id !== 1;

  const summaryPremium = (summary[`${title}`].reduce(
    (
      total,
      { employee_premium, opd_employee_contribution, enhance_employee_premium }
    ) =>
      total +
      Number(employee_premium) +
      Number(opd_employee_contribution) +
      Number(enhance_employee_premium),
    0
  ))

  const [premiumPresent] = useState(!!summary && !UdaanLogicActivate &&
    Boolean(
      summaryPremium
    ));
  const [installmentPresent] = useState(Boolean(summary[`${title}`][0]?.installment))
  useEffect(() => {
    if (premiumPresent) {
      setPremiumToPay(premiumToPay => Number(premiumToPay) + Number(summaryPremium))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premiumPresent])
  useEffect(() => {
    if (installmentPresent) {
      setInstallment(summary[`${title}`][0]?.installment)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installmentPresent])

  const shouldShowIPDSI = shouldShowSI(isIndividual, summary[`${title}`], 'ipd');
  const shouldShowOPDSI = shouldShowSI(isIndividualOPD, summary[`${title}`], 'opd');
  const hasIPD = summary[`${title}`].some((item) => !!(getSI(item)));
  const hasOPD = summary[`${title}`].some((item) => !!getSI(item, true));
  const hasEnhance = summary[`${title}`].some((item) => !!item.enhance_suminsured);

  const hasPremiumIPD = summary[`${title}`].some((item) => !!Boolean(
    Number(item.employee_premium) +
    // Number(item.opd_employee_contribution) +
    Number(item.enhance_employee_premium))
  );

  const hasPremiumOPD = summary[`${title}`].some((item) => !!Boolean(
    // Number(item.employee_premium) +
    Number(item.opd_employee_contribution)/*  +
    Number(item.enhance_employee_premium) */)
  );

  const onlySelfPremiumIPD = ((hasIPD && !isIndividual) || !hasIPD) /* && ((hasOPD && !isIndividualOPD) || !hasOPD) */ && summary[`${title}`].every((item) => (item.relation_id === 1 && !!Boolean(
    Number(item.employee_premium) +
    // Number(item.opd_employee_contribution) +
    Number(item.enhance_employee_premium))) || (item.relation_id !== 1 && !Boolean(
      Number(item.employee_premium) +
      // Number(item.opd_employee_contribution) +
      Number(item.enhance_employee_premium)))
  )

  const onlySelfPremiumOPD = /* ((hasIPD && !isIndividual) || !hasIPD) && */ ((hasOPD && !isIndividualOPD) || !hasOPD) && summary[`${title}`].every((item) => (item.relation_id === 1 && !!Boolean(
    // Number(item.employee_premium) +
    Number(item.opd_employee_contribution)/*  +
    Number(item.enhance_employee_premium) */)) || (item.relation_id !== 1 && !Boolean(
      // Number(item.employee_premium) +
      Number(item.opd_employee_contribution)/*  +
      Number(item.enhance_employee_premium) */))
  )


  const parentMergeIPDSI = (hasIPD && !isIndividual) && checkParentMergeSI(summary[`${title}`], [5, 6], false)
  const parentMergeOPDSI = (hasOPD && !isIndividualOPD) && checkParentMergeSI(summary[`${title}`], [5, 6], true)

  const parentInLawMergeIPDSI = (hasIPD && !isIndividual) && checkParentMergeSI(summary[`${title}`], [7, 8], false)
  const parentInLawMergeOPDSI = (hasOPD && !isIndividualOPD) && checkParentMergeSI(summary[`${title}`], [7, 8], true)

  const selfMergeIPDSI = (hasIPD && !isIndividual) && checkSelfMergeSI(summary[`${title}`], false)
  const selfMergeOPDSI = (hasOPD && !isIndividualOPD) && checkSelfMergeSI(summary[`${title}`], true)

  const parentMergePrIPD = !onlySelfPremiumIPD && checkParentMergePrIPD(summary[`${title}`], [5, 6]);
  const parentInLawMergePrIPD = !onlySelfPremiumIPD && checkParentMergePrIPD(summary[`${title}`], [7, 8]);

  const parentMergePrOPD = !onlySelfPremiumOPD && checkParentMergePrOPD(summary[`${title}`], [5, 6]);
  const parentInLawMergePrOPD = !onlySelfPremiumOPD && checkParentMergePrOPD(summary[`${title}`], [7, 8]);

  const selfMergePrIPD = !onlySelfPremiumIPD && checkSelfMergePrIPD(summary[`${title}`])
  const selfMergePrOPD = !onlySelfPremiumIPD && checkSelfMergePrOPD(summary[`${title}`])

  const mergeAll = !!(summary[`${title}`][0].is_parent_policy && (summary[`${title}`][summary[`${title}`].length - 1].ipd_all_parent_premium || summary[`${title}`][summary[`${title}`].length - 1].opd_all_parent_premium))


  return (
    <>
      {/* base + topup */}
      {sum_base_topup === 1 && summaryTitle[0] === title && <div className="ml-1 col-12 mb-1 w-100">
        <div
          className={`row justify-content-around align-items-center p-1 ${classesone.backPink}`}>
          <div className="col-12 col-xl-4 col-lg-4">
            <div className="d-flex align-items-center mr-1 mr-sm-0">
              <div style={{ marginRight: "5px" }}>
                <img
                  style={{ height: "45px" }}
                  src={
                    ["Group Mediclaim", "Mediclaim Top Up"].includes(title)
                      ? image1
                      : (["Group Personal Accident", "Personal Accident Top Up"].includes(title)
                        ? image2
                        : image3)
                  }
                  alt=""
                />
              </div>
              <div
                style={{ wordBreak: "break-word" }}>
                <h6
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                  className="ml-1">

                  {!!summary &&
                    summaryTitle.reduce((sumTitle, elem) => !sumTitle ? summary[`${elem}`]?.[0]?.policy_name : sumTitle + ' + ' + summary[`${elem}`]?.[0]?.policy_name, '')}
                </h6>
              </div>
            </div>
          </div>
          <div className="col-4">
            <small>
              Total {summary && hasIPD && (((isIndividual) ? "Individual Cover" : "Family Cover") + ((hasOPD && isIndividual !== isIndividualOPD) ? "(IPD) & " : ''))}
              {summary && hasOPD && isIndividual !== isIndividualOPD && (((isIndividualOPD) ? "Individual Cover" : "Family Cover") + ((hasOPD) ? "(OPD)" : ''))}
            </small>
            <Amount>
              {(summary &&
                comma(summaryTitle.reduce((total, titleElem) => total +
                  Number(Boolean(((!isIndividual && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem)) || {}] : summary[`${titleElem}`]).reduce(
                    (total, { enhance_suminsured, ...elem }) => total + Number(getSI(elem)) + Number(enhance_suminsured),
                    0
                  )) ? ((!isIndividual && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem)) || {}] : summary[`${titleElem}`]).reduce(
                    (total, { enhance_suminsured, ...elem }) => total + Number(getSI(elem)) + Number(enhance_suminsured),
                    0
                  ) : 0) +
                  Number(summary &&
                    Boolean(((!isIndividualOPD && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem, true) || {})] : summary[`${titleElem}`]).reduce(
                      (total, elem) => total + Number(getSI(elem, true)),
                      0
                    )) ? ((!isIndividualOPD && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem, true) || {})] : summary[`${titleElem}`]).reduce(
                      (total, elem) => total + Number(getSI(elem, true)),
                      0
                    ) : 0), 0))
                /* summaryTitle.map((titleElem, index) => (Boolean(((!isIndividual && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem)) || {}] : summary[`${titleElem}`]).reduce(
                  (total, { enhance_suminsured, ...elem }) => total + Number(getSI(elem)) + Number(enhance_suminsured),
                  0
                )) ? comma(((!isIndividual && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem)) || {}] : summary[`${titleElem}`]).reduce(
                  (total, { enhance_suminsured, ...elem }) => total + Number(getSI(elem)) + Number(enhance_suminsured),
                  0
                )) + (hasOPD ? " (IPD) & " : '') : "") +
                  (summary &&
                    Boolean(((!isIndividualOPD && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem, true) || {})] : summary[`${titleElem}`]).reduce(
                      (total, elem) => total + Number(getSI(elem, true)),
                      0
                    )) ? comma(((!isIndividualOPD && SummarySelfSI) ? [summary[`${titleElem}`].find((elem) => getSI(elem, true) || {})] : summary[`${titleElem}`]).reduce(
                      (total, elem) => total + Number(getSI(elem, true)),
                      0
                    )) + ((hasOPD && hasIPD) ? " (OPD)" : '') : "") + (index !== (summaryTitle.length - 1) ? ' + ' : '')) */)}
            </Amount>
          </div>
          <div className="col-4">
            <div className="row align-items-center">
              <div className="col-6 text-nowrap flex-column text-center" {...notAllGST && (summary[`${title}`]?.[0].show_gst_flag === 0) && { style: { lineHeight: '11px' } }}>
                {premiumPresent && <>
                  <small>Total {summaryTitle.reduce((total, elem) => total + (summary[`${elem}`].reduce(
                    (
                      total,
                      { employee_premium, opd_employee_contribution, enhance_employee_premium }
                    ) =>
                      total +
                      Number(employee_premium) +
                      Number(opd_employee_contribution) +
                      Number(enhance_employee_premium),
                    0
                  )), 0) > 0 ? 'Annual Premium' : 'Annual Amount Credit'} {notAllGST && (summary[`${title}`]?.[0].show_gst_flag === 0) && <span className="text-nowrap">(Exclude GST)</span>}</small>
                  <Amount>
                    {comma(Math.abs(summaryTitle.reduce((total, elem) => total + (summary[`${elem}`].reduce(
                      (
                        total,
                        { employee_premium, opd_employee_contribution, enhance_employee_premium }
                      ) =>
                        total +
                        Number(employee_premium) +
                        Number(opd_employee_contribution) +
                        Number(enhance_employee_premium),
                      0
                    )), 0)))}
                  </Amount>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* real policy */}
      <div className="ml-1 col-12 mb-1 w-100">
        <div
          className={`row justify-content-around align-items-center p-1 ${classesone.backPink}`}>
          <div className="col-12 col-xl-4 col-lg-4">
            <div className="d-flex align-items-center mr-1 mr-sm-0">
              <div style={{ marginRight: "5px" }}>
                <img
                  style={{ height: "45px" }}
                  src={
                    ["Group Mediclaim", "Mediclaim Top Up"].includes(title)
                      ? image1
                      : (["Group Personal Accident", "Personal Accident Top Up"].includes(title)
                        ? image2
                        : image3)
                  }
                  alt=""
                />
              </div>
              <div
                style={{ wordBreak: "break-word" }}>
                <h6
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                  className="ml-1">
                  {!!summary && summary[`${title}`]?.[0]?.policy_name}
                </h6>
              </div>
            </div>
          </div>
          <div className="col-4">
            <small>
              {summary && hasIPD && (((isIndividual) ? "Individual Cover" : ((summary[`${title}`]?.[0]?.cover_type === 1 && IndividualPlusFloater) ? 'Individual Cover' : "Family Cover")) + ((hasOPD && isIndividual !== isIndividualOPD) ? "(IPD) & " : ''))}
              {summary && hasOPD && isIndividual !== isIndividualOPD && (((isIndividualOPD) ? "Individual Cover" : "Family Cover") + ((hasOPD) ? "(OPD)" : ''))}
            </small>
            <Amount>
              {((isIndividual || isIndividualOPD) || IndividualPlusFloater || summary[`${title}`].every(({ relation_id }) => relation_id !== 1)/* || cover_type === 2 */) ?
                <span style={{ cursor: "pointer" }} className="small" onClick={() => setPolicyAccordion(!policyAccordion)}>{!policyAccordion ? "View" : "Hide"} Details</span> :
                // Show SI for only Self|First Member for Howden
                (summary &&
                  Boolean(((!isIndividual && SummarySelfSI) ? [summary[`${title}`].find((elem) => getSI(elem)) || {}] : summary[`${title}`]).reduce(
                    (total, { enhance_suminsured, ...elem }) => total + Number(getSI(elem)) + Number(enhance_suminsured),
                    0
                  )) ? comma(((!isIndividual && SummarySelfSI) ? [summary[`${title}`].find((elem) => getSI(elem)) || {}] : summary[`${title}`]).reduce(
                    (total, { enhance_suminsured, ...elem }) => total + Number(getSI(elem)) + Number(enhance_suminsured),
                    0
                  )) + (hasOPD ? " (IPD) & " : '') : "") +
                (summary &&
                  Boolean(((!isIndividualOPD && SummarySelfSI) ? [summary[`${title}`].find((elem) => getSI(elem, true) || {})] : summary[`${title}`]).reduce(
                    (total, elem) => total + Number(getSI(elem, true)),
                    0
                  )) ? comma(((!isIndividualOPD && SummarySelfSI) ? [summary[`${title}`].find((elem) => getSI(elem, true) || {})] : summary[`${title}`]).reduce(
                    (total, elem) => total + Number(getSI(elem, true)),
                    0
                  )) + ((hasOPD && hasIPD) ? " (OPD)" : '') : "")}
            </Amount>
          </div>
          <div className="col-4">
            <div className="row align-items-center">
              <div className="col-6 flex-column text-center" {...notAllGST && (summary[`${title}`]?.[0].show_gst_flag === 0) && { style: { lineHeight: '11px' } }}>
                {premiumPresent && <>
                  <small>{summaryPremium > 0 ? 'Annual Premium' : 'Annual Amount Credit'} {notAllGST && (summary[`${title}`]?.[0].show_gst_flag === 0) && <span className="text-nowrap">(Exclude GST)</span>}</small>
                  <Amount>
                    {comma(Math.abs(summaryPremium))}
                    {!EmployerWiseInstalment && !!summary[`${title}`]?.[0]?.installment &&
                      <InstalmentTooltip globalTheme={globalTheme} installment={summary[`${title}`]?.[0]?.installment} summaryPremium={summaryPremium} />}
                  </Amount>
                </>}
              </div>

              <div className="col-6" style={{ cursor: "pointer" }}>
                {!policyAccordion && (
                  <Icone
                    style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px' }}
                    className="far fa-plus-square"
                    onClick={() => setPolicyAccordion(true)}
                  ></Icone>
                )}
                {policyAccordion && (
                  <Icone
                    style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px' }}
                    className="far fa-minus-square"
                    onClick={() => setPolicyAccordion(false)}
                  ></Icone>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {policyAccordion && (
        <div className={`ml-1 my-2 col-12 w-100`}>
          <div className={`w-100 py-1 ${classesone.grayBackTable}`}>
            <h6 className="ml-2 text-primary">
              Insured Member Details
            </h6>
            <table style={{ width: '97.5%' }} className="ml-2 table-bordered">
              <thead>
                <tr className="align-top" style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                  <th>Member Name</th>
                  <th>Relation</th>
                  {!!((shouldShowIPDSI && hasIPD) || IndividualPlusFloater/* || cover_type === 2 */) && <th>
                    Sum {summary[`${title}`]?.[0]?.policy_sub_type_id === 3 ? 'Assured' : 'Insured'} {hasEnhance && "+ Enhance"}{" "}
                    {hasOPD && "(IPD)"}
                  </th>}
                  {!!(shouldShowOPDSI && hasOPD) && <th>Sum {summary[`${title}`]?.[0]?.policy_sub_type_id === 3 ? 'Assured' : 'Insured'} (OPD)</th>}
                  {!UdaanLogicActivate && hasPremiumIPD && <th>Annual Premium {hasPremiumOPD && 'IPD'}
                    {!EmployerWiseInstalment && !!summary[`${title}`]?.[0]?.installment && `: EMI ${summary[`${title}`]?.[0]?.installment} month${Number(false) > 1 ? "s" : ""}`}
                  </th>}
                  {hasPremiumOPD && <th>Annual Premium {hasPremiumIPD && 'OPD'}
                    {!hasPremiumIPD && !EmployerWiseInstalment && !!summary[`${title}`]?.[0]?.installment && `: EMI ${summary[`${title}`]?.[0]?.installment} month${Number(false) > 1 ? "s" : ""}`}
                  </th>}

                </tr>
              </thead>
              <tbody>
                {!!summary &&
                  summary[`${title}`]?.map((elem, index) => {
                    const ParentSiIpdSI = ([5].includes(elem.relation_id) && parentMergeIPDSI) ||
                      ([7].includes(elem.relation_id) && parentInLawMergeIPDSI);
                    const ParentSiOpdSI = ([5].includes(elem.relation_id) && parentMergeOPDSI) ||
                      ([7].includes(elem.relation_id) && parentInLawMergeOPDSI);

                    const ParentPrIPD = ([5].includes(elem.relation_id) && parentMergePrIPD) ||
                      ([7].includes(elem.relation_id) && parentInLawMergePrIPD);

                    const ParentPrOPD = ([5].includes(elem.relation_id) && parentMergePrIPD) ||
                      ([7].includes(elem.relation_id) && parentInLawMergePrIPD);

                    const shouldMergeWithSelfIPDSI = ([2, 3, 4].includes(elem.relation_id) && selfMergeIPDSI > 1) ? false : true;
                    const shouldMergeWithSelfOPDSI = ([2, 3, 4].includes(elem.relation_id) && selfMergeOPDSI > 1) ? false : true;

                    const shouldMergeWithSelfPrIPD = ([2, 3, 4].includes(elem.relation_id) && selfMergePrIPD > 1) ? false : true;
                    const shouldMergeWithSelfPrOPD = ([2, 3, 4].includes(elem.relation_id) && selfMergePrIPD > 1) ? false : true;

                    return (
                      <tr
                        key={"key" + index}
                        style={{ fontWeight: "600" }}
                        className="text-secondary"
                      >
                        <td>{elem.first_name + (elem.last_name ? ' ' + elem.last_name : '')}</td>
                        <td>{elem.relation_name}</td>

                        {!!((shouldShowIPDSI && hasIPD) || IndividualPlusFloater /* || cover_type === 2 */) &&
                          (isIndividual || (((!(parentMergeIPDSI && [6].includes(elem.relation_id)) &&
                            !(parentInLawMergeIPDSI && [8].includes(elem.relation_id)) && ![2, 3, 4].includes(elem.relation_id)) ||
                            (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfIPDSI && selfMergeIPDSI > 1)) ||
                            ([2, 3, 4].includes(elem.relation_id) && (!!isSIPresent(elem, false) || selfMergeIPDSI === 1))) && !isIndividual))
                          && <td {...(ParentSiIpdSI || (shouldMergeWithSelfIPDSI && selfMergeIPDSI > 1)) && { rowSpan: (shouldMergeWithSelfIPDSI && selfMergeIPDSI > 1) ? selfMergeIPDSI : 2 }}>
                            {(ParentSiIpdSI || getSI(elem) || elem.enhance_suminsured) ? (
                              <span className="">{comma(ParentSiIpdSI || getSI(elem))} {!!elem.enhance_suminsured && ` + ${comma(elem.enhance_suminsured)}`}</span>
                            ) : "-"}
                          </td>}
                        {shouldShowOPDSI && hasOPD &&
                          (isIndividualOPD || (((!(parentMergeOPDSI && [6].includes(elem.relation_id)) &&
                            !(parentInLawMergeOPDSI && [8].includes(elem.relation_id)) && ![2, 3, 4].includes(elem.relation_id)) ||
                            (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfOPDSI && selfMergeOPDSI > 1)) ||
                            ([2, 3, 4].includes(elem.relation_id) && (!!isSIPresent(elem, false) || selfMergeOPDSI === 1))) && !isIndividualOPD))
                          && <td {...(ParentSiOpdSI || (shouldMergeWithSelfOPDSI && selfMergeOPDSI > 1)) && { rowSpan: (shouldMergeWithSelfOPDSI && selfMergeOPDSI > 1) ? selfMergeOPDSI : 2 }}>
                            {(ParentSiOpdSI || getSI(elem, true)) ? (
                              <span className="">{comma((ParentSiOpdSI || getSI(elem, true)))}</span>
                            ) : "-"}
                          </td>}
                        {!UdaanLogicActivate && ((mergeAll && index === 0) || (hasPremiumIPD && !mergeAll &&
                          ((onlySelfPremiumIPD && elem.relation_id === 1) ? true :
                            !onlySelfPremiumIPD &&
                            ((!(parentMergePrIPD && [6].includes(elem.relation_id)) &&
                              !(parentInLawMergePrIPD && [8].includes(elem.relation_id)) &&
                              ![2, 3, 4].includes(elem.relation_id)) ||
                              (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfPrIPD && selfMergePrIPD > 1)) ||
                              ([2, 3, 4].includes(elem.relation_id) && (!!isPrPresentIPD(elem, false) || selfMergePrIPD === 1)))))) &&
                          <td {...(onlySelfPremiumIPD || ParentPrIPD || ((shouldMergeWithSelfPrIPD && selfMergePrIPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) || (mergeAll && index === 0)) && { rowSpan: (onlySelfPremiumIPD || mergeAll) ? summary[`${title}`]?.length : (((shouldMergeWithSelfPrIPD && selfMergePrIPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) ? selfMergePrIPD : 2) }}>
                            {(Boolean(
                              Number(elem.employee_premium) +
                              // Number(elem.opd_employee_contribution) +
                              Number(elem.enhance_employee_premium)
                            ) || ParentPrIPD || (mergeAll && index === 0 && findAnyPremium(summary[`${title}`])))
                              ? comma(Math.abs((Number(elem.employee_premium) +
                                // Number(elem.opd_employee_contribution) +
                                Number(elem.enhance_employee_premium)) || ParentPrIPD || (mergeAll && index === 0 && findAnyPremium(summary[`${title}`]))))
                              : "-"} {((Number(elem.employee_premium) +
                                // Number(elem.opd_employee_contribution) +
                                Number(elem.enhance_employee_premium)) || ParentPrIPD) < 0 && '(Credit)'}
                          </td>}

                        {!UdaanLogicActivate && ((mergeAll && index === 0) || (hasPremiumOPD && !mergeAll &&
                          ((onlySelfPremiumOPD && elem.relation_id === 1) ? true :
                            !onlySelfPremiumOPD &&
                            ((!(parentMergePrOPD && [6].includes(elem.relation_id)) &&
                              !(parentInLawMergePrOPD && [8].includes(elem.relation_id)) &&
                              ![2, 3, 4].includes(elem.relation_id)) ||
                              (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfPrOPD && selfMergePrOPD > 1)) ||
                              ([2, 3, 4].includes(elem.relation_id) && (!!isPrPresentOPD(elem, false) || selfMergePrOPD === 1)))))) &&
                          <td {...(onlySelfPremiumOPD || ParentPrOPD || ((shouldMergeWithSelfPrOPD && selfMergePrOPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) || (mergeAll && index === 0)) && { rowSpan: (onlySelfPremiumOPD || mergeAll) ? summary[`${title}`]?.length : (((shouldMergeWithSelfPrOPD && selfMergePrOPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) ? selfMergePrOPD : 2) }}>
                            {(Boolean(
                              // Number(elem.employee_premium) +
                              Number(elem.opd_employee_contribution)/*  +
                              Number(elem.enhance_employee_premium) */
                            ) || ParentPrOPD || (mergeAll && index === 0 && findAnyPremium(summary[`${title}`])))
                              ? comma(Math.abs((/* Number(elem.employee_premium) + */
                                Number(elem.opd_employee_contribution) /* +
                                Number(elem.enhance_employee_premium) */) || ParentPrOPD || (mergeAll && index === 0 && findAnyPremium(summary[`${title}`]))))
                              : "-"} {((/* Number(elem.employee_premium) + */
                                Number(elem.opd_employee_contribution) /* +
                                Number(elem.enhance_employee_premium) */) || ParentPrOPD) < 0 && '(Credit)'}
                          </td>}


                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {!!(nomineeSummary?.[parendIndex]?.length) && <div className={`w-100 py-1 ${classesone.grayBackTable}`}>
            <h6 className="ml-2 text-primary">
              Nominee Details
            </h6>
            <table style={{ width: '97.5%' }} className="ml-2 table-bordered">
              <thead>
                <tr className="align-top" style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                  <th>Nominee Name</th>
                  <th>Relation</th>
                  {nomineeSummary[parendIndex].some(elem => elem.guardian_fname) && <th>Guardian Name</th>}
                  {nomineeSummary[parendIndex].some(elem => elem.guardian_fname) && <th>Guardian Relation with Nominee</th>}
                  <th>Share %</th>
                </tr>
              </thead>
              <tbody>
                {!!summary &&
                  nomineeSummary[parendIndex]?.map((elem, index) => {
                    return (
                      <tr
                        key={"key" + index}
                        style={{ fontWeight: "600" }}
                        className="text-secondary"
                      >
                        <td>{elem.nominee_fname + (elem.nominee_lname ? ' ' + elem.nominee_lname : '')}</td>
                        <td>{elem.nominee_relation}</td>
                        {nomineeSummary[parendIndex]?.some(elem => elem.guardian_fname) &&
                          <td>{elem.guardian_fname ? (elem.guardian_fname + (elem.guardian_lname ? ' ' + elem.guardian_lname : '')) : '-'}</td>}
                        {nomineeSummary[parendIndex]?.some(elem => elem.guardian_fname) &&
                          <td>{elem.guardian_fname ? (elem.guardian_relation) : '-'}</td>}
                        <td>{elem.share_per} %</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          }
        </div>
      )
      }
    </>
  );
};

export default AccordionPolicy;

const shouldShowSI = (isIndividual, data, flag) => {

  if (isIndividual) return true;
  if (!isIndividual && (data.filter((member) => flag === 'ipd' ? Number(getSI(member)) + Number(member['enhance_suminsured']) : Number(getSI(member, true))).length <= 1)) {
    return false
  }
  return true

}
