import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import _ from 'lodash';
import Fade from "react-reveal/Fade";
import { useSelector } from "react-redux";

//styles
const ColDiv = styled(Col)`
  background-image: url(${props => props.url});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80% 100%;
  height: 350px;
  width: 650px;
  @media (max-width: 767px) {
    display: none;
  }
`;

export default function VerticalLinearStepper(props) {
  const Data = props?.Data;
  //stepper config-------------------------------------------------
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  }));
  const { globalTheme } = useSelector(state => state.theme)

  function getSteps() {
    return Data?.map((item) => item?.title) || ["No Data"];
  }
  const Tile = Data?.map((item, index) => (
    <Row key={'stepper' + index} style={{ margin: "0", padding: "0" }}>
      <Col xs={12} sm={12} md={12} lg={5} xl={5}>
        <label style={{ display: "flex", flexWrap: "wrap", overflow: "auto" }}>
          {item?.description || "Description"}
        </label>
      </Col>
      <ColDiv xs={12} sm={12} md={12} lg={7} xl={7} url={item?.image}></ColDiv>
    </Row>
  ));
  function getStepContent(step) {
    return !_.isEmpty(Tile) ? Tile[step] : "No Data"
  }
  //---------------------------------------------------------------

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label + 'step-52'}>
            <StepLabel>
              <span style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>{label}</span>
            </StepLabel>
            <StepContent>
              <Fade right delay={100}>
                <Typography>{getStepContent(index)}</Typography>
              </Fade>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>
            All steps completed - Would you like to review again?
          </Typography>
          <Button onClick={handleReset} className={classes.button}>
            Review
          </Button>
        </Paper>
      )}
    </div>
  );
}
