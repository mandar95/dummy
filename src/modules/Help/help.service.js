import HttpClient from '../../api/httpClient';

// FAQ
const getBrokerFAQ = () => HttpClient(`/broker/get/all_faq`);
const postBrokerFAQ = (data) => HttpClient(`/broker/store/faqs`, { method: "POST", data, dont_encrypt: true });
const getQueriesMasterTypeData = () => HttpClient("/admin/get-master-queries-id", { method: "GET" });
const downloadMasterType = (data) => HttpClient('/admin/export-queries-complaint-logs', { method: 'POST', data })
const downloadFeedback = (data) => HttpClient('/admin/export-feedback-report', { method: 'POST', data })
const updateBrokerFAQ = (id, data) => HttpClient(`/broker/update/faqs/${id}`, { method: "PATCH", data, dont_encrypt: true })
const deleteBrokerFAQ = (id, data) => HttpClient(`/broker/delete/faqs/${id}`, { method: "DELETE" })

// Filters
const getEmployer = () => HttpClient(`/broker/get/employer`);
const getSubTypePolicy = (id) => HttpClient(`/admin/getSubTypePolicy/${id}`);

// Download Sample
const downloadSample = data => HttpClient("/admin/get/sample-file", { method: 'POST', data });

// Queries & Complaint
const getQueriesComplaint = (id) => HttpClient(`/broker/get/queries/${id}`);
const replyQueriesComplaint = (id, data) => HttpClient(`/broker/update/queries/action/${id}`, { method: 'POST', data });

// Broker FeedBack
const getFeedBackBroker = (id) => HttpClient(`/broker/get/employer-feedback${id ? `?broker_id=${id}` : ''}`);

// Get Broker
const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

// Escalation Matrix
const saveEscalationMatrix = (data) => HttpClient('/admin/create/query/escalation-matrix', { method: 'POST', data })
const loadEscalationMatrix = (data) => HttpClient('/admin/get/query/escalation-matrices', { method: 'POST', data })
const updateEscalationMatrix = (id, data) => HttpClient(`/admin/update/query/escalation-matrix/${id}`, { method: 'PATCH', data })
const deleteEscalationMatrix = (id) => HttpClient(`/admin/delete/query/escalation-matrix/${id}`, { method: 'DELETE' })

/* _________________________________________________Employer Services_____________________________________________________ */

export const getEmployerFAQs = (is_super_hr = 0) => HttpClient(`/employer/get/faqs?is_super_hr=${is_super_hr}`);

export const getEmployerQueries = (is_super_hr = 0) => HttpClient(`/employer/get/employee-queries?is_super_hr=${is_super_hr}`);

export const getEmployerFeedBack = (is_super_hr = 0) => HttpClient(`/employer/get/employee-feedback?is_super_hr=${is_super_hr}`);

export const replyEmployeeQuery = (query_id, data) => HttpClient(`/employer/update/queries/action/${query_id}`, { method: "POST", data })

export const submitFeedback = (data) => HttpClient('/employee/add/feedbcak', { method: "POST", data });


/* _________________________________________________________________________________________________________________________ */

/* _________________________________________________Customer Services_____________________________________________________ */

const submitCustomerFeedback = (data) => HttpClient('/admin/add/feedback', { method: "POST", data });
const getCustomerQuery = () => HttpClient('/admin/get/query-type-list');
const getCustomerSubQuery = (data) => HttpClient('/admin/get/query-sub-type-list', { method: "POST", data });
const submitQuery = (data) => HttpClient('/admin/create/queries', { method: "POST", data, dont_encrypt: true });
const getCustomerQueries = () => HttpClient('/admin/get/queries');
const getCustomerFaq = (data) => HttpClient('/admin/get/faq', { method: "POST", data });

/* _________________________________________________Customer Services_____________________________________________________ */

/* _________________________________________________Insurer Services_____________________________________________________ */

const submitInsurerQueriesType = (data) => HttpClient('/insurer/create/master/query', { method: "POST", data });
const getInsurerQueriesType = (data) => HttpClient('/insurer/get/master/query', { method: "POST", data });
const deleteInsurerQueriesType = (id) => HttpClient(`/insurer/delete/master/query/${id}`, { method: "DELETE" });
const editInsurerQueriesType = (id) => HttpClient(`/insurer/edit/insurer-document/${id}`);
const updateInsurerQueriesType = (id, data) => HttpClient(`/insurer/update/master/query/${id}`, { method: 'POST', data, dont_encrypt: true });

const submitInsurerSubQueriesType = (data) => HttpClient('/insurer/create/master/sub-query', { method: "POST", data });
const getInsurerQueriesSubType = (data) => HttpClient('/insurer/get/master/sub-query', { method: "POST", data });
const deleteInsurerSubQueriesType = (id) => HttpClient(`/insurer/delete/master/sub-query/${id}`, { method: "DELETE" });
const updateInsurerSubQueriesType = (id, data) => HttpClient(`/insurer/update/master/sub-query/${id}`, { method: 'POST', data, dont_encrypt: true });

const getInsurerQuery = (data) => HttpClient('/insurer/get/queries', { method: "POST", data });

//FAQ
const getInsurerFaq = (data) => HttpClient('/insurer/get/faq', { method: "POST", data });
const createInsurerFaq = (data) => HttpClient('/insurer/create/faq', { method: "POST", data });
const createInsurerFaqXls = (data) => HttpClient('/insurer/create/excel/faq', { method: "POST", data, dont_encrypt: true });
const deleteInsurerFaq = (id) => HttpClient(`/insurer/delete/faq/${id}`, { method: "DELETE" });
const editInsurerFaq = (id) => HttpClient(`/insurer/get/faq/${id}`);
const updateInsurerFaq = (id, data) => HttpClient(`/insurer/update/faq/${id}`, { method: "PATCH", data });
const createMaterQuery = (data) => HttpClient('/insurer/create/excel/master-query', { method: "POST", data, dont_encrypt: true });
const createMaterSubQuery = (data) => HttpClient('/insurer/create/excel/master-sub-query', { method: "POST", data, dont_encrypt: true });

const updateQuery = (id, data) => HttpClient(`/insurer/update/query/action/${id}`, { method: 'POST', data, dont_encrypt: true });
const getInsurerFeedback = (data) => HttpClient('/insurer/get/feedback', { method: 'POST', data });
/* _________________________________________________Insurer Services_____________________________________________________ */

const GetOrganizationQuery = () => HttpClient('/broker/get/organization/queries');
const CreateOrgQueries = (data) => HttpClient('/broker/create/organization/queries', { method: 'POST', data, dont_encrypt: true });

const GetInsOrganizationQuery = () => HttpClient('/insurer/get/organization/queries');
const CreateInsOrgQueries = (data) => HttpClient('/insurer/create/organization/queries', { method: 'POST', data, dont_encrypt: true });

const GetEmpOrganizationQuery = (is_super_hr = 0) => HttpClient(`/employer/get/organization/queries?is_super_hr=${is_super_hr}`);
const CreateEmpOrgQueries = (data) => HttpClient('/employer/create/organization/queries', { method: 'POST', data, dont_encrypt: true });

export {
  getBrokerFAQ,
  getEmployer,
  getSubTypePolicy,
  postBrokerFAQ,
  downloadSample,
  getQueriesComplaint,
  replyQueriesComplaint,
  updateBrokerFAQ,
  deleteBrokerFAQ,
  getFeedBackBroker,
  adminGetBroker,
  submitCustomerFeedback,
  getCustomerQuery,
  getCustomerSubQuery,
  submitQuery,
  getCustomerQueries,
  submitInsurerQueriesType,
  getInsurerQueriesType,
  deleteInsurerQueriesType,
  editInsurerQueriesType,
  updateInsurerQueriesType,
  submitInsurerSubQueriesType,
  getInsurerQueriesSubType,
  deleteInsurerSubQueriesType,
  updateInsurerSubQueriesType,
  getInsurerQuery,
  getInsurerFaq,
  createInsurerFaq,
  createInsurerFaqXls,
  deleteInsurerFaq,
  updateInsurerFaq,
  editInsurerFaq,
  createMaterQuery,
  createMaterSubQuery,
  getCustomerFaq,
  updateQuery,
  getInsurerFeedback,
  GetOrganizationQuery,
  CreateOrgQueries,
  GetInsOrganizationQuery,
  CreateInsOrgQueries,
  GetEmpOrganizationQuery,
  CreateEmpOrgQueries,
  getQueriesMasterTypeData,
  downloadMasterType,
  downloadFeedback,
  saveEscalationMatrix,
  loadEscalationMatrix,
  updateEscalationMatrix,
  deleteEscalationMatrix,
};
