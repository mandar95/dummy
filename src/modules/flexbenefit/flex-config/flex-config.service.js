import HttpClient from 'api/httpClient';

// Filters
const getPolicySubTypeData = (data) =>
  HttpClient('/broker/get/employer/policy/type', { method: 'POST', data });
const getPolicyNumberData = (data) =>
  HttpClient(/*'/admin/get/policyno'*/'/broker/get/policy/type/numbers', {
    method: 'POST',
    data,
  });
const loadPolicyData = data => HttpClient('/admin/policy-rater-details', { method: 'POST', data })

const submitFlex = (data) => HttpClient('/admin/create-new-flex-plan', { method: 'POST', data });
const updateFlex = (data) => HttpClient('/admin/update-flex-plan-detail', { method: 'PATCH', data });
const deleteFlex = (data) => HttpClient('/admin/delete-flex-plan', { method: 'POST', data });
const loadFlexList = () => HttpClient('/admin/all-flex-plans');
const getFlexDetail = (data) => HttpClient('/admin/single-flex-plan-detail', { method: 'POST', data });
const updateFlexStatus = (data) => HttpClient('/admin/toggle-plan-status', { method: 'POST', data });

const loadBenefits = () => HttpClient('/admin/master-product-features');
const loadEmployeOptedFlex = ({ data, page = 1, per_page = 200, globalFilterState }) => HttpClient(`/admin/get-all-consumers-for-plan?&page=${page}&per_page=${per_page}`, { method: 'POST', data: { ...data, ...globalFilterState && { filter_value: globalFilterState } } });
const employeeRollBack = (data) => HttpClient('/admin/rollback-employee-plan', { method: 'POST', data });


export default {
  getPolicySubTypeData,
  getPolicyNumberData,
  loadPolicyData,
  submitFlex, updateFlex,
  loadFlexList,
  getFlexDetail,
  deleteFlex,
  loadBenefits,
  loadEmployeOptedFlex,
  updateFlexStatus,
  employeeRollBack
};
