import React from "react";
import styled from "styled-components";

const QuickStatsCard1 = (props) => {
  const {title1, title2, actionName, imgSrc} = props
  return (
    <QuickStatsCard1Container {...props} className="p-4">
      <div className="d-flex align-items-center">
        <div style={{ zIndex: 2 }} className="img-container mr-4">
          <img
            src={imgSrc}
            alt=""
          />
        </div>
        <div className="d-flex flex-column">
          <h5 className="m-0">{title1}</h5>
          <p className="m-0 py-2">{title2}</p>
          <div className="details">{actionName}</div>
        </div>
      </div>
    </QuickStatsCard1Container>
  );
};

export default QuickStatsCard1;

const QuickStatsCard1Container = styled.div`
  width: ${({ width }) => (width ? width : "fit-content")};
  background-color: ${({ bgColor }) => (bgColor ? bgColor : "#f6fff6")};
  border-radius: 15px;
  position: relative;
  overflow: hidden;

  img {
    width: 80px;
  }

  .img-container {
    display: flex;
    width: 100px;
    height: 100px;
    background: ${({ imageBgColor }) => (imageBgColor ? imageBgColor : "#fff")};
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }

  &::after {
    position: absolute;
    content: "";
    right: 2px;
    top: 3px;
    width: 20px;
    height: 20px;
    background-color: ${({ bubbleBgColor }) => (bubbleBgColor ? bubbleBgColor : "#ffeaee")};
    border-radius: 50%;
    z-index: 1;
  }
  &::before {
    position: absolute;
    content: "";
    left: 0px;
    bottom: 0px;
    width: 70px;
    height: 70px;
    background-color: ${({ bubbleBgColor }) => (bubbleBgColor ? bubbleBgColor : "#ffeaee")};
    border-radius: 0px 100% 0px 0px;
    z-index: 1;
  }
  h5 {
    color: ${({ title1Color }) => (title1Color ? title1Color : "#b89600")};
  }
  p {
    color: ${({ title2Color }) => (title2Color ? title2Color : "gray")};
  }
  .details {
    color: ${({ actionColor }) => (actionColor ? actionColor : "#333333")}
  }
`;
