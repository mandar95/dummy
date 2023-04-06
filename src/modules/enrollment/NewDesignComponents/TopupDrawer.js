import React from "react";

import classesone from "../index.module.css";
import { Input } from "components";
import { DateFormate, downloadFile } from "../../../utils";
import swal from "sweetalert";
import { comma } from "./ForthStep";
import { useSelector } from "react-redux";
// const Gender = {
//   Male: 1,
//   Female: 2,
//   Other: 3,
// };
// past imports end
const DrawerForm = ({ val, elem, name, gender, premiuma, premiumb }) => {
  const { globalTheme } = useSelector(state => state.theme)
  return (
    <div
      style={{ maxWidth: "400px" }}
      className="row w-100 justify-content-center mx-1"
    >
      <div className="col-12 my-2">
        <div
          className="row justify-content-between
          "
        >
          <div style={{ textAlign: "center" }} className="col-12">
            <button className={`${classesone.grayBack}`}>
              {name} Details
            </button>
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-center">
              {(Boolean(val?.suminsured) || !!Number(val?.employee_premium)) && <div className={`${classesone.backPink} col-12 w-100 my-2 py-2`}>
                <div className="row w-100">
                  {Boolean(val?.suminsured) && <div className="col-6">
                    <small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                      Sum Insured
                    </small>
                    <h5 className={`${classesone.redColor}`}>
                      ₹ {comma(val?.suminsured)} /-
                    </h5>
                  </div>}
                  {!!Number(val?.employee_premium) && <div className="col-6 text-right">
                    <small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                      Annual Premium
                    </small>
                    <h5 className={`${classesone.redColor}`}>
                      ₹ {comma(val?.employee_premium)} /-
                    </h5>
                  </div>}
                </div>
              </div>}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <Input
              label={"Relation"}
              style={{ background: "white" }}
              disabled
              value={val.relation_name || "-"}
            />
          </div>
          {!!elem.memberData?.some((elem) => !!elem.opd_suminsured) && (
            <div className="col-12 col-sm-6">
              <Input
                label={"OPD Sum Insured"}
                style={{ background: "white" }}
                disabled
                value={val.opd_suminsured}
              />
            </div>
          )}
          <div className="col-12 col-sm-6">
            <Input
              label={"Gender"}
              style={{ background: "white" }}
              disabled
              value={val.gender || "-"}
            />
          </div>
          <div className="col-12 col-sm-6">
            <Input
              label={"First Name"}
              style={{ background: "white" }}
              disabled
              value={val.first_name || "-"}
            />
          </div>
          {!!elem.memberData?.some((elem) => !!elem.last_name) && (
            Boolean(val.last_name) && <div className="col-12 col-sm-6">
              <Input
                label={"Last Name"}
                style={{ background: "white" }}
                disabled
                value={val.last_name || "-"}
              />
            </div>
          )}
          {Boolean(val?.dob) && <div className="col-12 col-sm-6">
            <Input
              label={"Date Of Birth"}
              style={{ background: "white" }}
              disabled
              value={DateFormate(val.dob) || "-"}
            />
          </div>}
          {Boolean(val.age && val.age_type) && <div className="col-12 col-sm-6">
            <Input
              label={"Age"}
              style={{ background: "white" }}
              disabled
              value={String(val.age + " " + val.age_type) || "-"}
            />
          </div>}
          {!!elem.memberData?.some((elem) => !!elem.mobile_no) && (
            Boolean(val.mobile_no) && <div className="col-12 col-sm-6">
              <Input
                label={"Mobile No"}
                style={{ background: "white" }}
                disabled
                value={val.mobile_no || "-"}
              />
            </div>
          )}
          {!!elem.memberData?.some((elem) => !!elem.email) && (
            Boolean(val.email) && <div className="col-12 col-sm-6">
              <Input
                label={"Email"}
                style={{ background: "white" }}
                disabled
                value={val.email || "-"}
              />
            </div>
          )}

          {!!elem.memberData?.some((elem) => !!elem.employee_premium) && (
            Boolean(val.employee_premium) && <div className="col-12 col-sm-6">
              <Input
                label={"Employee Premium"}
                style={{ background: "white" }}
                disabled
                value={val.employee_premium || "-"}
              />
            </div>
          )}
          {!!elem.memberData?.some((elem) => !!elem.is_unmarried_child) && (
            <div className="col-12 col-sm-6">
              {val.is_unmarried_child ? (
                <Input
                  label={"Unmarried Child"}
                  disabled
                  style={{ background: "white" }}
                  value="Yes"
                />
              ) : [3, 4].includes(Number(val.relation_id)) ? (
                <Input
                  label={"Unmarried Child"}
                  disabled
                  style={{ background: "white" }}
                  value="No"
                />
              ) : (
                <Input
                  label={"Unmarried Child"}
                  disabled
                  style={{ background: "white" }}
                  value="-"
                />
              )}
            </div>
          )}
          {!!elem.memberData?.some((elem) => !!elem.marriage_date) && (name === "Spouse/Partner" || name === "Spouse" || name === "Partner") && (
            <div className="col-12 col-sm-6">
              <Input
                label={"Marriage Date"}
                disabled
                style={{ background: "white" }}
                value={val.marriage_date || "-"}
              />
            </div>
          )}
          {!!elem.memberData?.some((elem) => !!elem.is_special_child) && (
            <div className="col-12 col-sm-6">
              <Input
                label={"Secial Child"}
                disabled
                style={{ background: "white" }}
                value={val?.is_special_child ? "Yes" : "No"}
              />
            </div>
          )}
          {!!elem.memberData?.some((elem) => !!elem.special_child_image) && (
            <div className="col-12 col-sm-6">
              {val.relation_id !== 1 ? (
                val?.special_child_image ? (
                  <a
                    href={val?.special_child_image || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    Special Child Document
                  </a>
                ) : (
                  "-"
                )
              ) : (
                "-"
              )}
            </div>
          )}
          {!!elem.memberData?.some((elem) => !!elem.is_adopted_child) && (
            <div className="col-12 col-sm-6">
              {val?.is_adopted_child ? (
                <Input
                  label={"Adopted Child"}
                  disabled
                  style={{ background: "white" }}
                  value={"Yes"}
                />
              ) : [3, 4].includes(val.relation_id) ? (
                <Input
                  label={"Adopted Child"}
                  disabled
                  style={{ background: "white" }}
                  value={"No"}
                />
              ) : (
                <Input
                  label={"Adopted Child"}
                  disabled
                  style={{ background: "white" }}
                  value={"-"}
                />
              )}
            </div>
          )}
          {!!elem.memberData?.some(
            (elem) => !!elem.adopted_child_document
          ) && (
              <div className="col-12 col-sm-6">
                <span
                  role="button"
                  onClick={() =>
                    val.adopted_child_document
                      ? downloadFile(
                        val.adopted_child_document,
                        undefined,
                        true
                      )
                      : swal("Document not available", "", "info")
                  }
                >
                  Adopted Child Document
                  <i
                    className={`${val.adopted_child_document
                      ? "ti ti-download"
                      : "ti ti-close"
                      } ml-2`}
                  ></i>
                </span>
              </div>
            )}
          {!!elem.memberData?.some((elem) => !!elem.locking_period_days) && (
            <div className="col-12 col-sm-6">
              <Input
                label={"Lock in Period"}
                disabled
                style={{ background: "white" }}
                value={
                  val?.locking_period_days
                    ? `${val?.locking_period_days} Days`
                    : "-"
                }
              />
            </div>
          )}
          {!!elem?.employer_verification_needed && (
            <div className="col-12 col-sm-6">
              <Input
                label={"Employer Verification Status"}
                disabled
                style={{ background: "white" }}
                value={val?.employer_verification_status_in_word}
              />
            </div>
            //   <td>

            //     {val?.employer_verification_status === 2
            //       ? "-" + val?.employer_remark
            //       : ""}
            //   </td>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerForm;
