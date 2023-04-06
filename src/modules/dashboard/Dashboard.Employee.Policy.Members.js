import React, { useState, useEffect } from "react";
import {
  employeeMemberDetails,
  getMemberDetails,
  getPolicyDetail,
} from "./Dashboard.slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import classes from "./Dashboard.module.css";
import swal from "sweetalert";
import { DateFormate, downloadFile, isValidHttpUrl } from "../../utils";
import {
  clearMemberDataDetail,
  getCardData,
  selectCardData,
  getCardDetails,
} from "../ECard/ECard.slice";
import _ from "lodash";
import { Col, Row } from "react-bootstrap";
import { comma } from "modules/enrollment/NewDesignComponents/ForthStep";
import UploadedImageModal from "./UploadedImageModal";
import { ModuleControl } from "../../config/module-control";
import { getSI } from "../enrollment/NewDesignComponents/subComponent/AccordionPolicy";

const FindMemberImage = (relation_id, gender) => {
  if (gender === "Other") {
    return "/assets/images/icon/othergender.png";
  }
  if ([1, 2].includes(relation_id)) {
    return gender === "Male"
      ? "/assets/images/icon/man.png"
      : "/assets/images/icon/woman.png";
  }
  if ([3, 4].includes(relation_id)) {
    return gender === "Male"
      ? "/assets/images/icon/boy.png"
      : "/assets/images/icon/girl.png";
  }
  if ([5, 6, 7, 8].includes(relation_id)) {
    return gender === "Male"
      ? "/assets/images/icon/grandfather.png"
      : "/assets/images/icon/grandmother.png";
  }

  return "/assets/images/icon/man.png";
};
const clickHandler = ({ value, policyDetails, dispatch }) => {
  if (value.member_healthecard && isValidHttpUrl(value.member_healthecard)) {
    downloadFile(value.member_healthecard, null, true);
  } else {
    const data = {
      employeeCode: value?.emp_code,
      tpa_member_id: value?.member_id,
      member_id: value?.id,
      policy_id: policyDetails?.policy_id,
    };
    dispatch(getCardData(data));
  }
};

export const EmployeePolicyMembers = () => {
  const [members, setMembers] = useState([]);
  const membersDetails = useSelector(getMemberDetails);
  const policyDetails = useSelector(getPolicyDetail);
  const CardResponse = useSelector(selectCardData);
  const dispatch = useDispatch();
  const { policyId } = useParams();
  const { globalTheme } = useSelector(state => state.theme)
  useEffect(() => {
    dispatch(employeeMemberDetails(policyId));

    return () => dispatch(clearMemberDataDetail());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setMembers(membersDetails);
  }, [membersDetails]);

  //Download Ecard If E_url =null---------------------------
  useEffect(() => {
    if (!_.isEmpty(CardResponse.data) && CardResponse.data) {
      if (CardResponse?.data?.ecardURL && isValidHttpUrl(CardResponse?.data?.ecardURL)) {
        downloadFile(CardResponse?.data?.ecardURL, null, true);
      } else {
        swal(ModuleControl.isHowden/* E-Card Message Update */ ? 'E-cards would be available post issuance of the policy' : "E-card not available", "", "warning");
      }
    }
    return () => {
      dispatch(getCardDetails({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CardResponse.data]);

  // image upload start
  const [modal, setModal] = useState(false);

  // image upload end
  return (
    <Row className="d-flex flex-wrap m-0 mt-2">
      {members.map((v, i) => {
        const IPDSI = getSI(v);
        const OPDSI = getSI(v, true);
        return (<Col xl={6} lg={6} md={12} sm={12} key={"asd" + i}>
          <div className="card mb-5 shadow" style={{ borderRadius: "30px" }}>
            <div
              className={`row no-gutters align-items-center ${classes.divHeight}`}>
              <div className="col-md-4">
                <div className="d-flex justify-content-center" style={{ minHeight: v?.image_url ? '0' : '90px' }}>
                  <div className={`d-flex justify-content-center ${classes.container}`}>
                    <img
                      style={{
                        maxWidth: "90px",
                        borderRadius: "50%"
                      }}
                      src={v?.image_url || FindMemberImage(v.relation_id, v.gender)}
                      alt=""
                    />
                    <div className={classes.overlay} onClick={() => setModal(v)}>
                      <div className={classes.text}><i className="fas fa-camera"></i></div>
                    </div>
                  </div>
                </div>
                <div className="text-center w-100">
                  <h5>
                    {Boolean(v.member_name.length > 55)
                      ? v.member_name.slice(0, 53) + "..."
                      : v.member_name || "N/A"}
                  </h5>
                </div>
              </div>
              <div className="col-md-8 ">
                <div className="">
                  <div className="row text-center">
                    {[1, 4].includes(policyDetails?.policy_sub_type_id)
                      ? !!v.member_id && (
                        <div className="col-6 mb-2">
                          <div>
                            <span>Member Id</span>
                          </div>
                          <div className="text-dark">
                            <small
                              style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                            >
                              {v.member_id || "N/A"}
                            </small>
                          </div>
                        </div>
                      )
                      : !!v.emp_code && (
                        <div className="col-6 mb-2">
                          <div>
                            Employee Code
                          </div>
                          <div className="text-dark">
                            <small
                              style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                            >
                              {v.emp_code || "N/A"}
                            </small>
                          </div>
                        </div>
                      )}

                    {(v.member_status === "Active" ||
                      !!v.member_healthecard) && (
                        <div className="col-6 mb-2 text-center align-self-center">
                          {v.member_status === "Active" ||
                            !!v.member_healthecard ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                clickHandler({
                                  dispatch,
                                  value: v,
                                  policyDetails,
                                })
                              }
                            >
                              Health E Card
                            </button>
                          ) : ("")}
                        </div>
                      )}
                    {!!v.member_relation && (
                      <div className="col-6 mb-2">
                        <div className="">Relation</div>
                        <div>
                          <small
                            style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                          >
                            {v.member_relation}
                          </small>
                        </div>
                      </div>
                    )}
                    {!!v.member_dob && (
                      <div className="col-6 mb-2">
                        <div className="">Date of Birth</div>
                        <div>
                          <small
                            style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                          >
                            {DateFormate(v.member_dob)}
                          </small>
                        </div>
                      </div>
                    )}
                    {!!v.member_status && (
                      <div className="col-6 mb-2">
                        <div className="">Status</div>
                        <div>
                          <small
                            style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                          >
                            {new Date(v.cover_end_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ? ([1, 4].includes(policyDetails?.policy_sub_type_id)
                              ? v.member_status
                              : "Active") : 'In-Active'}
                          </small>
                        </div>
                      </div>
                    )}
                    {!!IPDSI && (
                      <div className="col-6 mb-2">
                        <div className="">
                          {!!IPDSI && (
                            <>
                              Sum{" "}
                              {policyDetails.policy_sub_type_id === 3
                                ? "Assured"
                                : "Insured"}{" "}
                              {!!(OPDSI || v.enhance_suminsured) && "IPD"}
                            </>
                          )}
                        </div>
                        <div>
                          <small
                            style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                          >
                            ₹ {comma(IPDSI)}
                          </small>
                        </div>
                      </div>
                    )}
                    {!!v.enhance_suminsured && (
                      <div className="col-6 mb-2">
                        <div className="">
                          Sum Insured Enhance
                        </div>
                        <div>
                          <small
                            style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                          >
                            ₹ {comma(v.enhance_suminsured)}
                          </small>
                        </div>
                      </div>
                    )}
                    {!!OPDSI && (
                      <div className="col-6 mb-2 ">
                        <div className="">
                          {!!OPDSI && (
                            <>
                              Sum{" "}
                              {policyDetails.policy_sub_type_id === 3
                                ? "Assured"
                                : "Insured"}{" "}
                              {!!OPDSI && "OPD"}
                            </>
                          )}
                        </div>
                        <div>
                          <small
                            style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                          >
                            ₹ {comma(OPDSI)}
                          </small>
                        </div>
                      </div>
                    )}
                    {!!v.cover_start_date && (
                      <div className="col-6 mb-2 text-center">
                        <div className="">
                          <div>Cover Date</div>
                          <div>
                            <small
                              style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}
                            >
                              <span style={{ whiteSpace: 'pre' }}>{DateFormate(v.cover_start_date)}</span>{" "}
                              {v.cover_end_date ? (
                                <>to <span style={{ whiteSpace: 'pre' }}>{DateFormate(v.cover_end_date)}</span></>
                              ) : ("")}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        )
      })}
      {modal && (
        <UploadedImageModal
          show={Boolean(modal)}
          onHide={() => setModal(false)}
          data={modal}
          policyId={policyId}
          FindMemberImage={FindMemberImage}
        />
      )}
    </Row>
  );
};
