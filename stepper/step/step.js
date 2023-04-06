import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
    min-height: 108px;
`;

const StepLabelWrapper = styled.div`
    padding: 12px 0;
    padding-left: 30px;
`;

const StepLabel = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    h4 {
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(11px + ${fontSize - 92}%)` : '11px'};
        letter-spacing: 1px;
        color: #fff;
        max-width: 135px;
    }
    @media (max-width: 950px) {
        h4{
            display: none;
        }
    }
`;

const Icon = styled.div`
    cursor: pointer;
    padding: 8px;
    height: ${({ state }) => state ? '58px' : '50px'};
    width: ${({ state }) => state ? '58px' : '50px'};
    line-height: 35px;
    border-radius: 50%;
    text-align: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    background: #fff;
    z-index: 1;
    margin-left: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: ${({ state }) => state ? '4px solid' : ''};
    border-color: ${({ state, theme }) => state ? (state === 1 ? theme.PrimaryColors?.color4 : '#D0FF37') : ''};
    img {
        width: 28px;
        opacity: 0.7;
    }
`;

const states = {
    active: 1/* {
        color: '#87c3bb'
    } */,
    completed: 2/* {
        color: '#D0FF37'
    } */
}

const Step = props => {
    const { index, id, label, icon, activeStep, setStep, completed, steps, noCheck } = props;
    const onClick = () => {
        if (noCheck || completed || (steps.length && steps[index - 1]?.completed))
            setStep(index);
    };

    const stepState = completed ? 'completed' : ((activeStep === index) || (steps.length && steps[index - 1]?.completed)) ? 'active' : '';

    return (
        <Wrapper id={id} index={index}>
            <StepLabelWrapper>
                <StepLabel className="step-label">
                    <h4 className='align-self-center'>{label}</h4>
                    <Icon state={states[stepState]} onClick={onClick}>
                        <img src={icon} alt={id} />
                    </Icon>
                </StepLabel>
            </StepLabelWrapper>
        </Wrapper>
    );
}

export default Step;
