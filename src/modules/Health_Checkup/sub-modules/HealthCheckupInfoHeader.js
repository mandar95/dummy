import React from "react";
import { IconlessCard } from "components";
import styled from "styled-components";
const HealthButton = styled.button`
  background: ${({ theme }) => theme.Tab?.color || "#ff3c46"};
`;
const HealthCheckupInfoHeader = ({ classes, setModal, image, myModule }) => {
  return (
    <IconlessCard
      title={<h5 className={classes.redColor}>Add Health Checkup</h5>}
    >
      <div
        style={{ marginBottom: "-15px", marginTop: "-40px" }}
        className="row w-100 justify-content-between align-items-center"
      >
        <div className="w-100 col-12 col-sm-6">
          <p className={`ml-0 ml-sm-4 text-dark ${classes.fontSizeCard}`}>
            Sometimes symptoms of illness / disease does not present/visible
            and you may feel healthy while the condition gradually progresses.
            Tests that are part of your health checkup can detect many such
            conditions and your health care provider will be able to manage it
            before the condition even begins to affect you. Hence we have
            launched Online Health check-up program for you and your family,
            book your health check-up here for any 2 family member.
          </p>
          {!!myModule?.canwrite && <HealthButton
            className={`ml-4 mb-2 mb-sm-0 ${classes.bigButton} ${classes.letterSpacing}`}
            onClick={() => setModal(true)}
          >
            Add Health Checkup
          </HealthButton>}
        </div>
        <div className="w-100 col-12 col-sm-6">
          <div className="d-flex justify-content-center align-items center">
            <div style={{ maxWidth: "250px" }}>
              <img className="d-none d-sm-block w-100" src={image} alt="" />
            </div>
          </div>
        </div>
      </div>
    </IconlessCard>
  );
}

export default HealthCheckupInfoHeader;
