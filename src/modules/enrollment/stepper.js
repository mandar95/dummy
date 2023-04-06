import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import styled from "styled-components";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import classesone from "./index.module.css";
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements";

import FirstStep from "./NewDesignComponents/FirstStep";
import DependentWrapper from "./NewDesignComponents/DependentWrapper";
import NomineeWrapper from "./NewDesignComponents/NomineeWrapper";
import TopupWrapper from "./NewDesignComponents/TopupWrapper";
import FivthStep from "./NewDesignComponents/FivthStep";
import ViewBenifitModal from "./NewDesignComponents/ViewBenifitModal";

import { useDispatch, useSelector } from "react-redux";
import { backStep, nextStep, enrollment, set_step } from "./enrollment.slice";

const EnrollmentComponents = (top_present, nominee_present, base_enrolment_allowed) => [
  { label: 'Basic Policy Details', Component: FirstStep },
  ...base_enrolment_allowed ? [{ label: 'Insured Member', Component: DependentWrapper }] : [],
  ...top_present ? [{ label: 'Add Top Up Cover', Component: TopupWrapper }] : [],
  ...(nominee_present && base_enrolment_allowed) ? [{ label: 'Nominee Into Policy', Component: NomineeWrapper }] : [],
  { label: 'Enrolment Confirmation', Component: FivthStep }
]

function getStepContent(step, steps, data, onSave, top_present,
  childFunc, policy_ids, backStep, nominee_present, pId, base_enrolment_allowed, selectPolicy) {


  const SelectedComp = EnrollmentComponents(top_present, nominee_present, base_enrolment_allowed)[step];


  return <>
    {([policy_ids[0]]).map(({ id, policy_name }) => <SelectedComp.Component
      key={id + '_enrolment'}
      {...data} onSave={onSave}
      childFunc={childFunc}
      policy_name={policy_name}
      flex_balance={data.flex_balance}
      selectPolicy={selectPolicy}
      // nomineeConfig={nomineeConfig}
      // handleNext={handleNext}
      backStep={backStep}
      step={step} steps={steps} pId={pId} />)}
  </>

}

export default function CustomizedSteppers({
  data,
  onSave,
  top_present,
  summary,
  policy_ids,
  nominee_present,
  pId,
  selectPolicy
}) {

  const [modal, setModal] = useState(false);

  const dispatch = useDispatch();
  const { step, nomineeSummary } = useSelector(enrollment);

  const childFunc = useRef(null);
  const { globalTheme } = useSelector(state => state.theme)
  const base_enrolment_allowed = policy_ids.some(({ baseEnrolmentStatus }) => baseEnrolmentStatus)
  const steps = getSteps(top_present, base_enrolment_allowed);

  useEffect(() => {
    return () => { dispatch(set_step()) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === steps.length - 1) {
      setModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);



  function getSteps(top_present, base_enrolment_allowed) {
    return EnrollmentComponents(top_present, nominee_present, base_enrolment_allowed).map(({ label }) =>
      <span key={'getSteps' + label} style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}>
        {label}
      </span>)
  }


  const handleNext = (step) => {
    dispatch(nextStep());
  };

  return (
    <div
      style={{
        marginLeft: "15px",
      }}
      className={`row w-100 justify-content-center shadow-lg  bg-white ${classesone.card}`}
    >
      <div className="d-flex w-100 justify-content-between flex-column flex-sm-row border-bottom border-secondary">
        <ThemeColor
          className={`${classesone.redBackColor} ${classesone.flagborder} d-flex justify-content-center align-items-center mt-3 mb-1 px-5 py-2 py-sm-0 h5`}>
          {EnrollmentComponents(top_present, nominee_present, base_enrolment_allowed)[step]?.label}
        </ThemeColor>
        <div
          style={{ cursor: "pointer" }}
          className={`d-flex justify-content-center align-items-center ${classesone.pinkBack} mt-3 mb-2 mr-2 px-4 py-2`}
          onClick={() => setModal(true)}>
          <ViewBeneift className={`${classesone.fontSize}`}>
            View Benefit Summary{" "}
            <ViewBenefitIcone
              style={{
                borderRadius: "50%",
              }}
              className="ml-2 p-1 far fa-eye" />
          </ViewBeneift>
        </div>
      </div>
      <StepperThemeColor className="d-none d-md-block col-md-3 py-4 w-100 stepper-theme-color">
        <Stepper orientation="vertical" activeStep={step}>
          {steps.map((label) => (
            <Step key={_.uniqueId("stepper")}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </StepperThemeColor>
      <div className="col-12 col-md-9 py-4 w-100">
        {step === steps.length ? (
          <div>
            {/* <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset}>Reset</Button> */}
          </div>
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'space-between',
          }}>
            {getStepContent(
              step,
              steps,
              data,
              onSave,
              top_present,
              childFunc,
              policy_ids,
              backStep,
              nominee_present,
              pId,
              base_enrolment_allowed,
              selectPolicy
            )}
            {!["Nominee Into Policy", "Insured Member", "Add Top Up Cover"].includes(steps[step]?.props?.children) && <div className="d-flex w-100 flex-column flex-sm-row justify-content-center align-items-center my-2">
              <div className="w-100 d-flex justify-content-center justify-content-sm-start">
                {step !== 0 && (
                  <Button
                    disabled={step === 0}
                    onClick={() => dispatch(backStep())}>
                    <i className="fas fa-arrow-left"></i>
                    Previous
                  </Button>
                )}
              </div>
              <div className="w-100">
                {step !== 0 && (
                  <div className="d-flex justify-content-center justify-content-sm-end mt-2 mt-0">
                    <Button
                      onClick={() =>
                        step !== steps.length - 1
                          ? handleNext(steps[step])
                          : childFunc.current()
                      }>
                      {step === steps.length - 1 ? (<>Submit</>)
                        : (<>
                          {" "}
                          Save & Next
                          <i className="fas fa-arrow-right"></i>
                        </>
                        )}
                    </Button>
                  </div>
                )}
              </div>
            </div>}
          </div>
        )}
      </div>
      {modal && (
        <ViewBenifitModal
          show={modal}
          onHide={() => setModal(false)}
          data={data}
          summary={summary}
          nomineeSummary={nomineeSummary}
          policy_ids={policy_ids}
        />
      )}
    </div>
  );
}

const ThemeColor = styled.small`
  background: ${({ theme }) => theme.Tab?.color || "#e11a22"};
`;

export const StepperThemeColor = styled.div`
.MuiStepIcon-root.MuiStepIcon-completed,.MuiStepIcon-root.MuiStepIcon-active {
  color: ${({ theme }) => theme.Tab?.color || "#e11a22"};
}
`;

const ViewBeneift = styled.small`
  color: ${({ theme }) => theme.Tab?.color || "#FF0000"};
`;

const ViewBenefitIcone = styled.i`
  color: #fff;
  background: ${({ theme }) => theme.Tab?.color || "#e11a22"};
`;
