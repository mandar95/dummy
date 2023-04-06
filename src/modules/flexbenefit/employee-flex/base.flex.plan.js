import React, { useEffect, useRef, useState } from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { NumberInd } from '../../../utils';
import { BenefitDetail, CalculatePR } from './FlexSummaryModal';
import { Relation_Name } from './FamilyMemberModal';
import { ToolTipDiv } from '../../dashboard/sub-components/helper';
import styled from "styled-components";
import { getSiPr } from './employee-flex.action';
import BaseOptionModal from './BaseOptionModal';
import { isSelectedPlan } from './helper';
import SummaryToolTippOver from './SummaryToolTip';
import { ModuleControl } from '../../../config/module-control';

export const NewBasePremium = (item) => {
  const ParentsPremium = item.relation_wise?.reduce((total, { relation_id, employee_premium }) => [5, 6, 7, 8].includes(relation_id) ? total + +employee_premium : total, 0) || 0
  return item.employee_premium - ParentsPremium;
}

export function BaseFlexPlan({
  item, selectedBenefit, selectedTopupBenefit, selectedParentBenefit, AddOnFlex, isSinglePlan, premiumUpdated,
  globalTheme, allRelations, choosedTopup = [],
  dispatch, reducerdetails, watchMemberFeature, sumInsured,
  choosedParent = [], MemberFeature, setOptionState, setPremiumUpdated }) {

  const [addOnModal, setAddOnModal] = useState(false);
  const [selectedId, setSelectedId] = useState(sumInsured);
  const ref = useRef();
  const [popoverShow, setPopover] = useState(false);
  const handleHover = (trigger) => {
    setPopover(trigger);
  };

  useEffect(() => {
    if (sumInsured && selectedId && Number(selectedId) !== Number(sumInsured)) {
      setSelectedId()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumInsured])

  useEffect(() => {
    if (selectedId) {
      getSiPr(dispatch, [item].map(({ policy_id, suminsured, flex_suminsured, id }) => {
        let sum_insured = selectedId || sumInsured || suminsured
        if (flex_suminsured.every((elem) => Number(elem.sum_insured) !== Number(sum_insured))) {
          sum_insured = flex_suminsured[0]?.sum_insured
        }

        return ({
          plan_id: id,
          policy_id: policy_id,
          sum_insured: sum_insured,
          relation_ids: allRelations.map(({ id }) => id)
        })
      }), reducerdetails, { setPremiumUpdated, isSinglePlan })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const choosedBenefits = item.plan_benefits?.filter(({ benefit_name }) => selectedBenefit && selectedBenefit[benefit_name]);
  const choosedTopupBenefits = choosedTopup.map(({ plan_benefits, id }) => (plan_benefits?.filter(({ benefit_name }) => selectedTopupBenefit && (plan_benefits.some(({ mandatory_if_not_selected_benefit_ids }) => mandatory_if_not_selected_benefit_ids) ? selectedTopupBenefit[id] && selectedTopupBenefit[id] === benefit_name : selectedTopupBenefit[benefit_name]))));
  const choosedParentBenefits = choosedParent.map(({ plan_benefits, id }) => (plan_benefits?.filter(({ benefit_name }) => selectedParentBenefit && (plan_benefits.some(({ mandatory_if_not_selected_benefit_ids }) => mandatory_if_not_selected_benefit_ids) ? selectedParentBenefit[id] && selectedParentBenefit[id] === benefit_name : selectedParentBenefit[benefit_name]))));

  const benefitDetails = BenefitDetail(choosedBenefits, item, AddOnFlex, { no_of_parents: allRelations.filter(({ id }) => [5, 6].includes(+id))?.length || 0, no_of_parent_in_laws: allRelations.filter(({ id }) => [7, 8].includes(+id))?.length || 0 }, item.pro_rate_percentage_calculation);
  const benefitTopupDetails = choosedTopup.map((itemTopup, index) =>
    BenefitDetail(choosedTopupBenefits[index], itemTopup, AddOnFlex, { no_of_parents: allRelations.filter(({ id }) => [5, 6].includes(+id))?.length || 0, no_of_parent_in_laws: allRelations.filter(({ id }) => [7, 8].includes(+id))?.length || 0 }, item.pro_rate_percentage_calculation));
  const benefitParentDetails = choosedParent.map((itemParent, index) =>
    BenefitDetail(choosedParentBenefits[index], itemParent, AddOnFlex, { no_of_parents: allRelations.filter(({ id }) => [5, 6].includes(+id))?.length || 0, no_of_parent_in_laws: allRelations.filter(({ id }) => [7, 8].includes(+id))?.length || 0 }, item.pro_rate_percentage_calculation));

  const RelationMapToPolicy = allRelations.filter(({ id }) => item.allowed_relations
    .some(({ relation_id }) => Number(id) === +relation_id)
  )
  const parentBenefitSelected = item.plan_benefits.some(({ benefit_feature_details, benefit_name }) => (benefit_feature_details.some(({ has_capping_data }) => has_capping_data) && selectedBenefit && selectedBenefit[benefit_name]));

  const BasePlanPremium = Number(parentBenefitSelected ? NewBasePremium(item) : item.employee_premium);

  const TotalPremium = BasePlanPremium +
    Number(benefitDetails.benefits_premium || 0) +
    Number(choosedTopup.reduce((total, { employee_premium }) => total + +employee_premium, 0) || 0) +
    Number(benefitTopupDetails?.reduce((total, { benefits_premium }) => total + +benefits_premium, 0) || 0) +
    Number(choosedParent.reduce((total, { employee_premium }) => total + +employee_premium, 0) || 0) +
    Number(benefitParentDetails?.reduce((total, { benefits_premium }) => total + +benefits_premium, 0) || 0) +
    Number((MemberFeature && (MemberFeature.is_optional ? watchMemberFeature : true)) ? CalculatePR({ ...MemberFeature, premium_by: 1 }, 1, undefined, undefined, item.pro_rate_percentage_calculation) : 0)

  const NoOfTimeSalary = (item?.no_of_times_salary?.length && item?.no_of_times_salary?.length !== 1) ? item?.no_of_times_salary[item?.policy_suminsureds?.findIndex(si => +si === +item.suminsured)] : false

  const planSelected = isSelectedPlan(item, item.suminsured, item.employee_premium);

  return (<div><PlanDiv totalPremium={!!BasePlanPremium && TotalPremium !== BasePlanPremium} id={item.id + 'card'} className="col">
    <PlanSubDiv>
      {planSelected &&
        <div className="_src_styles_module__absolute2">
          <div className="d-flex justify-content-center align-items-center">
            <small className="py-1" style={{ fontWeight: '500', fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', letterSpacing: '1px' }}>{`Default Plan`}</small>
          </div>
        </div>
      }
      {!!(isSinglePlan && premiumUpdated && premiumUpdated !== 1) &&
        <div className="_src_styles_module__absolute2 _src_styles_module__absolute_success" style={{ top: planSelected ? '-84px' : '-54px' }}>
          <div className="d-flex justify-content-center align-items-center">
            <small className="py-1" style={{ fontWeight: '500', fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', letterSpacing: '1px' }}>{`Premium Updated`}</small>
          </div>
        </div>
      }
      <div className="_src_styles_module__absolute" style={{ backgroundColor: globalTheme?.Tab?.color }}>
        <div className="d-flex justify-content-center align-items-center">
          <small className="text-light py-1" style={{ fontWeight: '500', fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: '1px' }}>{item.plan_name}</small>
        </div>
      </div>
      <small className="_src_styles_module__cardHeading d-flex align-items-center">{item.policy_name}
        {!!item.plan_description && <ToolTipDiv>
          <OverlayTrigger
            key={"home-india"}
            placement={"top"}
            overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{item.plan_description}</Tooltip>}>
            <svg
              className="icon icon-info cursor-help"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 35 35"
              fill="#8D9194">
              <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
              <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
              <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
            </svg>
          </OverlayTrigger>
        </ToolTipDiv>}
      </small>
      <div>

        {/* {!!item.plan_description && <p style={{ whiteSpace: 'pre-line' }} className="_src_styles_module__cardParagraph border">
          {item.plan_description} <span className="">read more</span></p>} */}
        <Row>
          <Col xl={5} lg={5} md={5} sm={5}>
            <p className="_src_styles_module__graytext">Family Construct</p>
          </Col>
          <Col xl={7} lg={7} md={7} sm={7}>
            <div className="d-flex justify-content-end">
              <div><small className="_src_styles_module__bold">{!!RelationMapToPolicy?.length && `${Relation_Name[RelationMapToPolicy[0]?.id]}${Relation_Name[RelationMapToPolicy[1]?.id] ? ', ' + Relation_Name[RelationMapToPolicy[1]?.id] : ''}${Relation_Name[RelationMapToPolicy[2]?.id] ? ', ' + Relation_Name[RelationMapToPolicy[2]?.id] : ''}`}
                {RelationMapToPolicy?.length > 3 && '...'}
                {RelationMapToPolicy?.length > 3 && <ToolTipDiv>
                  <OverlayTrigger
                    key={'home-india1'}
                    placement={"top"}
                    overlay={<Tooltip id={'tooltip-home-india'}>
                      <strong>
                        {RelationMapToPolicy?.reduce((total, { id }) => (total ? total + ', ' : '') + Relation_Name[id], '')}
                      </strong>
                    </Tooltip>}>
                    <svg
                      onClick={(e) => { e.stopPropagation() }}
                      className="icon icon-info"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 35 35"
                      fill="#8D9194" >
                      <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                      <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                      <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                    </svg>
                  </OverlayTrigger>
                </ToolTipDiv>}
              </small></div>
            </div>
          </Col>
        </Row>
        <div ref={ref}
          onMouseOver={handleHover.bind(null, true)}
          onMouseOut={handleHover.bind(null, false)} className="_src_styles_module__cardPrice" style={{ background: globalTheme?.Tab?.color + '12', letterSpacing: '0.8px' }}>

          <div className="d-flex flex-column p-2 justify-content-between align-items-baseline"
            onClick={() => item?.flex_suminsured?.length > 1 && /* (isSinglePlan ?  */setAddOnModal(true)/*  : setShow(true)) */}
            style={{
              ...item?.flex_suminsured?.length > 1 && {
                cursor: 'pointer',
                background: `transparent url("data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==") no-repeat right 9px ${choosedTopup?.some(({ sum_with_base_policy }) => sum_with_base_policy === 1) ? 'top 18px' : 'bottom 15px'}`
              }
            }}>
            <div className='d-flex justify-content-between w-100'>
              <div className="_src_styles_module__bold" style={{ fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px' }}>
                <small style={{ fontWeight: '500' }}>Sum Insured{choosedTopup?.some(({ sum_with_base_policy }) => sum_with_base_policy === 1) && `(${item.plan_name})`}</small>
              </div>
              <div className='mt-1'><small className={`_src_styles_module__bold ${(NoOfTimeSalary || item?.flex_suminsured?.length === 1) ? '' : 'mr-3'}`}>₹{NumberInd(item.suminsured)}</small>
              </div>
            </div>
            {choosedTopup?.some(({ sum_with_base_policy }) => sum_with_base_policy === 1) &&
              <div className='d-flex justify-content-between w-100'>
                <div className="_src_styles_module__bold" style={{ fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px' }}>
                  <small style={{ fontWeight: '500' }}>Sum Insured({`${choosedTopup?.find(({ sum_with_base_policy }) => sum_with_base_policy === 1).plan_name}`})</small>
                </div>
                <div className='mt-1'><small className={`_src_styles_module__bold ${NoOfTimeSalary ? '' : 'mr-3'}`}>₹{NumberInd(choosedTopup?.find(({ sum_with_base_policy }) => sum_with_base_policy === 1).suminsured)}</small>
                </div>
              </div>
            }
            {choosedTopup?.some(({ sum_with_base_policy }) => sum_with_base_policy === 1) &&
              <div className='d-flex justify-content-between w-100 ' style={{ color: globalTheme?.Tab?.color, borderTop: '1px dashed ' + globalTheme?.Tab?.color }}>
                <div className="_src_styles_module__bold mt-1" style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: '500' }}>
                  Total Sum Insured
                </div>
                <div className='mt-1'><small className={`_src_styles_module__bold ${NoOfTimeSalary ? '' : 'mr-3'}`}>₹{NumberInd(+choosedTopup?.find(({ sum_with_base_policy }) => sum_with_base_policy === 1).suminsured + +item.suminsured)}</small>
                </div>
              </div>
            }
            {!!NoOfTimeSalary && <div className='d-flex justify-content-between w-100'>
              <div className="_src_styles_module__bold" style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: '500' }}>
                No. Of Times Salary
              </div>
              <div className='mt-1'><small className="_src_styles_module__bold mr-3">{+NoOfTimeSalary}</small>
              </div>
            </div>}
          </div>

          {!!BasePlanPremium && TotalPremium !== BasePlanPremium && <div className="d-flex p-2 justify-content-between align-items-baseline" style={{ color: globalTheme?.Tab?.color, borderTop: '1px dashed ' + globalTheme?.Tab?.color, }}>
            <div className=" _src_styles_module__bold"><small style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: '500' }}>{BasePlanPremium < 0 ? 'Amount' : 'Premium'}</small>
              <br /> {BasePlanPremium < 0 && <div className='d-flex justify-content-end mb-2'><sub> (Credit)</sub></div>}
            </div>
            <div className=" _src_styles_module__bold"><small className="_src_styles_module__bold">
              ₹ {NumberInd(Math.abs(BasePlanPremium))}
            </small>
              <br /> <div className='d-flex justify-content-end mb-2'><sub> (Incl GST)</sub></div>
            </div>
          </div>}
        </div>

      </div>
    </PlanSubDiv>
    <BaseOptionModal
      globalTheme={globalTheme}
      show={addOnModal}
      isSinglePlan={isSinglePlan}
      no_of_times_salary={item?.no_of_times_salary || []}
      detail={item}
      defaultSI={sumInsured}
      selectedId={selectedId}
      setOptionState={setOptionState}
      setSelectedId={setSelectedId}
      onHide={() => setAddOnModal(false)} />
    {ModuleControl.FlexSummaryTooltip && <SummaryToolTippOver ref={ref} showpopover={popoverShow} data={item} />}

  </PlanDiv>
    {!!TotalPremium && <div className="_src_styles_module__cardPrice mt-2" style={{ background: globalTheme?.Tab?.color /* + '12' */, letterSpacing: '0.8px', margin: '0px 20px' }}>
      <div className="d-flex p-2 justify-content-between align-items-baseline" style={{ color: /* globalTheme?.Tab?.color */'#ffffff' }}>
        <div className=" _src_styles_module__bold"><small style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: '700' }}>Total {TotalPremium < 0 ? 'Amount' : 'Premium'}</small>
          <br /> {TotalPremium < 0 && <div className='d-flex justify-content-end mb-2'><sub> (Credit)</sub></div>}
        </div>
        <div className=" _src_styles_module__bold"><small className="_src_styles_module__bold font-weight-bold">
          ₹ {NumberInd(Math.abs(TotalPremium))}
        </small>
          <br /> <div className='d-flex justify-content-end mb-2 font-weight-bold'><sub> (Incl GST)</sub></div>
        </div>
      </div>
    </div>}
  </div>
  )
}

const PlanDiv = styled.div`
 background: #ffffff;
 margin:0px 20px;
 position: relative;
 border-radius: 20px;
 padding: 0px;
 border: 1px solid ${({ theme }) => theme?.Tab?.color};
  min-width: 280px;
  max-width: fit-content;
`
const PlanSubDiv = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  max-width: 300px;
  border-radius: 2px;
  height: 100%;
  padding: 10px 11px;
`
