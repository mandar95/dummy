import HttpClient from "api/httpClient";

// Filters
const getEmployerNameData = (data, pageNo, per_page = 100) =>
  HttpClient(`/admin/get/employer?page=${pageNo}&per_page=${per_page}`, { method: "POST", data });
// const getInsurerData = (data) =>
//   HttpClient("/admin/get/insurer", { method: "POST", data });
const getPolicySubTypeData = (data) =>
  HttpClient("/broker/get/employer/policy/type", { method: "POST", data });
  

const getPolicyNumberData = (data) =>
  HttpClient(/*"/admin/get/policyno"*/'/broker/get/policy/type/numbers', {
    method: "POST",
    data,
  });
const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);
const adminGetEmployer = (id) => HttpClient(`/broker/get/employers?broker_id=${id}`);


// Enrolment Report
const exportReportData = (data) =>
  HttpClient("/broker/download-member-enrollment-report", {
    method: "POST",
    data,
  });

// claim utilization
const loadClaimUtilization = (data) =>
  HttpClient("/broker/claim-utilization", { method: "POST", data });

// monthly claim tracker
const loadMonthlyClaim = (data) =>
  HttpClient("/broker/report/claim-tracker", { method: "POST", data });

// client summary details
const loadClientSummary = (data) =>
  HttpClient("/broker/report/client-summary", { method: "POST", data });

const exportReportDataOfTpa = (data) =>
  HttpClient("/admin/tpa/download-report", {
    method: "POST",
    data,
  });

const exportReportDataOfGpa = (data) =>
  HttpClient("/admin/gpa-claim/download-report", {
    method: "POST",
    data,
  });

const exportReportDataOfGtl = (data) =>
  HttpClient("/admin/gtl-claim/download-report", {
    method: "POST",
    data,
  });

export default {
  // getInsurerData,
  getPolicySubTypeData,
  exportReportData,
  getPolicyNumberData,
  getEmployerNameData,
  adminGetBroker,
  adminGetEmployer,
  loadClaimUtilization,
  loadMonthlyClaim,
  loadClientSummary,
  exportReportDataOfTpa,
  exportReportDataOfGpa,
  exportReportDataOfGtl
};
