import HttpClient from 'api/httpClient';

const loadCompanyData = (data) => HttpClient(`/admin/get/enquiry-details`, { method: 'POST', data });
const saveCompanyData = (data) => HttpClient('/admin/create/rfq-leads', { method: 'POST', data, dont_encrypt: true });
const getIndustry = () => HttpClient('/admin/get/rfq-config-data', { method: "GET" });
const statecity = (data) => HttpClient('/employee/get/state-city', { method: "POST", data });

//uw-quote-view
const uw = (data) => HttpClient('/admin/get/uw/view', { method: "POST", data });
const uwSingle = (data) => HttpClient(`/admin/edit/uw-lead`, { method: "POST", data });

const loadPlans = (data) => HttpClient('/insurer/get-plans', { method: 'POST', data });


const getTopUP = (data) => HttpClient('/admin/get-rfq-products', { method: "POST", data });

//customize plan 
const customizeplan = (data) => HttpClient('/admin/get/select-plan-details', { method: "POST", data });
const singleplan = (data) => HttpClient('/admin/get/selected-plan-detail', { method: "POST", data });
const uploadSheet = (data) => HttpClient('/admin/lead-upload-data', { method: "POST", data, dont_encrypt: true });
const plansave = (data) => HttpClient('/admin/select-plan', { method: "POST", data });
const employeeSheetData = (data) => HttpClient('/admin/get/employee-data', { method: "POST", data });
const finalsave = (data) => HttpClient(`/admin/save-customzied-plan`, { method: 'POST', data });

const generateOTP = (data) => HttpClient('/admin/send-otp', { method: 'POST', data });
const generateOTP2 = (data) => HttpClient('/broker/mobicomm-send-otp', { method: 'POST', data });
const verfiyOTP = (data) => HttpClient('/admin/verify-otp', { method: 'POST', data });
const verfiyOTP2 = (data) => HttpClient('/broker/mobicomm-send-otp', { method: 'POST', data });
const resendOTP = (data) => HttpClient('/admin/resend-otp', { method: 'POST', data });

const getMembers = (data) => HttpClient('/admin/get/full-employee-data', { method: 'POST', data })
const addMember = (data) => HttpClient('/admin/create/employee-data', { method: 'POST', data });
const updateMember = (data, id) => HttpClient(`/admin/update/employee-data/${id}`, { method: 'PATCH', data });
const removeMember = (id) => HttpClient(`/admin/delete/employee-data/${id}`, { method: 'DELETE' });

//bucket config
const getIndustries = (data) => HttpClient('/insurer/get/unique-risk-bucket-industry', { method: "POST", data });
const createBucket = (data) => HttpClient('/insurer/create/risk-bucket-industry', { method: 'POST', data });
const getBucket = (data) => HttpClient('/insurer/get-all/risk-bucket-industry', { method: "POST", data });
const editBucket = (data) => HttpClient(`/insurer/edit/risk-bucket-industry/${data}`);
const updateBucket = (id, data) => HttpClient(`/insurer/update/risk-bucket-industry/${id}`, { method: "PATCH", data });
const deleteBucket = (data) => HttpClient(`/insurer/delete/risk-bucket-industry/${data}`, { method: "DELETE" });
//delete from previous buckets
const replace = (data) => HttpClient(`/insurer/delete/industry`, { method: "POST", data });


//reports
const reports = (data) => HttpClient('/insurer/get/insurance-customer-report', { method: "POST", data });
const allIns = (data) => HttpClient('/insurer/all-insurers', { method: 'GET' });
const allBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

const getConfigData = (data) => HttpClient('/admin/get/rfq-configured-data', { method: "POST", data });
//customize-plan
const quotes = (data) => HttpClient('/admin/get-all-quotes', { method: "POST", data });
const PostQuote = (data) => HttpClient('/admin/save-selected-plan-detail', { method: "POST", data });

//upload claim data
const uploadClaimSheet = (data) => HttpClient('/admin/upload/previous-policy/claim-data', { method: "POST", data, dont_encrypt: true });

//get quote slip
const getQuoteSlip = (data) => HttpClient('/insurer/get/quote-slip', { method: "POST", data });

//callback
const createCallback = (data) => HttpClient('/insurer/create/callback', { method: "POST", data });

//invite member
const inviteMember = (data) => HttpClient('/insurer/create/invite/member', { method: "POST", data });

const getRFQDataCount = (data) => HttpClient(`/admin/get/rfq-lead/data-count/${data}`);

const sendQuoteSlipData = (data) => HttpClient('/admin/create/quote-slip-data', { method: "POST", data });
const getAllQuoteSlipData = (data) => HttpClient('/admin/all-quote-slip-data', { method: "POST", data });
const deleteQuoteFeature = (data) => HttpClient(`/admin/delete/quote-slip-feature`, { method: "POST", data });
const updateQuoteSlipData = (data) => HttpClient('/admin/update/quote-slip-data', { method: "POST", data });
const downloadQuotedata = (data) => HttpClient('/admin/download-quote-slip-data', { method: "POST", data });
const sendQuoteEmail = (data) => HttpClient('/admin/send-quote-slip-email', { method: "POST", data })
const isVerifiedSource = (data) => HttpClient('/admin/validate/campaign-code', { method: 'POST', data });

const sendRFQLeadQuote = (data) => HttpClient('/admin/send/rfq-leads/quote', { method: 'POST', data, dont_encrypt: true })

export default {
  saveCompanyData,
  getIndustry,
  statecity,
  loadCompanyData,
  uw,
  uwSingle,
  getTopUP,
  customizeplan,
  generateOTP,
  generateOTP2,
  verfiyOTP,
  verfiyOTP2,
  resendOTP,
  uploadSheet,
  employeeSheetData,
  singleplan,
  plansave,
  getMembers,
  addMember,
  updateMember,
  removeMember,
  finalsave,
  createBucket,
  getBucket,
  editBucket,
  updateBucket,
  deleteBucket,
  getIndustries,
  loadPlans,
  reports,
  replace,
  allIns,
  allBroker,
  getConfigData,
  quotes,
  PostQuote,
  uploadClaimSheet,
  getQuoteSlip,
  createCallback,
  inviteMember,
  getRFQDataCount,

  sendQuoteSlipData,
  getAllQuoteSlipData,
  deleteQuoteFeature,
  updateQuoteSlipData,
  downloadQuotedata,
  sendQuoteEmail,
  isVerifiedSource,
  sendRFQLeadQuote
}
