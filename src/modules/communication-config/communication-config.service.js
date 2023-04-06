import HttpClient from 'api/httpClient';

// Filters
const loadHtmlTags = () => HttpClient('/admin/get/html/tags');
const loadUser = (type = 'Broker', userType, pageNo = 1) => HttpClient(`/admin/users?type=${type}&page=${pageNo}&status=1${userType ? `&user_type_name=${userType}` : ''}`);
// const loadEmailTemplate = (userType) => HttpClient(`/admin/get/email-template${userType ? `?user_type_name=${userType}` : ''}`);
// const loadSmsTemplate = (userType) => HttpClient(`/admin/get/sms-template${userType ? `?user_type_name=${userType}` : ''}`);
const loadEmailTemplate = (data) => HttpClient(`/admin/get/email-template`, { method: "POST", data });
const loadSmsTemplate = (data) => HttpClient(`/admin/get/sms-template`, { method: "POST", data });
const loadDynamic = () => HttpClient(`/admin/get/dynamic-values`);
const loadPolicyNumber = () => HttpClient('/admin/get/all-policies');
const loadTemplates = (userType) => HttpClient(`/admin/get/communication/view${userType ? `?user_type_name=${userType}` : ''}`);
const loadSMSTemplates = (userType) => HttpClient(`/admin/get/sms/communication/view${userType ? `?user_type_name=${userType}` : ''}`);



const createEmailTemplate = (data) => HttpClient('/admin/store/email-template', { method: "POST", data, dont_encrypt: true });
const createCommunication = (data) => HttpClient('/admin/create/communication', { method: "POST", data });
const createSmsTemplate = (data) => HttpClient('/admin/store/sms-template', { method: "POST", data })

const getTemplateView = (data) => HttpClient('/admin/get/communication/static/view', { method: "POST", data })
const deleteEmailCommunication = (id) => HttpClient(`/admin/delete/email-template/${id}`, { method: 'DELETE' })
const deleteSmsCommunication = (id) => HttpClient(`/admin/delete/sms-template/${id}`, { method: 'DELETE' })

const loadEMP = (data) => HttpClient(`/admin/get/employee-of-employers`, { method: "POST", data })

export default {
  loadHtmlTags,
  createEmailTemplate,
  loadUser,
  loadEmailTemplate,
  loadDynamic,
  createCommunication,
  loadPolicyNumber,
  createSmsTemplate,
  loadSmsTemplate,
  loadTemplates,
  loadSMSTemplates,
  getTemplateView,
  deleteEmailCommunication,
  deleteSmsCommunication,
  loadEMP
};
