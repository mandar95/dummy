import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./styleflexmodal.css";
import Card from "./Card";
import classes from "./card.module.css";
import { NumberInd } from "../../../utils";
// import { tempStorage } from "./employee-flex.action";
import { useHistory } from "react-router";
import { BenefitText, getURL } from "./flex.plan";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import classesone from "./FamilyMemberModal.module.css";
import { ExtractPremium } from "./addon.flex.plan";
import { ToolTipDiv } from "../../dashboard/sub-components/helper";
import { CalculatePR, CalculateSI } from './FlexSummaryModal';

const FlexModal = ({ lgShow, policyDetails = [], onHide, dispatch, selectedBenefit, globalTheme, allRelations, reducerdetails, tempData }) => {

  const [tab, setTab] = useState(1);
  const history = useHistory();

  const GMCDetail = policyDetails.find(({ product_id }) => product_id === 1) || {}
  const GPADetail = policyDetails.find(({ product_id }) => product_id === 2) || {}
  const GTLDetail = policyDetails.find(({ product_id }) => product_id === 3) || {}

  const choosedTopupGMC = policyDetails.find(({ parent_product_id, is_parent_plan, product_id }) => product_id === 4 && parent_product_id === GMCDetail.product_id && !is_parent_plan);
  const choosedParentGMC = policyDetails.find(({ parent_product_id, is_parent_plan }) => parent_product_id === GMCDetail.product_id && is_parent_plan === 1);

  const choosedTopupGPA = policyDetails.find(({ parent_product_id, is_parent_plan, product_id }) => product_id === 5 && parent_product_id === GPADetail.product_id && !is_parent_plan);
  const choosedParentGPA = policyDetails.find(({ parent_product_id, is_parent_plan }) => parent_product_id === GPADetail.product_id && is_parent_plan === 1);

  const choosedTopupGTL = policyDetails.find(({ parent_product_id, is_parent_plan, product_id }) => product_id === 6 && parent_product_id === GTLDetail.product_id && !is_parent_plan);
  const choosedParentGTL = policyDetails.find(({ parent_product_id, is_parent_plan }) => parent_product_id === GTLDetail.product_id && is_parent_plan === 1);

  const benefitDetailsGMC = {
    benefits_suminsured: GMCDetail.benefits_suminsured || 0,
    benefits_premium: GMCDetail.benefits_premium || 0,
    benefits_features: GMCDetail.benefits_features
  }

  const benefitDetailsGPA = {
    benefits_suminsured: GPADetail.benefits_suminsured || 0,
    benefits_premium: GPADetail.benefits_premium || 0,
    benefits_features: GPADetail.benefits_features
  }

  const benefitDetailsGTL = {
    benefits_suminsured: GTLDetail.benefits_suminsured || 0,
    benefits_premium: GTLDetail.benefits_premium || 0,
    benefits_features: GTLDetail.benefits_features
  }

  const onSubmit = () => {
    const policyToConfirm = reducerdetails.filter(({ policy_id }) => !tempData?.flex_details?.some(elem => elem.policy_id === policy_id)).reduce((sum, { policy_id }) => !sum ? policy_id : `${sum},${policy_id}`, '');
    history.push(`policy-flexible-benefits-form${policyToConfirm ? `?policyToConfirm=${policyToConfirm}` : ''}`)
    // tempStorage(dispatch, {
    //   flex_details: [{
    //     plan_id: GMCDetail.id,
    //     policy_id: GMCDetail.policy_id,
    //     policy_suminsured: GMCDetail.suminsured,
    //     policy_premium: GMCDetail.premium,
    //     employee_premium: GMCDetail.employee_premium,
    //     employer_premium: GMCDetail.employer_premium,
    //     plan_name: GMCDetail.plan_name,
    //     policy_name: GMCDetail.policy_name,
    //     product_id: GMCDetail.product_id,

    //     relations: GMCDetail.relations,

    //     ...benefitDetailsGMC
    //   }, ...choosedTopupGMC ? [{
    //     plan_id: choosedTopupGMC.id,
    //     policy_id: choosedTopupGMC.policy_id,
    //     policy_suminsured: choosedTopupGMC.suminsured,
    //     policy_premium: choosedTopupGMC.premium,
    //     employee_premium: choosedTopupGMC.employee_premium,
    //     employer_premium: choosedTopupGMC.employer_premium,
    //     plan_name: choosedTopupGMC.plan_name,
    //     policy_name: choosedTopupGMC.policy_name,
    //     product_id: choosedTopupGMC.product_id,

    //     relations: choosedTopupGMC.relations,

    //     benefits_suminsured: 0,
    //     benefits_premium: 0,
    //   }] : [],
    //   ...choosedParentGMC ? [{
    //     plan_id: choosedParentGMC.id,
    //     policy_id: choosedParentGMC.policy_id,
    //     policy_suminsured: choosedParentGMC.suminsured,
    //     policy_premium: choosedParentGMC.premium,
    //     employee_premium: choosedParentGMC.employee_premium,
    //     employer_premium: choosedParentGMC.employer_premium,
    //     plan_name: choosedParentGMC.plan_name,
    //     policy_name: choosedParentGMC.policy_name,
    //     product_id: choosedParentGMC.product_id,
    //     is_parent_plan: 1,

    //     relations: choosedParentGMC.relations,

    //     benefits_suminsured: 0,
    //     benefits_premium: 0,
    //   }] : []
    //   ]
    // }, { history })
  }


  const TotalPremium = (GMCDetail.employee_premium || 0) + (choosedTopupGMC?.employee_premium || 0) + (benefitDetailsGMC.benefits_premium || 0) + (choosedParentGMC?.employee_premium || 0) +
    (GPADetail.employee_premium || 0) + (choosedTopupGPA?.employee_premium || 0) + (benefitDetailsGPA.benefits_premium || 0) + (choosedParentGPA?.employee_premium || 0) +
    (GTLDetail.employee_premium || 0) + (choosedTopupGTL?.employee_premium || 0) + (benefitDetailsGTL.benefits_premium || 0) + (choosedParentGTL?.employee_premium || 0)

  return (

    <Modal
      size="xl"
      show={!!lgShow}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex"
    >
      <ModalHeader className="justify-content-between mb-0">
        <div>
          <div className="ml-4 mb-2">
            <small className={classes.cardHeading}>Flex Summary</small>
          </div>
        </div>
        <div onClick={onHide} style={{ color: globalTheme?.Tab?.color }} className={classesone.redColor}>
          <i className="fas fa-times"></i>
        </div>
      </ModalHeader>
      <Modal.Body>
        <div className="row w-100">
          <div
            className={`col-12 col-xl-4  ml-4 ml-xl-0 ${classes.borderRight}`}
          >
            {/* GMC */}
            {!!GMCDetail.plan_id && <Card globalTheme={globalTheme} detail={GMCDetail} topup={choosedTopupGMC?.sum_with_base_policy === 1 && choosedTopupGMC} parent={choosedParentGMC} />}
            {!!(benefitDetailsGMC.benefits_premium || benefitDetailsGMC.benefits_suminsured) &&
              <Card globalTheme={globalTheme} mt='4' detail={{ plan_name: 'Add On GMC', employee_premium: benefitDetailsGMC.benefits_premium, policy_suminsured: benefitDetailsGMC.benefits_suminsured }} />}
            {choosedTopupGMC && choosedTopupGMC.sum_with_base_policy !== 1 && <Card globalTheme={globalTheme} mt='4' detail={choosedTopupGMC} />}
            {choosedParentGMC && <Card globalTheme={globalTheme} mt='4' detail={choosedParentGMC} />}

            {/* GPA */}
            {!!GPADetail.plan_id && <Card globalTheme={globalTheme} mt='4' detail={GPADetail} topup={choosedTopupGPA?.sum_with_base_policy === 1 && choosedTopupGPA} parent={choosedParentGPA} />}
            {!!(benefitDetailsGPA.benefits_premium || benefitDetailsGPA.benefits_suminsured) &&
              <Card globalTheme={globalTheme} mt='4' detail={{ plan_name: 'Add On GPA', employee_premium: benefitDetailsGPA.benefits_premium, policy_suminsured: benefitDetailsGPA.benefits_suminsured }} />}
            {choosedTopupGPA && <Card globalTheme={globalTheme} mt='4' detail={choosedTopupGPA} />}
            {choosedParentGPA && <Card globalTheme={globalTheme} mt='4' detail={choosedParentGPA} />}

            {/* GTL */}
            {!!GTLDetail.plan_id && <Card globalTheme={globalTheme} mt='4' detail={GTLDetail} topup={choosedTopupGTL?.sum_with_base_policy === 1 && choosedTopupGTL} parent={choosedParentGTL} />}
            {!!(benefitDetailsGTL.benefits_premium || benefitDetailsGTL.benefits_suminsured) &&
              <Card globalTheme={globalTheme} mt='4' detail={{ plan_name: 'Add On GTL', employee_premium: benefitDetailsGTL.benefits_premium, policy_suminsured: benefitDetailsGTL.benefits_suminsured }} />}
            {choosedTopupGTL && <Card globalTheme={globalTheme} mt='4' detail={choosedTopupGTL} />}
            {choosedParentGTL && <Card globalTheme={globalTheme} mt='4' detail={choosedParentGTL} />}


          </div>
          <div className="col-12 ml-3 ml-xl-0 col-xl-8 w-100">
            <div
              className={`row py-3 ml-1 ml-xl-0 py-xl-0 pb-xl-2 w-100 ${classes.borderBottom}`}
            >
              {!!GMCDetail.plan_id && <div className="w-100 col-4 text-center">
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "500", background: tab === 1 ? globalTheme?.Tab?.color : ' rgb(217 217 217)' }}
                  className={`d-none d-lg-block py-1 px-4 rounded ${tab === 1
                    ? `${classes.darkRedBackTab}`
                    : `text-dark ${classes.tab}`
                    }`}
                  onClick={() =>
                    setTab(1)
                  }
                >
                  Group Mediclaim
                  {tab === 1 && (
                    <div className={`${classes.arrow}`} style={{ color: globalTheme?.Tab?.color }}>
                      <i className="fas fa-caret-down"></i>
                    </div>
                  )}
                </small>
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "500", background: tab === 1 ? globalTheme?.Tab?.color : ' rgb(217 217 217)' }}
                  className={` d-block d-lg-none py-1 px-4 rounded ${tab === 1
                    ? `${classes.darkRedBackTab}`
                    : `text-dark ${classes.tab}`
                    }`}
                  onClick={() =>
                    setTab(1)
                  }
                >
                  GMC
                  {tab === 1 && (
                    <div className={`${classes.arrow}`} style={{ color: globalTheme?.Tab?.color }}>
                      <i className="fas fa-caret-down"></i>
                    </div>
                  )}
                </small>
              </div>}
              {!!GPADetail.plan_id && <div className="w-100 col-4 text-center">
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "500", background: tab === 2 ? globalTheme?.Tab?.color : ' rgb(217 217 217)' }}
                  className={`py-1 d-none d-lg-block  px-3 rounded ${tab === 2
                    ? `${classes.darkRedBackTab}`
                    : `text-dark ${classes.tab}`
                    }`}
                  onClick={() =>
                    setTab(2)
                  }
                >
                  Group Personal Accident
                  {tab === 2 && (
                    <div className={`${classes.arrow}`} style={{ color: globalTheme?.Tab?.color }}>
                      <i className="fas fa-caret-down"></i>
                    </div>
                  )}
                </small>
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "500", background: tab === 2 ? globalTheme?.Tab?.color : ' rgb(217 217 217)' }}
                  className={`d-block d-lg-none py-1 px-4 rounded ${tab === 2
                    ? `${classes.darkRedBackTab}`
                    : `text-dark ${classes.tab}`
                    }`}
                  onClick={() =>
                    setTab(2)
                  }
                >
                  GPA
                  {tab === 2 && (
                    <div className={`${classes.arrow}`} style={{ color: globalTheme?.Tab?.color }}>
                      <i className="fas fa-caret-down"></i>
                    </div>
                  )}
                </small>
              </div>}
              {!!GTLDetail.plan_id && <div className="w-100  col-4 text-center">
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "500", background: tab === 3 ? globalTheme?.Tab?.color : ' rgb(217 217 217)' }}
                  className={`py-1  d-none d-lg-block px-4 rounded ${tab === 3
                    ? `${classes.darkRedBackTab}`
                    : `text-dark ${classes.tab}`
                    }`}
                  onClick={() =>
                    setTab(3)
                  }
                >
                  Group Term Life
                  {tab === 3 && (
                    <div className={`${classes.arrow}`} style={{ color: globalTheme?.Tab?.color }}>
                      <i className="fas fa-caret-down"></i>
                    </div>
                  )}
                </small>
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "500", background: tab === 3 ? globalTheme?.Tab?.color : ' rgb(217 217 217)' }}
                  className={`d-block d-lg-none py-1 px-4 rounded ${tab === 3
                    ? `${classes.darkRedBackTab}`
                    : `text-dark ${classes.tab}`
                    }`}
                  onClick={() =>
                    setTab(3)
                  }
                >
                  GTL
                  {tab === 3 && (
                    <div className={`${classes.arrow}`} style={{ color: globalTheme?.Tab?.color }}>
                      <i className="fas fa-caret-down"></i>
                    </div>
                  )}
                </small>
              </div>}
            </div>
            <div>
              <div className="m-2 row w-100">
                {!!(GMCDetail.product_features?.length || GPADetail.product_features?.length || GTLDetail.product_features?.length) && <div className="my-3 border rounded col-12">
                  <div
                    style={{ borderRadius: "5px", color: globalTheme?.Tab?.color, background: globalTheme?.Tab?.color + '12' }}
                    className={`py-1 my-1 ${classes.darkRed} text-center ${classes.pinkBack} ${classes.bold}`}
                  >
                    Product Features
                  </div>
                  <table className="w-100 mb-1">
                    {/* on the tab one clicked */}
                    {tab === 1 && GMCDetail.product_features.map(({ title, content }, index) =>
                      <tr key={index + '-product_features'} className="w-100 border-bottom border-light">
                        <td
                          style={{ fontWeight: "600" }}
                          className="text-dark py-2"
                        >
                          {title}
                        </td>
                        <th className="text-right">{content}</th>
                      </tr>
                    )}
                    {/* when tab two clicked */}
                    {tab === 2 && GPADetail.product_features.map(({ title, content }, index) =>
                      <tr key={index + '-product_features'} className="w-100 border-bottom border-light">
                        <td
                          style={{ fontWeight: "600" }}
                          className="text-dark py-2"
                        >
                          {title}
                        </td>
                        <th className="text-right">{content}</th>
                      </tr>
                    )}
                    {/* when three is pressed */}
                    {tab === 3 && GTLDetail.product_features.map(({ title, content }, index) =>
                      <tr key={index + '-product_features'} className="w-100 border-bottom border-light">
                        <td
                          style={{ fontWeight: "600" }}
                          className="text-dark py-2"
                        >
                          {title}
                        </td>
                        <th className="text-right">{content}</th>
                      </tr>
                    )}
                  </table>
                </div>}
                <div className="my-3 border rounded col-12">
                  {!!(GMCDetail?.choosedBenefits?.length || GPADetail.choosedBenefits?.length || GTLDetail.choosedBenefits?.length) && <div
                    style={{ borderRadius: "5px", color: globalTheme?.Tab?.color, background: globalTheme?.Tab?.color + '12' }}
                    className={`py-1 my-1  ${classes.darkRed}  text-center ${classes.pinkBack} ${classes.bold}`}
                  >
                    Add On Coverages
                  </div>}
                  {tab === 1 && (
                    <table className="w-100 mb-1">
                      {GMCDetail?.choosedBenefits?.length ? GMCDetail?.choosedBenefits?.map(({ benefit_name, benefit_description, benefit_feature_details, ...rest }, index) => {
                        const selectedFeature = benefit_feature_details[0] || {};

                        const parentRelation = { no_of_parents: GMCDetail.relations.filter(({ relation_id }) => [5, 6].includes(+relation_id))?.length || 0, no_of_parent_in_laws: GMCDetail.relations.filter(({ relation_id }) => [7, 8].includes(+relation_id))?.length || 0 };
                        const currentPremium = (selectedFeature.has_capping_data && (parentRelation.no_of_parents || parentRelation.no_of_parent_in_laws)) ?
                          ExtractPremium({ ...parentRelation, suminsured: GMCDetail.policy_suminsured, premium: GMCDetail.employee_premium, pro_rate_percentage_calculation: GMCDetail.pro_rate_percentage_calculation }, selectedFeature)
                          : CalculatePR(selectedFeature, GMCDetail.premium, GMCDetail.policy_suminsured, undefined, GMCDetail.pro_rate_percentage_calculation);

                        const SIText = CalculateSI({ ...selectedFeature, cover_type: 2 }, GMCDetail.policy_suminsured);

                        return <tr key={index + '-choosedBenefits'} className="w-100 border-bottom border-light">
                          <td
                            style={{ fontWeight: "600" }}
                            className="text-dark py-2 d-inline"
                          >
                            {benefit_name} {selectedFeature.feature_name && `: ${selectedFeature.feature_name}`}
                            {!!selectedFeature?.feature_description && <ToolTipDiv>
                              <OverlayTrigger
                                key={"home-india"}
                                placement={"top"}
                                overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{selectedFeature?.feature_description}</Tooltip>}>
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

                          </td>
                          <th className="text-right" style={{ whiteSpace: "nowrap" }}>

                            <OverlayTrigger
                              key={"home-india"}
                              placement={"top-end"}
                              overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>
                                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {['-', '', null, undefined].includes(selectedFeature?.feature_description) ? 'Covered' : selectedFeature?.feature_description}
                                </span>
                              </Tooltip>}>
                              <div>
                                {BenefitText({ ...selectedFeature, SIText }, currentPremium, globalTheme, benefit_name, GMCDetail.policy_suminsured)}
                              </div>
                            </OverlayTrigger>
                            { }
                          </th>
                        </tr>
                      }) : <div style={{ textAlign: 'center' }}>
                        <img src={getURL['GMC']} alt={'GMC'} style={{
                          height: '250px',
                          maxHeight: '250px'
                        }} />
                      </div>}
                    </table>
                  )}

                  {tab === 2 && (
                    <table className="w-100 mb-1">
                      {GPADetail.choosedBenefits?.length ? GPADetail.choosedBenefits.map(({ benefit_name, benefit_description, benefit_feature_details }, index) => {
                        const selectedFeature = benefit_feature_details[0] || {};

                        const parentRelation = { no_of_parents: GPADetail.relations.filter(({ relation_id }) => [5, 6].includes(+relation_id))?.length || 0, no_of_parent_in_laws: GPADetail.relations.filter(({ relation_id }) => [7, 8].includes(+relation_id))?.length || 0 };
                        const currentPremium = (selectedFeature.has_capping_data && (parentRelation.no_of_parents || parentRelation.no_of_parent_in_laws)) ?
                          ExtractPremium({ ...parentRelation, suminsured: GPADetail.policy_suminsured, premium: GPADetail.employee_premium, pro_rate_percentage_calculation: GPADetail.pro_rate_percentage_calculation }, selectedFeature)
                          : CalculatePR(selectedFeature, GPADetail.premium, GPADetail.policy_suminsured, undefined, GPADetail.pro_rate_percentage_calculation);

                        return <tr key={index + '-choosedBenefits'} className="w-100 border-bottom border-light">
                          <td
                            style={{ fontWeight: "600" }}
                            className="text-dark py-2"
                          >
                            {benefit_name}

                          </td>
                          <th className="text-right" style={{ whiteSpace: "nowrap" }}>

                            <OverlayTrigger
                              key={"home-india"}
                              placement={"top-end"}
                              overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>
                                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {['-', '', null, undefined].includes(benefit_description) ? 'Covered' : benefit_description}
                                </span>
                              </Tooltip>}>
                              <div>
                                {BenefitText(selectedFeature, currentPremium, globalTheme, benefit_name, GPADetail.policy_suminsured)}
                              </div>
                            </OverlayTrigger>
                            { }
                          </th>
                        </tr>
                      }) : <div style={{ textAlign: 'center' }}>
                        <img src={getURL['GPA']} alt={'GPA'} style={{
                          height: '250px',
                          maxHeight: '250px'
                        }} />
                      </div>}
                    </table>
                  )}

                  {tab === 3 && (
                    <table className="w-100 mb-1">
                      {GTLDetail.choosedBenefits?.length ? GTLDetail.choosedBenefits.map(({ benefit_name, benefit_description, benefit_feature_details }, index) => {
                        const selectedFeature = benefit_feature_details[0] || {};

                        const parentRelation = { no_of_parents: GTLDetail.relations.filter(({ relation_id }) => [5, 6].includes(+relation_id))?.length || 0, no_of_parent_in_laws: GTLDetail.relations.filter(({ relation_id }) => [7, 8].includes(+relation_id))?.length || 0 };
                        const currentPremium = (selectedFeature.has_capping_data && (parentRelation.no_of_parents || parentRelation.no_of_parent_in_laws)) ?
                          ExtractPremium({ ...parentRelation, suminsured: GTLDetail.policy_suminsured, premium: GTLDetail.employee_premium, pro_rate_percentage_calculation: GTLDetail.pro_rate_percentage_calculation }, selectedFeature)
                          : CalculatePR(selectedFeature, GTLDetail.premium, GTLDetail.policy_suminsured, undefined, GTLDetail.pro_rate_percentage_calculation);

                        return <tr key={index + '-choosedBenefits'} className="w-100 border-bottom border-light">
                          <td
                            style={{ fontWeight: "600" }}
                            className="text-dark py-2"
                          >
                            {benefit_name}

                          </td>
                          <th className="text-right" style={{ whiteSpace: "nowrap" }}>

                            <OverlayTrigger
                              key={"home-india"}
                              placement={"top-end"}
                              overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>
                                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {['-', '', null, undefined].includes(benefit_description) ? 'Covered' : benefit_description}
                                </span>
                              </Tooltip>}>
                              <div>
                                {BenefitText(selectedFeature, currentPremium, globalTheme, benefit_name, GTLDetail.policy_suminsured)}
                              </div>
                            </OverlayTrigger>
                            { }
                          </th>
                        </tr>
                      }) : <div style={{ textAlign: 'center' }}>
                        <img src={getURL['GTL']} alt={'GTL'} style={{
                          height: '250px',
                          maxHeight: '250px'
                        }} />
                      </div>}
                    </table>
                  )}
                </div>
              </div>
              {!!(GMCDetail.uncovered_benefits?.length || GPADetail.uncovered_benefits?.length || GTLDetail.uncovered_benefits?.length) && <div className="mx-3">
                <h3
                  style={{ fontWeight: "600", color: globalTheme?.Tab?.color }}
                  className={`${classes.darkRed}`}
                >
                  What's not covered?
                </h3>
                <table className="w-100 mb-1">
                  {tab === 1 && GMCDetail.uncovered_benefits.map(({ benefit_name, benefit_description }, index) => <tr key={index + '-uncovered_benefits'} className="w-100 border-bottom border-light">
                    <td
                      style={{ fontWeight: "600" }}
                      className="text-dark py-2"
                    >
                      {benefit_name}
                    </td>
                    <th className="text-right">{benefit_description}</th>
                  </tr>)}
                  {tab === 2 && GPADetail.uncovered_benefits.map(({ benefit_name, benefit_description }, index) => <tr key={index + '-uncovered_benefits'} className="w-100 border-bottom border-light">
                    <td
                      style={{ fontWeight: "600" }}
                      className="text-dark py-2"
                    >
                      {benefit_name}
                    </td>
                    <th className="text-right">{benefit_description}</th>
                  </tr>)}
                  {tab === 3 && GTLDetail.uncovered_benefits.map(({ benefit_name, benefit_description }, index) => <tr key={index + '-uncovered_benefits'} className="w-100 border-bottom border-light">
                    <td
                      style={{ fontWeight: "600" }}
                      className="text-dark py-2"
                    >
                      {benefit_name}
                    </td>
                    <th className="text-right">{benefit_description}</th>
                  </tr>)}
                </table>
              </div>}
              <div className="mx-5">
                <div className={`row ${classes.borderRadius}`}>
                  <div className={`col-12 col-lg-4 ${classes.borderRight}`}>
                    <div className="p-1 text-center">
                      {GMCDetail.plan_name && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {GMCDetail.plan_name}
                      </span>}
                      {!!benefitDetailsGMC.benefits_premium && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        Add On
                      </span>}
                      {choosedTopupGMC && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {choosedTopupGMC.plan_name}
                      </span>}
                      {choosedParentGMC && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {choosedParentGMC.plan_name}
                      </span>}

                      {GPADetail.plan_name && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {GPADetail.plan_name}
                      </span>}
                      {!!benefitDetailsGPA.benefits_premium && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        Add On
                      </span>}
                      {choosedTopupGPA && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {choosedTopupGPA.plan_name}
                      </span>}
                      {choosedParentGPA && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {choosedParentGPA.plan_name}
                      </span>}

                      {GTLDetail.plan_name && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {GTLDetail.plan_name}
                      </span>}
                      {!!benefitDetailsGTL.benefits_premium && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        Add On
                      </span>}
                      {choosedTopupGTL && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {choosedTopupGTL.plan_name}
                      </span>}
                      {choosedParentGTL && <span
                        style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", background: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
                        className={`badge mt-1 badge-pill py-2 px-4 text-light ${classes.darkRedBack}`}
                      >
                        {choosedParentGTL.plan_name}
                      </span>}
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 text-center my-auto">
                    <div className="mt-2">
                      <small
                        style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}
                        className={`text-dark ${classes.bold}`}
                      >
                        Total {TotalPremium < 0 ? 'Amount Credit' : 'Premium'}
                      </small>
                      <div>
                        <small
                          style={{ color: globalTheme?.Tab?.color }}
                          className={` ${classes.darkRed}  ${classes.cardHeading}`}
                        >
                          ₹ {NumberInd(Math.abs(TotalPremium))} /-
                        </small>
                        <br /><span className={`ml-2 ${classes.bold}`}>
                          (Incl GST)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 py-2 py-lg-0 align-self-center">
                    <div onClick={onSubmit} style={{ background: globalTheme?.Tab?.color }} className={classes.proceedButton}>
                      <div style={{ fontSize: globalTheme.fontSize ? `calc(22px + ${globalTheme.fontSize - 92}%)` : '22px', fontWeight: "600" }}>
                        Proceed
                      </div>
                      <div className="mt-1">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal >
  );
};

export default FlexModal;
