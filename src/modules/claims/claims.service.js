import HttpClient from 'api/httpClient';

// Filters
const getEmployer = () => HttpClient('/broker/get/employer');
const getEmployee = (data) => HttpClient('/admin/get/employee/bysubtype', { method: "POST", data });
const getPolicyType2 = (data) => HttpClient('/broker/get/employer/policy/type', { method: "POST", data });
const getPolicyType = (data) => HttpClient('/admin/get/policy/subtype', { method: "POST", data });
const getMembers = (data) => HttpClient('/admin/get/emp_member', { method: "POST", data });
const getPolicyId = (data) => HttpClient('/admin/get/policyno', { method: "POST", data });
const postClaimValid = (data) => HttpClient('/admin/check/is-claim-submit', { method: "POST", data });
const getClaimId = (data) => HttpClient('/admin/get/claimId', { method: "POST", data });
//admin
const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);
const adminGetEmployer = (id) => HttpClient(`/broker/get/employers?broker_id=${id}`);

// Submit Forms
const postSubmitClaim = (data) => HttpClient('/admin/create/claim/submitclaim', { method: "POST", data, dont_encrypt: true });
const postIntimateClaim = (data) => HttpClient('/admin/create/claim/intimate', { method: "POST", data, dont_encrypt: true });
const loadIntimateClaimId = (data) => HttpClient('/admin/get/unmapped-intimate-claims', { method: "POST", data });

// submit-claim temp
const postSubmitTemp = (data) => HttpClient('/admin/submit/claim/step', { method: "POST", data });
const getSubmitTemp = () => HttpClient('/admin/get/existing-claim-data', { method: "POST" });
const deleteSubmitTemp = (id) => HttpClient(`/admin/delete/temp-claim/${id}`, { method: 'DELETE' });

// Track Claim
const postTrackClaim = (data) => HttpClient('/admin/get/trackClaim', { method: "POST", data });
const postTrackClaimForGPA = (data) => HttpClient('/admin/get/GpaTrackClaim', { method: "POST", data });

// Overall Claim
const postOverAllClaim = (data) => HttpClient('/admin/get/overall-claim', { method: "POST", data });
const exportPortalClaimReport = (data) => HttpClient('/admin/export/portal-claims', { method: "POST", data });

// State/City
const getStates = () => HttpClient('/admin/get/state');
const getCities = (data) => HttpClient('/admin/get/city', { method: "POST", data });

// Hopital State/City
const getHospStates = (data) => HttpClient('/admin/get/networkhospital/state', { method: "POST", data });
const getHospCities = (data) => HttpClient('/admin/get/networkhospital/city', { method: "POST", data });
const getHospitals = (data) => HttpClient('/admin/get/networkhospital/details', { method: "POST", data });
const getHospitalsByName = (data) => HttpClient('/admin/get/networkhospital/name', { method: "POST", data });

// TPA Status Config
const getTPAs = (data) => HttpClient('/admin/get-assiociated-tpas', { method: "POST", data });
const getTPAKeywords = (data) => HttpClient('/admin/get-tpa-claims-keyword', { method: "POST", data });
const getTPAKeywordsStatus = () => HttpClient('/admin/custom-claims-status', { method: "GET" });
const createTPAKeywords = (data) => HttpClient('/admin/create-custom-claim-status', { method: "POST", data });
const editTPAKeywords = (data) => HttpClient('/admin/update-custom-claim', { method: "POST", data });
const removeTPAKeywords = (data) => HttpClient('/admin/delete-custom-status', { method: "POST", data });


//documents
const documents = (data) => HttpClient('/employer/get/policy/claim-document', { method: "POST", data });

// claim Data
const loadClaimData = (data) => HttpClient('/admin/all-cliam-details', { method: "POST", data });

//upload policy data
const uploadPolicyData = (data) => HttpClient('/broker/upload/claim-data', { method: "POST", data, dont_encrypt: true });

const getClaimDetails = (data) => HttpClient('/admin/get-claim-data', { method: "POST", data });
const getClaimDetailsForGPA = (data) => HttpClient('/admin/get-gpa-claim-data', { method: "POST", data });

const GetDynamicSampleFile = (data) => HttpClient('/broker/upload/claim-data/sample', { method: "POST", data });

//submit claim bulk upload
const postClaimData = (data) => HttpClient('/broker/upload/claim-data', { method: "POST", data, dont_encrypt: true });
//intimate claim bulk upload
const postIntimateClaimData = (data) => HttpClient('/broker/upload/claim-data', { method: "POST", data, dont_encrypt: true });

const loadClaimDetails = (data) => HttpClient('/admin/get/existing-claim-data', { method: "POST", data });
const postDeficiencyUpload = (data) => HttpClient('/admin/deficiency-upload', { method: "POST", data, dont_encrypt: true });

// accepted extensions tpas
const tpaAcceptedExtensions = (data) => HttpClient('/admin/get/submit-claim-accepted-extensions', { method: "POST", data, });

// digital claim ipd opd form
const digitalClaimIpdOpdform = (data, type) => HttpClient(`/admin/digital-claim-${type}-form`, { method: "POST", data, });

export default {
  getEmployer,
  getEmployee,
  getPolicyType,
  getPolicyType2,
  getMembers,
  postSubmitClaim,
  getStates, getCities,
  getPolicyId,
  postClaimValid,
  postIntimateClaim,
  getHospStates,
  getHospCities,
  getHospitals,
  postTrackClaim,
  postTrackClaimForGPA,
  getHospitalsByName,
  getClaimId,
  postOverAllClaim,
  adminGetBroker,
  adminGetEmployer,
  postSubmitTemp,
  getSubmitTemp,
  deleteSubmitTemp,
  documents,

  getTPAs,
  getTPAKeywords,
  getTPAKeywordsStatus,
  createTPAKeywords,
  editTPAKeywords,
  removeTPAKeywords,

  loadClaimData,
  uploadPolicyData,
  getClaimDetails,
  getClaimDetailsForGPA,
  GetDynamicSampleFile,
  postClaimData,
  postIntimateClaimData,
  loadClaimDetails,
  postDeficiencyUpload,
  loadIntimateClaimId,
  exportPortalClaimReport,
  tpaAcceptedExtensions,

  digitalClaimIpdOpdform
};
