import React, { Fragment, useContext } from "react";
import styled from 'styled-components';
import Modal from "react-bootstrap/Modal";
import "./styleflexmodal.css";
import classes from "./card.module.css";
import { NumberInd } from "../../../utils";
import { useHistory } from "react-router";
import { BenefitText } from "./flex.plan";
import { Accordion, AccordionContext, Col, OverlayTrigger, Row, Tooltip, useAccordionToggle } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import classesone from "./FamilyMemberModal.module.css";
import { ExtractPremium } from "./addon.flex.plan";
import { ToolTipDiv } from "../../dashboard/sub-components/helper";
import { useSelector } from "react-redux";
import { StyledButton } from "modules/RFQ/data-upload/style.js";
import { Relation_Name } from "./FamilyMemberModal";
import { CoverType } from "../../policies/steps/additional-details/additional-cover";
// import { GetSumInsuredType } from './flex.plan.js';
// import { CustomNames } from "../flex-config/BenefitModal";

const calculateModalSize = (gmc, gpa, gtl) => {
  let count = 0;
  if (gmc) {
    ++count
  }
  if (gpa) {
    ++count
  }
  if (gtl) {
    ++count
  }
  return count;
}

const modalSize = {
  1: 'lg',
  2: 'xl',
  3: 'xxl',
}

const colSize = {
  1: 12,
  2: 6,
  3: 4,
}

export const ContextAwareToggle = ({ eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);
  const { globalTheme } = useSelector(state => state.theme)
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );
  const isCurrentEventKey = currentEventKey === eventKey;
  return (
    <StyledButton
      color='#60c385;'
      variant="link"
      className="open-button"
      onClick={decoratedOnClick}
      relative={'relative'}>
      {isCurrentEventKey ? (<i
        style={{
          color: 'rgb(96, 96, 96)',
          fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
          marginLeft: '-12px',
          fontWeight: '600'
        }}
        className="fal fa-chevron-down"></i>) :
        (<i style={{
          color: 'rgb(96, 96, 96)',
          fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
          marginLeft: '-12px',
          fontWeight: '600'
        }} className="fal fa-chevron-left"></i>
        )}
    </StyledButton>
  );
};

const Vline = styled.div`
  width: 0px;
  border: 5px solid ${({ theme }) => theme?.Tab?.color || "#1bf29e"};
  height: 25px;
  border-radius: 12px;
`

const ProceedCard = styled.div`
  background: ${({ theme }) => (theme?.Button?.default?.background + '1f') || '#3fd49f1f'};
  border-radius: 10px;
  padding: 10px 20px;
  .label_head{
    font-size: 1.4rem;
    color: #606060;
    font-weight: 600;
  }
  .label_value{
    font-size: 1.4rem;
    font-weight: 700;
  }
  .subText{
    font-size: 0.9rem;
  }
  .proceedButton {
    /* background: #e11a22; */
    cursor: pointer;
    padding: 10px 60px;
    border-radius: 10px;
    color: white;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: ${(theme) => theme?.Button?.default?.background || '#3fd49f'};
    .label{
      font-size: ${({ theme }) => theme.fontSize ? `calc(20px + ${theme.fontSize - 92}%)` : '20px'} ;
      font-weight: 600;
    margin-right: 15px;
    }
  }
`;

const PolicyCard = styled.div`
  position: relative;
  border-radius: 12px;
  width: 100%;
  box-shadow: 0px 5px 20px -5px #d6d6d6;
  padding: 10px;
  .label_head{
    font-size: 1.2rem;
    color: ${({ theme }) => theme?.Tab?.color || "#000000"};
    filter: brightness(55%);
    font-weight: 600;
  }
  .theme_color_text{
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme?.Tab?.color || "#000000"};
  }
  .light_grey{
    /* font-size: 1rem; */
    font-weight: 500;
    color: #9b9b9b;
  }
  .theme_color_text_dark{
    /* font-size: 1rem; */
    font-weight: 500;
    color: ${({ theme }) => theme?.Tab?.color || "#000000"};
    filter: brightness(65%);
  }

`


export const CalculateSI = (benefit_feature_details, suminsured) => {

  if (!benefit_feature_details) return 0;
  let benefit_feature_suminsured = 0;
  let currentSI = suminsured;

  if (benefit_feature_details.has_capping_data && benefit_feature_details.capping_data?.length) {
    const selectCapData = benefit_feature_details.capping_data.find(({ sum_insured }) => Number(sum_insured) === Number(suminsured));

    currentSI = selectCapData ? (selectCapData?.sum_insured || 0) : currentSI;
  }

  // calculate cover
  if (benefit_feature_details.cover_by === 1) {
    benefit_feature_suminsured = Number(benefit_feature_details.cover)
  } else {
    benefit_feature_suminsured = currentSI * Number(benefit_feature_details.cover) / 100
  }

  if (benefit_feature_details.cover_type !== 2 && !(benefit_feature_details.has_capping_data && benefit_feature_details.capping_data?.length)) {
    benefit_feature_suminsured = 0;
  }

  return benefit_feature_suminsured

}
export const CalculatePR = (benefit_feature_details, premium, suminsured, { no_of_parents, no_of_parent_in_laws } = {}, pro_rate_percentage_calculation = 100) => {
  if (!benefit_feature_details) return 0;

  let benefit_feature_premium = 0;

  if (benefit_feature_details.has_capping_data && benefit_feature_details.capping_data?.length) {
    const selectCapData = benefit_feature_details.capping_data.find(({ sum_insured }) => Number(sum_insured) === Number(suminsured));
    let total = 0;
    if (selectCapData) {
      if (no_of_parents) {
        if (no_of_parents === 1) {
          total = total + Number(selectCapData.single_parent_premium)
        }
        if (no_of_parents === 2)
          total = total + Number(selectCapData.double_parent_premium)
      }
      if (no_of_parent_in_laws) {
        if (no_of_parent_in_laws === 1) {
          total = total + Number(selectCapData.single_parent_premium)
        }
        if (no_of_parent_in_laws === 2) {
          total = total + Number(selectCapData.double_parent_premium)
        }
      }
      return total * (pro_rate_percentage_calculation / 100)
    }
  }

  if (benefit_feature_details.premium_by === 1) {
    benefit_feature_premium = Number(benefit_feature_details.premium)
  } else {
    benefit_feature_premium = premium * Number(benefit_feature_details.premium) / 100
  }

  if (benefit_feature_details.premium_type === 1) {
    benefit_feature_premium = -benefit_feature_premium;
  }
  if (benefit_feature_details.premium_type === 3) {
    benefit_feature_premium = 0;
  }

  return benefit_feature_premium * (pro_rate_percentage_calculation / 100);
}

export const BenefitDetail = (choosedBenefits = [], { suminsured, id, premium }, AddOnFlex, { no_of_parents, no_of_parent_in_laws }, pro_rate_percentage_calculation = 100) => {

  /* 
  cover_by      1: value 2: % 
  cover_type    1: inc   2: add    3: no cover

  premium_by    1: value 2: % 
  premium_type  1: disc  2: load   3: no prem
  */

  let benefits_suminsured = 0, benefits_premium = 0;

  const benefits_features = choosedBenefits.map((feature) => {

    const selectedOption = AddOnFlex[id]?.[feature.benefit_name];

    const benefit_feature_details = feature?.benefit_feature_details?.find(({ id }) => Number(selectedOption) === id) || feature.benefit_feature_details?.[0] || {};
    let
      benefit_feature_suminsured = CalculateSI(benefit_feature_details, suminsured),
      benefit_feature_premium = CalculatePR(benefit_feature_details, premium, undefined, undefined, pro_rate_percentage_calculation),
      benefit_feature_suminsured_text = CalculateSI({ ...benefit_feature_details, cover_type: 2 }, suminsured),
      benefit_feature_cover_type = benefit_feature_details.cover_type
      ;

    const isParentEnhance = (benefit_feature_details.has_capping_data) && (no_of_parents || no_of_parent_in_laws);
    if (benefit_feature_details.has_capping_data) {
      if (isParentEnhance) {
        benefit_feature_cover_type = 1
        const ParentPrem = CalculatePR(
          benefit_feature_details, premium, suminsured,
          { no_of_parents: no_of_parents, no_of_parent_in_laws: no_of_parent_in_laws }, pro_rate_percentage_calculation) || 0
        benefit_feature_suminsured = CalculateSI(
          benefit_feature_details, suminsured,
          { no_of_parents: no_of_parents, no_of_parent_in_laws: no_of_parent_in_laws }) || 0
        benefit_feature_premium = ParentPrem;
      } else {
        benefit_feature_suminsured = 0;
        benefit_feature_premium = 0;
      }
    }


    if (feature.min_enchance_si_limit > suminsured || benefit_feature_details.min_enchance_si_limit > suminsured) {
      benefit_feature_suminsured = 0;
      benefit_feature_premium = 0;
    }

    benefits_suminsured += benefit_feature_suminsured;
    benefits_premium += benefit_feature_premium;

    return {
      benefit_id: feature.id,
      benefit_feature_id: benefit_feature_details.id,
      benefit_feature_suminsured,
      benefit_feature_suminsured_text,
      benefit_feature_cover_type,
      benefit_feature_premium,
      benefit_feature_name: feature.benefit_name,
      benefit_feature_sub_name: benefit_feature_details.feature_name,
      benefit_description: benefit_feature_details.feature_description || 'Covered'
    }
  })

  return {
    benefits_suminsured,
    benefits_premium,
    benefits_features
  }
}

const FlexSummaryModal = ({ lgShow, policyDetails = [], onHide, dispatch, selectedBenefit, globalTheme, allRelations, reducerdetails, tempData, title }) => {

  const history = useHistory();

  const GMCDetail = policyDetails.find(({ product_id }) => product_id === 1) || {}
  const GPADetail = policyDetails.find(({ product_id }) => product_id === 2) || {}
  const GTLDetail = policyDetails.find(({ product_id }) => product_id === 3) || {}

  const choosedTopupGMC = policyDetails.filter(({ parent_product_id, is_parent_plan, product_id }) => product_id === 4 && parent_product_id === GMCDetail.product_id && !is_parent_plan);
  const choosedParentGMC = policyDetails.filter(({ parent_product_id, is_parent_plan, product_id }) => product_id === 1 && parent_product_id === GMCDetail.product_id && is_parent_plan === 1);

  const choosedTopupGPA = policyDetails.filter(({ parent_product_id, is_parent_plan, product_id }) => product_id === 5 && parent_product_id === GPADetail.product_id && !is_parent_plan);
  const choosedParentGPA = policyDetails.filter(({ parent_product_id, is_parent_plan, product_id }) => product_id === 2 && parent_product_id === GPADetail.product_id && is_parent_plan === 1);

  const choosedTopupGTL = policyDetails.filter(({ parent_product_id, is_parent_plan, product_id }) => product_id === 6 && parent_product_id === GTLDetail.product_id && !is_parent_plan);
  const choosedParentGTL = policyDetails.filter(({ parent_product_id, is_parent_plan, product_id }) => product_id === 3 && parent_product_id === GTLDetail.product_id && is_parent_plan === 1);

  const benefitDetailsGMC = {
    benefits_suminsured: GMCDetail.benefits_suminsured || 0,
    benefits_premium: GMCDetail.benefits_premium || 0,
    benefits_features: GMCDetail.benefits_features
  }

  const benefitDetailsTopupGMC = choosedTopupGMC.reduce((total, item) => ({
    benefits_suminsured: total.benefits_suminsured + (item.benefits_suminsured || 0),
    benefits_premium: total.benefits_premium + (item.benefits_premium || 0),
    benefits_features: [...total.benefits_features, ...(item.benefits_features || [])]
  }), {
    benefits_suminsured: 0,
    benefits_premium: 0,
    benefits_features: []
  })

  const benefitDetailsParentGMC = choosedParentGMC.reduce((total, item) => ({
    benefits_suminsured: total.benefits_suminsured + (item.benefits_suminsured || 0),
    benefits_premium: total.benefits_premium + (item.benefits_premium || 0),
    benefits_features: [...total.benefits_features, ...(item.benefits_features || [])]
  }), {
    benefits_suminsured: 0,
    benefits_premium: 0,
    benefits_features: []
  })

  const benefitDetailsGPA = {
    benefits_suminsured: GPADetail.benefits_suminsured || 0,
    benefits_premium: GPADetail.benefits_premium || 0,
    benefits_features: GPADetail.benefits_features
  }

  const benefitDetailsTopupGPA = choosedTopupGPA.reduce((total, item) => ({
    benefits_suminsured: total.benefits_suminsured + (item.benefits_suminsured || 0),
    benefits_premium: total.benefits_premium + (item.benefits_premium || 0),
    benefits_features: [...total.benefits_features, ...(item.benefits_features || [])]
  }), {
    benefits_suminsured: 0,
    benefits_premium: 0,
    benefits_features: []
  })

  const benefitDetailsParentGPA = choosedParentGPA.reduce((total, item) => ({
    benefits_suminsured: total.benefits_suminsured + (item.benefits_suminsured || 0),
    benefits_premium: total.benefits_premium + (item.benefits_premium || 0),
    benefits_features: [...total.benefits_features, ...(item.benefits_features || [])]
  }), {
    benefits_suminsured: 0,
    benefits_premium: 0,
    benefits_features: []
  })

  const benefitDetailsGTL = {
    benefits_suminsured: GTLDetail.benefits_suminsured || 0,
    benefits_premium: GTLDetail.benefits_premium || 0,
    benefits_features: GTLDetail.benefits_features
  }

  const benefitDetailsTopupGTL = choosedTopupGTL.reduce((total, item) => ({
    benefits_suminsured: total.benefits_suminsured + (item.benefits_suminsured || 0),
    benefits_premium: total.benefits_premium + (item.benefits_premium || 0),
    benefits_features: [...total.benefits_features, ...(item.benefits_features || [])]
  }), {
    benefits_suminsured: 0,
    benefits_premium: 0,
    benefits_features: []
  })

  const benefitDetailsParentGTL = choosedParentGTL.reduce((total, item) => ({
    benefits_suminsured: total.benefits_suminsured + (item.benefits_suminsured || 0),
    benefits_premium: total.benefits_premium + (item.benefits_premium || 0),
    benefits_features: [...total.benefits_features, ...(item.benefits_features || [])]
  }), {
    benefits_suminsured: 0,
    benefits_premium: 0,
    benefits_features: []
  })

  const onSubmit = () => {
    const policyToConfirm = reducerdetails.reduce((total, elem) => [...total, elem, ...elem.topup_policies, ...elem.parent_policies], []).filter(({ policy_id }) => !tempData?.flex_details?.some(elem => elem.policy_id === policy_id)).reduce((sum, { policy_id }) => !sum ? policy_id : `${sum},${policy_id}`, '');
    history.push(`policy-flexible-benefits-form${policyToConfirm ? `?policyToConfirm=${policyToConfirm}` : ''}`)
  }

  const TotalPremium =
    (GMCDetail.employee_premium || 0)
    + (benefitDetailsGMC.benefits_premium || 0)
    + (choosedTopupGMC?.reduce((total, { employee_premium }) => total + employee_premium, 0) || 0)
    + (benefitDetailsTopupGMC.benefits_premium || 0)
    + (choosedParentGMC?.reduce((total, { employee_premium }) => total + employee_premium, 0) || 0)
    + (benefitDetailsParentGMC.benefits_premium || 0) +

    (GPADetail.employee_premium || 0)
    + (benefitDetailsGPA.benefits_premium || 0)
    + (choosedTopupGPA?.reduce((total, { employee_premium }) => total + employee_premium, 0) || 0)
    + (benefitDetailsTopupGPA.benefits_premium || 0)
    + (choosedParentGPA?.reduce((total, { employee_premium }) => total + employee_premium, 0) || 0)
    + (benefitDetailsParentGPA.benefits_premium || 0) +

    (GTLDetail.employee_premium || 0)
    + (benefitDetailsGTL.benefits_premium || 0)
    + (choosedTopupGTL?.reduce((total, { employee_premium }) => total + employee_premium, 0) || 0)
    + (benefitDetailsTopupGTL.benefits_premium || 0)
    + (choosedParentGTL?.reduce((total, { employee_premium }) => total + employee_premium, 0) || 0)
    + (benefitDetailsParentGTL.benefits_premium || 0)

  const sizeCount = calculateModalSize(
    GMCDetail.plan_id || choosedParentGMC?.length || choosedTopupGMC?.length,
    GPADetail.plan_id || choosedParentGPA?.length || choosedTopupGPA?.length,
    GTLDetail.plan_id || choosedParentGTL?.length || choosedTopupGTL?.length,
  );

  return (

    <Modal
      size={modalSize[sizeCount]}
      show={!!lgShow}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex"
    >
      <ModalHeader className="justify-content-between mb-0">
        <div>
          <div className="ml-4 mb-2">
            <small className={classes.summaryModalHeading}>{title || 'Flex Summary'}</small>
          </div>
        </div>
        <div onClick={onHide} style={{ color: globalTheme?.Tab?.color }} className={classesone.redColor}>
          <i className="fas fa-times"></i>
        </div>
      </ModalHeader>
      <Modal.Body className="px-4" style={{ minHeight: '42rem' }}>
        <ProceedCard className="d-flex ">
          <div className="text-center my-auto d-flex justify-content-start w-100">

            <span className="label_head">Total {TotalPremium < 0 ? 'Amount Credit' : 'Premium'}:</span>
            &nbsp;
            <span className="label_value">₹ {NumberInd(Math.abs(TotalPremium))} /-
              &nbsp;<sub className="subText">(Incl GST)</sub>
            </span>

          </div>
          <div className="py-2 py-lg-0 align-self-center">
            <div onClick={onSubmit} style={{ background: globalTheme?.Button?.default?.background }} className='proceedButton'>
              <div className="label">
                Proceed
              </div>
              <div className="mt-1">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </ProceedCard>
        <Row className="d-flex mt-3">
          {!!(GMCDetail.plan_id || choosedParentGMC?.length || choosedTopupGMC?.length) && <Col xl={colSize[sizeCount]} lg={colSize[sizeCount]} md={12} sm={12}>
            <PolicyCardComponent
              title={'Group Mediclaim'}
              basePolicy={GMCDetail} parentPolicy={choosedParentGMC} globalTheme={globalTheme} topupPolicy={choosedTopupGMC}
            />
          </Col>}
          {!!(GPADetail.plan_id || choosedParentGPA?.length || choosedTopupGPA?.length) && <Col xl={colSize[sizeCount]} lg={colSize[sizeCount]} md={12} sm={12}>
            <PolicyCardComponent
              title={'Group Personal Accident'}
              basePolicy={GPADetail} parentPolicy={choosedParentGPA} globalTheme={globalTheme} topupPolicy={choosedTopupGPA}
            />
          </Col>}
          {!!(GTLDetail.plan_id || choosedParentGTL?.length || choosedTopupGTL?.length) && <Col xl={colSize[sizeCount]} lg={colSize[sizeCount]} md={12} sm={12}>
            <PolicyCardComponent
              title={'Group Term Life'}
              basePolicy={GTLDetail} parentPolicy={choosedParentGTL} globalTheme={globalTheme} topupPolicy={choosedTopupGTL}
            />
          </Col>}
        </Row>
      </Modal.Body>
    </Modal >
  );
};

export default FlexSummaryModal;

const PolicyCardComponent = ({ basePolicy, parentPolicy, globalTheme, topupPolicy, title }) => (
  <PolicyCard>
    <div className="d-flex align-items-center">
      <Vline />
      <span className="label_head pl-3">
        {title}
      </span>
    </div>
    <hr className="mt-1 mb-2" />
    {!!(basePolicy.plan_id || parentPolicy) && <Accordion defaultActiveKey={1}
      style={{
        borderRadius: '12px',
        width: '100%',
        marginBottom: '15px',
        border: '1px solid #e5e5e5'
      }}
      key={'AllowedRelations-' /* + index */}
    >
      <Accordion.Toggle
        eventKey={1} style={{
          width: '100%',
          border: 'none',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          background: 'white',
          borderRadius: '15px',
          padding: '10px',
          outline: 'none'

        }} className='d-flex justify-content-between align-items-center'>
        <div className='text-left mr-3' style={{
          fontWeight: '600',
          fontSize: globalTheme.fontSize ? `calc(1.2rem + ${globalTheme.fontSize - 92}%)` : '1.2rem',
          color: '#464646'
        }}>
          Base Policy
        </div>
        <ContextAwareToggle eventKey={1} />
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={1} style={{
        width: '100%',
        // paddingTop: '50px',
        paddingBottom: '5px',
        paddingLeft: '15px',
        paddingRight: '15px',
        background: 'white',
        // borderTop: '2px solid #e5e5e5',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <>
          {!!basePolicy.plan_id && <>
            <hr className="mt-1 mb-2" />
            <PolicyDetail title={basePolicy.plan_name} sumInsured={basePolicy.policy_suminsured} premium={basePolicy.employee_premium} members={basePolicy.relations || []}
              member_feature={basePolicy.member_feature} globalTheme={globalTheme} />
          </>}

          {!!parentPolicy.length && parentPolicy.map((parentDetail, index) => <Fragment key={index + parentDetail.plan_name}>
            <hr className="mt-1 mb-2" />
            <PolicyDetail title={parentDetail.plan_name} sumInsured={parentDetail.policy_suminsured} premium={parentDetail.employee_premium} members={parentDetail.relations || []}
              member_feature={parentDetail.member_feature} globalTheme={globalTheme} />
          </Fragment>)}

        </>
      </Accordion.Collapse>
    </Accordion>}
    {!!topupPolicy.length && topupPolicy.map(topupDetail =>
      <Accordion
        style={{
          borderRadius: '12px',
          width: '100%',
          marginBottom: '15px',
          border: '1px solid #e5e5e5'
        }}
        key={'AllowedRelations-' /* + index */}
      >
        <Accordion.Toggle
          eventKey={2} style={{
            width: '100%',
            border: 'none',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            background: 'white',
            borderRadius: '15px',
            padding: '10px',
            outline: 'none'

          }} className='d-flex justify-content-between align-items-center'>
          <div className='text-left mr-3' style={{
            fontWeight: '600',
            fontSize: globalTheme.fontSize ? `calc(1.2rem + ${globalTheme.fontSize - 92}%)` : '1.2rem',
            color: '#464646'
          }}>
            {topupDetail.plan_name || 'Top-up'}
          </div>
          <ContextAwareToggle eventKey={2} />
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={2} style={{
          width: '100%',
          // paddingTop: '50px',
          // paddingTop: '15px',
          paddingLeft: '15px',
          paddingRight: '15px',
          background: 'white',
          // borderTop: '2px solid #e5e5e5',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px'
        }}>
          <>
            <hr className="mt-2 mb-3" />
            <PolicyDetail title={topupDetail.plan_name} sumInsured={topupDetail.policy_suminsured} premium={topupDetail.employee_premium} members={topupDetail.relations || []}
              member_feature={topupDetail.member_feature} globalTheme={globalTheme} />
          </>
        </Accordion.Collapse>
      </Accordion>)
    }
    {!!basePolicy?.choosedBenefits?.length && <Accordion
      style={{
        borderRadius: '12px',
        width: '100%',
        marginBottom: '15px',
        border: '1px solid #e5e5e5'
      }}
      key={'AllowedRelations-' /* + index */}
    >
      <Accordion.Toggle
        eventKey={3} style={{
          width: '100%',
          border: 'none',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          background: 'white',
          borderRadius: '15px',
          padding: '10px',
          outline: 'none'

        }} className='d-flex justify-content-between align-items-center'>
        <div className='text-left mr-3' style={{
          fontWeight: '600',
          fontSize: globalTheme.fontSize ? `calc(1.2rem + ${globalTheme.fontSize - 92}%)` : '1.2rem',
          color: '#464646'
        }}>
          Add Ons
        </div>
        <ContextAwareToggle eventKey={3} />
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={3} style={{
        width: '100%',
        // paddingTop: '50px',
        // paddingTop: '15px',
        paddingLeft: '15px',
        paddingRight: '15px',
        background: 'white',
        // borderTop: '2px solid #e5e5e5',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <>
          <hr className="mt-2 mb-2" />
          <table className="w-100 mb-1">
            {basePolicy?.choosedBenefits?.map(AddOnComponent(basePolicy, globalTheme))}
          </table>
        </>
      </Accordion.Collapse>
    </Accordion>}

    {/* Topup Addons */}
    {!!topupPolicy.length && topupPolicy.map((topupDetail, index) => !!topupDetail?.choosedBenefits?.length && <Accordion
      style={{
        borderRadius: '12px',
        width: '100%',
        marginBottom: '15px',
        border: '1px solid #e5e5e5'
      }}
      key={'AllowedRelations-' /* + index */}
    >
      <Accordion.Toggle
        eventKey={index + 'topup'} style={{
          width: '100%',
          border: 'none',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          background: 'white',
          borderRadius: '15px',
          padding: '10px',
          outline: 'none'

        }} className='d-flex justify-content-between align-items-center'>
        <div className='text-left mr-3' style={{
          fontWeight: '600',
          fontSize: globalTheme.fontSize ? `calc(1.2rem + ${globalTheme.fontSize - 92}%)` : '1.2rem',
          color: '#464646'
        }}>
          Add Ons
        </div>
        <ContextAwareToggle eventKey={index + 'topup'} />
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={index + 'topup'} style={{
        width: '100%',
        // paddingTop: '50px',
        // paddingTop: '15px',
        paddingLeft: '15px',
        paddingRight: '15px',
        background: 'white',
        // borderTop: '2px solid #e5e5e5',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <>
          <hr className="mt-2 mb-2" />
          <table className="w-100 mb-1">
            {topupDetail?.choosedBenefits?.map(AddOnComponent(topupDetail, globalTheme))}
          </table>
        </>
      </Accordion.Collapse>
    </Accordion>)}

    {/* Parent Addons */}
    {!!parentPolicy.length && parentPolicy.map((parentDetail, index) => !!parentDetail?.choosedBenefits?.length && <Accordion
      style={{
        borderRadius: '12px',
        width: '100%',
        marginBottom: '15px',
        border: '1px solid #e5e5e5'
      }}
      key={'AllowedRelations-' /* + index */}
    >
      <Accordion.Toggle
        eventKey={index + 'parent'} style={{
          width: '100%',
          border: 'none',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          background: 'white',
          borderRadius: '15px',
          padding: '10px',
          outline: 'none'

        }} className='d-flex justify-content-between align-items-center'>
        <div className='text-left mr-3' style={{
          fontWeight: '600',
          fontSize: globalTheme.fontSize ? `calc(1.2rem + ${globalTheme.fontSize - 92}%)` : '1.2rem',
          color: '#464646'
        }}>
          Add Ons
        </div>
        <ContextAwareToggle eventKey={index + 'parent'} />
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={index + 'parent'} style={{
        width: '100%',
        // paddingTop: '50px',
        // paddingTop: '15px',
        paddingLeft: '15px',
        paddingRight: '15px',
        background: 'white',
        // borderTop: '2px solid #e5e5e5',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <>
          <hr className="mt-2 mb-2" />
          <table className="w-100 mb-1">
            {parentDetail?.choosedBenefits?.map(AddOnComponent(parentDetail, globalTheme))}
          </table>
        </>
      </Accordion.Collapse>
    </Accordion>)}
  </PolicyCard>
)

const PolicyDetail = ({ title, sumInsured, premium, members, member_feature, globalTheme }) => {

  return (
    <div>
      <p className="mb-1 theme_color_text">{title}</p>
      <Row className="d-flex flex-nowrap justify-content-around">
        <Col xl={4} lg={4} md={4} sm={4} className="d-flex flex-column">
          <span className="light_grey">Sum Insured</span>
          <span className="theme_color_text_dark">
            ₹ {NumberInd(sumInsured)}
          </span>
        </Col>
        <div style={{
          width: '0px',
          border: '0.1px solid rgba(0,0,0,.1)',
          height: 'auto',
        }} />
        <Col xl={4} lg={4} md={4} sm={4} className="d-flex flex-column">
          <span className="light_grey">{premium < 0 ? 'Amount' : 'Premium'}
            <br /> {premium < 0 && <div className='d-flex mb-2'><sub> (Credit)</sub></div>}
          </span>
          <span className="theme_color_text_dark">
            {Number(premium) ? `₹ ${NumberInd(Math.abs(premium))}` : '-'}
          </span>
        </Col>
        <div style={{
          width: '0px',
          border: '0.1px solid rgba(0,0,0,.1)',
          height: 'auto',
        }} />
        <Col xl={4} lg={4} md={4} sm={4} className="d-flex flex-column">
          <span className="light_grey">Members Covered</span>
          <span className="d-flex align-items-center theme_color_text_dark">{members.length + (member_feature?.cover > 0 ? (member_feature.relation_ids.length || 0) : 0)}
            <ToolTipDiv>
              <OverlayTrigger
                key={'home-india1'}
                placement={"top"}
                overlay={<Tooltip id={'tooltip-home-india'}>
                  <strong>
                    {members?.reduce((total, { relation_id }) => (total ? total + ', ' : '') + Relation_Name[relation_id], '')}
                    {member_feature?.cover > 0 && member_feature.relation_ids.reduce((all, id) => !all ? (', ' + Relation_Name[id]) : (all + ', ' + Relation_Name[id]), '')}
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
            </ToolTipDiv></span>
        </Col>

      </Row>
      {!!member_feature && member_feature?.description && <div style={{ background: globalTheme?.Tab?.color + '12 ' }} className={'my-1 p-2 rounded'}>
        {member_feature?.description}
        <div style={{ color: globalTheme?.Tab?.color }}>
          {member_feature.cover > 0 && <><small className="_src_styles_module__bold">{CoverType.find(({ id }) => +member_feature.cover_type === id)?.name || ''} Sum Insured of {NumberInd(member_feature.cover)}</small><br /></>}
          Flex {member_feature?.premium_type === 1 ? 'Credit' : 'Debit'} of {NumberInd(member_feature?.premium)}
          <sub> (Incl GST)</sub>
        </div>
      </div>}
    </div>
  )
}

const AddOnComponent = (baseDetail, globalTheme) => {
  return ({ benefit_name, benefit_description, benefit_feature_details, ...rest }, index) => {
    const selectedFeature = benefit_feature_details[0] || {};

    const parentRelation = { no_of_parents: baseDetail.relations.filter(({ relation_id }) => [5, 6].includes(+relation_id))?.length || 0, no_of_parent_in_laws: baseDetail.relations.filter(({ relation_id }) => [7, 8].includes(+relation_id))?.length || 0 };
    const currentPremium = (selectedFeature.has_capping_data && (parentRelation.no_of_parents || parentRelation.no_of_parent_in_laws)) ?
      ExtractPremium({ ...parentRelation, suminsured: baseDetail.policy_suminsured, premium: baseDetail.employee_premium, pro_rate_percentage_calculation: baseDetail.pro_rate_percentage_calculation }, selectedFeature)
      : CalculatePR(selectedFeature, baseDetail.premium, baseDetail.policy_suminsured, undefined, baseDetail.pro_rate_percentage_calculation);

    const SIText = CalculateSI({ ...selectedFeature, cover_type: 2 }, baseDetail.policy_suminsured);

    // const SI = CalculateSI(benefit_feature_details, baseDetail.policy_suminsured);

    // return <div key={index + '-choosedBenefits'}>
    //   <Row className="d-flex flex-nowrap justify-content-around">
    //     <Col xl={4} lg={4} md={4} sm={4} className="d-flex flex-column">
    //       {/* <span className="light_grey">Sum Insured</span> */}
    //       <span className="theme_color_text_dark text-dark py-2 d-flex justify-content-left align-items-end flex-nowrap text-nowrap">
    //         <span style={{
    //           maxWidth: 'min-content'
    //         }} className="text-wrap">{benefit_name}</span>
    //         {!!(selectedFeature.feature_name || selectedFeature?.feature_description) && <ToolTipDiv className="mb-1">
    //           <OverlayTrigger
    //             key={"home-india"}
    //             placement={"top"}
    //             overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>
    //               {selectedFeature.feature_name}
    //               {!!(selectedFeature.feature_name && selectedFeature?.feature_description) &&
    //                 <hr className="my-1" style={{ borderColor: '#fff' }} />}
    //               {selectedFeature?.feature_description}</Tooltip>}>
    //             <svg
    //               className="icon icon-info cursor-help"
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 35 35"
    //               fill="#8D9194">
    //               <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
    //               <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
    //               <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
    //             </svg>
    //           </OverlayTrigger>
    //         </ToolTipDiv>}

    //       </span>
    //     </Col>
    //     <div style={{
    //       width: '0px',
    //       border: '0.1px solid rgba(0,0,0,.1)',
    //       height: 'auto',
    //     }} />
    //     <Col xl={4} lg={4} md={4} sm={4} className="d-flex flex-column">
    //       <span className="light_grey">Sum Insured</span>
    //       <br /> <div className='d-flex mb-2'><sub>
    //         {!SI && !!SIText && `(${GetSumInsuredType[benefit_feature_details.cover_type]})`}
    //         {!!SI && (`${GetSumInsuredType[benefit_feature_details.has_capping_data ? 1 : benefit_feature_details.cover_type]}`)}
    //       </sub></div>
    //       <span className="theme_color_text_dark">
    //         ₹ {NumberInd(SI || SIText || 0)}
    //       </span>
    //     </Col>
    //     <div style={{
    //       width: '0px',
    //       border: '0.1px solid rgba(0,0,0,.1)',
    //       height: 'auto',
    //     }} />
    //     <Col xl={4} lg={4} md={4} sm={4} className="d-flex flex-column">
    //       <span className="light_grey">{currentPremium < 0 ? 'Amount' : 'Premium'}
    //         <br /> {currentPremium < 0 && <div className='d-flex mb-2'><sub> (Credit)</sub></div>}
    //       </span>
    //       <span className="theme_color_text_dark">
    //         ₹ {NumberInd(Math.abs(currentPremium))}
    //       </span>
    //     </Col>
    //   </Row>
    // </div>

    return <Fragment key={index + '-choosedBenefits'}>
      <tr className="w-100">
        <th
          style={{
            fontWeight: "600",
          }}
          className="text-dark py-2 d-flex justify-content-left align-items-end flex-nowrap text-nowrap"
        >
          <span style={{
            maxWidth: 'min-content'
          }} className="text-wrap">{benefit_name}</span>
          {!!(selectedFeature.feature_name || selectedFeature?.feature_description) && <ToolTipDiv className="mb-1">
            <OverlayTrigger
              key={"home-india"}
              placement={"top"}
              overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>
                {selectedFeature.feature_name}
                {!!(selectedFeature.feature_name && selectedFeature?.feature_description) &&
                  <hr className="my-1" style={{ borderColor: '#fff' }} />}
                {selectedFeature?.feature_description}</Tooltip>}>
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

        </th>
        <th className="text-right" style={{ whiteSpace: "wrap" }}>

          <OverlayTrigger
            key={"home-india"}
            placement={"top-end"}
            overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>
              <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {['-', '', null, undefined].includes(selectedFeature?.feature_description) ? 'Covered' : selectedFeature?.feature_description}
              </span>
            </Tooltip>}>
            <div>
              {BenefitText({ ...selectedFeature, SIText }, currentPremium, globalTheme, benefit_name, baseDetail.policy_suminsured)}
            </div>
          </OverlayTrigger>
          { }
        </th>
      </tr>
      {baseDetail?.choosedBenefits.length !== index + 1 && <tr>
        <th colSpan={2}>
          <hr className="my-1" />
        </th>
      </tr>}
    </Fragment>
  }
}
