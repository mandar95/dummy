import HttpClient from 'api/httpClient';

// RFQ Configuration
const loadRfqConfig = () => HttpClient('/admin/get/rfq-config-data');
const saveTempConfig = (data) => HttpClient('/admin/create/general-rfq-temp-config', { method: 'POST', data });
const removeTempConfig = (data) => HttpClient('/admin/delete/temp-rfq-config', { method: 'POST', data });
const getTempConfig = () => HttpClient('/admin/get/temp-general-rfq-config');
const saveConfig = (data) => HttpClient('/insurer/create-plan', { method: 'POST', data, dont_encrypt: true });
const loadBuckets = (data) => HttpClient('/insurer/get-all/risk-bucket-industry', { method: 'POST', data });

// RFQ Approve
const loadRfq = (data) => HttpClient(`/insurer/get-single-plan`, { method: 'POST', data })
const updateRfq = (data) => HttpClient(`/insurer/update/maker-checker`, { method: 'POST', data, dont_encrypt: true })

// Defiency
const addDeficiency = (data) => HttpClient('/admin/create/rfq/deficiency', { method: 'POST', data, dont_encrypt: true })
const updateDeficiency = (data, id) => HttpClient(`/admin/update/rfq/deficiency/${id}`, { method: 'POST', data, dont_encrypt: true })

// Approve Customer
const approveCustomer = (data, id) => HttpClient(`/admin/update/rfq-leads/${id}`, { method: 'PATCH', data })

//work-flow
const roles = (data) => HttpClient('/insurer/get/ic-role', { method: 'POST', data });
const createFlow = (data) => HttpClient('/insurer/create/work-flow-access', { method: 'POST', data, dont_encrypt: true });
const allIns = (data) => HttpClient('/insurer/all-insurers', { method: 'GET' });
const allBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

//work-flow-list-view
const workFlowList = (data) => HttpClient('/insurer/get/work-flow-list', { method: 'POST', data, dont_encrypt: true });
const UpdateFlow = (id, data) => HttpClient(`/insurer/update/work-flow-access/${id}`, { method: 'POST', data, dont_encrypt: true });
const deleteFlow = (id) => HttpClient(`/insurer/delete/work-flow-access/${id}`, { method: 'DELETE' });

//User List View
const userList = (data) => HttpClient('/insurer/get/lead/list-view', { method: 'POST', data })
const UpdateList = (data) => HttpClient('/insurer/update/lead/work-flow', { method: 'POST', data })

// Prduct
const loadFeatureType = () => HttpClient('/insurer/all-product-feature-types')
const loadFeatures = () => HttpClient('/insurer/all-feature-list')
const loadFeature = (id) => HttpClient(`/insurer/single-product/${id}/detail`)
const saveFeature = (data) => HttpClient('/insurer/create-product-feature', { method: 'POST', data })
const updateFeature = (data) => HttpClient('/insurer/update-product-feature', { method: 'POST', data })
const removeFeature = (id) => HttpClient(`/insurer/delete-product-feature/${id}`, { method: 'DELETE' })

//PG
const paymentRFQ = (data) => HttpClient('/admin/create-payment/order/rfq', { method: 'POST', data })

//RFQAssignment
const createRFQAssignment = (data) => HttpClient('/admin/create/rfq-lead/assignment', { method: 'POST', data })

//Load RFQAssignment
const loadRFQleadAssigne = (id) => HttpClient(`/admin/get/rfq-lead/assignment/${id}`)

//update UWQuote
const updateUWQuote = (data) => HttpClient('/admin/update/customer-policy-search', { method: 'POST', data, dont_encrypt: true })

//update ICQuote
const updateICQuote = (data) => HttpClient('/insurer/update/rfq-lead', { method: 'POST', data, dont_encrypt: true })

// /admin/update/rfq/deficiency/${: id}
export default {
  loadRfqConfig,
  saveTempConfig,
  removeTempConfig,
  getTempConfig,
  saveConfig,
  loadBuckets,

  loadRfq,
  updateRfq,

  addDeficiency,
  updateDeficiency,

  approveCustomer,

  roles,
  createFlow,
  allIns,
  allBroker,

  workFlowList,
  UpdateFlow,
  deleteFlow,

  userList,
  UpdateList,

  loadFeatureType,
  loadFeatures,
  loadFeature,
  saveFeature,
  updateFeature,
  removeFeature,

  paymentRFQ,
  createRFQAssignment,
  loadRFQleadAssigne,
  updateUWQuote,
  updateICQuote
};
