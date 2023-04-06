import httpClient from '../../../api/httpClient';

//get Policy Type
const policySubType = () => Promise.all([httpClient('/admin/getSubTypePolicy/1'), httpClient('/admin/getSubTypePolicy/2')]);

//get all FAQs
// export const employeeHelp = () => httpClient(`/employee/get/faqs`);

//get FAQs by policy type
const getFAQByPolicy = (policyId) => httpClient(`/employee/get/faqs?policy_sub_type_id=${policyId}`);

// const loadSubPolicy = (employee_id, employer_id) => httpClient(`/admin/get/master/subpolicy?${employee_id ? 'employee_id=' + employee_id : 'employer_id=' + employer_id}`);
const loadSubPolicy = () => httpClient('/employee/get/dashboard');

//get query type
const getQueryType = () => httpClient('/admin/get/masterQueryType');

//get query sub-type
const getQuerySubType = (data) => httpClient('/admin/get/subQueryType', { method: 'POST', data })

//create Queries & Complaints
const createQueries = (data) => httpClient('/employee/create/queries', { method: "POST", data, dont_encrypt: true })

//submit feedback
const submitFeedback = (data) => httpClient('/employee/add/feedbcak', { method: "POST", data });

//gather queries 
const getQueries = () => httpClient('/employee/get/queries');

export default {
    policySubType,
    getFAQByPolicy,
    getQueryType,
    getQuerySubType,
    createQueries,
    submitFeedback,
    getQueries,
    loadSubPolicy
}
