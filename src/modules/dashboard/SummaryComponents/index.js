import React, { useState } from "react";
import CustomSummaryAccordion from "./CustomSummaryAccordion.js";
import { useMediaQuery } from 'react-responsive'
const SummayDetails = ({ title, id, summary, nominee, setEmployeeTotalPremium,choosed }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const [accordion, setAccordion] = useState({
    member: true,
    nominee: true,
  });
  return (
    <div className="row justify-content-start mx-2 w-100">
      {title !== "nominee" && (
        <div className="col-sm-12 w-100">
          <div
            style={{
              cursor: "pointer",
            }}
            className="d-flex justify-content-between align-items-center bg-light shadow-sm px-2 my-2"
            onClick={() =>
              setAccordion((accordion) => ({
                ...accordion,
                member: !accordion.member,
              }))
            }
          >
            <div className="h5">
              <img
                style={{ maxHeight: "45px", marginRight: "10px" }}
                src={window.location.origin + "/assets/images/icon/family.png"}
                alt=""
              />{" "}
              Member Details {!isMobile && `- ${summary[`${title}`][0].policy_name}`}
            </div>
            <div className="h5 mx-2">
              {accordion.member ? (
                <i className="fas fa-eye"></i>
              ) : (
                <i className="fas fa-eye-slash"></i>
              )}
            </div>
          </div>
          {accordion.member && (
            <CustomSummaryAccordion
              id={id}
              title={title}
              summary={summary}
              accordionType={"Member"}
              setEmployeeTotalPremium={setEmployeeTotalPremium}
              choosed={choosed}
            />
          )}
        </div>
      )}
      {title === "nominee" && Boolean(typeof summary[`${title}`] === "object") && (
        <div className="col-12 w-100">
          <div
            style={{
              cursor: "pointer",
            }}
            className="d-flex justify-content-between align-items-center bg-light shadow-sm px-2 my-2"
            onClick={() =>
              setAccordion((accordion) => ({
                ...accordion,
                nominee: !accordion.nominee,
              }))
            }
          >
            <div className="d-flex justify-content-center align-items-center h5">
              <div>
                <img
                  style={{ maxHeight: "40px", marginRight: "10px" }}
                  src={
                    window.location.origin +
                    "/assets/images/flex-plan/Vectors_GTL.png"
                  }
                  alt=""
                />
              </div>
              <div>Nominee Details</div>
            </div>
            <div className="h5 mx-2">
              {accordion.nominee ? (
                <i className="fas fa-eye"></i>
              ) : (
                <i className="fas fa-eye-slash"></i>
              )}
            </div>
          </div>
          {accordion.nominee && (
            <CustomSummaryAccordion
              id={id}
              title={title}
              summary={summary}
              accordionType={"Nominee"}
              nominee={nominee}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SummayDetails;
