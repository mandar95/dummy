import React, { useEffect, useState } from 'react';
import swal from "@sweetalert/with-react";
import vector from "../../../enrollment/NewDesignComponents/Vectors/Vector-4.png";
import styled, { createGlobalStyle } from "styled-components";
import classesone from "../../../enrollment/index.module.css";
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements"
import { InputWrapper } from 'modules/policies/steps/additional-details/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { saveEnrolment } from '../employee-flex.action';
import { NumberInd } from '../../../../utils';
import { Col, Row } from 'react-bootstrap';
import { Head, OptionInput } from "modules/enrollment/style";
import { CardContentConatiner } from "modules/Insurance/style";
import { ModuleControl } from '../../../../config/module-control';
import { calculatePremiumInstallment } from '../../../enrollment/NewDesignComponents/TopUp';
import { Marker, Typography } from '../../../../components';

const NotTATA = !ModuleControl.isTATA

const GlobalStyle = createGlobalStyle`
td {
  padding: 0 !important;
}
.block-grid {
  max-width: initial !important;
}
`

// const installments = [{ installment: 1, id: 1 }, { installment: 2, id: 2 }, { installment: 3, id: 3 }, { installment: 4, id: 4 }]

const ConfirmDiv = styled.div`
width: 123px;
padding: 1px 0px;
border-radius: 14px;
background: #fde8e8;
border: 1px solid #5267e1;
border: ${({ theme }) => '1px solid ' + theme.Tab?.color};
`
const ConfirmLabel = styled.label`
color: ${({ theme }) => theme.Tab?.color + ` !important`};
`

// const ExtractOPD = (flex_details) => {
//   const benefits = flex_details.reduce((ben, { benefits_features }) => [...ben, ...(benefits_features || [])], [])
//   const OPDBenefit = benefits.find(({ benefit_feature_name }) => ((benefit_feature_name).toLowerCase()).includes('opd'))
//   if (OPDBenefit) {
//     return {
//       opd_suminsured: OPDBenefit.benefit_feature_suminsured,
//       opd_premium: OPDBenefit.benefit_feature_premium,
//       opd_employee_contribution: OPDBenefit.benefit_feature_premium,
//       opd_employer_contribution: 0
//     }
//   }
//   return {}
// }

const ExtractParentData = (flex_details) => {
  const benefitsChoosed = flex_details.reduce((ben, { choosedBenefits }) => [...ben, ...(choosedBenefits || [])], [])
  const benefits = flex_details.reduce((ben, { benefits_features }) => [...ben, ...(benefits_features || [])], [])
  const ParentBenefitChoosed = benefitsChoosed.find(({ benefit_feature_details }) => {
    if (benefit_feature_details.some(({ has_capping_data, capping_data }) => has_capping_data && capping_data.length)) {
      return true
    }
    return false
  })
  const ParentBenefit = benefits.find(({ benefit_id }) => +ParentBenefitChoosed?.id === +benefit_id)
  if (ParentBenefit) {
    return {
      sum_insured: ParentBenefit.benefit_feature_suminsured,
      premium: ParentBenefit.benefit_feature_premium,
      benefit_feature_name: ParentBenefit.benefit_feature_name
    }
  }
  return {}
}

function replaceChar(origString, replaceChar, indexStart, indexEnd) {
  let firstPart = origString.substr(0, indexStart);
  let lastPart = origString.substr(indexEnd);

  let newString = firstPart + replaceChar + lastPart;
  return newString;
}

export const Confirmation = ({ handleBack, tempData, dispatch, policyContent }) => {

  const { control } = useForm({});
  const { globalTheme } = useSelector(state => state.theme);
  const history = useHistory();
  const [confirm, setConfirm] = useState(0);
  const { confirmation } = useSelector(state => state.enrollment);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [installments, setInstallments] = useState([]);
  const [selectedInstallment, setselectedInstallment] = useState(null);

  useEffect(() => {
    if (!!policyContent) {
      setTimeout(() => {
        let _data = document.getElementById(`declarationDiv`);
        if (_data) {
          _data.innerHTML = replaceChar(policyContent, `<b>  ₹${NumberInd(TotalPremium)}</b>  `, policyContent.indexOf('I agree to pay') + 14, policyContent.indexOf('from my salary'));
        }
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyContent])

  useEffect(() => {
    const allInstallments = tempData?.flex_details?.reduce((total, elem) => [...total, ...(elem.installments || [])], [])
    if (allInstallments?.length) {
      const arrayUnique = [...new Map(allInstallments.map(item =>
        [item['installment'], item])).values()];

      setInstallments(arrayUnique.sort(function (a, b) {
        return a?.installment - b?.installment;
      }))
    }
  }, [tempData])

  const TotalPremium = tempData?.flex_details?.reduce((total, { employee_premium = 0, benefits_premium = 0 }) => total + employee_premium + benefits_premium, 0)

  const onSubmit = () => {

    if (!confirmation.is_installment_selected && !confirmation.no_of_installment_opted_for && !!TotalPremium && installments?.length && !selectedInstallment) {
      swal('Installment Is Mandatory', '', "info");
      return
    }
    if (confirm) {
      // const OpdDetail = ExtractOPD(tempData.flex_details);
      const ParentDetail = ExtractParentData(tempData.flex_details);
      let parentAdded = 0;

      const policyToConfirm = query.get('policyToConfirm') || '';

      saveEnrolment(dispatch, {
        ...policyToConfirm && { policy_id_to_be_confirm: policyToConfirm.split(',') },
        policy_details: tempData.flex_details
          .map(({ benefits_features, relation_wise, member_feature, ...elem }) =>
          ({
            ...elem,
            ...(selectedInstallment && installments.length) && { installment_id: selectedInstallment },
            benefits_premium: elem.benefits_premium || 0, ...(benefits_features?.length && {
              benefits_features: benefits_features/* .filter(({ benefit_feature_name }) => ((benefit_feature_name).toLowerCase()) !== 'opd') */
                .map(({ benefit_feature_premium, benefit_feature_suminsured, benefit_feature_suminsured_text, ...rest }) =>
                ({
                  ...rest,
                  ...(rest.benefit_feature_name === ParentDetail.benefit_feature_name) ? { benefit_feature_premium: 0, benefit_feature_suminsured: 0 } : { benefit_feature_premium: benefit_feature_premium || 0, benefit_feature_suminsured },
                  ...(benefit_feature_suminsured_text || !Number(benefit_feature_suminsured)) && { benefit_feature_suminsured: benefit_feature_suminsured_text }
                }))
            }),
            relations: member_feature?.cover > 0 ?
              [...relation_wise
                .map(elem1 => ({
                  ...elem1,
                  ...elem1.relation_id === 1 &&
                  {
                    premium: (elem.employee_premium - member_feature.premium) || 0,
                    employer_premium: elem.employer_premium || 0,
                    // employee_premium: 0
                  }
                })),
              ...member_feature.relation_ids.map(id => ({
                relation_id: id,
                sum_insured: member_feature.cover,
                employer_premium: 0,
                // employee_premium: 0,
                premium: member_feature.premium || 0,
              }))] : relation_wise
          })),
        member_details: tempData.insured_details.map(({ member_contact_no, member_email, member_lastname, ...elem }) => {
          if ([5, 6, 7, 8].includes(+elem.member_relation_id) && ParentDetail.benefit_feature_name) {
            parentAdded += 1
          }
          return ({
            ...elem,
            ...member_contact_no && { member_contact_no },
            ...member_email && { member_email },
            ...member_lastname && { member_lastname },
            is_adopted_child: 0,
            is_special_child: 0,
            adopted_child_document: 0,
            partner_document: 0,
            // ...(+elem.member_relation_id === 1) && OpdDetail,
            ...([5, 6, 7, 8].includes(+elem.member_relation_id) && parentAdded === 1) && ParentDetail
          })
        }),
        ...tempData.nominee_details && tempData.nominee_details.some(elem => elem.nominee_relation && elem.share_per) && { nominee_details: tempData.nominee_details?.map(({ nominee_lname, ...elem }) => ({ ...elem, ...nominee_lname && { nominee_lname } })) || [] }
      }, { history })
    }
    else {
      swal("Required", 'Confirm before enrolling', "info");
    }
  }

  const onChange = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? 1 : 0;
    setConfirm(prev => checked);
    return selected;
  };




  const SelectPremium = (installments || [])?.map(
    ({ installment, id }, index) => (
      <Col md={6} lg={4} xl={3} sm={12} key={installment + id} className="p-3">
        <div
          className="card h-100"
          style={{
            borderRadius: "18px",
            boxShadow: "rgb(179 179 179 / 35%) 1px 1px 12px 0px",
            cursor: "pointer",
          }}
          onClick={() => {
            setselectedInstallment(id);
          }}
        >
          <div className="card-body card-flex-em">
            <OptionInput className="d-flex">
              <input
                name={"installment_id"}
                type={"radio"}
                value={id}
                checked={selectedInstallment === id}
              />
              <span></span>
            </OptionInput>
            <div
              className="row rowButton2"
              style={{
                marginRight: "-15px !important",
                marginLeft: "-15px !important",
              }}
            >
              <CardContentConatiner height={"auto"}>
                <div className="col-md-12 text-center">
                  <Head>
                    {installment} month <br />{" "}
                    {NotTATA &&
                      `Premium ₹${calculatePremiumInstallment(
                        TotalPremium / installment
                      )}/month`}
                  </Head>
                </div>
              </CardContentConatiner>
            </div>
          </div>
        </div>
      </Col>
    )
  );

  const DeclarationConfigUI = <div className={classesone.divRelativeForm}>
    <div style={{ borderRadius: "20px", border: "1px solid blue" }} className="col-12">
      <div className='row' id="declarationDiv" style={{
        padding: '10px',
        wordBreak: 'break-word',
        width: '100%'
      }}></div>
      <div className='row' style={{ padding: '10px' }}>
        {!!(installments || [])?.length && !!TotalPremium && !(confirmation.is_installment_selected && confirmation.no_of_installment_opted_for) && (
          <>
            <Marker />
            <Typography>{"\u00A0"}Premium installment</Typography>
            <div className="col-12">
              <p style={{
                fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                letterSpacing: '1px',
                color: '#727272'
              }}>
                The selected instalment would be applicable for all the policies premium over the application.
              </p>
            </div>
            <Row className='w-100'>{SelectPremium}</Row>
          </>
        )}
        <div className='row' style={{ padding: '10px' }}>
          {/* {((!have_flex_policy) && !!salary_deduction) && <p className='agree-pay-div'>I agree to pay ₹<strong>{salary_deduction}</strong> <small>(Incl GST)</small> */}
          <p className='agree-pay-div'>
            {!!(installments?.length && confirmation.is_installment_selected && confirmation.no_of_installment_opted_for) ? <> No of installment :<strong>{confirmation.no_of_installment_opted_for} month</strong> </> :
              !!selectedInstallment && <> No of installment :<strong>{
                installments?.find(
                  ({ id }) => id === selectedInstallment
                )?.installment
              } month</strong></>}
          </p>
          {/* {' '}from my salary.</p>} */}
        </div>
      </div>
      <div className="row w-100">
        <div className="col-12 col-sm-8 align-self-center text-center text-sm-left">
          {/* EnrolmentAllowed && */ <form >
            <ConfirmDiv>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="customCheck"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={!!confirm} />
                  }
                  name="add_benefit"
                  control={control}
                  onChange={onChange} />

                <ConfirmLabel className="custom-control-label" style={{ fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px', fontWeight: "600" }} htmlFor="customCheck">
                  {`I Agree`}
                </ConfirmLabel>
              </InputWrapper>
            </ConfirmDiv>
          </form>}
        </div>
        <div className="col-12 col-sm-4">
          <div className="d-flex justify-content-center align-items center">
            <img style={{ height: "150px" }} src={vector} alt="" />
          </div>
        </div>
      </div>
    </div>
    <div className="d-flex w-100 flex-column flex-sm-row justify-content-center align-items-center my-2">
      <div className="w-100 d-flex justify-content-center justify-content-sm-start">
        <Button
          type='button'
          onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
          Previous
        </Button>
      </div>
      <div className="w-100">
        <div className="d-flex justify-content-center justify-content-sm-end mt-2 mt-0">
          <Button
            type='button' onClick={onSubmit}>
            {" "}
            Submit
            <i className="fas fa-arrow-right"></i>
          </Button>
        </div>
      </div>
    </div>
    <GlobalStyle />
  </div >


  return policyContent ? DeclarationConfigUI : (
    <>

      <div className={classesone.divRelativeForm}>
        <div className="row">
          <div className="col-12">
            <h5 className="my-2">
              Please verify Your Data for the following:
            </h5>
          </div>

          <div className="col-12" style={{
            letterSpacing: '1px',
            /* color: red; */
            fontWeight: '600',
            lineHeight: '15px',
            marginTop: '20px'
          }}>
            {confirmation?.content?.map((elem) => (
              <p key={elem + 'confirm'}>
                <i className="text-primary mr-2 fas fa-check-circle"></i>{" "}
                {elem}
              </p>
            ))}
          </div>
          <div className="col-12">
            <p style={{
              fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
              letterSpacing: '1px',
              color: '#727272'
            }}>
              {/* You cannot modify the enrolment information post enrollment period
        after which the data submitted by you will not be editable and
        considered as final. */}
              {confirmation.note}
            </p>
          </div>

          {!!(installments || [])?.length && !!TotalPremium && !(confirmation.is_installment_selected && confirmation.no_of_installment_opted_for) && (
            <>
              <Marker />
              <Typography>{"\u00A0"}Premium installment</Typography>
              <div className="col-12">
                <p style={{
                  fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                  letterSpacing: '1px',
                  color: '#727272'
                }}>
                  The selected instalment would be applicable for all the policies premium over the application.
                </p>
              </div>
              <Row className='w-100'>{SelectPremium}</Row>
            </>
          )}

          <div style={{ borderRadius: "20px", border: "1px solid blue" }} className="col-12">
            <div className="row w-100">
              <div className="col-12 col-sm-8 align-self-center text-center text-sm-left">
                {!!(Number(TotalPremium)) && (Number(TotalPremium) > 0 ?
                  (<p className='agree-pay-div'>I agree to pay ₹<strong>{NumberInd(TotalPremium)}</strong> <small>(Incl GST)</small>
                    {!!(installments.length && confirmation.is_installment_selected && confirmation.no_of_installment_opted_for) ? <> in <strong>{confirmation.no_of_installment_opted_for} month</strong> of installment </> :
                      !!selectedInstallment && <> in <strong>{
                        installments?.find(
                          ({ id }) => id === selectedInstallment
                        )?.installment
                      } month</strong> of installment</>}
                    {' '}from my salary.</p>) :
                  (<p className='agree-pay-div'>Amount to be credit ₹<strong>{NumberInd(Math.abs(TotalPremium))}</strong> <small>(Incl GST)</small>
                    .</p>))}
                <p style={{
                  fontWeight: '500',
                  fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                  letterSpacing: '1px'
                }}> {confirmation.title}</p>
                <form>
                  <ConfirmDiv>
                    <InputWrapper className="custom-control custom-checkbox">
                      <Controller
                        as={
                          <input
                            id="customCheck"
                            className="custom-control-input"
                            type="checkbox"
                            defaultChecked={!!confirm} />
                        }
                        name="add_benefit"
                        control={control}
                        onChange={onChange} />

                      <ConfirmLabel className="custom-control-label" style={{ fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px', fontWeight: "600" }} htmlFor="customCheck">
                        {`I Agree`}
                      </ConfirmLabel>
                    </InputWrapper>
                  </ConfirmDiv>
                </form>
              </div>
              <div className="col-12 col-sm-4">
                <div className="d-flex justify-content-center align-items center">
                  <img style={{ height: "150px" }} src={vector} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="d-flex w-100 flex-column flex-sm-row justify-content-center align-items-center my-2">
        <div className="w-100 d-flex justify-content-center justify-content-sm-start">
          <Button
            type='button'
            onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </Button>
        </div>
        <div className="w-100">
          <div className="d-flex justify-content-center justify-content-sm-end mt-2 mt-0">
            <Button
              type='button' onClick={onSubmit}>
              {" "}
              Submit
              <i className="fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
