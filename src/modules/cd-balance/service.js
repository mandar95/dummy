import HttpClient from "../../api/httpClient";

const loadSummary = ({ data, page, per_page, globalFilterState, ...rest }, cancelTokenSource) =>
  HttpClient(`/broker/get/cd-balance/summary${data.userType ? `?user_type_name=${data.userType}` : ''}&is_super_hr=${data.is_super_hr}&page=${page}&per_page=${per_page}${globalFilterState ? `&filter_value=${globalFilterState}` : ''}`,
    { cancelToken: cancelTokenSource ? cancelTokenSource.token : false });

const loadPolicyWise = (data, currentUser) => HttpClient(`/broker/get/addition/endorsement/summary${currentUser ? `?user_type_name=${currentUser}` : ''}`, { method: 'POST', data });
const loadPolicySubType = (employer_id, broker_id) => HttpClient(`/admin/get/master/subpolicy?${employer_id ? 'employer_id=' + employer_id : 'broker_id=' + broker_id}`);
const loadEmployers = (userType) => HttpClient(`/admin/users?type=Employer&status=1${userType ? `&user_type_name=${userType}` : ''}&per_page=10000`);
const loadEmployerChilds = (data) => HttpClient('/broker/get/employer/child-companies', { method: 'POST', data });
const loadGroupChilds = (data) => HttpClient('/broker/get/employer/group-companies', { method: 'POST', data });
const loadInsurerCrossCheck = (data) => HttpClient('/broker/get/insurer/endorse/member/report', { method: 'POST', data });
const loadPolicies = (currentUser, pageNo, is_super_hr = 0, employer_id) => HttpClient(`/broker/policies${currentUser ? `?user_type_name=${currentUser}` : ''}&page=${pageNo}&is_super_hr=${is_super_hr}&employer_id=${employer_id}`);
const GetErrorSheetData = (data) => HttpClient('/broker/get/insurer/endorsement/error-sheet', { method: "POST", data });

// const sampleFile = (url) =>
//   HttpClient(
//     `/admin/get/sample-file?sample_type_id=${url}`,
//     { method: "POST" }
//   );

const sampleFile = (data) =>
  HttpClient(
    '/broker/download/insurer-member-endorsement/format',
    { method: "POST", data }
  );

const submitInsurerCdStatement = (data) => HttpClient('/broker/create/insurer/cd-statement', { method: 'POST', data, dont_encrypt: true });
const loadInsurerCdStatement = (data) => HttpClient('/broker/get/insurer/cd-statement/upload-data', { method: 'POST', data });
const submitInsurerEndorsementReport = (data) => HttpClient("/broker/insurer/endorse/member", { method: "POST", data, dont_encrypt: true });

const downloadCDStatement = (data) => HttpClient('/broker/get/cd_statement', { method: 'POST', data });
const availableLivesAPI = (data) => HttpClient('/broker/get/cd_balance/employee_count', { method: 'POST', data });

const loadCdBalanceData = (data) =>
  HttpClient("/broker/get/cd_balance_details", { method: "POST", data });
const loadPolicyDetailsData = (data) =>
  HttpClient("/broker/get/policy/details", { method: "POST", data });
const updateCdBalance = (data) =>
  HttpClient("/broker/update/cd_balance", { method: "POST", data });

export {
  loadSummary,
  loadPolicyWise, loadPolicySubType,
  loadEmployers, loadEmployerChilds,
  loadGroupChilds, loadInsurerCrossCheck,
  sampleFile,
  submitInsurerCdStatement,
  loadInsurerCdStatement,
  submitInsurerEndorsementReport,
  loadPolicies,
  GetErrorSheetData,
  downloadCDStatement,
  availableLivesAPI,
  loadCdBalanceData,
  loadPolicyDetailsData,
  updateCdBalance
};
