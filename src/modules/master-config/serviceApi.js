import HttpClient from "../../api/httpClient";

const allMaster = (id) =>
  HttpClient(`/admin/get-all/master`, { method: "GET" });

// Country
const country = (id) =>
  HttpClient(`/admin/get/country/${id}`, { method: "GET" });

//get ----------------------------------------------------

//country
const countries = () =>
  HttpClient("/admin/get-all/countries", { method: "GET" });
// Tpa
const getTpa = () => HttpClient("/admin/master/tpa", { method: "GET" });
//TPA Services
const getTPAData = () => HttpClient('/admin/tpa/service');
// Relation
const getRelation = () =>
  HttpClient("/admin/get/master/relation", { method: "GET" });
// Designation
const getDesignation = () =>
  HttpClient("/admin/get/master/designation", { method: "GET" });
// Construct
const getConstruct = () => HttpClient('/admin/get/master/construct', { method: "GET" });
// Policy Types
const getPolicyTypes = () => HttpClient('/admin/get/master/policy', { method: "GET" });
// Premium
const getPremium = () => HttpClient('/admin/get/master/premium', { method: "GET" });
// Insurer
const getInsurer = () => HttpClient('/admin/get/master/insurer', { method: "GET" });
// Master Query Type
const getMasterQueryType = () => HttpClient('/admin/get/masterQueryType', { method: "GET" });
// Alignment
const getAlignment = () => HttpClient('/admin/get-all/alignment', { method: "GET" });
// Alignment
const getPosition = () => HttpClient('/admin/get-all/position', { method: "GET" });
// SumInsured
const getSumInsured = () => HttpClient('/admin/get/master/suminsured', { method: "GET" });
// SubSumInsured
const getSubSumInsured = () => HttpClient('/admin/get/master/subsuminsured', { method: "GET" });
// Size
const getSize = () => HttpClient('/admin/get-all/size', { method: "GET" });
// Query
const getQuery = () => HttpClient('/admin/get/master/query', { method: "GET" });
// Grade
const getGrade = () => HttpClient('/admin/get-all/grade', { method: "GET" });
// Query Sub Type
const getQuerySubType = () => HttpClient('/admin/get/master/sub-query', { method: "GET" });
// Policy Sub Type
const getPolicySubType = () => HttpClient('/admin/get/master/subpolicy', { method: "GET" });
// Policy Content
const getPolicyContent = () => HttpClient('/admin/policyContent', { method: "GET" });
// Insurer Type
const getInsurerType = () => HttpClient('/employee/get/insurer-type', { method: "GET" });
// Announcement
const getAnnouncement = () => HttpClient('/admin/get/master/announcement', { method: "GET" });
// Announcement Sub Type
const getAnnouncementSubType = () => HttpClient('/admin/get/master/sub-announcement', { method: "GET" });
// dashboard icon
const loadDashboardIcone = () => HttpClient('/admin/get/all/dashboard-icons', { method: "GET" });
// sample format
const loadSampleFormat = () => HttpClient('/admin/get/all/sample-format', { method: "GET" });
// notification
const loadNotificationType = () => HttpClient('/admin/get/action');
//campaign
const loadCampaign = () => HttpClient('/admin/get-all/campaigns');
//-----------------------------------------------------------

//patch ----------------------------------------------------
//country
const updateCountry = (id) =>
  HttpClient(`admin/update/country/${id}`, { method: "PATCH" });
//policy
// const updatePolicy = (data, id) => HttpClient(`/admin/update/master/policy/${id}`, { method: "patch", data });
//--------------------------------------------------------

//delete ----------------------------------------------------
// Alignment
const deleteAlignment = (id) => HttpClient(`/admin/delete/alignment/${id}`, { method: "DELETE" });
// Position
const deletePosition = (id) => HttpClient(`/admin/delete/position/${id}`, { method: "DELETE" });
// SumInsured
const deleteSumInsured = (id) => HttpClient(`/admin/delete/master/suminsured/${id}`, { method: "DELETE" });
// SubSumInsured
const deleteSubSumInsured = (id) => HttpClient(`/admin/delete/master/subsuminsured/${id}`, { method: "DELETE" });
// Size
const deleteSize = (id) => HttpClient(`/admin/delete/size/${id}`, { method: "DELETE" });
// TPA Services
const deleteTPAData = (id) => HttpClient(`/admin/tpa/service/${id}`, { method: "DELETE" });
// Country
const deleteCountry = (id) => HttpClient(`/admin/delete/country/${id}`, { method: "DELETE" });
// Designation
const deleteDesignation = (id) => HttpClient(`/admin/delete/master/designation/${id}`, { method: "DELETE" });
// Query
const deleteQuery = (id) => HttpClient(`/admin/delete/master/query/${id}`, { method: "DELETE" });
// TPA
const deleteTPA = (id) => HttpClient(`/admin/master/tpa/${id}`, { method: "DELETE" });
// Policy
const deletePolicy = (id) => HttpClient(`/admin/delete/master/policy/${id}`, { method: "DELETE" });
// Relation
const deleteRelation = (id) => HttpClient(`/admin/delete/master/relation/${id}`, { method: "DELETE" });
// Construct
const deleteConstruct = (id) => HttpClient(`/admin/delete/master/construct/${id}`, { method: "DELETE" });
// Grade
const deleteGrade = (id) => HttpClient(`/admin/delete/grade/${id}`, { method: "DELETE" });
// Query Sub Type
const deleteQuerySubType = (id) => HttpClient(`/admin/delete/master/sub-query/${id}`, { method: "DELETE" });
// Insurer
const deleteInsurer = (id) => HttpClient(`/admin/delete/master/insurer/${id}`, { method: "DELETE" });
// Policy Sub Type
const deletePolicySubType = (id) => HttpClient(`/admin/delete/master/subpolicy/${id}`, { method: "DELETE" });
// Policy Content
const deletePolicyContent = (id) => HttpClient(`/admin/delete/policyContent/${id}`, { method: "DELETE" });
// Insurer Type
const deleteInsurerType = (id) => HttpClient(`/employee/delete/insurertype/${id}`, { method: "DELETE" });
// Announcement
const deleteAnnouncement = (id) => HttpClient(`/admin/delete/master/announcement/${id}`, { method: "DELETE" });
// Announcement Sub Type
const deleteAnnouncementSubType = (id) => HttpClient(`/admin/delete/master/sub-announcement/${id}`, { method: "DELETE" });
// Premium
const deletePremium = () => HttpClient('/admin/delete/master/premium', { method: "DELETE" });
// dashboard icon
const deleteDashboardIcone = (id) => HttpClient(`/admin/delete/dashboard-icon/${id}`, { method: "DELETE" });
// sample format
const deleteSampleFormat = (id) => HttpClient(`/admin/delete/sample-format/${id}`, { method: "DELETE" });
// notification
const deleteNotificationAction = (id) => HttpClient(`/admin/delete/notification/action/${id}`, { method: "DELETE" });
// campaign
const deleteCampaign = (id) => HttpClient(`/admin/delete/campaign/${id}`, { method: "DELETE" });
//--------------------------------------------------------


//store----------------------------------------------------------------------

const storeCountries = (data) =>
  HttpClient("/admin/store/country", { method: "POST", data, dont_encrypt: true });

const storeDesignation = (data) =>
  HttpClient("/admin/create/excel/designation", { method: "POST", data, dont_encrypt: true });

const storeRelation = (data) =>
  HttpClient("/admin/create/excel/master/relation", { method: "POST", data, dont_encrypt: true });

const storePolicy = (data) =>
  HttpClient("/admin/create/excel/master/policy", { method: "POST", data, dont_encrypt: true });

const storeFamilyConstruct = (data) =>
  HttpClient("/admin/create/excel/family/construct", { method: "POST", data, dont_encrypt: true });

const storeAlignment = (data) =>
  HttpClient("/admin/create/excel/alignment", { method: "POST", data, dont_encrypt: true });

const storePosition = (data) =>
  HttpClient("/admin/create-excel/position", { method: "POST", data, dont_encrypt: true });

const storeSumInsured = (data) =>
  HttpClient("/admin/create/excel/suminsured", { method: "POST", data, dont_encrypt: true });

const storeSubSumInsured = (data) =>
  HttpClient("/admin/create/excel/subsuminsured", { method: "POST", data, dont_encrypt: true });

const storeTPAData = (data) =>
  HttpClient('/admin/create/tpa/service', { method: "POST", data, dont_encrypt: true });

const storeSize = (data) =>
  HttpClient("/admin/create-excel/size", { method: "POST", data, dont_encrypt: true });

const storeQuery = (data) =>
  HttpClient("/admin/create/excel/master-query", { method: "POST", data, dont_encrypt: true });

const storeTpa = (data) =>
  HttpClient("/admin/create/tpa-master", { method: "POST", data, dont_encrypt: true });

const storeSubQuery = (data) =>
  HttpClient("/admin/create/excel/master-sub-query", { method: "POST", data, dont_encrypt: true });

const storeGrade = (data) =>
  HttpClient("/admin/create-excel/grade", { method: "POST", data, dont_encrypt: true });

const storeSubPolicy = (data) =>
  HttpClient("/admin/create-excel/subpolicy", { method: "POST", data, dont_encrypt: true });

const storeAnnouncement = (data) =>
  HttpClient("/admin/create/excel/announcement", { method: "POST", data, dont_encrypt: true });

const storeSubAnnouncement = (data) =>
  HttpClient("/admin/create/excel/sub-announcement", { method: "POST", data, dont_encrypt: true });

const storeInsurerType = (data) =>
  HttpClient("/employee/create/insurer-type", { method: "POST", data, dont_encrypt: true });

const storePolicyContent = (data) =>
  HttpClient("/admin/create/PolicyContent", { method: "POST", data, dont_encrypt: true });

const storeInsurer = (data) =>
  HttpClient("/admin/create/master/insurer", { method: "POST", data, dont_encrypt: true });

const storePremium = (data) =>
  HttpClient("/admin/create-excel/master/premium", { method: "POST", data, dont_encrypt: true });

const sampleFile = (url) => HttpClient(
  `/admin/get/sample-file?sample_type_id=${url}`,
  { method: "POST" }
);
// dashboard icon
const createDashboardIcon = (data) =>
  HttpClient("/admin/create/new-dashboard-icon", { method: "POST", data, dont_encrypt: true });

// create sample format
const createSampleFormat = (data) =>
  HttpClient("/admin/create/sample-format", { method: "POST", data, dont_encrypt: true });

// create sample format
const createNotificationAction = (data) =>
  HttpClient("/admin/create/notification/action", { method: "POST", data });
// Compaign
const createCampaign = (data) =>
  HttpClient("/admin/create/campaign", { method: "POST", data });
//--------------------------------------------------------


/*------------EDIT------------------*/

const editSize = (id, data) => HttpClient(`/admin/update/size/${id}`, { method: "PATCH", data });
const editTPA = (id, data) => HttpClient(`/admin/master/tpa/${id}`, { method: "PATCH", data });
const editPosition = (id, data) => HttpClient(`/admin/update/position/${id}`, { method: "PATCH", data });
const editAlignment = (id, data) => HttpClient(`/admin/update/alignment/${id}`, { method: "PATCH", data });
const editCountry = (id, data) => HttpClient(`/admin/update/country/${id}`, { method: "PATCH", data });
const editService = (id, data) => HttpClient(`/admin/tpa/service/${id}`, { method: "PATCH", data });
const editGrade = (id, data) => HttpClient(`/admin/update/grade/${id}`, { method: "POST", data });
const editInsurer = (id, data) => HttpClient(`/admin/update/master/insurer/${id}`, { method: "POST", data, dont_encrypt: true });
const editPolicyContent = (id, data) => HttpClient(`/admin/update/policyContent/${id}`, { method: "POST", data, dont_encrypt: true });
const editConstruct = (id, data) => HttpClient(`/admin/update/master/construct/${id}`, { method: "PATCH", data });
const editAnnouncement = (id, data) => HttpClient(`/admin/update/master/announcement/${id}`, { method: "PATCH", data });
const editAnnouncementSubType = (id, data) => HttpClient(`/admin/update/master/sub-announcement/${id}`, { method: "PATCH", data });
const editQuery = (id, data) => HttpClient(`/admin/update/master/query/${id}`, { method: "PATCH", data });
const editSubQuery = (id, data) => HttpClient(`/admin/update/master/sub-query/${id}`, { method: "PATCH", data });
const editDesignation = (id, data) => HttpClient(`/admin/update/master/designation/${id}`, { method: "PATCH", data });
const editPolicy = (id, data) => HttpClient(`/admin/update/master/policy/${id}`, { method: "PATCH", data });
const editSubPolicy = (id, data) => HttpClient(`/admin/update/master/subpolicy/${id}`, { method: "PATCH", data });
const editSumInsured = (id, data) => HttpClient(`/admin/update/master/suminsured/${id}`, { method: "PATCH", data });
const editSubSumInsured = (id, data) => HttpClient(`/admin/update/master/subsuminsured/${id}`, { method: "PATCH", data });
const editRelation = (id, data) => HttpClient(`/admin/update/master/relation/${id}`, { method: "PATCH", data });
const editInsurerType = (id, data) => HttpClient(`/employee/update/insurer-type/${id}`, { method: "POST", data, dont_encrypt: true });
const editPremium = (id, data) => HttpClient(`/admin/update/master/premium/${id}`, { method: "PATCH", data });
const editDashboardIcon = (id, data) => HttpClient(`/admin/update/dashboard-icon/${id}`, { method: "POST", data, dont_encrypt: true });
const editSampleFormat = (id, data) => HttpClient(`/admin/update/sample-format/${id}`, { method: "POST", data, dont_encrypt: true });
const editCampaign = (id, data) => HttpClient(`/admin/update/campaign/${id}`, { method: "PATCH", data });
/*----------------------------------*/

export const service = {
  allMaster,
  countries,
  updateCountry,
  country,
  storeCountries,
  getTpa,
  getTPAData,
  getRelation,
  getDesignation,
  getConstruct,
  // updatePolicy,
  getPolicyTypes,
  getPremium,
  getInsurer,
  getMasterQueryType,
  storeDesignation,
  storeRelation,
  storePolicy,
  storeFamilyConstruct,
  storeAlignment,
  getAlignment,
  deleteAlignment,
  storePosition,
  storeSumInsured,
  storeSubSumInsured,
  storeTPAData,
  createCampaign,
  deleteTPAData,
  getPosition,
  deletePosition,
  getSumInsured,
  deleteSumInsured,
  getSubSumInsured,
  deleteSubSumInsured,
  storeSize,
  storeQuery,
  getSize,
  deleteSize,
  storeTpa,
  deleteCountry,
  deleteDesignation,
  getQuery,
  deleteQuery,
  deleteTPA,
  deletePolicy,
  deleteRelation,
  deleteConstruct,
  deleteCampaign,
  getGrade,
  deleteGrade,
  storeSubQuery,
  storeGrade,
  editSize,
  editTPA,
  editPosition,
  editAlignment,
  editCountry,
  editService,
  editGrade,
  editInsurer,
  editPolicyContent,
  editConstruct,
  editAnnouncement,
  editAnnouncementSubType,
  editQuery,
  editSubQuery,
  editDesignation,
  editPolicy,
  editSubPolicy,
  editSumInsured,
  editSubSumInsured,
  editRelation,
  editInsurerType,
  editPremium,
  editCampaign,
  getQuerySubType,
  deleteQuerySubType,
  deleteInsurer,
  getPolicySubType,
  deletePolicySubType,
  storeSubPolicy,
  getPolicyContent,
  deletePolicyContent,
  getInsurerType,
  getAnnouncement,
  getAnnouncementSubType,
  deleteInsurerType,
  deleteAnnouncement,
  deleteAnnouncementSubType,
  storeAnnouncement,
  storeSubAnnouncement,
  storeInsurerType,
  storePolicyContent,
  deletePremium,
  storeInsurer,
  storePremium,
  sampleFile,

  loadDashboardIcone,
  createDashboardIcon,
  editDashboardIcon,
  deleteDashboardIcone,

  loadSampleFormat,
  createSampleFormat,
  deleteSampleFormat,
  editSampleFormat,

  loadNotificationType,
  createNotificationAction,
  deleteNotificationAction,

  loadCampaign,
  // createNotificationAction,
  // deleteNotificationAction
};
