import HttpClient from "../../api/httpClient";

//tables
const info = (userType) => HttpClient(`/admin/super-admin/get-tables${userType ? `?user_type_name=${userType}` : ''}`, { method: "GET" });

//columns
const columns = (data) => HttpClient('/admin/super-admin/get-table/column', { method: "POST", data });

//create columns
const create = (data) => HttpClient('/admin/super-admin/create-report-template', { method: "POST", data });

//create report
// const loadBroker = (type = 'Broker', userType) => HttpClient(`/admin/users?type=${type}&status=1${userType ? `&user_type_name=${userType}` : ''}`);
const loadTemplate = (userType) => HttpClient(`/admin/super-admin/get-report-template${userType ? `?user_type_name=${userType}` : ''}`);
const createCommunication = (data) => HttpClient('/admin/super-admin/create-report-trigger', { method: "POST", data });

const loadTemplateData = (userType) => HttpClient(`/admin/super-admin/all-report-templates${userType ? `?user_type_name=${userType}` : ''}`);
const downloadReportTemplate = (data) => HttpClient('/admin/download-report-template-report', { method: "POST", data });
const updateTemplateStatus = (data) => HttpClient('/admin/toggle-report-template-status', { method: "POST", data });

//verify
const verifyMerge = (data) => HttpClient('/admin/super-admin/check-table-joins', { method: "POST", data });

export const services = {
  info, columns, create,
  // loadBroker, 
  loadTemplate,
  createCommunication, verifyMerge,
  loadTemplateData, downloadReportTemplate,
  updateTemplateStatus
};
