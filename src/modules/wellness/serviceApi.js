import HttpClient from "../../api/httpClient";

const getUrl = (data) => HttpClient('/admin/get/welness/url', { method: "POST", data });

//get brokers (for admin)
const broker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

//get employers 
const employers = (data, pageNo) => HttpClient(`/admin/get/employer?page=${pageNo}&per_page=100`, { method: "POST", data });

//benefit-config
const createBenefit = (data) => HttpClient('/admin/add/new-benefit', { method: "POST", data, dont_encrypt: true });
const getAllBenefit = (data) => HttpClient('/admin/get/all-benefit', { method: 'POST', data });
const editBenefit = (id) => HttpClient(`/admin/edit/benefit/${id}`);
const updateBenefit = (id, data) => HttpClient(`/admin/update/benefit/${id}`, { method: 'POST', data, dont_encrypt: true });
const deleteBenefit = (id) => HttpClient(`/admin/delete/benefit/${id}`, { method: "DELETE" });

//wellness partner config
const createPartner = (data) => HttpClient('/admin/create/wellness-partner', { method: "POST", data, dont_encrypt: true });
const getAllPartner = (data) => HttpClient('/admin/get-all/wellness-partner', { method: 'POST', data });
const editPartner = (id) => HttpClient(`/admin/edit/wellness-partner/${id}`);
const updatePartner = (id, data) => HttpClient(`/admin/update/wellness-partner/${id}`, { method: 'POST', data, dont_encrypt: true });
const deletePartner = (id) => HttpClient(`/admin/delete/wellness-partner/${id}`, { method: "DELETE" });

//benefit wellness partner mapping (BWPM)
const createBWPM = (data) => HttpClient('/admin/create/wellness-partner-benefit', { method: "POST", data });
const getAllBWPM = (data) => HttpClient('/admin/get/all-wellness-partner-benefit', { method: 'POST', data });
const editBWPM = (id) => HttpClient(`/admin/edit/wellness-partner-benefit/${id}`);
const updateBWPM = (id, data) => HttpClient(`/admin/update/wellness-partner-benefit/${id}`, { method: 'POST', data, dont_encrypt: true });
const deleteBWPM = (id) => HttpClient(`/admin/delete/wellness-partner-benefit/${id}`, { method: "DELETE" });
const exportBWPM = (data) => HttpClient(`/admin/get/wellness-partner-benefit-export`, { method: 'POST', data });

//benefit employer mapping
const createEM = (data) => HttpClient('/admin/create/employer-benefit', { method: "POST", data });
const getAllEM = (data) => HttpClient('/admin/get/all-employer-benefit', { method: 'POST', data });
const editEM = (id) => HttpClient(`/admin/edit/employer-benefit/${id}`);
const updateEM = (id, data) => HttpClient(`/admin/update/employer-benefit/${id}`, { method: 'POST', data, dont_encrypt: true });
const deleteEM = (id) => HttpClient(`/admin/delete/employer-benefit/${id}`, { method: "DELETE" });
const exportEM = (data) => HttpClient(`/admin/get/employer-benefit-export`, { method: 'POST', data });

//wellness flex config
const createWF = (data) => HttpClient('/admin/create/wellness-flex', { method: "POST", data });
const getAllWF = (data) => HttpClient('/admin/get/all-wellness-flex', { method: 'POST', data });
const editWF = (id) => HttpClient(`/admin/edit/wellness-flex/${id}`);
const updateWF = (id, data) => HttpClient(`/admin/update/wellness-flex/${id}`, { method: 'POST', data, dont_encrypt: true });
const deleteWF = (id) => HttpClient(`/admin/delete/wellness-flex/${id}`, { method: "DELETE" });
const exportWF = (data) => HttpClient('/admin/get/wellness-flex-export', { method: 'POST', data });

//wellness benefit cms
const createCMS = (data) => HttpClient('/admin/create/wellness-benefit-cms', { method: "POST", data });
const getAllCMS = (data) => HttpClient('/admin/get/all-wellness-benefit-cms', { method: 'POST', data });
const editCMS = (id) => HttpClient(`/admin/edit/wellness-benefit-cms/${id}`);
const updateCMS = (id, data) => HttpClient(`/admin/update/wellness-benefit-cms/${id}`, { method: 'POST', data, dont_encrypt: true });
const deleteCMS = (id) => HttpClient(`/admin/delete/wellness-benefit-cms/${id}`, { method: "DELETE" });

//wellness benefit static content
const getAllStaticContent = (data) => HttpClient('/admin/get/employer/static-content', { method: "POST", data });
const createStaticContent = (data) => HttpClient('/admin/set/employer/static-content', { method: "POST", data });
const deleteStaticContent = (id) => HttpClient(`/admin/delete/broker-icd/${id}`, { method: "DELETE" });
const editStaticContent = (id) => HttpClient(`/admin/edit/broker-icd/${id}`);
const updateStaticContent = (id, data) => HttpClient(`/admin/update/broker-icd/${id}`, { method: 'POST', data, dont_encrypt: true });

//ICD Code Master
const getAllICD = () => HttpClient('/admin/get/all/icd');
const createICD = (data) => HttpClient('/admin/create/broker-icd', { method: "POST", data });
const getAllBrokerICD = (data) => HttpClient('/admin/get/all-broker-icd', { method: "POST", data });
const deleteICD = (id) => HttpClient(`/admin/delete/broker-icd/${id}`, { method: "DELETE" });
const editICD = (id) => HttpClient(`/admin/edit/broker-icd/${id}`);
const updateICD = (id, data) => HttpClient(`/admin/update/broker-icd/${id}`, { method: 'POST', data, dont_encrypt: true });
const exportICD = (data) => HttpClient('/admin/get/icd-export', { method: 'POST', data });

//ICD Admin
const createIA = (data) => HttpClient('/admin/create/master-icd', { method: "POST", data });
const getAllIA = () => HttpClient('/admin/get/all/icd');
const editIA = (id) => HttpClient(`/admin/edit/master-icd/${id}`);
const updateIA = (id, data) => HttpClient(`/admin/update/master-icd/${id}`, { method: 'POST', data, dont_encrypt: true });
const deleteIA = (id) => HttpClient(`/admin/delete/master-icd/${id}`, { method: "DELETE" });

//My-wellness
const getAllEmployeeBenefit = (data) => HttpClient('/admin/get/all-employee-benefit', { method: 'POST', data });
const getICDContent = (data) => HttpClient('/admin/get/icd-content', { method: 'POST', data });

const memberSync = (data) => HttpClient('/admin/heaps/member-sync', { method: 'POST', data });
const memberSyncCNH = () => HttpClient('/admin/cnh/member-sync');
const getVisit = () => HttpClient('/employee/visitor-sso');
const pristynCareApi = () => HttpClient('/admin/connect/pristine-care');
const getMediBuddy = () => HttpClient('/employee/get/medibuddy-redirection-link');
const getLybrate = () => HttpClient('/employee/get/lybrate-redirection-link');
const getMeraDoc = () => HttpClient('/employee/get/meradoc-redirection-link');
const get1MG = () => HttpClient('/admin/1mg/generate-hash');

export default {
    getUrl, broker, employers, createBenefit, getAllBenefit, editBenefit, updateBenefit, deleteBenefit,
    createPartner, getAllPartner, editPartner, updatePartner, deletePartner, createBWPM, getAllBWPM, editBWPM,
    updateBWPM, deleteBWPM, exportBWPM, createEM, getAllEM, editEM, updateEM, deleteEM, exportEM, createWF,
    getAllWF, editWF, updateWF, deleteWF, exportWF, createCMS, getAllCMS, editCMS, updateCMS, deleteCMS,
    getAllICD, createICD, getAllBrokerICD, deleteICD, editICD, updateICD, exportICD,
    getAllEmployeeBenefit, getICDContent,
    createIA, getAllIA, editIA, updateIA, deleteIA,
    getAllStaticContent, createStaticContent, editStaticContent, updateStaticContent, deleteStaticContent,
    memberSync,
    memberSyncCNH,
    getVisit, pristynCareApi, getMediBuddy, getLybrate, getMeraDoc, get1MG
}
