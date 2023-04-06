import HttpClient from "../../api/httpClient";

// drop-downs
const loadEmployers = () => HttpClient('/broker/get/employer');

// employee upload
const uploadEmployeeUpload = (data) => HttpClient('/admin/employee/bulk-upload', { method: "POST", data, dont_encrypt: true });
const sampleEmployeeUpload = (data) => HttpClient('/admin/employee/bulk-upload-sample', { method: "POST", data });

const loadErrorSheet = (data) => HttpClient('/broker/get/error-sheet', { method: "POST", data })

export default {
  loadEmployers,
  uploadEmployeeUpload,
  sampleEmployeeUpload,
  loadErrorSheet
};
