import HttpClient from "../../api/httpClient";

const loadEmployers = () => HttpClient('/broker/get/employer');
const loadPolicyType = (data) => HttpClient('/admin/get/policy/subtype', { method: "POST", data });
const loadPolicyNo = (data, pageNo) => HttpClient(`/admin/get/policyno?page=${pageNo}&per_page=250`, { method: "POST", data });
const loadSampleFormat = (data) => HttpClient('/broker/get-planned-hospitalization-sample', { method: "POST", data });
const loadEmployee = (data) => HttpClient('/admin/get/employee/bysubtype', { method: "POST", data });
const loadMembers = (data) => HttpClient('/admin/get/emp_member', { method: "POST", data });
const loadAilment = (data) => HttpClient('/employee/ailment-with-hospital-mapping', { method: "POST", data });
const loadHospitals = (data) => HttpClient('/admin/get/networkhospital/details', { method: "POST", data });
const loadBalanceSuminsured = (data) => HttpClient('/employee/get/balance/suminsured', { method: "POST", data });
// const loadStateCity = (data) => HttpClient('/employee/get-network-hosp-state-city', { method: "POST", data });

const loadState = (data) => HttpClient('/admin/get/networkhospital/state', { method: "POST", data });
const loadCity = (data) => HttpClient('/admin/get/networkhospital/city', { method: "POST", data });

const exportPlannedHosp = (data) => HttpClient('/broker/store-planned-hospitalization-details', { method: "POST", data, dont_encrypt: true });
const sheetStatus = (data) => HttpClient('/broker/planned-hospitalization-error-sheets', { method: "POST", data });

const saveClaim = (data) => HttpClient('/admin/create/claim/intimate', { method: "POST", data, dont_encrypt: true });

const loadClaimData = (data) => HttpClient('/employee/get-claim-data-detail', { method: "POST", data, dont_encrypt: true });

const RecommendHospitals = (data) => HttpClient('/broker/recommend-hospitals-ailment-wise', { method: "POST", data, dont_encrypt: true });
const suggestHospital = (data) => HttpClient('/broker/save-recommended-hospital-ailment-mapping', { method: "POST", data });

const updateClaimStatus = (data) => HttpClient('/employee/toggle-claim-status', { method: "POST", data });
const updateProceedWith = (data) => HttpClient('/employee/select-recommend-or-current-hospital', { method: "POST", data });
const updateTPAClaim = (data) => HttpClient('/broker/tpa-update-planned-hospitalization', { method: "POST", data, dont_encrypt: true });

const updateDiscrepancy = (data) => HttpClient('/broker/claim-deficiency-flow', { method: "POST", data, dont_encrypt: true });

const getHealthECard = (data) => HttpClient('/admin/get/healthEcard', { method: "POST", data });

const ClaimDetail = (data) => HttpClient('/broker/view-all-planned-hospitalization-claims', { method: "POST", data });
const PlannedHospitalMapDetail = (data) => HttpClient('/broker/view-all-planned-hospitals-and-aliment-mapping', { method: "POST", data });

// Flow API`s

const loadFlowDetails = () => HttpClient('/admin/get/all/policy-e-cashless')
const createECashFlow = (data) => HttpClient('/admin/create/policy-e-cashless', { method: "POST", data })
const getFlowDetail = (policy_id) => HttpClient(`/admin/get/single/policy-e-cashless/${policy_id}`)
const updateECashFlow = (data) => HttpClient(`/admin/update/policy-e-cashless/${data.id}`, { method: "PATCH", data })
const deleteECashFlow = (flow_id) => HttpClient(`/admin/delete/policy-e-cashless/${flow_id}`, { method: "DELETE" })


export default {
  loadEmployers, loadPolicyType, loadPolicyNo, loadSampleFormat,
  exportPlannedHosp, sheetStatus, loadEmployee, loadMembers,
  loadAilment, loadHospitals, loadBalanceSuminsured,
  //  loadStateCity,
  loadState, loadCity, saveClaim, loadClaimData,
  RecommendHospitals, suggestHospital, updateClaimStatus,
  updateProceedWith, updateTPAClaim, updateDiscrepancy,
  getHealthECard, ClaimDetail, PlannedHospitalMapDetail,
  //Flow
  loadFlowDetails, createECashFlow,
  getFlowDetail, updateECashFlow,
  deleteECashFlow,
};
