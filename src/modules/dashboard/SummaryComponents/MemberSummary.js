import React, { useEffect, useState } from "react";
import { comma } from "modules/enrollment/NewDesignComponents/ForthStep";
import { Input } from "components";
import Button from "@material-ui/core/Button";
import imagea from "../../enrollment/NewDesignComponents/subComponent/user.png";
import { useSelector } from "react-redux";
import { DateFormate } from "utils";
import { useMediaQuery } from 'react-responsive'
import { ModuleControl } from "../../../config/module-control";
export const getImage = (name, gender, type = "member") => {
  let pic = "/assets/images/icon/man.png";
  if (name === "Self" && gender === "Female") {
    pic = "/assets/images/icon/woman.png";
  } else if (name === "Son" && gender === "Male") {
    pic = "/assets/images/icon/boy.png";
  } else if (name === "Daughter" && gender === "Female") {
    pic = "/assets/images/icon/girl.png";
  } else if ((name === "Spouse/Partner" || name === "Spouse" || name === "Partner") && gender === "Female") {
    pic = "/assets/images/icon/woman.png";
  } else if (
    (name === "Mother-in-law" || name === "Mother") &&
    gender === "Female"
  ) {
    pic = "/assets/images/icon/grandmother.png";
  } else if (
    (name === "Father-in-law" || name === "Father") &&
    gender === "Male"
  ) {
    pic = "/assets/images/icon/grandfather.png";
  } else if (gender === "Other") {
    pic = "/assets/images/icon/othergender.png";
  }
  if (type === "nominee") {
    pic = imagea;
  }
  return pic;
};
const MemberSummary = ({ title, summary, setEmployeeTotalPremium, choosed }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const { currentUser } = useSelector((state) => state.login);
  const UdaanLogicActivate = ModuleControl.isHowden &&
    ((((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('robin software development') ||
      (currentUser?.company_name || '').toLowerCase().startsWith('rakuten')) &&
      Number(summary[`${title}`]?.[0]?.number_of_time_salary) === 3)) &&
    summary[`${title}`]?.[0]?.policy_sub_type_id !== 1;
  const [relationData, setRelationData] = useState(0);
  let coverTypeValue =
    summary &&
      Boolean(
        summary[`${title}`].reduce(
          (total, { suminsured }) => total + Number(suminsured),
          0
        ) +
        summary[`${title}`].reduce(
          (total, { opd_suminsured }) =>
            total + Number(opd_suminsured ? opd_suminsured : 0),
          0
        )
      )
      ? comma(
        summary[`${title}`].reduce(
          (total, { suminsured }) => total + Number(suminsured),
          0
        ) +
        summary[`${title}`].reduce(
          (total, { opd_suminsured }) =>
            total + Number(opd_suminsured ? opd_suminsured : 0),
          0
        )
      )
      : "-";
  let coverType = Boolean(
    Number(summary[`${title}`]?.[0]?.suminsurued_type_id) === 1
  )
    ? "Individual Cover"
    : "Family Cover";
  const [annualPremium] = useState(!!summary && !UdaanLogicActivate &&
    Boolean(
      summary[`${title}`].reduce(
        (total, { employee_premium, opd_employee_contribution }) =>
          total +
          Number(employee_premium) +
          Number(opd_employee_contribution),
        0
      )
    ));
  useEffect(() => {
    if (annualPremium) {
      if (choosed === "") {
        setEmployeeTotalPremium(employeeTotalPremium => Number(employeeTotalPremium) + Number(summary[`${title}`].reduce(
          (
            total,
            { employee_premium, opd_employee_contribution }
          ) =>
            total +
            Number(employee_premium) +
            Number(opd_employee_contribution),
          0
        )))
      } else if (choosed !== "") {
        setEmployeeTotalPremium(employeeTotalPremium => employeeTotalPremium);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annualPremium])
  return (
    <div className="row">
      <div className="col-12 col-sm-4">
        <Input
          style={{
            background: "white",
          }}
          disabled={true}
          value={coverType === "Individual Cover" ? "View Details" : coverTypeValue}
          label={coverType}
        />
      </div>
      {annualPremium && <>
        <div className="col-12 col-sm-4">
          <Input
            style={{
              background: "white",
            }}
            disabled={true}
            value={comma(summary[`${title}`].reduce(
              (
                total,
                { employee_premium, opd_employee_contribution }
              ) =>
                total +
                Number(employee_premium) +
                Number(opd_employee_contribution),
              0
            ))}
            label={"Annual Premium"}
          />
        </div>
        {Boolean(summary[`${title}`][0]?.installment) && <div className="col-12 col-sm-4">
          <Input
            style={{
              background: "white",
            }}
            disabled={true}
            value={`${summary[`${title}`][0]?.installment} Months`}
            label={"Installment"}
          />
        </div>}
      </>}

      <div className="col-12 w-100" style={{
        overflowX: "auto"
      }}>
        <div style={{
          ...(isMobile && { width: 100 })
        }} className="d-flex py-2 flex-nowrap">
          {!!summary &&
            summary[`${title}`]?.map((elem, index) => (
              <div key={"MemberSummary" + index}>
                <Button

                  onClick={() => setRelationData(index)}
                  style={{
                    ...(relationData === index && {
                      borderBottom: "2px solid red",
                    }),
                  }}
                  className={`mx-2`}
                  startIcon={
                    <img
                      style={{ maxHeight: "30px", marginRight: "10px" }}
                      src={getImage(elem.relation_name, elem.gender)}
                      alt=""
                    />
                  }
                >
                  {elem.relation_name.split("/")[0]}
                </Button>
              </div>
            ))}
        </div>
      </div>
      <div className="row w-100 mx-1">
        {relationData !== null && (
          <>
            <div className="col-12 col-sm-4">
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                value={summary[`${title}`][relationData].relation_name || "-"}
                label={"Relation"}
              />
            </div>
            <div className="col-12 col-sm-4">
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                value={summary[`${title}`][relationData].first_name || "-"}
                label={"First Name"}
              />
            </div>
            <div className="col-12 col-sm-4">
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                value={summary[`${title}`][relationData].last_name || "-"}
                label={"Last Name"}
              />
            </div>
            <div className="col-12 col-sm-4">
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                value={summary[`${title}`][relationData].gender || "-"}
                label={"Gender"}
              />
            </div>
            <div className="col-12 col-sm-4">
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                value={DateFormate(summary[`${title}`][relationData].dob) || "-"}
                label={"Date Of Birth"}
              />
            </div>
            {coverType === "Individual Cover" && <>
              <div className="col-12 col-sm-4">
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  value={summary[`${title}`][relationData].suminsured || "-"}
                  label={`Sum Insured
                ${summary[`${title}`].some(
                    (item) => !!item.opd_suminsured
                  ) ? "IPD" : ""}`}
                />
              </div>
              {summary[`${title}`].some(
                (item) => !!item.opd_suminsured
              ) && <div className="col-12 col-sm-4">
                  <Input
                    style={{
                      background: "white",
                    }}
                    disabled={true}
                    value={summary[`${title}`][relationData].opd_suminsured || "-"}
                    label={`Sum Insured OPD`}
                  />
                </div>}
            </>}
            {!UdaanLogicActivate && summary[`${title}`].some(
              (item) => !!Boolean(
                Number(item.employee_premium) +
                Number(item.opd_employee_contribution))
            ) && <div className="col-12 col-sm-4">
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  value={Boolean(
                    Number(summary[`${title}`][relationData].employee_premium) +
                    Number(summary[`${title}`][relationData].opd_employee_contribution)
                  )
                    ? comma(Number(summary[`${title}`][relationData].employee_premium) +
                      Number(summary[`${title}`][relationData].opd_employee_contribution))
                    : "-"}
                  label={`Annual Premium`}
                />
              </div>}
          </>
        )}
      </div>
    </div>
  );
};

export default MemberSummary;
