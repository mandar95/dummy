import httpClient from '../../api/httpClient';

export const employeeFormCenter = (userType, is_super_hr = 0) => httpClient(`/employee/get/employee-documnet-list${userType ? `?user_type_name=${userType}&is_super_hr=${is_super_hr}` : ''}`);

const brokerGetEmployers = (id) => httpClient(`/broker/get/employers?broker_id=${id}`);

const brokerGetDocuments = () => httpClient('/broker/get/documents');

// const brokerGetPolicyType = () => httpClient('/broker/get/policy-type');
const brokerGetPolicyType = () => httpClient('/admin/getSubTypePolicy/1');

const brokerPostPolicyType = (data) => httpClient(`/admin/get/policy/subtype`, { method: "POST", data });

const brokerGetPolicyNumber = () => httpClient('/broker/get/policy-number');

const brokerPostPolicyNumber = (data) => httpClient(`/admin/get/policyno`, { method: "POST", data })

const submitDocument = (data) => httpClient('/admin/add/document-list', { method: "POST", data, dont_encrypt: true });

const getDocument = (id) => httpClient(`/admin/get/employer-document-list${id ? `?broker_id=${id}` : ''}`);

const updateDetails = (id, data) => httpClient(`/broker/update/document/${id}`, { method: "POST", data, dont_encrypt: true });

const deleteDetails = (id) => httpClient(`/broker/delete/document/${id}`, { method: "DELETE" });

const adminGetBroker = (userType) => httpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);
const adminGetEmployer = (id) => httpClient(`/broker/get/employers?broker_id=${id}`);

export default {
    brokerGetEmployers,
    brokerGetDocuments,
    brokerGetPolicyType,
    brokerPostPolicyType,
    brokerGetPolicyNumber,
    brokerPostPolicyNumber,
    submitDocument,
    getDocument,
    updateDetails,
    deleteDetails,
    adminGetBroker,
    adminGetEmployer
}

// HttpClient(`/admin/get/policy/subtype`, { method: "POST", data });
// HttpClient(`/admin/get/policyno`, { method: "POST", data });

