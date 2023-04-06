import React from "react";
import styled from "styled-components";
import classes from "./newCard.module.css";
import image1and4 from "../../dashboard/1and4.png";
import image2and5 from "../../dashboard/2and5.png";
import image3and6 from "../../dashboard/3and6.png";
import closeImage from "./Closed-img.png";
import pendingImage from "./Pending-img.png";
import { useSelector } from "react-redux";

export const getTodayDate = () => {
  var today = new Date(),
    month = "" + (today.getMonth() + 1),
    day = "" + today.getDate(),
    year = today.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
};

/*
 * Enrollment Status => 0  (CLOSE)
 * Enrollment Status => 1  (OPEN)
 * Enrollment Status => 2  (CONFIRMED)
*/

export const EnrolmentCard = ({
  policy_number,
  id,
  onSubmit,
  enrollement_end_date,
  enrollement_start_date,
  enrollement_status,
  policyType,
  topup_enrolment,
  enrollment_midterm_window_is_set,
  enrollment_window_is_set
}) => {
  const showImageOnPolicy1and4 = policyType === 1 || policyType === 4;
  const showImageOnPolicy2and5 = policyType === 2 || policyType === 5;
  const showImageOnPolicy3and6 = policyType === 3 || policyType === 6;
  const policyNameExtract = policy_number.split(":");
  const { globalTheme } = useSelector(state => state.theme)

  const DontShowAnything = ([enrollement_status, enrollment_midterm_window_is_set, enrollment_window_is_set].every(item => item === 0))

  return (
    <div
      style={{ cursor: "pointer" }}
      className={`shadow w-100 ${classes.card} my-4 mr-4 mr-lg-0`}
      onClick={() =>
        onSubmit(
          id,
          undefined,
          enrollement_status,
          enrollement_start_date,
          enrollement_end_date,
          topup_enrolment
        )
      }
    >
      <div
        style={{ minHeight: "32px" }}
        className={`mx-4 my-2 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-baseline flex-wrap`}
      >
        <div
          style={{ wordBreak: "break-word" }}
          className="h5"
        >
          {policyNameExtract[0]}
        </div>
        <div className="mb-2 mb-sm-2 ml-sm-auto">
          {([0, 2].includes(enrollement_status)) && !DontShowAnything && (
            <DangerButton
              style={{
                fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px',
                wordBreak: "break-word",
                letterSpacing: "1px",
              }}
              className={`${classes.divBorder2} px-2 py-1 text-white`}
            >
              {enrollement_status === 0 ? 'Enrolment Window Closed' : 'Enrolment Confirmed'}
            </DangerButton>
          )}
          {(enrollement_status === 1) && (
            <small
              style={{
                fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px',
                wordBreak: "break-word",
                letterSpacing: "1px",
              }}
              className={`${classes.divBorder2} bg-success text-white px-2 py-1`}
            >
              Enrolment Window Open
            </small>
          )}
        </div>
      </div>

      <div
        className={`${classes.controlCard} ${classes.controlMargin} ${classes.minHeightCard}`}
      >
        <div className={`mx-1 py-2 w-100 my-2 my-sm-0`}>
          <div className={`${classes.imgdiv}`}>
            {showImageOnPolicy1and4 && (
              <div>
                <img src={image1and4} alt="asb" />
              </div>
            )}
            {showImageOnPolicy2and5 && (
              <div>
                <img src={image2and5} alt="asb" />
              </div>
            )}
            {showImageOnPolicy3and6 && (
              <div>
                <img src={image3and6} alt="asb" />
              </div>
            )}
          </div>
        </div>
        <div
          className={`mx-1  w-100 my-2 my-sm-0 ${([1, 2].includes(enrollement_status)) ? `py-3` : `py-5`
            } ${classes.divBorder2} ${classes.grayBack}`}
        >
          {policyNameExtract[1].length > 0 ? (
            <>
              <div>
                <div className={`text-center`}>
                  <small
                    style={{ wordBreak: "break-word" }}
                    className={`${classes.fontBold}`}
                  >
                    {policyNameExtract[1]}
                  </small>
                </div>
              </div>
              <div className="w-100">
                {([1, 2].includes(enrollement_status)) && (
                  <>
                    <div className={`text-center`}>
                      <small className={`${classes.bigFont}`}>
                        Enrolment Confirmation
                      </small>
                    </div>
                    <div className={`text-center`}>
                      {(enrollement_status === 2) && (
                        <small
                          style={{
                            fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px',
                            letterSpacing: "1px",
                            fontWeight: "600",
                          }}
                          className={`${classes.divBorder2} border border-dark px-2 py-1`}
                        >
                          Done <i className=" mt-3 fas fa-check"></i>
                        </small>
                      )}
                      {(enrollement_status === 1) && (
                        <small
                          style={{
                            fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px',
                            letterSpacing: "1px",
                            fontWeight: "600",
                          }}
                          className={`${classes.divBorder2} border border-dark px-2 py-1`}
                        >
                          Pending <i className="mt-3 far fa-clock"></i>
                        </small>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="py-4">
              <div className={`text-center`}>
                <small className={`${classes.bigFont}`}></small>
              </div>
              <div className={`text-center`}>
                <small>
                  <small className={`${classes.fontBold}`}></small>
                </small>
              </div>
            </div>
          )}
        </div>
        <div className={`d-none d-sm-block w-100 py-2 mx-1 mb-2 mb-sm-0 `}>
          <div className={`mb-4 mb-sm-0 ${classes.imgdiv}`}>
            {[0, 2].includes(enrollement_status) && (
              <div>
                <img style={{ height: "80px" }} src={closeImage} alt="asb" />
              </div>
            )}
            {enrollement_status === 1 && (
              <div>
                <img style={{ height: "80px" }} src={pendingImage} alt="asb" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DangerButton = styled.small`
  background: ${({ theme }) => theme.Tab?.color || "#FF0000"};
`;
