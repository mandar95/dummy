import React from "react";
// import Dashboard from "./Dashboard";
import EmployeeHome from 'modules/employeeHome/employeeHome';
import DashboardBroker from "./dashboard_broker/dashboard";
import DashboardEmployer from "./dashboard_employer/dashboard";
import DashboardAdmin from "./dashboard-admin/dashboard";
import { InsurerDashboard } from "./dashboard_insurer/InsurerDashboard";
import { CustomerDashboard } from "./dashboard_customer/CustomerDashboard";
import NewBrokerDashboard from 'modules/NewBrokerDashboard';
import { useParams } from "react-router-dom";
import { ModuleControl } from "../../config/module-control";

const SwitchExchangeDashboard = () => {
  const { userType } = useParams();
  switch (userType) {
    case "employee":
      return <EmployeeHome />;
    case "employer":
      return ModuleControl.NewBrokerDashboard ? <NewBrokerDashboard /> : <DashboardEmployer />;
    case "broker":
      return ModuleControl.NewBrokerDashboard ? <NewBrokerDashboard /> : <DashboardBroker />;
    case "admin":
      return <DashboardAdmin />;
    case "insurer":
      return <InsurerDashboard />;
    case "customer":
      return <CustomerDashboard />;
    default:
      return <div>404 PAGE NOT FOUND</div>;
  }
};

export default SwitchExchangeDashboard;
