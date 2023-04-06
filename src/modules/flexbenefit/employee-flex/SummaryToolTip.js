import React, { useEffect, useState } from 'react';
import { Overlay, Popover } from "react-bootstrap";
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NumberInd } from 'utils';
import { Relation_Name } from './FamilyMemberModal';

const getSI = (v, is_opd) => is_opd ? (v.opd_total_cover || v.opd_suminsured) : (v.sum_insured);

const shouldShowSI = (isIndividual, data = [], flag) => {

  if (isIndividual) return true;
  if (!isIndividual && (data.filter((member) => flag === 'ipd' ? Number(getSI(member)) + Number(member['enhance_suminsured'] || 0) : Number(getSI(member, true))).length <= 1)) {
    return false
  }
  return true

}

const isSIPresent = (memberDetail, is_opd) => {
  return is_opd ? Number(getSI(memberDetail, true)) : (Number(getSI(memberDetail)) +
    Number(memberDetail.enhance_suminsured || 0))
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

const isPrPresentIPD = (memberDetail) => {
  return Number(memberDetail.employee_premium) +
    // Number(memberDetail.opd_employee_contribution) +
    Number(memberDetail.enhance_employee_premium || 0)
}

const isPrPresentOPD = (memberDetail) => {
  // return Number(memberDetail.employee_premium) +
  return Number(memberDetail.opd_employee_contribution) /* +
    Number(memberDetail.enhance_employee_premium) */
}

const findAnyPremium = (member_array) => {
  const memberWithPremium = member_array.find(elem => (Number(elem.employee_premium) +
    Number(elem.opd_employee_contribution) +
    Number(elem.enhance_employee_premium || 0)))

  return (Number(memberWithPremium?.employee_premium || 0) +
    Number(memberWithPremium?.opd_employee_contribution || 0) +
    Number(memberWithPremium?.enhance_employee_premium || 0))
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



function SummaryToolTippOver({ showpopover, data }, reference) {

  const IndividualPlusFloater = Number(Number(data?.sum_insured_type_id) === 3);
  const isIndividual = Boolean(Number(data?.sum_insured_type_id) === 1);
  const isIndividualOPD = Boolean([1, 0].includes(data?.opd_suminsured_type_id === null ? 2 : Number(data?.opd_suminsured_type_id || 0)));

  const MemberData = data?.relation_wise || [];

  const shouldShowIPDSI = shouldShowSI(isIndividual, MemberData, 'ipd');
  const shouldShowOPDSI = shouldShowSI(isIndividualOPD, MemberData, 'opd');
  const hasIPD = MemberData.some((item) => !!(getSI(item)));
  const hasOPD = MemberData.some((item) => !!getSI(item, true));
  const hasEnhance = MemberData.some((item) => !!item.enhance_suminsured);

  const { globalTheme } = useSelector(state => state.theme)
  const [columnCount, setColumnCount] = useState(1)

  const hasPremiumIPD = MemberData.some((item) => !!Boolean(
    Number(item.employee_premium) +
    // Number(item.opd_employee_contribution) +
    Number(item.enhance_employee_premium || 0))
  );

  const hasPremiumOPD = MemberData.some((item) => !!Boolean(
    // Number(item.employee_premium) +
    Number(item.opd_employee_contribution)/*  +
      Number(item.enhance_employee_premium || 0) */)
  );

  useEffect(() => {
    const extractCount = [true,
      !!((shouldShowIPDSI && hasIPD) || IndividualPlusFloater/* || cover_type === 2 */),
      !!(shouldShowOPDSI && hasOPD),
      hasPremiumIPD,
      hasPremiumOPD].filter(Boolean).length
    if (extractCount > 1 && extractCount !== columnCount) {
      setColumnCount(extractCount)
    }
  }, [IndividualPlusFloater, columnCount, hasIPD, hasOPD, hasPremiumIPD, hasPremiumOPD, shouldShowIPDSI, shouldShowOPDSI])


  const onlySelfPremiumIPD = ((hasIPD && !isIndividual) || !hasIPD) /* && ((hasOPD && !isIndividualOPD) || !hasOPD) */ && MemberData.every((item) => (item.relation_id === 1 && !!Boolean(
    Number(item.employee_premium) +
    // Number(item.opd_employee_contribution) +
    Number(item.enhance_employee_premium || 0))) || (item.relation_id !== 1 && !Boolean(
      Number(item.employee_premium) +
      // Number(item.opd_employee_contribution) +
      Number(item.enhance_employee_premium || 0)))
  )

  const onlySelfPremiumOPD = /* ((hasIPD && !isIndividual) || !hasIPD) && */ ((hasOPD && !isIndividualOPD) || !hasOPD) && MemberData.every((item) => (item.relation_id === 1 && !!Boolean(
    // Number(item.employee_premium) +
    Number(item.opd_employee_contribution)/*  +
            Number(item.enhance_employee_premium || 0) */)) || (item.relation_id !== 1 && !Boolean(
      // Number(item.employee_premium) +
      Number(item.opd_employee_contribution)/*  +
              Number(item.enhance_employee_premium || 0) */))
  )


  //-----------
  const parentMergeIPDSI = (hasIPD && !isIndividual) && checkParentMergeSI(MemberData, [5, 6], false)
  const parentMergeOPDSI = (hasOPD && !isIndividualOPD) && checkParentMergeSI(MemberData, [5, 6], true)

  const parentInLawMergeIPDSI = (hasIPD && !isIndividual) && checkParentMergeSI(MemberData, [7, 8], false)
  const parentInLawMergeOPDSI = (hasOPD && !isIndividualOPD) && checkParentMergeSI(MemberData, [7, 8], true)

  const selfMergeIPDSI = (hasIPD && !isIndividual) && checkSelfMergeSI(MemberData, false)
  const selfMergeOPDSI = (hasOPD && !isIndividualOPD) && checkSelfMergeSI(MemberData, true)

  const parentMergePrIPD = !onlySelfPremiumIPD && checkParentMergePrIPD(MemberData, [5, 6]);
  const parentInLawMergePrIPD = !onlySelfPremiumIPD && checkParentMergePrIPD(MemberData, [7, 8]);

  const parentMergePrOPD = !onlySelfPremiumOPD && checkParentMergePrOPD(MemberData, [5, 6]);
  const parentInLawMergePrOPD = !onlySelfPremiumOPD && checkParentMergePrOPD(MemberData, [7, 8]);

  const selfMergePrIPD = !onlySelfPremiumIPD && checkSelfMergePrIPD(MemberData)
  const selfMergePrOPD = !onlySelfPremiumIPD && checkSelfMergePrOPD(MemberData)

  const mergeAll = !!(data?.is_parent_policy && MemberData.length && (!MemberData.some(({ relation_id, employee_premium }) => [5, 6, 7, 8].includes(relation_id) && employee_premium)))

  if ([true,
    !!((shouldShowIPDSI && hasIPD) || IndividualPlusFloater/* || cover_type === 2 */),
    !!(shouldShowOPDSI && hasOPD),
    hasPremiumIPD,
    hasPremiumOPD].filter(Boolean).length <= 1) {
    return false
  }

  return (
    // <div ref={reference}>
    <Overlay
      show={showpopover}
      target={reference}
      placement={"top"}
      // container={reference.current}
      containerPadding={50}
    >
      <Popup columnCount={columnCount} id="popover-contained">
        <Popover.Content>
          <table style={{ width: '100%' }} className="table-bordered">
            <thead>
              <tr className="align-top" style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                <th>Relation</th>
                {!!((shouldShowIPDSI && hasIPD) || IndividualPlusFloater/* || cover_type === 2 */) && <th>
                  Sum {MemberData?.product_id === 3 ? 'Assured' : 'Insured'} {hasEnhance && "+ Enhance"}{" "}
                  {hasOPD && "(IPD)"}
                </th>}
                {!!(shouldShowOPDSI && hasOPD) && <th>Sum {MemberData?.product_id === 3 ? 'Assured' : 'Insured'} (OPD)</th>}
                {hasPremiumIPD && <th>Annual Premium {hasPremiumOPD && 'IPD'}
                </th>}
                {hasPremiumOPD && <th>Annual Premium {hasPremiumIPD && 'OPD'}
                </th>}

              </tr>
            </thead>
            <tbody>
              {/* !!summary && */
                MemberData?.map((elem, index) => {
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
                      <td>{Relation_Name[elem.relation_id]}</td>

                      {!!((shouldShowIPDSI && hasIPD) || IndividualPlusFloater /* || cover_type === 2 */) &&
                        (isIndividual || (((!(parentMergeIPDSI && [6].includes(elem.relation_id)) &&
                          !(parentInLawMergeIPDSI && [8].includes(elem.relation_id)) && ![2, 3, 4].includes(elem.relation_id)) ||
                          (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfIPDSI && selfMergeIPDSI > 1)) ||
                          ([2, 3, 4].includes(elem.relation_id) && (!!isSIPresent(elem, false) || selfMergeIPDSI === 1))) && !isIndividual))
                        && <td {...(ParentSiIpdSI || (shouldMergeWithSelfIPDSI && selfMergeIPDSI > 1)) && { rowSpan: (shouldMergeWithSelfIPDSI && selfMergeIPDSI > 1) ? selfMergeIPDSI : 2 }}>
                          {(ParentSiIpdSI || getSI(elem) || elem.enhance_suminsured) ? (
                            <span className="">{NumberInd(ParentSiIpdSI || getSI(elem))} {!!elem.enhance_suminsured && ` + ${NumberInd(elem.enhance_suminsured || 0)}`}</span>
                          ) : "-"}
                        </td>}
                      {shouldShowOPDSI && hasOPD &&
                        (isIndividualOPD || (((!(parentMergeOPDSI && [6].includes(elem.relation_id)) &&
                          !(parentInLawMergeOPDSI && [8].includes(elem.relation_id)) && ![2, 3, 4].includes(elem.relation_id)) ||
                          (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfOPDSI && selfMergeOPDSI > 1)) ||
                          ([2, 3, 4].includes(elem.relation_id) && (!!isSIPresent(elem, false) || selfMergeOPDSI === 1))) && !isIndividualOPD))
                        && <td {...(ParentSiOpdSI || (shouldMergeWithSelfOPDSI && selfMergeOPDSI > 1)) && { rowSpan: (shouldMergeWithSelfOPDSI && selfMergeOPDSI > 1) ? selfMergeOPDSI : 2 }}>
                          {(ParentSiOpdSI || getSI(elem, true)) ? (
                            <span className="">{NumberInd((ParentSiOpdSI || getSI(elem, true)))}</span>
                          ) : "-"}
                        </td>}
                      {((mergeAll && index === 0) || (hasPremiumIPD && !mergeAll &&
                        ((onlySelfPremiumIPD && elem.relation_id === 1) ? true :
                          !onlySelfPremiumIPD &&
                          ((!(parentMergePrIPD && [6].includes(elem.relation_id)) &&
                            !(parentInLawMergePrIPD && [8].includes(elem.relation_id)) &&
                            ![2, 3, 4].includes(elem.relation_id)) ||
                            (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfPrIPD && selfMergePrIPD > 1)) ||
                            ([2, 3, 4].includes(elem.relation_id) && (!!isPrPresentIPD(elem, false) || selfMergePrIPD === 1)))))) &&
                        <td {...(onlySelfPremiumIPD || ParentPrIPD || ((shouldMergeWithSelfPrIPD && selfMergePrIPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) || (mergeAll && index === 0)) && { rowSpan: (onlySelfPremiumIPD || mergeAll) ? MemberData?.length : (((shouldMergeWithSelfPrIPD && selfMergePrIPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) ? selfMergePrIPD : 2) }}>
                          {(Boolean(
                            Number(elem.employee_premium) +
                            // Number(elem.opd_employee_contribution) +
                            Number(elem.enhance_employee_premium || 0)
                          ) || ParentPrIPD || (mergeAll && index === 0 && findAnyPremium(MemberData)))
                            ? NumberInd(Math.abs((Number(elem.employee_premium) +
                              // Number(elem.opd_employee_contribution) +
                              Number(elem.enhance_employee_premium || 0)) || ParentPrIPD || (mergeAll && index === 0 && findAnyPremium(MemberData))))
                            : "-"} {((Number(elem.employee_premium) +
                              // Number(elem.opd_employee_contribution) +
                              Number(elem.enhance_employee_premium || 0)) || ParentPrIPD) < 0 && '(Credit)'}
                        </td>}

                      {((mergeAll && index === 0) || (hasPremiumOPD && !mergeAll &&
                        ((onlySelfPremiumOPD && elem.relation_id === 1) ? true :
                          !onlySelfPremiumOPD &&
                          ((!(parentMergePrOPD && [6].includes(elem.relation_id)) &&
                            !(parentInLawMergePrOPD && [8].includes(elem.relation_id)) &&
                            ![2, 3, 4].includes(elem.relation_id)) ||
                            (!([6, 8].includes(elem.relation_id)) && (shouldMergeWithSelfPrOPD && selfMergePrOPD > 1)) ||
                            ([2, 3, 4].includes(elem.relation_id) && (!!isPrPresentOPD(elem, false) || selfMergePrOPD === 1)))))) &&
                        <td {...(onlySelfPremiumOPD || ParentPrOPD || ((shouldMergeWithSelfPrOPD && selfMergePrOPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) || (mergeAll && index === 0)) && { rowSpan: (onlySelfPremiumOPD || mergeAll) ? MemberData?.length : (((shouldMergeWithSelfPrOPD && selfMergePrOPD > 1) && ![5, 6, 7, 8].includes(elem.relation_id)) ? selfMergePrOPD : 2) }}>
                          {(Boolean(
                            // Number(elem.employee_premium) +
                            Number(elem.opd_employee_contribution)/*  +
                              Number(elem.enhance_employee_premium || 0) */
                          ) || ParentPrOPD || (mergeAll && index === 0 && findAnyPremium(MemberData)))
                            ? NumberInd(Math.abs((/* Number(elem.employee_premium) + */
                              Number(elem.opd_employee_contribution) /* +
                                Number(elem.enhance_employee_premium || 0) */) || ParentPrOPD || (mergeAll && index === 0 && findAnyPremium(MemberData))))
                            : "-"} {((/* Number(elem.employee_premium) + */
                              Number(elem.opd_employee_contribution) /* +
                                Number(elem.enhance_employee_premium || 0) */) || ParentPrOPD) < 0 && '(Credit)'}
                        </td>}


                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Popover.Content>
      </Popup>
    </Overlay>
    // </div>
  );
}

export default React.forwardRef(SummaryToolTippOver)

const Popup = styled(Popover)`
  width: ${({ columnCount }) => columnCount * 140 > 280 ? columnCount * 140 + 'px' : '280px'};
  @media screen and (max-width: 776px){
    width: 90%;
  }
  /* padding: 15px; */
  max-width: 100%;
  border-radius: 8px;
  border:none;
  background: white;
  box-shadow: 0px 3px 10px 1px #ccc;
  & .popover-body> .row:last-child {
    margin: 5px 0px 0px 0px;
    border-top: 1px solid rgba(0,0,0,.1);
  }
  & .popover-body> .row:last-child > div {
    padding: 0px;
  }
  .popover-body {
    padding: 0;
    background: white;
    border: 2px solid #3d82e6;
    border-radius: 4px;
    box-shadow: inset 0px 1px 20px 0px ${({ theme }) => (theme.Tab?.color || '#8a8a8a')}33;
    /* color: #212529; */
}
.arrow::before {
  border-top-color: ${({ theme }) => (theme.Tab?.color || '#8a8a8a')}!important;
}
.arrow::after {
  border-top-color:${({ theme }) => (theme.Tab?.color || '#8a8a8a')}!important;
}
`
