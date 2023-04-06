import React, { useState, useEffect } from 'react';
import swal from "@sweetalert/with-react";
import vector from "./Vectors/Vector-4.png";
import styled from "styled-components";
import classesone from "../index.module.css";
// import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements"
import { InputWrapper } from 'modules/policies/steps/additional-details/styles';
import { Controller, useForm } from 'react-hook-form';
import { enrollment, clear, enrollAllConfirmation, /* loadConfirmtion, */ loadAllSalaryDeduction, loadDeclaration, set_step, loadPolicyId } from '../enrollment.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { calculatePremiumInstallment } from './TopUp';
import { Head, OptionInput } from "modules/enrollment/style";
import { CardContentConatiner } from "modules/Insurance/style";
import { Marker, Typography } from "components";
import { ModuleControl } from '../../../config/module-control';


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

const NotTATA = !ModuleControl.isTATA

const RedirectToNextPolicyType = (policies = [], current_policies = [], history, selectPolicy, dispatch, have_flex_policy) => {
  const policy = policies.filter(
    ({ policy_sub_type_id, id, enrollement_status }) =>
      policy_sub_type_id <= 3 && enrollement_status === 1 && !current_policies.find(({ id: policy_id }) => policy_id === id));

  if (policy.length) {
    selectPolicy(policy[0].id, false)
    dispatch(set_step())
    dispatch(loadPolicyId(true));
  } else {
    history.replace(have_flex_policy ? 'flex-benefits' : '/home')
  }
}
const FivthStep = ({ childFunc, policy_ids, pId, flex_balance, selectPolicy }) => {
  const { control } = useForm({})
  const history = useHistory();
  const { globalTheme } = useSelector(state => state.theme)
  const [confirm, setConfirm] = useState(0);
  const dispatch = useDispatch();
  const { confirmation, /* flex, */ salary_deduction, loading, error, success,
    have_flex_policy, installments, declaration, policies } = useSelector(enrollment);
  const { currentUser } = useSelector((state) => state.login);
  const [selectedInstallment, setselectedInstallment] = useState(null);

  const isDeclaration = ((declaration?.type === 1 && policy_ids?.length === 1) || (declaration?.type === 2 && policy_ids?.length >= 1))

  useEffect(() => {
    dispatch(loadAllSalaryDeduction(policy_ids))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (confirmation.note) {
  //     if (installments?.length && salary_deduction && !confirmation.is_installment_selected) {
  //       setselectedInstallment(installments?.[installments?.length - 1]?.id || null)
  //     }
  //   }
  // }, [installments, salary_deduction, confirmation])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {

      swal(<div className='d-flex flex-wrap pt-3 justify-content-center'>
        {success.map(({ message }, index) =>
          <p key={index + 'confirm'}>{policy_ids[index].policy_name} : {message} </p>)}
      </div>
        , success, "success")
        .then(() => (true /* Enrolment Redirection */ ?
          RedirectToNextPolicyType(policies, policy_ids, history, selectPolicy, dispatch, have_flex_policy) :
          history.replace(have_flex_policy ? 'flex-benefits' : '/home')));
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);
  useEffect(() => {
    childFunc.current = finalSubmit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirm, selectedInstallment])

  useEffect(() => {
    if (currentUser) {
      dispatch(loadDeclaration({
        master_system_trigger_id: 25,
        employer_id: currentUser.employer_id,
        broker_id: currentUser.broker_id,
        policy_id: pId
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])


  useEffect(() => {
    if (!!declaration) {
      setTimeout(() => {
        let _data = document.getElementById(`declarationDiv`);
        if (_data) {
          _data.innerHTML = declaration?.view
        }
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [declaration])
  // const EnrolmentAllowed = policy_ids.some(({ baseEnrolmentStatus }) => baseEnrolmentStatus);

  const finalSubmit = () => {
    if ((!confirmation.is_installment_selected || !confirmation.no_of_installment_opted_for) && !!salary_deduction && installments?.length && !selectedInstallment) {
      swal('Installment Is Mandatory', '', "info");
      return
    }
    if (confirm /* || !EnrolmentAllowed */) {
      if (have_flex_policy) {
        swal('Success', 'You can enhance your coverage under Flexible Benefit Program.', "success").then(() => history.replace('flex-benefits'));
        return
      } else {
        dispatch(
          enrollAllConfirmation({
            policy_ids: policy_ids,
            confirmation_flag: confirm || 1,
            ...installments.length && {
              selectedInstallment:
                selectedInstallment ||
                installments.find(({ installment }) => Number(installment) === Number(confirmation.no_of_installment_opted_for))?.id
            }
          })
        );
        return null;
      }
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

  const EmployeeSalaryDeduct = salary_deduction - (flex_balance?.flex_utilized_amt || 0)



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
                        salary_deduction / installment
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

  const DeclarationConfigUI = () => {
    return (
      <div className={classesone.divRelativeForm}>
        <div style={{ borderRadius: "20px", border: "1px solid blue" }} className="col-12">
          <div className='row' id="declarationDiv" style={{
            padding: '10px',
            wordBreak: 'break-word',
            width: '100%'
          }}></div>
          <div className='row' style={{ padding: '10px' }}>
            {!!(installments || [])?.length && !!salary_deduction && !(confirmation.is_installment_selected && confirmation.no_of_installment_opted_for) && (
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
      </div >
    )
  }

  return isDeclaration ? DeclarationConfigUI() :
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

        {!!(installments || [])?.length && !!salary_deduction && !(confirmation.is_installment_selected && confirmation.no_of_installment_opted_for) && (
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

              {((!have_flex_policy) && !!(EmployeeSalaryDeduct || flex_balance?.flex_utilized_amt)) &&
                <p className='agree-pay-div'>I {/* EnrolmentAllowed ? */ 'agree' /* : 'agreed' */} to pay{' '}
                  {!!EmployeeSalaryDeduct && <>₹<strong>{String(EmployeeSalaryDeduct).includes(".") ? EmployeeSalaryDeduct.toFixed(2) : EmployeeSalaryDeduct}</strong> {ModuleControl.isUIB ? currentUser.employer_id !== 13 : true && <small>(Incl GST)</small>}
                    {!!(installments.length && confirmation.is_installment_selected && confirmation.no_of_installment_opted_for) ? <> in <strong>{confirmation.no_of_installment_opted_for} month</strong> of installment </> :
                      !!selectedInstallment && <> in <strong>{
                        installments?.find(
                          ({ id }) => id === selectedInstallment
                        )?.installment
                      } month</strong> of installment</>}
                    {' '}from my salary </>}

                  {!!(flex_balance?.flex_utilized_amt && EmployeeSalaryDeduct) && ` & `}

                  {!!(flex_balance?.flex_utilized_amt) && <>₹<strong>{String(flex_balance?.flex_utilized_amt).includes(".") ? flex_balance?.flex_utilized_amt.toFixed(2) : flex_balance?.flex_utilized_amt}</strong> {ModuleControl.isUIB ? currentUser.employer_id !== 13 : true && <small>(Incl GST)</small>}
                    {' '}from my flex wallet</>}
                  .</p>}
              <p style={{
                fontWeight: '500',
                fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                letterSpacing: '1px'
              }}> {/* EnrolmentAllowed ? */ confirmation.title /* : (confirmation.title || '').replace('confirm', 'had confirmed') */}</p>
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
      </div>
    </div>

}

export default FivthStep;
