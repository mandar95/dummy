import HttpClient from "../../api/httpClient";
// add member-------------------------
const getEmployerNameData = (data, pageNo = 1, perPage = 100) =>
  HttpClient(`/admin/get/employer?page=${pageNo}&per_page=${perPage}`, { method: "POST", data });

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

// const dynamicFile = (data) =>
//   HttpClient(
//     '/admin/get/custom-sample-file',
//     { method: "POST", data }
//   );
const dynamicFile = (data) =>
  HttpClient(
    '/admin/get/endorsement/sample-document',
    { method: "POST", data }
  );

const sumInsured = (data) =>
  HttpClient(
    `/employee/policy/rate/details?policy_id=${data}`,
    { method: "GET", data }
  );

const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

const postICMemberData = (data) => HttpClient("/broker/insurer/endorse/member", { method: "POST", data, dont_encrypt: true });
//-----
//--------------------------------------
const sheetKeys = () => HttpClient('/admin/default-format-data');
const createSheetTemplate = (data) => HttpClient('/admin/create-custom-format', { method: "POST", data });
const editSheetTemplate = (data) => HttpClient('/admin/update-custom-upload-template', { method: "POST", data });
const getTemplates = (data) => HttpClient('/admin/all-custom-upload-templates', { method: "POST", data });
const removeTemplate = (data) => HttpClient('/admin/delete-custom-template', { method: "POST", data });

const getEndorsementDetail = (data, userType, is_super_hr = 0, employer_id) => HttpClient(`/admin/endrosement-details?type=${data}${userType ? `&user_type_name=${userType}&is_super_hr=${is_super_hr}` : ''}${employer_id ? ('&employer_id=' + employer_id) : ''}`, { method: "GET", data })
const EndorsedMemberApproveReject = (data) => HttpClient('/admin/approve-reject-endrosed-member', { method: "POST", data });
const CreateEndorsementDeficiency = (data) => HttpClient('/admin/raise-defiency-for-endrosed-member', { method: "POST", data });

const GetErrorSheetData = (data) => HttpClient('/broker/get/endorsement/error-sheet', { method: "POST", data });
const GetErrorSheetURL = (data) => HttpClient('/admin/generate-endrosement-error-report', { method: "POST", data });
// add nominee-------------------------
//-------------------------------------
const GetDynamicFileTPA = (data) =>
  HttpClient(
    '/admin/get/tpa/member/sample',
    { method: "POST", data }
  );

const postMemberDataTPA = (data) =>
  HttpClient("/admin/store/tpa/member/data", { method: "POST", data, dont_encrypt: true });

const GetErrorSheetDataTPA = (data) => HttpClient("/admin/get/tpa/member/error/sheet", { method: "POST", data });
const getTPAFetch = (data) => HttpClient("/admin/get-assiociated-tpas", {
  method: "POST",
  data: {
    broker_id: 1,
  },
});
export {
  getEmployerNameData, getPolicySubType,
  getPolicyNumber, postMemberData,
  sampleFile, dynamicFile, sumInsured, adminGetBroker,
  sheetKeys, createSheetTemplate, getTemplates, editSheetTemplate, removeTemplate, postICMemberData,
  getEndorsementDetail, EndorsedMemberApproveReject, CreateEndorsementDeficiency, GetErrorSheetData,
  GetDynamicFileTPA, postMemberDataTPA,
  postMemberDataNew, GetErrorSheetDataTPA, getTPAFetch, GetErrorSheetURL
};
