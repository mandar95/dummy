import React from "react";
import { useParams } from "react-router-dom";
import { EmployeeFlexBenefit } from "./Employee/employee.flexbenefit";
// import { EmployerFlexBenefit } from "./flexbenefit"; // remove all file in future
import { BrokerFlexBenefit } from "./broker_view_flex/flexbenefit";


export const SwitchExchange = () => {

  const { userType } = useParams();
  switch (userType) {
    case "employee":
      return <EmployeeFlexBenefit />;
    case "employer":
      return <BrokerFlexBenefit />;
    case "broker":
      return <BrokerFlexBenefit />;
    case "admin":
      return <BrokerFlexBenefit admin />;
    default:
      return <div>404 PAGE NOT FOUND</div>;
  }
};
