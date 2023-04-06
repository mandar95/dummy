import HttpClient from "../../api/httpClient";

//Customer
const uploadCustomerDocument = (data) => HttpClient('/admin/customer-upload-documents', { method: "POST", data, dont_encrypt: true });
const getAllCustomerDocuments = () => HttpClient('/admin/get/customer-documents');
const deleteCustomerDocument = (id) => HttpClient(`/admin/delete/customer-document/${id}`, { method: "DELETE" });
const editCustomerDocument = (id) => HttpClient(`/admin/edit/customer-document/${id}`);
const updateCustomerDocument = (id, data) => HttpClient(`/admin/update/customer-document/${id}`, { method: 'POST', data, dont_encrypt: true });

//Insurer
const uploadInsurerDocument = (data) => HttpClient('/insurer/insurer-upload-documents', { method: "POST", data, dont_encrypt: true });
const getAllInsurerDocuments = (data) => HttpClient('/insurer/get/insurer-documents', { method: "POST", data });
const deleteInsurerDocument = (id) => HttpClient(`/insurer/delete/insurer-document/${id}`, { method: "DELETE" });
const editInsurerDocument = (id) => HttpClient(`/insurer/edit/insurer-document/${id}`);
const updateInsurerDocument = (id, data) => HttpClient(`/insurer/update/insurer-document/${id}`, { method: 'POST', data, dont_encrypt: true });
const getFileType = () => HttpClient('/insurer/get/document-type-list');
const getPlanType = (data) => HttpClient('/insurer/get/ic-plan-list', { method: "POST", data });

//declaration
const createDeclration = (data) => HttpClient(`/insurer/create/ic-declaration`, { method: 'POST', data });
const getAllDeclration = (data) => HttpClient(`/insurer/get/ic-declaration`, { method: 'POST', data });
const deleteDeclration = (id) => HttpClient(`/insurer/delete/ic-declaration/${id}`, { method: 'DELETE' });
const createMaterDeclaration = (data) => HttpClient(`/insurer/create/excel/ic-declaration`, { method: 'POST', data, dont_encrypt: true });
const updateDeclaration = (data) => HttpClient(`/insurer/update/ic-declaration`, { method: 'POST', data, dont_encrypt: true });

const getAllAdminDeclaration = (data) => HttpClient(`/admin/get/ic-declaration`, { method: 'POST', data });
const updateAdminDeclaration = (data) => HttpClient(`/admin/update/ic-declaration`, { method: 'POST', data, dont_encrypt: true });

const getAllIcList = () => HttpClient('/admin/get/ic-list');
const allBroker = (userType = 'Super Admin') => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

export default {
    uploadCustomerDocument,
    getAllCustomerDocuments,
    deleteCustomerDocument,
    editCustomerDocument,
    updateCustomerDocument,

    uploadInsurerDocument,
    getAllInsurerDocuments,
    deleteInsurerDocument,
    editInsurerDocument,
    updateInsurerDocument,
    getFileType,
    getPlanType,
    createDeclration,
    getAllDeclration,
    deleteDeclration,
    createMaterDeclaration,
    updateDeclaration,
    getAllAdminDeclaration,
    updateAdminDeclaration,
    getAllIcList,
    allBroker,
}
