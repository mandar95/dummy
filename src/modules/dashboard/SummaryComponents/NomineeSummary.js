import React, { useState } from "react";
import { Input } from "components";
import Button from "@material-ui/core/Button";
import { getImage } from "./MemberSummary";
import { useMediaQuery } from 'react-responsive'
import { DateFormate } from "utils";
const NomineeSummary = ({ title, summary, accordionType }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const [nomineeData, setNomineeData] = useState(0);
  return (
    <div className="row">
      <div className="col-12 w-100" style={{
        overflowX: "auto"
      }}>
          <div style={{
            ...(isMobile && {width: 100})
          }} className="d-flex py-2 flex-nowrap">
            {!!summary &&
              summary[`${title}`]?.map((elem, index) => (
                <div key={"NomineeSummary" + index}>
                  <Button

                    onClick={() => setNomineeData(index)}
                    style={{
                      border: "0px",
                      ...(nomineeData === index && {
                        borderBottom: "2px solid red",
                      }),
                    }}
                    className={`mx-2`}
                    startIcon={
                      <img
                        style={{ maxHeight: "30px", marginRight: "10px" }}
                        src={getImage(elem.nominee_relation, "", "nominee")}
                        alt=""
                      />
                    }
                  >
                    {elem?.nominee_relation?.split("/")[0]}
                  </Button>
                </div>
              ))}
          </div>
      </div>
      <div className="row w-100 mx-1">
        {nomineeData !== null &&
          Boolean(typeof summary[`${title}`] === "object") && (
            <>
              <div className="col-12 col-sm-4">
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  value={
                    summary[`${title}`][nomineeData]?.nominee_relation || "-"
                  }
                  label={"Relation"}
                />
              </div>
              <div className="col-12 col-sm-4">
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  value={summary[`${title}`][nomineeData]?.nominee_fname || "-"}
                  label={"First Name"}
                />
              </div>
              <div className="col-12 col-sm-4">
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  value={summary[`${title}`][nomineeData]?.nominee_lname || "-"}
                  label={"Last Name"}
                />
              </div>
              <div className="col-12 col-sm-4">
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  value={DateFormate(summary[`${title}`][nomineeData]?.nominee_dob) || "-"}
                  label={"Date Of Birth"}
                />
              </div>
              <div className="col-12 col-sm-4">
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  value={summary[`${title}`][nomineeData]?.share_per || "-"}
                  label={"Share %"}
                />
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default NomineeSummary;
