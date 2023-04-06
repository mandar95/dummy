/* eslint-disable eqeqeq */
import React, { useContext, useState, useEffect } from 'react';
import styled from "styled-components";

import { Col, Row, Accordion, Card as BSCard, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { StyledButton } from "modules/RFQ/data-upload/style.js";

import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";
import { OptionInput } from "modules/flexbenefit/style.js";

import { Controller } from "react-hook-form";
import classes from "../flexbenefit.module.css";
import { ViewPolicyFlex } from './ViewPolicyFlex';
import { comma } from "modules/enrollment/NewDesignComponents/ForthStep";
import { ContextAwareToggle as ContextAwareToggleImp } from '../../enrollment/enrollment.help';
import { ModuleControl } from '../../../config/module-control';
import { useSelector } from 'react-redux';

export const RelationName = {
  1: "Self",
  2: "Spouse",
  3: "Daughter",
  4: "Son",
  5: "Father",
  6: "Mother",
  7: "Father-in-law",
  8: "Mother-in-law",
  9: "Sibling",
  10: "Partner",
}

export const MYTypography = styled.div`
cursor: pointer;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};    
    
    color: #606060;
    display: inline-block;
    letter-spacing: 1px;
    margin-left: 11px;
    margin-bottom:11px;
`

export const InputWrapper = styled.div`

width: 130px;
word-break: break-word;
max-width: none;
text-align: center;
display:flex;
flex-direction:column;
    padding-left:5px;
     padding-right: 5px;
    margin-bottom: 12px;
    margin-top: 0;
    height: 100px;
    justify-content: space-around;
    border-radius: 16px;
     border: 1px solid #d6d6d6;

    .custom-control-label {
        &:before {
            border-radius: 100%;
            height: 20px;
            width: 20px;
            background-color: #f9ffff;
            border: 1px solid #41807f;
            margin-top: -13px;
            margin-left: 12px;
        }
    }
    .custom-control-label {
        &:after {
          
    top: -10px;
    left: -7px;

        }
    }
    .custom-control-input:checked~.custom-control-label::before {
        border-color: #41807f;
        background-color: #41807f;
        height: 20px;
        width: 20px;
    }
    .custom-control-label::after{
        height: 20px;
        width: 20px;
        cursor: pointer;
    }

    .custom-control-input:checked~.custom-control-label::after {
        background-image: none !important;
        left: -3px;
        top: -6px;
        width: 6px;
        height: 10px;
        border: solid rgb(255 255 255);
        border-width: 0 2px 2px 0;
        transform: rotate( 45deg);
        zoom: 1.2;
    }

    .custom-control-label {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};  
        padding-left: 5px;
        padding-top: 2px;
        letter-spacing: 0.3px;
        margin-top: 4px;
        color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
        

        padding-left: 8px;
        padding-top: 3px;
        
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    }
`;

export const ContextAwareToggle = ({ children, eventKey, callback }) => {
  const { globalTheme } = useSelector(state => state.theme)
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => {
      callback && callback(eventKey);
    }
  );
  const isCurrentEventKey = currentEventKey === eventKey;
  return (
    <StyledButton
      color='#60c385;'
      variant="link"
      className="open-button"
      onClick={decoratedOnClick}
      relative={'relative'}
      style={{ marginTop: '22px' }}>
      {isCurrentEventKey ? (<i style={{
        color: '#41807f',
        fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px',
        paddingBottom: '7px',
        cursor: 'grabbing'
      }} className="arrow fa-minus" />) :
        (<i style={{
          color: '#41807f',
          fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px',
          paddingBottom: '7px',
          cursor: 'grabbing'
        }} className="arrow fa-plus" />)}
    </StyledButton>
  );
};


export const CustomCheck = (min_si, premium) => {

  if (typeof premium === "string") {
    const [base_suminsured = 0] = (premium || '')?.split(',');
    if ((base_suminsured >= min_si) || !min_si || min_si === 0) return true
    else return false
  }
  return true;
}

export const GetPremiumType = {
  1: '',//Discount
  2: 'To Pay',//Loading
  3: ''//
}
export const CalculatePremium = ({ premium_type, premium_by, premium, capping_data,
  has_capping_data }, base_premium, base_cover,
  { no_of_parents, no_of_parent_in_laws } = {}) => {

  if (has_capping_data && capping_data?.length) {
    const selectCapData = capping_data.find(({ sum_insured }) => Number(sum_insured) === Number(base_cover));
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
      return total
    }

  }
  /* Loading */
  if (premium_type === 2) {
    if (premium_by === 1) return Number(premium)
    else return (Number(premium) * Number(base_premium)) / 100;
  }


  return 0;
}

export const GetSumInsuredType = {
  1: 'Including', // Including
  2: 'Additional', // Additional
  3: '' // No Cover
}

const CalculateSumInsured = ({ cover_type, cover_by, cover }, base_suminsured) => {

  /* Additional */
  if (cover_type === 2) {
    if (cover_by === 1) return Number(cover)
    else return (Number(cover) * Number(base_suminsured)) / 100;
  }

  return 0;
}


export const SeperateOpd = ({
  totalPremium = 0, totalSumInsured = 0,
  base_premium = 0, base_suminsured = 0,
  AllFeatures = [], feature_id = [], v
}) => {
  const OPD_Features = AllFeatures.filter(({ is_opd, id }) => is_opd && feature_id.includes(id));

  const OPD_Premium = OPD_Features.reduce((total, elem) => {
    return total + (CalculatePremium(elem, base_premium) || 0)
  }, 0);

  const OPD_SumInsured = OPD_Features.reduce((total, elem) => {
    return total + (CalculateSumInsured(elem, base_suminsured) || 0)
  }, 0);

  const Parents_Feature = AllFeatures.filter(({ is_parent_premium, id }) => is_parent_premium && feature_id.includes(id));

  const Parent_Premium = Parents_Feature.reduce((total, elem) => {
    return total + (CalculatePremium(
      elem,
      base_premium,
      base_suminsured, { no_of_parents: v.no_of_parents, no_of_parent_in_laws: 0 }) || 0)
  }, 0);

  const Parent_InLaw_Premium = Parents_Feature.reduce((total, elem) => {
    return total + (CalculatePremium(
      elem,
      base_premium,
      base_suminsured, { no_of_parents: 0, no_of_parent_in_laws: v.no_of_parent_in_laws }) || 0)
  }, 0);

  return {
    benefit_suminsured: (Number(totalSumInsured) - Number(base_suminsured) - OPD_SumInsured) || 0, // benefit cover 
    benefit_premium: (Number(totalPremium) - Number(base_premium) - OPD_Premium - Parent_Premium - Parent_InLaw_Premium) || 0, // benefit premium

    final_base_opd_cover: OPD_SumInsured || 0, // opd cover
    final_base_opd_premium: OPD_Premium || 0, // opd premium

    ...Parent_Premium && { parent_premium: Parent_Premium || 0 }, // parent premium
    ...Parent_InLaw_Premium && { parent_in_law_premium: Parent_InLaw_Premium || 0 } // parent in law premium
  }
}


export const GetSrc = (id) => {
  if ([1, 4].includes(id)) return '/assets/images/GMC_k.png'
  if ([2, 5].includes(id)) return '/assets/images/GPA_k.png'
  if ([3, 6].includes(id)) return '/assets/images/GTL.png'
}

export const shouldHidePremium = ({ salary, flex_sum_insured_value }, sum_insured, checkFrom = 3) => {
  const indexOfSalary3 = salary.findIndex(({ no_of_times_of_salary }) => Number(no_of_times_of_salary) === checkFrom);

  if (Number(flex_sum_insured_value[indexOfSalary3]) === Number(sum_insured)) {
    return true;
  }
  return false;
}

const isHowden = ModuleControl.isHowden

export function PackageUpdate({ v, packageIndex, control, register,
  watch, setValue, currentUser,
  setTotalPremium: anotherSetTotalPremium, setTotalSumInsured: anotherSetTotalSumInsured,
  setKey, setUpdateFlag, updateFlag, AllowedSubmit }) {

  const { globalTheme } = useSelector(state => state.theme)

  const UdaanLogicActivate = v.policy_rater_type_id === 5 &&
    isHowden &&
    ((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited'));

  const UdaanLogicActivateHidePremium = isHowden &&
    ((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('robin software development') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('rakuten')) && !!v.salary?.length;

  const PearsonLogicActivateHidePremium = isHowden && (currentUser?.company_name || '').toLowerCase().startsWith('pearson') && !!v.salary?.length;

  const [totalPremium, setTotalPremium] = useState(null);
  const [totalSumInsured, setTotalSumInsured] = useState(null);


  const [AllFeatures, setAllFeatures] = useState([]);


  const selfSI = v?.relation_wise_si_gpa?.find(({ relation_id }) => relation_id === 1)?.suminsureds
  const indexofSelfSI = selfSI?.indexOf(v?.current_cover);
  const parent = watch(`flex[${packageIndex}].parent`) || [];
  const premium = watch(`flex[${packageIndex}].premium`) ||
    (v?.relation_wise_si_gpa?.length ? [v?.current_cover,
    v?.relation_wise_pi_gpa
      .reduce((total, { employee_premium }, index) => {

        return total + employee_premium[indexofSelfSI]
      }, 0)]
      .join(',')
      : (v?.enhance_suminsureds?.length && v.current_enhance_cover) ? [v.current_enhance_cover, v?.enhance_premiums?.[v?.enhance_suminsureds?.findIndex(({ sum_insured }) => Number(sum_insured) === Number(v.current_enhance_cover))]?.total_premium || 0].join(',')
        : (v.current_cover && !v?.enhance_suminsureds?.length ? (
          (typeof v?.flex_sum_insured_value === "object") && v?.flex_sum_insured_value ?
            [v.current_cover, ((UdaanLogicActivateHidePremium || PearsonLogicActivateHidePremium) && shouldHidePremium(v, v.current_cover, PearsonLogicActivateHidePremium ? 2 : 3)) ? 0 : v.flex_employee_premium[v?.flex_sum_insured_value.indexOf(v.current_cover)]]
            : [v.current_cover, v.grade_premium[v.grade_suminsured.indexOf(v.current_cover)]?.family_premium]) :
          [0, 0]
        ).join(','));

  useEffect(() => {
    if (updateFlag < 3)
      setUpdateFlag(prev => prev + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFlag])

  useEffect(() => {
    if (v?.benefits?.length) {
      const all_features = [];

      (v.benefits || []).forEach(({ features, benefit_name }) =>
        (features || []).forEach((elem) =>
          all_features.push({
            ...elem,
            is_opd: (benefit_name.toLowerCase()).includes('opd') ? 1 : 0,
            is_parent_premium: (!!Number(elem.has_capping_data) && elem.capping_data?.length) ? 1 : 0
          })));

      setAllFeatures(all_features);
    }
  }, [v])


  useEffect(() => {
    if (typeof premium === "string") {
      const [base_suminsured = 0, base_premium = 0] = (premium || '')?.split(',');
      const all_feature_keys = parent.filter(({ child }) => !!child).map(({ child }) => child) || [];

      const feature_premium = all_feature_keys.reduce((total, i) => {
        return total + (CalculatePremium(
          AllFeatures.length ? AllFeatures.find((({ id }) => Number(id) === Number(i))) : {},
          base_premium, base_suminsured, { no_of_parents: v.no_of_parents, no_of_parent_in_laws: v.no_of_parent_in_laws }) || 0)
      }, 0);

      const feature_suminsured = all_feature_keys.reduce((total, i) => {
        return total + (CalculateSumInsured(AllFeatures.length ? AllFeatures.find((({ id }) => Number(id) === Number(i))) : {}, base_suminsured) || 0)
      }, 0);

      setTotalPremium(Number(feature_premium) + Number(base_premium))
      setTotalSumInsured(Number(feature_suminsured) + Number(base_suminsured))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent, premium])

  useEffect(() => {
    // Udaan Logic
    let udaanPremium = 0
    if (UdaanLogicActivate) {
      if (v.adult_count === 1 && (v.child_count === 0 || !!v.child_count)) {
        udaanPremium = -4000;
      }
      if (((v.no_of_parents || 0) + (v.no_of_parent_in_laws || 0)) === 0 && !!(v.adult_count > 1 || v.child_count)) {
        udaanPremium = -2500;
      }
    }

    anotherSetTotalPremium(prev => [
      ...prev.slice(0, packageIndex),
      Number(totalPremium) + udaanPremium,
      ...prev.slice(packageIndex + 1)
    ])
    anotherSetTotalSumInsured(prev => [
      ...prev.slice(0, packageIndex),
      totalSumInsured,
      ...prev.slice(packageIndex + 1)
    ])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPremium, totalSumInsured])

  const benefit_ids = v.benefit_ids?.split(',') || [];
  const feature_ids = v.feature_ids?.split(',') || [];


  const NameFn = (elem, childIndex, id, isParent, showInput) => {
    const [base_suminsured = 0, base_premium = 0] = (premium || '')?.split(',');
    const ParentPrem = isParent && (CalculatePremium(
      AllFeatures.length ? AllFeatures.find((({ id }) => Number(id) === Number(elem.id))) : {},
      base_premium, base_suminsured, { no_of_parents: v.no_of_parents, no_of_parent_in_laws: v.no_of_parent_in_laws }) || '')
    return (
      <OptionInput label_padding={!showInput} width='auto' small key={"child-feature1" + childIndex} className="d-flex">
        {showInput && <><input
          onClick={() => { setUpdateFlag(prev => prev + 1) }}
          name={`flex[${packageIndex}].parent[${id}].child`}
          type={"radio"}
          ref={register}
          value={String(elem?.id)}
          defaultChecked={feature_ids.includes(String(elem?.id)) || childIndex === 0}
        />
          <span></span>
        </>}
        <div className='label_name'>
          {!!elem.name && elem.name} {!!((elem.cover && GetSumInsuredType[elem.cover_type]) || (elem.premium && GetPremiumType[elem.premium_type])) && ':'} {!!elem.cover && !!GetSumInsuredType[elem.cover_type] && `${GetSumInsuredType[elem.cover_type]} Suminsured ${elem.cover_by === 2 ? `${comma(elem.cover) || 0}% of Base Sum Insured` : `₹${comma(elem.cover) || 0}`}`}
          {!!(elem.premium && GetPremiumType[elem.premium_type] && elem.cover && GetSumInsuredType[elem.cover_type]) && ` - `}
          {!!elem.premium && !!GetPremiumType[elem.premium_type] && `${GetPremiumType[elem.premium_type]} Annual Premium ${elem.premium_by === 2 ? `${comma(elem.premium) || 0}% of Base Annual Premium` : `₹${comma(elem.premium) || 0}`}`}
          <small> (Incl GST)</small>
          {!!ParentPrem && <>- Premium ₹{ParentPrem}</>}
          {!!elem.description && <OverlayTrigger
            key={"home-india"}
            placement={"top"}
            overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{elem.description}</Tooltip>}>
            <svg
              className="icon icon-info cursor-help"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 35 35"
              fill="#8D9194">
              <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
              <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
              <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
            </svg>
          </OverlayTrigger>}
        </div>
      </OptionInput>
    );
  }

  return AllowedSubmit ? (!!(v?.grade_suminsured?.length) || (v?.flex_sum_insured_value)) && (
    <Col key={'plan_' + packageIndex} xl={12} lg={12} md={12} sm={12} style={{ marginBottom: '20px' }}>
      <Accordion defaultActiveKey={packageIndex + 1} style={{
        boxShadow: '1px 1px 16px 0px #e7e7e7'
      }}>
        <Accordion.Toggle onClick={(e) => {
          setKey(prev => {
            const prevCopy = [...prev]
            prevCopy[packageIndex] = !prevCopy[packageIndex]
            return prevCopy
          })
        }} eventKey={packageIndex + 1} style={{
          width: '100%',
          border: 'none',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          background: 'white',
          padding: '10px',

        }} className='d-flex justify-content-between align-items-center'>
          <div style={{
            fontWeight: '500',
            fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
            letterSpacing: '1px',
            color: 'black'
          }}>
            <img
              src={GetSrc(v.policy_sub_type_id)}
              alt={'policy_image_404'}
              style={{
                borderRadius: "5px",
                textAlign: "center",
                marginRight: '10px',
                height: '40px'
              }} />
            {v.policy_name}</div>
          <ContextAwareToggleImp eventKey={packageIndex + 1} />
        </Accordion.Toggle>
        {true &&
          <Accordion.Collapse eventKey={packageIndex + 1} style={{
            width: '100%',
            paddingTop: '15px',
            background: 'white',
            borderTop: '2px solid #41807f',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px'
          }}>
            <div isHeder={false} style={{ paddingBottom: '1px' }}>
              {!!v.description &&
                <Row style={{
                  padding: '0px 20px'
                }}>
                  <span style={{
                    marginBottom: '15px',
                    padding: '0px 10px',
                    whiteSpace: 'pre-line',
                    fontWeight: '500',
                    fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
                    letterSpacing: '1.5px'
                  }}>  {v.description}</span>

                </Row>
              }
              <Row style={{
                padding: '0px 20px',
                display: 'flex',
                justifyContent: 'end'
              }}>

                <div style={{
                  display: 'flex',
                  background: '#dcebeb',
                  padding: '1px 10px',
                  borderRadius: '5px',
                  letterSpacing: '1px',
                  marginTop: '-5px',
                  marginRight: '-6px'
                }}>
                  <div style={{ color: '#41807F', fontWeight: '500' }}>Policy No &nbsp;-</div>&nbsp;<div style={{ color: '#41807F', fontWeight: '500' }}>{v.policy_number || "-"}</div>
                </div>
              </Row>
              <MYTypography>{'\u00A0'}Select Sum Insured</MYTypography>
              <Row className='m-0' style={{ padding: '0px 15px' }}
              >

                {v?.relation_wise_si_gpa?.length ? (selfSI?.map((sum_insured, index) => {
                  // const isCurrentSI = sum_insured === v.current_cover;
                  const currentSIPremium = v?.relation_wise_pi_gpa
                    .reduce((total, { employee_premium, relation_id }) =>
                      total + employee_premium[index], 0)

                  const viewValueArray = [
                    sum_insured,
                    currentSIPremium
                  ]
                  const value = viewValueArray.join(',');



                  return (
                    <div>
                      <div className="p-2" key={packageIndex + sum_insured + index}>
                        <InputWrapper className={`h-100 custom-control custom-radio`}>
                          <Controller
                            as={
                              <input
                                id={`flex[${packageIndex}][${sum_insured}]`}
                                className="custom-control-input"
                                type="radio"
                                checked={premium === value}
                                onClick={() => { setUpdateFlag(prev => prev + 1) }}
                                defaultChecked={((v.current_cover) == (sum_insured))} />
                            }
                            value={value}
                            onClick={() => {
                              return (premium === value) ? setValue(`flex[${packageIndex}].premium`, '') : ''
                            }}
                            onChange={([e]) => {
                              return !premium[packageIndex]?.premium ? (e.target.checked && value) : ''
                            }}
                            name={`flex[${packageIndex}].premium`}
                            control={control} />
                          <label className="custom-control-label" style={{ padding: '7px 0px 0px', margin: '0px' }} htmlFor={`flex[${packageIndex}][${sum_insured}]`}>
                          </label>
                          <div> <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!sum_insured && `Suminsured`}</span><br></br><span>{!!sum_insured && `₹${comma(sum_insured)}`}</span></div>
                          {!!(sum_insured && (viewValueArray[1] > 0)) && <div style={{
                            borderTop: '2px dashed'
                          }}></div>}
                          <div>
                            <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!(viewValueArray[1] > 0) && `Annual Premium`}</span> <br></br><span>{!!(viewValueArray[1] > 0) && `₹${/*(String(viewValueArray[1]).includes('.') && viewValueArray[1]) ? viewValueArray[1].toFixed(2) :*/ comma(viewValueArray[1])}`}</span>
                            {(viewValueArray[1] > 0) && <small> (Incl GST)</small>}
                          </div>
                        </InputWrapper>
                        <div style={{ marginTop: '-13px' }} key={packageIndex + sum_insured + index}>
                          <InputWrapper className={`h-100 custom-control custom-radio `}>
                            {v?.relation_wise_si_gpa.map(({ suminsureds, relation_id }, childIndex) => relation_id !== 1 && (
                              <div key={childIndex}> <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>
                                {!!suminsureds[index] && (RelationName[relation_id] + ` Suminsured`)}</span><br></br><span>{!!suminsureds[index] && `₹${comma(suminsureds[index])}`}</span>
                              </div>
                            ))}

                          </InputWrapper>
                        </div>
                      </div>
                    </div>)
                }))
                  : v?.enhance_suminsureds?.length ? (v?.enhance_suminsureds?.map(({ sum_insured }, index) => {
                    const viewValueArray = [
                      sum_insured,
                      v?.enhance_premiums?.[index]?.total_premium
                    ]
                    const value = viewValueArray.join(',');

                    return (
                      <div className="p-2" key={packageIndex + sum_insured + index}>
                        <InputWrapper className={`h-100 custom-control custom-radio ${((v?.current_enhance_cover ? v?.current_enhance_cover : v.current_cover) == sum_insured) ? classes.selected_suminsured : ''}`}>
                          <Controller
                            as={
                              <input
                                id={`flex[${packageIndex}][${sum_insured}]`}
                                className="custom-control-input"
                                type="radio"
                                checked={premium === value}
                                onClick={() => { setUpdateFlag(prev => prev + 1) }}
                                defaultChecked={((v?.current_enhance_cover ? v?.current_enhance_cover : v.current_cover) == (sum_insured))} />
                            }
                            value={value}
                            onClick={() => {
                              return (premium === value) ? setValue(`flex[${packageIndex}].premium`, '') : ''
                            }}
                            onChange={([e]) => {
                              return !premium[packageIndex]?.premium ? (e.target.checked && value) : ''
                            }}
                            name={`flex[${packageIndex}].premium`}
                            control={control} />
                          <label className="custom-control-label" style={{ padding: '7px 0px 0px', margin: '0px' }} htmlFor={`flex[${packageIndex}][${sum_insured}]`}>
                          </label>
                          <div> <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!sum_insured && `Enhance Suminsured`}</span><br></br><span>{!!sum_insured && `₹${comma(sum_insured)}`}</span></div>
                          {!!(sum_insured && (viewValueArray[1] > 0)) && <div style={{
                            borderTop: '2px dashed'
                          }}></div>}
                          <div>
                            <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!(viewValueArray[1] > 0) && `Annual Premium`}</span> <br></br><span>{!!(viewValueArray[1] > 0) && `₹${/*(String(viewValueArray[1]).includes('.') && viewValueArray[1]) ? viewValueArray[1].toFixed(2) :*/ comma(viewValueArray[1])}`}</span>
                            {(viewValueArray[1] > 0) && <small> (Incl GST)</small>}
                          </div>
                        </InputWrapper>
                      </div>)
                  })) :
                    <>
                      {v?.grade_suminsured?.map((sum_insured, index) => {
                        const viewValueArray = [
                          sum_insured,
                          v.grade_premium[index]?.family_premium
                        ]
                        const value = viewValueArray.join(',');

                        return (
                          <div className="p-2" key={packageIndex + sum_insured + index}>
                            <InputWrapper className={`h-100 custom-control custom-radio ${v.current_cover === sum_insured ? classes.selected_suminsured : ''}`}>
                              <Controller
                                as={
                                  <input
                                    id={`flex[${packageIndex}][${sum_insured}]`}
                                    className="custom-control-input"
                                    type="radio"
                                    checked={premium === value}
                                    onClick={() => { setUpdateFlag(prev => prev + 1) }}
                                    defaultChecked={(v.current_cover === sum_insured)} />
                                }
                                value={value}
                                onClick={() => {
                                  return (premium === value) ? setValue(`flex[${packageIndex}].premium`, '') : ''
                                }}
                                onChange={([e]) => {
                                  return !premium[packageIndex].premium ? (e.target.checked && value) : ''
                                }}
                                name={`flex[${packageIndex}].premium`}
                                control={control} />
                              <label className="custom-control-label" style={{ padding: '0px', margin: '0px' }} htmlFor={`flex[${packageIndex}][${sum_insured}]`}>
                              </label>
                              <div> <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!sum_insured && `Suminsured`}</span><br></br><span>{!!sum_insured && `₹${comma(sum_insured)}`}</span></div>
                              {!!(sum_insured && (viewValueArray[1] > 0)) && <div style={{
                                borderTop: '2px dashed'
                              }}></div>}
                              <div>
                                <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!(viewValueArray[1] > 0) && `Annual Premium`}</span> <br></br><span>{(viewValueArray[1] > 0) && `₹${/*(String(viewValueArray[1]).includes('.') && viewValueArray[1]) ? viewValueArray[1].toFixed(2) :*/ comma(viewValueArray[1])}`}</span>
                                {(viewValueArray[1] > 0) && <small> (Incl GST)</small>}
                              </div>
                            </InputWrapper>
                          </div>)
                      })}
                      {(typeof v?.flex_sum_insured_value === "object") && v?.flex_sum_insured_value?.map((sum_insured, index) => {
                        const viewValueArray = [
                          sum_insured,
                          ((UdaanLogicActivateHidePremium || PearsonLogicActivateHidePremium) && shouldHidePremium(v, sum_insured, PearsonLogicActivateHidePremium ? 2 : 3)) ? 0 : v.flex_employee_premium[index]
                        ]
                        const value = viewValueArray.join(',');

                        const no_of_time = v.salary?.length ?
                          (String(v.salary[index]?.no_of_times_of_salary).includes('.00') ? Number(v.salary[index]?.no_of_times_of_salary) : Number(v.salary[index]?.no_of_times_of_salary).toFixed(2))
                          : null;

                        return (
                          <div className="p-2" key={packageIndex + sum_insured + index}>
                            <InputWrapper className={`h-100 custom-control custom-radio ${v.current_cover === sum_insured ? classes.selected_suminsured : ''}`}>
                              <Controller
                                as={
                                  <input
                                    id={`flex[${packageIndex}][${sum_insured}]`}
                                    className="custom-control-input"
                                    type="radio"
                                    checked={premium === value}
                                    onClick={() => { setUpdateFlag(prev => prev + 1) }}
                                    defaultChecked={(v.current_cover === sum_insured)}
                                  />
                                }
                                value={value}
                                onClick={() => {
                                  return (premium === value) ? setValue(`flex[${packageIndex}].premium`, '') : ''
                                }}
                                onChange={([e]) => e.target.checked && value}
                                name={`flex[${packageIndex}].premium`}
                                control={control}
                              />
                              <label className="custom-control-label" style={{ padding: !!(no_of_time) ? '7px 0px 0px' : '0px', margin: '0px' }} htmlFor={`flex[${packageIndex}][${sum_insured}]`}>
                              </label>
                              {!!(no_of_time) && <><div className='mr-1'> <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!no_of_time && `No. of time CTC: ${no_of_time}`}</span><br></br><span>
                              </span></div>
                                <div style={{
                                  borderTop: '2px dashed'
                                }}></div></>}
                              <div> {!!sum_insured && `Suminsured`}<br></br><span>{!!sum_insured && `₹${comma(sum_insured)}`}</span></div>
                              {!!(sum_insured && (viewValueArray[1] > 0)) && <div
                                style={{
                                  borderTop: '2px dashed'
                                }}
                              ></div>}
                              <div>
                                {!!(viewValueArray[1] > 0) && `Annual Premium`} <br></br><span>{(viewValueArray[1] > 0) && `₹${comma(String(viewValueArray[1]).includes('.') ? viewValueArray[1].toFixed(2) : viewValueArray[1])}`}</span>
                                {(viewValueArray[1] > 0) && <small> (Incl GST)</small>}
                              </div>
                            </InputWrapper>
                          </div>)
                      })}
                    </>
                }

              </Row>
              <Row className='m-0'>
                <Col md={12} lg={12} xl={12} sm={12} />
                {v?.benefits?.map(({ benefit_description, benefit_name, features, id, min_enchance_si_limit }, index) => !!features?.length && CustomCheck(min_enchance_si_limit, premium) &&
                  <Col key={id + 'benefit'} md={12} lg={12} xl={6} sm={12} className='mb-2' >
                    <Accordion defaultActiveKey={index + 1}>
                      <BSCard className='border'>
                        <Accordion.Toggle as={BSCard.Header} eventKey={index + 1}>
                          <OptionInput notAllowed={(benefit_name === 'Parental Enhancement' && (v.no_of_parents || v.no_of_parent_in_laws))} width='auto' single key={"feature" + index} className="d-flex mt-6px">
                            <input
                              onClick={() => { setUpdateFlag(prev => prev + 1) }}
                              name={`flex[${packageIndex}].parent[${id}].id`}
                              type={"checkbox"}
                              ref={register}
                              disabled={(benefit_name === 'Parental Enhancement' && (v.no_of_parents || v.no_of_parent_in_laws))}
                              value={id}
                              defaultChecked={benefit_ids.includes(String(id)) || (benefit_name === 'Parental Enhancement' && (v.no_of_parents || v.no_of_parent_in_laws))} />
                            <span></span>
                            <div className='label_name'>
                              {benefit_name}
                              {!!benefit_description && <OverlayTrigger
                                key={"home-india"}
                                placement={"top"}
                                overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{benefit_description}</Tooltip>}>
                                <svg
                                  className="icon icon-info cursor-help"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 35 35"
                                  fill="#8D9194">
                                  <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                                  <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                                  <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                                </svg>
                              </OverlayTrigger>}
                            </div>
                          </OptionInput>
                          <ContextAwareToggle eventKey={index + 1} />
                        </Accordion.Toggle>
                        {/* !!parent[id]?.id && */ <Accordion.Collapse eventKey={index + 1}>
                          <BSCard.Body>
                            {features && (features.map((elem, i) => CustomCheck(elem.min_enhance_si_limit, premium) &&
                              <div key={`flex[${packageIndex}][${i}][${id}]`} className={classes.box_xircle}>
                                {NameFn(elem, i, id, (benefit_name === 'Parental Enhancement' && (v.no_of_parents || v.no_of_parent_in_laws)), !!parent[id]?.id)}
                              </div>))}
                          </BSCard.Body>
                        </Accordion.Collapse>}
                      </BSCard>
                    </Accordion>
                  </Col>)}
              </Row>
              <Row className="ml-2 mt-2 mb-5">
                <Col md={12} lg={12} xl={6} sm={12} className={classes.minus_4_margin}>
                  {v?.benefits.map(({ benefit_description, benefit_name, features, id }, index) => !features?.length && !!benefit_name &&
                    <OptionInput single key={"feature" + id} className="d-flex mt-6px">
                      <input
                        onClick={() => { setUpdateFlag(prev => prev + 1) }}
                        name={`flex[${packageIndex}].parent[${id}].id`}
                        type={"checkbox"}
                        ref={register}
                        value={id}
                        defaultChecked={benefit_ids.includes(String(id))} />
                      <span></span>
                      <div className='label_name'>
                        {benefit_name}
                        {!!benefit_description && <OverlayTrigger
                          key={"home-india"}
                          placement={"top"}
                          overlay={<Tooltip id={"tooltip-home-india"}>{benefit_description}</Tooltip>}>
                          <svg
                            className="icon icon-info cursor-help"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 35 35"
                            fill="#8D9194">
                            <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                            <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                            <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                          </svg>
                        </OverlayTrigger>}
                      </div>
                    </OptionInput>)}
                </Col>
              </Row>

              {!!UdaanLogicActivate &&
                <Row style={{
                  padding: '0px 20px'
                }}>
                  <span style={{
                    marginBottom: '15px',
                    padding: '0px 10px',
                    whiteSpace: 'pre-line',
                    fontWeight: '500',
                    fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
                    letterSpacing: '1.5px'
                  }}>

                    {/* No Dependant 4000 */}
                    {v.adult_count === 1 && (v.child_count === 0 || !v.child_count) && 'No Dependents Enrolled - Flex Credit of ₹4,000'}

                    {/* No Parent 2500 */}
                    {(((v.no_of_parents || 0) + (v.no_of_parent_in_laws || 0)) === 0 &&
                      !!(v.adult_count > 1 || v.child_count)) &&
                      'No Parent Enrolled - Flex Credit of ₹2,500'}

                  </span>

                </Row>
              }
            </div>
          </Accordion.Collapse>
        }
      </Accordion>
    </Col >
  ) : <ViewPolicyFlex v={v} feature_ids={feature_ids} parent={parent}
    AllFeatures={AllFeatures} premium={premium} benefit_ids={benefit_ids}
    UdaanLogicActivate={UdaanLogicActivate} UdaanLogicActivateHidePremium={UdaanLogicActivateHidePremium}
    PearsonLogicActivateHidePremium={PearsonLogicActivateHidePremium}

    packageIndex={packageIndex} control={control} register={register}
    setKey={setKey} setUpdateFlag={setUpdateFlag} />
}
