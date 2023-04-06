import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import StepTwo from "./step-two";
import Check from "@material-ui/icons/Check";
import clsx from "clsx";
import StepOne from "./step-one/step-one";
import StepOneA from "./step-one-a/step-one-a";
import StepConnector from "@material-ui/core/StepConnector";
import swal from "sweetalert";
import styled from "styled-components";
import {
  clearcolResponse,
  clearfieldResponse,
  clearTableResponse,
  clearColDetails,
} from "../report-config.slice";
import _ from "lodash";
import { Button as Btn } from 'react-bootstrap';

export default function HorizontalLinearStepper(props) {
  //stepper Config-----------------------------------------
  const QontoConnector = withStyles({})(StepConnector);

  const response = useSelector((state) => state.reportConfig);

  const useQontoStepIconStyles = makeStyles({
    root: {
      color: "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center",
    },
    active: {
      color: "#784af4",
    },
    circle: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    completed: {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
  });

  function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
        })}
      >
        {completed ? (
          <Check className={classes.completed} />
        ) : (
          <div className={classes.circle} />
        )}
      </div>
    );
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }));

  function getSteps() {
    return ["Create Report", "Columns", "Filters" /*"Review & Submit"*/];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        props.getTitle("Select Table");
        return (
          <DivStep1>
            <StepOne handleNext={handleNext} />
          </DivStep1>
        );
      case 1:
        props.getTitle("Columns");
        return (
          <DivStep1A>
            <StepOneA />
          </DivStep1A>
        );
      case 2:
        props.getTitle("Filters");
        return (
          <DivStep2>
            <StepTwo handleNext={handleNext} />
          </DivStep2>
        );
      // default:
      // case 2:
      //   props.getTitle("Review & Submit");
      //   return "This is the bit I really care about!";
      default:
        return "Unknown step";
    }
  }
  //-------------------------------------------------------
  const dispatch = useDispatch();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const stepBack = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (!_.isEmpty(response?.col_resp)) {
        stepBack();
      } else {
        swal("Please select and save the required tables", "", "info");
      }
    } else if (activeStep === 1) {
      if (!_.isEmpty(response?.fieldResp)) {
        stepBack();
      } else {
        swal("Please select the required table values", "", "info");
      }
    } else {
      stepBack();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     // You probably want to guard against something like this,
  //     // it should never occur unless someone's actively trying to break something.
  //     throw new Error("You can't skip a step that isn't optional.");
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  const handleReset = () => {
    setActiveStep(0);
    dispatch(clearcolResponse());
    dispatch(clearfieldResponse());
    dispatch(clearTableResponse());
    dispatch(clearColDetails());
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption"></Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label + 'report-confg'} {...stepProps}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Btn onClick={handleReset} className={classes.button}>
              Reset
            </Btn>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div style={{ marginTop: "20px" }}>
              {/*isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )*/}

              <Button
                variant="contained"
                color="primary"
                style={
                  activeStep === steps.length - 1
                    ? { display: "none", float: "right" }
                    : { float: "right" }
                }
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
              <Button
                disabled={activeStep === 0}
                onClick={() => {
                  swal(
                    "The submitted data will reset after going back",
                    "",
                    "warning"
                  ).then(() => {
                    handleBack()
                  });
                }}
                className={classes.button}
                style={{ float: "right" }}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DivStep1 = styled.div`
  border: 1px solid blue;
  border-radius: 10px;
  background-color: #fce4ff;
  @media (max-width: 767px) {
    border: none;
  }
`;
const DivStep1A = styled.div`
  border: 1px solid blue;
  padding-bottom: 40px;
  border-radius: 10px;
  background-color: #fce4ff;
  @media (max-width: 767px) {
    border: none;
  }
`;
const DivStep2 = styled.div`
  border: 1px solid blue;
  border-radius: 10px;
  @media (max-width: 767px) {
    border: none;
  }
`;
