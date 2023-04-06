import React from "react";
import styled from "styled-components";

const InProgressCard = (props) => {
  const {title, badgeName, percentage} = props;
  return (
    <InProgressCardContainer {...props} className="shadow p-4">
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="m-0">
              {title} <i className="far fa-angle-right"></i>
            </p>
          </div>
          <div className="px-3 rounded py-1 shadow">{percentage}</div>
        </div>
        <div className="d-flex pt-5 pb-3 justify-content-between">
          <div className="badge-title px-4 py-2 ">{badgeName}</div>
        </div>
      </div>
    </InProgressCardContainer>
  );
};

export default InProgressCard;

const InProgressCardContainer = styled.div`
  width: ${({ width }) => (width ? width : "fit-content")};
  background-color: #fff;
  border-radius: 10px;

  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};
    width: 80%;
  }
  .badge-title {
    width: fit-content;
    background-color: ${({ badgeBgColor }) => (badgeBgColor ? badgeBgColor : "#f6fff6")};
    border-radius: 9999px;
    color: ${({ badgeColor }) => (badgeColor ? badgeColor : "#4db94d")};
  }
  .fa-angle-right {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    transform: translate(10px, 2px) rotate(90deg);
    color: lightgray;
  }
`;
