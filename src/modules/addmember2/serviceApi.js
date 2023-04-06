import HttpClient from "../../api/httpClient";
// add member-------------------------
const getPolicySubType = (data) =>
  HttpClient("/broker/get/employer/policy/type", { method: "POST", data });

const getPolicyNumber = (data) =>
  HttpClient("/broker/get/policy/type/numbers", { method: "POST", data });

const postMemberData = (data) =>
  HttpClient("/broker/endrose/member", { method: "POST", data, dont_encrypt: true });
const postMemberDataNew = (data) =>
  HttpClient("/broker/new-endrose-member", { method: "POST", data, dont_encrypt: true });

const sampleFile = (url) =>
  HttpClient(
    `/admin/get/sample-file?sample_type_id=${url}`,
    { method: "POST" }
  );

const sumInsured = (data) =>
  HttpClient(
    `/employee/policy/rate/details?policy_id=${data}`,
    { method: "GET", data }
  );
//--------------------------------------

// add nominee-------------------------

const getPolicyType = (data) => HttpClient('/broker/get/employer/policy/type', { method: "POST", data });
const getPolicyId = (data) => HttpClient('/admin/get/policyno', { method: "POST", data });
const getEmployeesByPolicy = (data) => HttpClient('/admin/get/employee/bysubtype', { method: "POST", data });
const loadRelationMaster = () => HttpClient('/admin/get/master/relation');

// const getEmployee = (data, page = 1) =>
//   HttpClient(`/admin/get/employee?page=${page}&per_page=250`, { method: "POST", data });

const addNomineeData = (data) =>
  HttpClient("/employee/add/nominee", { method: "POST", data });

const policies = (data) =>
  HttpClient(`/employee/policies?employee_id=${data}`, { method: "GET" });

//crud
const getNominee = (data) =>
  HttpClient(`/employee/get/all-nominee`, { method: "POST", data });
const deleteNominee = (id) =>
  HttpClient(`/employee/delete/nominee/${id}`, { method: "DELETE" });

//-------------------------------------
export {
  getPolicySubType, getPolicyNumber, postMemberData, sampleFile,
  addNomineeData, sumInsured, policies, getNominee, deleteNominee,
  getPolicyType, getPolicyId, getEmployeesByPolicy, loadRelationMaster,
  postMemberDataNew
};
