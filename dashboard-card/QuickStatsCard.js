import React from "react";
import styled from "styled-components";

const QuickStatsCard = (props) => {
  const {title, number} = props
  return (
    <QuickStatsCardContainer {...props}>
      <div className="d-flex pl-4 pt-4 pr-5 pb-3 justify-content-center align-items-center">
        <div style={{ zIndex: 2 }} className="d-flex flex-column">
          <div className="number text-center px-2">{number}</div>
          <p className="m-0 px-2 text-center pb-3">{title}</p>
        </div>
      </div>
    </QuickStatsCardContainer>
  );
};

export default QuickStatsCard;

const QuickStatsCardContainer = styled.div`
  width: ${({ width }) => (width ? width : "fit-content")};
  background-color: ${({ bgColor }) => (bgColor ? bgColor : "#f6fff6")} ;
  border-radius: 15px;
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    content: "";
    right: 3px;
    top: 3px;
    width: 39%;
    height: 29%;
    background-color: ${({ bubbleBgColor }) => (bubbleBgColor ? bubbleBgColor : "#ffeaee")} ;
    border-radius: 37% 63% 71% 29% / 30% 24% 76% 70%;
    z-index: 1;
  }

  &::before {
    position: absolute;
    content: "";
    left: 0px;
    bottom: 0px;
    width: 35px;
    height: 35px;
    background-color: ${({ bubbleBgColor }) => (bubbleBgColor ? bubbleBgColor : "#ffeaee")};
    border-radius: 0px 100% 0px 0px;
    z-index: 1;
  }

  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    color: ${({ titleColor }) => (titleColor ? titleColor : "darkgray")};
  }
  .number {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(5rem + ${fontSize - 92}%)` : '5rem'};
    color: ${({ numberColor }) => (numberColor ? numberColor : "#8dcd8d")};
  }
`;
