import HttpClient from "../../api/httpClient";

// drop-downs
const loadEmployers = () => HttpClient('/broker/get/employer');
const loadPolicyType = (data) => HttpClient('/admin/get/policy/subtype', { method: "POST", data });
const loadPolicyTypeAll = (data) => HttpClient('/broker/get/employer/policy/type', { method: "POST", data });
const loadPolicyNo = (data, isBroker) => HttpClient(isBroker ? '/broker/get/policy/type/numbers' : '/admin/get/policyno', { method: "POST", data });

// intimate claim
const createIntimateClaim = (data) => HttpClient('/admin/store/offline-intimate-claim', { method: "POST", data, dont_encrypt: true })
// const loadIntimateClaimErrorSheet = (data) => HttpClient('/admin/store/intimate-claim/error-sheet', { method: "POST", data })

// submit claim 
const createSubmitClaim = (data) => HttpClient('/admin/store/offline-submit-claim', { method: "POST", data, dont_encrypt: true })
// const loadSubmitClaimErrorSheet = (data) => HttpClient('/admin/store/submit-claim/error-sheet', { method: "POST", data })

// network hospital 
const createNetworkHospital = (data) => HttpClient('/admin/create/excel/networkhospital', { method: "POST", data, dont_encrypt: true })
// const loadNetworkHospitalErrorSheet = (data) => HttpClient('/admin/get/networkhospitals/error-sheet')

// upload claim
const createClaimData = (data) => HttpClient('/broker/upload/claim-data', { method: "POST", data, dont_encrypt: true });
const createGPAClaimData = (data) => HttpClient('/admin/get/gpa-claim/import-excel', { method: "POST", data, dont_encrypt: true });
// const loadClaimDataErrorSheet = (data) => HttpClient('/broker/get/tpa/claim-data/error-sheet', { method: "POST", data })
const createGTLClaimData = (data) => HttpClient('/admin/get/gtl-claim/import-excel', { method: "POST", data, dont_encrypt: true });

// error sheet [intimate claim, submit claim, network hospital, upload claim]
const loadErrorSheet = (data) => HttpClient('/broker/get/error-sheet', { method: "POST", data })



// member upload
const createMemberData = (data) => HttpClient("/admin/store/tpa/member/data", { method: "POST", data, dont_encrypt: true });
const loadMemberDataErrorSheet = (data) => HttpClient("/admin/get/tpa/member/error/sheet", { method: "POST", data });


// sample format [intimate claim, submit claim,netwrok,]
const loadSampleFormat = (data) => HttpClient('/admin/get/tpa-claim/sample-file', { method: "POST", data })

// sample format - member data
const loadSampleFormatMemberData = (data) => HttpClient('/admin/get/tpa-member/custom/sample', { method: "POST", data });

// sample format - claim data
const loadSampleFormatClaimData = (data) => HttpClient('/broker/upload/claim-data/sample', { method: "POST", data });
const loadSampleFormatForGpa = (data) => HttpClient('/admin/get/gpa-claim/sample-document', { method: "POST", data });
const loadSampleFormatForGtl = (data) => HttpClient('/admin/get/gtl-claim/sample-document', { method: "POST", data });

// ecard upload
const uploadECard = (data) => HttpClient("/admin/new/upload/e-card", { method: "POST", data, dont_encrypt: true });

// policy coverage
const laodCoverageSample = (data) => HttpClient('/employer/get/employee-coverage/sample', { method: "POST", data });
const laodCoverActionSample = (data) => HttpClient('/employer/employee-cover/up-down-config/sample', { method: "POST", data });
const uploadPolicyCoverage = (data) => HttpClient('/employer/upload/employee-coverage', { method: "POST", data, dont_encrypt: true });
const uploadPolicyCoverAction = (data) => HttpClient('/employer/upload/employee-cover-action', { method: "POST", data, dont_encrypt: true });

export default {
  loadEmployers, loadPolicyType, loadPolicyNo,

  createIntimateClaim,
  createSubmitClaim,
  createNetworkHospital,
  createClaimData,

  loadErrorSheet,

  createMemberData, loadMemberDataErrorSheet,

  loadSampleFormat,
  loadSampleFormatMemberData,
  loadSampleFormatClaimData,
  loadPolicyTypeAll,
  loadSampleFormatForGpa,
  createGPAClaimData,

  uploadECard,

  laodCoverageSample,
  laodCoverActionSample,
  uploadPolicyCoverage,
  uploadPolicyCoverAction,

  loadSampleFormatForGtl,
  createGTLClaimData
};
