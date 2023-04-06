import React from "react";
import MemberSummary from "./MemberSummary";
import NomineeSummary from "./NomineeSummary";
const CustomSummaryAccordion = ({ title, summary, accordionType,setEmployeeTotalPremium,choosed }) => {
    return accordionType === "Member" ? (
    <MemberSummary title={title} summary={summary} setEmployeeTotalPremium={setEmployeeTotalPremium} choosed={choosed} />
  ) : (
    <NomineeSummary title={title} summary={summary} />
  );
};

export default CustomSummaryAccordion;
