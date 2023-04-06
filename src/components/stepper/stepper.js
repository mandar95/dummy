import React, { useState } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProgressBar, Row, Col } from 'react-bootstrap';
import Button from '../button/Button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const LabelWrapper = styled.div`
  background: ${({ theme }) => (theme.PrimaryColors?.color4 || '#3e4dcc')};
  border-radius: 0px 24px 24px 0px;
  width: 20%;
  margin-right: -24px;
  padding-top: 98px;
  padding-bottom: 40px;
  @media (max-width: 950px) {
    width: 11%;
  }
  @media (max-width: 780px) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: none;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#fff'};
  transition: all 0.3s ease 0s;
  margin-right: -18px;
  padding: 18px;
  padding-left: 48px;
  margin-top: 3rem !important;
  @media (max-width: 780px) {
    margin-top: 0 !important;
    padding-left: 18px;
  }
`;

const ContentFooter = styled.div`
  margin-top: 40px;
`;

const StyledProgressBar = styled(ProgressBar)`
  height: 24px;
  border-radius: 10px;
  .progress-bar {
    background: linear-gradient(to left, #3fd49f 0%, #d0ff37 100%);
  }
`;

const ProgressText = styled.p`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  letter-spacing: 1px;
  
`;

const ProgressCount = styled.span`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  letter-spacing: 1px;
  
  color: #b0de1a;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Stepper = props => {
  const { children, activeStep, onSave, goNext, goBack, afterNext, lastStep = 5, hideProgressBar = false } = props;
  const [currStep, setCurrStep] = useState(activeStep);
  // component props
  const moveNext = () => {

    if (afterNext) afterNext(currStep, currStep + 1);
    setStep(currStep + 1);
  };

  const movePrevious = () => {
    setStep(currStep - 1);
  };

  const setStep = step => {
    if (step >= 0 && step < steps.length) {
      setCurrStep(step);
    }
  };

  const childrenArray = React.Children.toArray(children);
  const steps = childrenArray.map((step, index) => {
    return React.cloneElement(step,
      {
        index: index,
        activeStep: currStep,
        moveNext,
        movePrevious,
        setStep,
        ...step.props
      });
  });

  const formSubmit = formId => {
    const form = document.getElementById(formId);
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  };

  const _renderStepContent = () => {
    const currentStep = childrenArray[currStep];
    const completedSteps = steps.filter(step => step.props.completed
      ? step.props.completed === 'completed'
      : null);
    const progress = Math.ceil((completedSteps.length / steps.length) * 100);

    return (<ContentWrapper className="content-wrapper mb-4">
      {React.cloneElement(currentStep.props.children, {
        activeStep: currStep,
        moveNext,
        movePrevious,
        onSave,
        goNext,
        goBack,
        ...currentStep.props
      })}
      <ContentFooter>
        <Row>
          <Col md={4} className="text-center">
            {!hideProgressBar &&
              <>
                <StyledProgressBar now={progress} />
                <ProgressText>
                  <ProgressCount>{`${progress}% `}</ProgressCount>
                  of 100 Completed
                </ProgressText>
              </>}
          </Col>
          <Col md={8}>
            <ButtonWrapper>
              {(currStep !== 0) && <Button buttonStyle="outline-secondary" onClick={movePrevious}>Previous</Button>}
              <Button
                className="ml-3"
                onClick={() => formSubmit(currentStep.props.formId)}>
                {(currStep === (lastStep - 1)) ? 'Submit' : 'Next'}
              </Button>
            </ButtonWrapper>
          </Col>
        </Row>
      </ContentFooter>
    </ContentWrapper>);
  };

  return (
    <Wrapper className="stepper-wrapper">
      <LabelWrapper className="label-wrapper">
        {steps}
      </LabelWrapper>
      {_renderStepContent()}
    </Wrapper>
  )
};

Stepper.propTypes = {
  children: PropTypes.node.isRequired,
  activeStep: PropTypes.number
};

Stepper.defaultProps = {
  activeStep: 0
}

export default Stepper;
