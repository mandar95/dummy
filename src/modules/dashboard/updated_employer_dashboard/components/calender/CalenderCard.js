import React from "react";
import { CalenderCardContainer } from "../../style";

const CalenderCard = ({ date, onClick, enrollmentConfiremd, select }) => {
  return (
    <CalenderCardContainer
      background={select === date && "#4344ee"}
      color={select === date ? "#ffffffde" : undefined}
      onClick={onClick}
      className="mx-2 my-1"
    >
      <div className="d-flex flex-column">
        <h5 className="mb-1 font-weight-bold">{date}</h5>
        <p className="m-0">Enrolment Confirmed: {enrollmentConfiremd}</p>
      </div>
    </CalenderCardContainer>
  );
};

export default CalenderCard;
