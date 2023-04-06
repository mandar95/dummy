import HttpClient from "../../api/httpClient";

const getEmployerNameData = (data) =>
  HttpClient("/admin/get/employer?page=1&per_page=5000", { method: "POST", data });

const getInsurerData = (data) =>
  HttpClient("/admin/get/insurer", { method: "POST", data });

const getPolicyTypeData = (data) =>
  HttpClient("/broker/get/employer/policy/type", { method: "POST", data });

const getPolicyNumberData = (data) =>
  HttpClient("/admin/get/policyno", { method: "POST", data });

const getPolicyDetailsData = (data) =>
  HttpClient("/broker/get/policy/details", { method: "POST", data });

const getCdData = (data) =>
  HttpClient("/broker/update/cd_balance", { method: "POST", data });

const postCdBalanceData = (data) =>
  HttpClient("/broker/get/cd_balance_details", { method: "POST", data });

const getCdStatementFile = (data) =>
  HttpClient("/broker/get/cd_statement", { method: "POST", data });

const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

const employeePremiumBalance = (data) => HttpClient("/broker/get/cd_balance/employee_count", { method: "POST", data });

export {
  getEmployerNameData,
  getInsurerData,
  getPolicyTypeData,
  getPolicyNumberData,
  getPolicyDetailsData,
  getCdData,
  postCdBalanceData,
  getCdStatementFile,
  adminGetBroker,
  employeePremiumBalance
};
