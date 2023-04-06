import React, { useEffect, useReducer, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import classesone from "modules/enrollment/index.module.css";
import FirstStep from "modules/enrollment/NewDesignComponents/FirstStep";
import { Loader } from "../../../../components";
import { InsuredMembers } from "./InsuredMembers";
import { NomineeMembers } from "./NomineeMembers";

import { useDispatch, useSelector } from "react-redux";
import { backStep, nextStep, enrollment, set_step } from "modules/enrollment/enrollment.slice";
import { initialState, loadPolicyDeclaration, loadTempStorage, reducer } from "../employee-flex.action";
import { RightContainer } from "../../../core/layout/Layout";
import { isNomineeThere, loadConfirmtion } from "../../../enrollment/enrollment.slice";
import { Confirmation } from "./Confirmation";
import { loadPolicy } from "../../../policies/approve-policy/approve-policy.slice";
// import { GetSumInsuredType } from "../flex.plan";
import Prototype from "modules/announcements/prototype.js";
import SideBar from "./Sidebar";

const EnrollmentComponents = (nominee_present) => [
  { label: 'Employee Details', Component: FirstStep },
  { label: 'Insured Member', Component: InsuredMembers },
  ...nominee_present ? [{ label: 'Nominee Into Policy', Component: NomineeMembers }] : [],
  { label: 'Confirmation', Component: Confirmation },
]

function getStepContent({ step, handleBack, handleNext, tempData, dispatch, nominee_present, policyContent }) {
  const SelectedComp = EnrollmentComponents(nominee_present)[step];
  return <SelectedComp.Component
    handleNext={handleNext}
    handleBack={handleBack}
    tempData={tempData}
    dispatch={dispatch}
    policyContent={policyContent}
  />
}

export default function FlexStepper({ myModule }) {

  const reduxDispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const { step, nominee_present } = useSelector(enrollment);
  const { currentUser } = useSelector(state => state.login);
  const [{ tempData, loading }, dispatch] = useReducer(reducer, initialState);
  const [policyContent, setPolicyContent] = useState(null);

  useEffect(() => {
    loadTempStorage(dispatch)
    reduxDispatch(loadConfirmtion())

    return () => { reduxDispatch(set_step()) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step])

  useEffect(() => {
    if (currentUser && tempData && tempData?.flex_details?.length) {
      loadPolicyDeclaration({
        master_system_trigger_id: 25,
        employer_id: currentUser.employer_id,
        broker_id: currentUser.broker_id,
      }, tempData?.flex_details, setPolicyContent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, tempData])

  useEffect(() => {
    if (tempData?.flex_details) {
      const firstBasePolicyId = tempData?.flex_details.find(({ product_id }) => [1, 2, 3].includes(product_id)).policy_id
      // nominee exist ?
      reduxDispatch(isNomineeThere(tempData?.flex_details.map(({ policy_id }) => ({ id: policy_id })), currentUser.employer_id))

      // policy
      reduxDispatch(loadPolicy(firstBasePolicyId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempData])

  const handleNext = () => {
    reduxDispatch(nextStep());
  };

  const handleBack = () => {
    reduxDispatch(backStep());
  };


  const steps = EnrollmentComponents(nominee_present).map(({ label }) =>
    <span key={'getSteps' + label} style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}>
      {label}
    </span>);

  return (
    <>
      <Prototype
        position='Top'
        url={['', 'employee', 'policy-flexible-benefits']}
      />

      <div className="row m-0 flex-wrap">
        <div
          className={`col-12 col-lg-9 h-100 row mx-0 my-2 justify-content-center shadow-lg bg-white ${classesone.card}`}>
          <div className="d-flex w-100 justify-content-start flex-column flex-sm-row border-bottom border-secondary">
            {steps.map((label, index) => (<ThemeColor active={index <= step}
              key={index + '-steps'}
              // onClick={() => reduxDispatch(set_step(index))}
              style={{ height: '40px' }}
              className={`${classesone.redBackColor} ${classesone.flagborder} ${classesone.flagborder_radius} d-flex mb-0 mr-4 justify-content-center align-items-center mt-3 px-5 py-2 py-sm-0 h5`}>
              {label}
            </ThemeColor>))}
          </div>

          <div className="col-12 py-4 w-100">
            <div style={{ height: '100%', display: 'flex', flexWrap: 'wrap', alignContent: 'space-between' }}>
              {getStepContent({ step, handleBack, handleNext, tempData, dispatch, nominee_present, policyContent })}
            </div>
          </div>

          {loading && <Loader />}
          <GlobalStyle />
        </div>
        <div className="col-12 col-lg-3" style={{ minWidth: '270px' }}>
          <SideBar flex_details={tempData?.flex_details || []} />
        </div>
      </div>
      <Prototype
        position='Bottom'
        url={['', 'employee', 'policy-flexible-benefits']}
      />
    </>
  );
}

const ThemeColor = styled.small`
  background: ${({ theme, active }) => active ? (theme.Tab?.color || "#e11a22") : '#ccc'};
  color: ${({ active }) => active ? "#fff" : '#000'};
`;

export const StepperThemeColor = styled.div`
  height: 340px;
  width: 250px;
  border: 1px solid #ccc;
  background-color: azure;
`;

export const Vline = styled.div`
  border-left: 8px solid ${({ theme }) => theme?.Tab?.color};
  height: 35px;
  position: absolute;
  margin-left: -35px;
  border-top-left-radius: 10px;
  border-top-right-radius: 13px 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 13px 15px;
  left: 35px;`

const GlobalStyle = createGlobalStyle`
  ${RightContainer}{
    overflow: unset;
    @media (max-width: 992px) {
      overflow: hidden;
    }
  }
`;
