/* eslint-disable react/jsx-no-target-blank */
import { NoDataFound } from "components";
import React from "react";
import { useSelector } from "react-redux";

import { claim } from "../../../claims.slice";

export function findExtension(filename) {
  return (
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename
  );
}

const ClaimSubmission = () => {
  const { claimDataBox: props } = useSelector(claim);
  const { globalTheme } = useSelector(state => state.theme);
  return (
    Boolean(props?.filenames?.length) ?
      <div className="row p-3 w-100 justify-content-center">
        {props?.filenames?.map((data, i) => {
          return (
            <div
              className="col-12 col-md-6 text-center my-2"
              key={data.doc_name + i}
            >
              <div
                style={{
                  background: "#f3f9fe",
                }}
                className="d-flex justify-content-between btn-lg w-100 shadow-sm"
              >
                {Number(data.doc_type) === 1 ? (
                  <div>{"Medical Bills & Discharge Summary"}</div>
                ) : (
                  <div>{data.doc_name}</div>
                )}

                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => window.open(data.doc_link, "_blank")}
                >
                  {["png", "jpg", "jpeg", "gif"].includes(
                    findExtension(data.doc_link)
                  ) ? (
                    <img
                      style={{ maxWidth: "50px", maxHeight: "30px" }}
                      src={data.doc_link}
                      alt={""}
                    />
                  ) : (
                    <i
                      style={{ fontSize: globalTheme.fontSize ? `calc(23px + ${globalTheme.fontSize - 92}%)` : '23px' }}
                      className="font-weight text-warning fas fa-file-alt"
                    ></i>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      :
      <div className="d-flex justify-content-center">
        <NoDataFound />
      </div>
  );
};

export default ClaimSubmission;
