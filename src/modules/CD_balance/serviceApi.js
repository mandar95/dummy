import HttpClient from "../../api/httpClient";

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

export {
  getInsurerData,
  getPolicyTypeData,
  getPolicyNumberData,
  getPolicyDetailsData,
  getCdData,
  postCdBalanceData,
  getCdStatementFile
};
