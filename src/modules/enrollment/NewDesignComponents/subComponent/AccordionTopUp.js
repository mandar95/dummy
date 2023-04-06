import React, { useState } from "react";
import classesone from "../../index.module.css";
import image2 from "../../../dashboard/2and5.png";
import { useSelector } from "react-redux";
const AccordionTopUp = () => {
  const [policyAccordion1, setPolicyAccordion1] = useState(false);
  const { globalTheme } = useSelector(state => state.theme)
  return (
    <>
      <div className="ml-1 mt-1 col-12 w-100">
        <div
          className={`d-flex justify-content-around align-items-center p-1 ${classesone.backPink}`}
        >
          <div className="d-flex justify-content-center align-items-end">
            <div>
              <img style={{ height: "60px" }} src={image2} alt="" />
            </div>
            <div>
              <h6
                style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                className="ml-1"
              >
                Policy Name
              </h6>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <small>Family Cover</small>
            <h6 className="text-danger">5874</h6>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column text-center">
              <small>Total Premium</small>
              <h6 className="text-danger">5874</h6>
            </div>
            <div className="ml-3" style={{ cursor: "pointer" }}>
              {!policyAccordion1 && (
                <i
                  style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px' }}
                  className="text-danger far fa-plus-square"
                  onClick={() => setPolicyAccordion1(true)}
                ></i>
              )}
              {policyAccordion1 && (
                <i
                  style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px' }}
                  className="text-danger far fa-minus-square"
                  onClick={() => setPolicyAccordion1(false)}
                ></i>
              )}
            </div>
          </div>
        </div>
      </div>
      {policyAccordion1 && (
        <div className={`ml-1 my-2 col-12 w-100`}>
          <div className={`w-100 py-1 ${classesone.grayBackTable}`}>
            <h6 className="ml-2 text-primary">
              Member Details
            </h6>
            <table className="ml-2 w-100">
              <tr style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                <th>Member Name</th>
                <th>Sum Insured</th>
                <th>Premium</th>
              </tr>
              <tr style={{ fontWeight: "600" }} className="text-secondary">
                <td>Amir</td>
                <td>50000</td>
                <td>50000</td>
              </tr>
              <tr style={{ fontWeight: "600" }} className="text-secondary">
                <td>Amir</td>
                <td>50000</td>
                <td>50000</td>
              </tr>
              <tr style={{ fontWeight: "600" }} className="text-secondary">
                <td>Amir</td>
                <td>50000</td>
                <td>50000</td>
              </tr>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AccordionTopUp;
