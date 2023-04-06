/* eslint-disable eqeqeq */
import React from 'react';

import { Col, Row, Accordion, Card as BSCard, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OptionInput } from "modules/flexbenefit/style.js";

import { Controller } from "react-hook-form";
import classes from "../flexbenefit.module.css";
import {
  CalculatePremium, ContextAwareToggle,
  CustomCheck, GetPremiumType, GetSrc, GetSumInsuredType,
  InputWrapper, MYTypography, RelationName, shouldHidePremium
} from './package_update2';
import { comma } from "modules/enrollment/NewDesignComponents/ForthStep";
import { ContextAwareToggle as ContextAwareToggleImp } from '../../enrollment/enrollment.help';
import { useSelector } from 'react-redux';


export function ViewPolicyFlex({
  v, feature_ids, parent,
  AllFeatures, premium, benefit_ids,
  UdaanLogicActivate, UdaanLogicActivateHidePremium,
  PearsonLogicActivateHidePremium,

  packageIndex, control, register,
  setKey, setUpdateFlag }) {

  const { globalTheme } = useSelector(state => state.theme)


  const NameFn = (elem, childIndex, id, isParent, showInput) => {
    const [base_suminsured = 0, base_premium = 0] = (premium || '')?.split(',');

    const ParentPrem = isParent && (CalculatePremium(
      AllFeatures.length ? AllFeatures.find((({ id }) => Number(id) === Number(elem.id))) : {},
      base_premium, base_suminsured, { no_of_parents: v.no_of_parents, no_of_parent_in_laws: v.no_of_parent_in_laws }) || '')
    return (
      <OptionInput label_padding={showInput} width='auto' small key={"child-feature1" + childIndex} className="d-flex">

        <div className='label_name'>
          {!!elem.name && elem.name} {!!((elem.cover && GetSumInsuredType[elem.cover_type]) || (elem.premium && GetPremiumType[elem.premium_type])) && ':'} {!!elem.cover && !!GetSumInsuredType[elem.cover_type] && `${GetSumInsuredType[elem.cover_type]} Suminsured ${elem.cover_by === 2 ? `${comma(elem.cover || 0)}% of Base Sum Insured` : `₹${comma(elem.cover || 0)}`}`}
          {!!(elem.premium && GetPremiumType[elem.premium_type] && elem.cover && GetSumInsuredType[elem.cover_type]) && ` - `}
          {!!elem.premium && !!GetPremiumType[elem.premium_type] && `${GetPremiumType[elem.premium_type]} Annual Premium's ${elem.premium_by === 2 ? `${comma(elem.premium || 0)}% of Base Annual Premium` : `₹${comma(elem.premium || 0)}`}`}
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

  return (!!(v?.grade_suminsured?.length) || (v?.flex_sum_insured_value)) && (
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
            {((v?.current_enhance_cover || v?.enhance_suminsureds?.length) ? v?.current_enhance_cover : v.current_cover)
              ?
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
                <MYTypography>{'\u00A0'}Selected Sum Insured</MYTypography>
                <Row className='m-0' style={{ padding: '0px 15px' }}
                >
                  {v?.relation_wise_si_gpa?.length ? (v?.relation_wise_si_gpa.find(({ relation_id }) =>
                    relation_id === 1)?.suminsureds?.map((sum_insured, index) => {
                      // const isCurrentSI = sum_insured === v.current_cover;

                      if (v.current_cover !== sum_insured) return null;

                      const currentSIPremium = v?.relation_wise_pi_gpa
                        .reduce((total, { employee_premium, relation_id }) =>
                          total + employee_premium[index], 0)

                      const viewValueArray = [
                        sum_insured,
                        currentSIPremium
                      ]

                      return (
                        <div className="p-2" key={packageIndex + sum_insured + index}>
                          <InputWrapper className={`custom-control custom-radio`}>
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
                        </div>)
                    }))
                    : v?.enhance_suminsureds?.length ? (v?.enhance_suminsureds?.map(({ sum_insured }, index) => {
                      const viewValueArray = [
                        sum_insured,
                        v?.enhance_premiums?.[index]?.total_premium
                      ]
                      const value = viewValueArray.join(',');

                      return ((v?.current_enhance_cover ? v?.current_enhance_cover : v.current_cover) == (sum_insured)) && (
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

                          return (v.current_cover === sum_insured) && (
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
                                  name={`flex[${packageIndex}].premium`}
                                  control={control} />
                                <label className="custom-control-label" style={{ padding: '0px', margin: '0px' }} htmlFor={`flex[${packageIndex}][${sum_insured}]`}>
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


                          return (v.current_cover === sum_insured) && (
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
                                  name={`flex[${packageIndex}].premium`}
                                  control={control}
                                />
                                <label className="custom-control-label" style={{ padding: !!(no_of_time) ? '7px 0px 0px' : '0px', margin: '0px' }} htmlFor={`flex[${packageIndex}][${sum_insured}]`}>
                                </label>
                                {!!(no_of_time) && <><div> <span style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}>{!!no_of_time && `No. of time CTC: ${no_of_time}`}</span><br></br><span>
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
                                  {!!(viewValueArray[1] > 0) && `Annual Premium`} <br></br><span>{!!(viewValueArray[1] > 0) && `₹${String(viewValueArray[1]).includes('.') ? viewValueArray[1].toFixed(2) : comma(viewValueArray[1])}`}</span>
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
                    (benefit_ids.includes(String(id)) || (benefit_name === 'Parental Enhancement' && !!(v.no_of_parents || v.no_of_parent_in_laws))) &&
                    <Col key={id + 'benefit'} md={12} lg={12} xl={6} sm={12} className='mb-2' >
                      <Accordion defaultActiveKey={index + 1}>
                        <BSCard className='border'>
                          <Accordion.Toggle as={BSCard.Header} eventKey={index + 1}>
                            <OptionInput notAllowed={(benefit_name === 'Parental Enhancement' && (v.no_of_parents || v.no_of_parent_in_laws))} width='auto' single key={"feature" + index} className="d-flex mt-6px">
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
                                feature_ids.includes(String(elem?.id)) &&
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
                      (benefit_ids.includes(String(id))) &&
                      <OptionInput single key={"feature" + id} className="d-flex mt-6px">
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
                      {(((v.no_of_parents || 0) + (v.no_of_parent_in_laws || 0)) === 0 && v.adult_count > 1) && 'No Parent Enrolled - Flex Credit of ₹2,500'}

                    </span>

                  </Row>
                }
              </div> :
              <MYTypography>{'\u00A0'}No Sum Insured Selected</MYTypography>}
          </Accordion.Collapse>
        }
      </Accordion>
    </Col >
  )
}
