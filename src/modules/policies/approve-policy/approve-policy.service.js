import HttpClient from 'api/httpClient';

// Assign Policy GET Details
const getPolicyDetail = (id) => HttpClient(`/broker/policy/${id}/edit`);
const getOptions = (id) => HttpClient(`/broker/configure/policy${id ? `?broker_id=${id}` : ''}`);

// Downlaod Sample
const downloadSample = data => HttpClient("/admin/get/sample-file", { method: 'POST', data })

// get audit trail
const getAuditTrail = (data) => HttpClient("/broker/get/enrollment-window/audit-trail", { method: "POST", data })

// Update Policy
const updatePolicy = (data) => HttpClient(`/broker/policy/update`, { method: 'POST', data, dont_encrypt: true });

// Aprove &| Live Policy
const confirmPolicy = (data) => HttpClient(`/broker/toggle/policy/status`, { method: 'POST', data });

const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

// enrollment update
const loadMembersEnrolled = (data) => HttpClient('/admin/get/policy-employees', { method: 'POST', data });
const loadMembersEnrollePaginated = (data, cancelTokenSource) => HttpClient('/admin/get/policy-employees',
  {
    method: 'POST', data: { ...data.data, ...data.globalFilterState && { filter_value: data.globalFilterState }, ...data },
    cancelToken: cancelTokenSource ? cancelTokenSource.token : false
  });
const updateMembersEnrollmentDate = (data) => HttpClient('/admin/change/employees-enrollement-dates', { method: 'POST', data });
const updateMembersEnrollmentConfirmaton = (data) => HttpClient('/admin/change/enrollement-confirmation-status', { method: 'POST', data });

// endorsement mapping
const endorsementMapping = (data) => HttpClient('/admin/create-policy-template-mapping', { method: 'POST', data });

// Base Wise Si-Pr
const loadBaseWiseSiPrSheet = (data) => HttpClient('/admin/policy/rates/details', { method: 'POST', data });

// check employer cd statement
const checkEmployerCdStatement = (data) => HttpClient('/broker/check-employer-cd-statement', { method: 'POST', data });


export default {
  getPolicyDetail,
  getOptions,
  downloadSample,
  updatePolicy,
  confirmPolicy,
  adminGetBroker,
  loadMembersEnrolled,
  updateMembersEnrollmentDate,
  updateMembersEnrollmentConfirmaton,
  endorsementMapping,
  loadBaseWiseSiPrSheet,
  checkEmployerCdStatement,
  getAuditTrail,
  loadMembersEnrollePaginated
};
