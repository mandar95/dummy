import HttpClient from "api/httpClient";

const loadFormConfigs = () => HttpClient('/admin/policyContent');
const loadPolicyConfigs = (id) => HttpClient(`/broker/configure/policy${id ? `?broker_id=${id}` : ''}`);
const loadFamilyLabels = data => HttpClient('/admin/get/family-lable',
    { method: 'POST', data });

const loadRelationMaster = () => HttpClient('/admin/get/master/relation');

const saveTempPolicy = (data, id) => HttpClient(`/broker/create/basicPolicy${id ? `?broker_id=${id}` : ''}`,
    { method: 'POST', data });

const deleteTempPolicy = id => HttpClient(`/broker/delete/temp-policy${id ? `?broker_id=${id}` : ''}`,
    { method: 'DELETE' });

const deletePolicy = id => HttpClient(`/broker/policy/${id}`, { method: 'DELETE' });

const savePolicy = data => HttpClient("/broker/create/policy",
    { method: 'POST', data, dont_encrypt: true });

const validateEmployerPolicyExists = data => HttpClient("/broker/employer/gmc/check", { method: "POST", data });

const loadAllPolicies = (id, userType, pageNo = 1, cancelTokenSource, is_super_hr = 0, employer_id) =>
    HttpClient(`/broker/policies${userType ? `?user_type_name=${userType}` : ''}${id ? `&broker_id=${id}` : ''}&employer_id=${employer_id < 0 ? 0 : employer_id}&page=${pageNo}&is_super_hr=${is_super_hr}`,
        { cancelToken: cancelTokenSource ? cancelTokenSource.token : false });

const updateEnrollmentDate = data => HttpClient('/broker/change/policy/enrollement',
    { method: 'POST', data });

const downloadPolicy = data => HttpClient('/broker/policy/export/data',
    { method: 'POST', data });

const checkTopup = data => HttpClient("/broker/check/eligible/top-up", { method: 'POST', data })

const ipdPolicies = data => HttpClient("/broker/get-all-ipd-policies", { method: 'POST', data })

const downloadSample = data => HttpClient("/admin/get/sample-file", { method: 'POST', data })

const renewType = data => HttpClient('/broker/renew-policy-data-check', { method: 'POST', data })

const loadLeadData = (data) => HttpClient(`/admin/get/enquiry-details`, { method: 'POST', data });
const loadRfq = (data) => HttpClient(`/insurer/get-single-plan`, { method: 'POST', data });

const getSI = (data) => HttpClient(`/admin/get/policy/suminsured/type`, { method: 'POST', data });
const getRater = (data) => HttpClient(`/admin/get/policy/rater/type`, { method: 'POST', data });

const postFeatureData = (data) => HttpClient(`/admin/create/suminsured/feature/mapping`, { method: 'POST', data, dont_encrypt: true });
const getSuminsured = (data) => HttpClient(`/admin/get/policy/suminsured`, { method: 'POST', data });

const getFeatures = (data) => HttpClient(`/admin/get/suminsured/feature/mapping`, { method: 'POST', data });
const deleteFeature = (id) => HttpClient(`/admin/delete/suminsured/feature/mapping/${id}`, { method: 'DELETE' });
const updateFeature = (id, data) => HttpClient(`/admin/update/suminsured/feature/mapping/${id}`, { method: "POST", data, dont_encrypt: true });

const getMasterCommunication = (id) => HttpClient(`/admin/get/master/system-trigger?is_policy_dependent=${id}`);
//const getMasterCommunication = () => HttpClient(`/admin/get/master/policy-system-trigger`);
const createComminicationTriggers = (data) => HttpClient(`/admin/create/policy-to-system-triggers`, { method: 'POST', data });
const getComminicationTriggers = (id) => HttpClient(`/admin/get/policy-to-system-trigger/${id}`);
const deleteComminicationTriggers = (triggerId, policyId) => HttpClient(`/admin/delete/policy-to-system-trigger/${policyId}/${triggerId}`, { method: 'DELETE' });

const createComminicationTriggersEmployer = (data) => HttpClient(`/admin/create/employer-to-system-triggers`, { method: 'POST', data });
const getComminicationTriggersEmployer = (id) => HttpClient(`/admin/get/employer-to-system-trigger?employer_id=${id}`);
const deleteComminicationTriggersEmployer = (id) => HttpClient(`/admin/delete/employer-to-system-trigger?id=${id}`, { method: 'DELETE' });
const fetchSumInsured = (data) => HttpClient("/admin/get/policy/suminsured", {
    method: "POST",
    data
});

const getEmployerUserForContactDetails = (id) => HttpClient(`/broker/get/employer-users/${id}`);
const checkEmployerInstallment = (data) => HttpClient('/broker/check-employer-installment', { method: 'POST', data });
const loadTopPoliciesByBase = (data) => HttpClient('/broker/get/top-up-policy', { method: 'POST', data });


export default {
    loadFormConfigs,
    loadPolicyConfigs,
    loadFamilyLabels,
    loadRelationMaster,
    saveTempPolicy,
    deleteTempPolicy,
    savePolicy,
    validateEmployerPolicyExists,

    loadAllPolicies,
    updateEnrollmentDate,
    downloadPolicy,
    downloadSample,
    checkTopup,
    ipdPolicies,
    deletePolicy,
    renewType,
    loadLeadData,
    loadRfq,
    getSI,
    postFeatureData,
    getFeatures,
    deleteFeature,
    updateFeature,
    getMasterCommunication,
    createComminicationTriggers,
    getComminicationTriggers,
    deleteComminicationTriggers,
    getSuminsured,

    createComminicationTriggersEmployer,
    getComminicationTriggersEmployer,
    deleteComminicationTriggersEmployer,
    getRater,
    fetchSumInsured,
    getEmployerUserForContactDetails,
    checkEmployerInstallment,
    loadTopPoliciesByBase
};
