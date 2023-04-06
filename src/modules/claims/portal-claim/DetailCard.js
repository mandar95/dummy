import React from "react";
import styled from 'styled-components';

export const InfoCard = ({ topText, children }) => {
  return (
    <Container>
      <RightCorner>
        <TopRight>{topText}</TopRight>
      </RightCorner>
      {children}
    </Container>
  );
};

const Container = styled.div`
  margin: 10px;
  width: auto;
  min-height: 200px;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 35px;
  box-sizing: border-box;
  background: url("/assets/images/bg-5.png") no-repeat top right;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#fff'};
  @media (max-width: 767px) {
    margin: 0px;
  }
`
const RightCorner = styled.div`
float: right;
padding:5px;
top:-1px;
`

const TopRight = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(50px + ${fontSize - 92}%)` : '50px'};
margin-right: 12px;
color: #ccccff;
margin-bottom: 0px !important;
`

