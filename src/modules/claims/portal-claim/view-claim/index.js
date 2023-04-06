import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import { IconlessCard, Button } from "components";
import { UserDetail } from "./step/first";
import { Hospitalization } from "./step/second";
import ClaimSubmission from "./step/third";
import { StepperThemeColor } from "modules/enrollment/stepper";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { loadClaimDetails, clearClaimData } from "../../claims.slice";
import { Decrypt } from "utils";
import { useEffect } from "react";
import { useParams } from "react-router";
function getSteps() {
  return ["User Details", "Hospitalization Details", "Submission"];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return <UserDetail />;
    case 1:
      return <Hospitalization />;
    case 2:
      return <ClaimSubmission />;
    default:
      return "Unknown stepIndex";
  }
}

export function ViewClaimDetails() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  let {
    claim_id,
    employee_id,
    employer_id,
    member_id,
    policy_id,
    policy_type_id,
    type
  } = useParams();

  const params = {
    claim_id:
      Decrypt(claim_id) === 0
        ? null
        : Decrypt(claim_id),
    employee_id: Decrypt(employee_id),
    employer_id: Decrypt(employer_id),
    member_id: Decrypt(member_id),
    policy_id: Decrypt(policy_id),
    policy_type_id: Decrypt(policy_type_id),
    claim_type: type,
  };

  useEffect(() => {
    if (!_.isEmpty(params)) {
      dispatch(loadClaimDetails(params));
    }
    return () => {
      dispatch(clearClaimData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <IconlessCard title={"Claim Details"}>
      <StepperThemeColor className="d-none d-md-block w-100 stepper-theme-color">
        <Stepper
          style={{ marginTop: "-40px" }}
          activeStep={activeStep}
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </StepperThemeColor>
      <div>
        <div>
          <div>
            <Typography component={'span'}>{getStepContent(activeStep)}</Typography>
            <div className={`d-flex justify-content-${activeStep === 0 ? "end" : "between"}`}>
              {activeStep !== 0 && <Button
                buttonStyle={"outline"}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Previous
              </Button>}
              {activeStep !== steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep !== steps.length - 1 && handleNext}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </IconlessCard>
  );
}
