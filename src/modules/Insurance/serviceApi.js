import HttpClient from "../../api/httpClient";

const getInsuranceLink = (data) => HttpClient('/insurer/get/customer-buy-insurance', { method: "POST", data });

const getInsurance = (data) => HttpClient('/insurer/get/ic-insurance-policy', { method: "POST", data });

const createInsurance = (data) => HttpClient('/insurer/create/ic-insurance-policy', { method: "POST", data, dont_encrypt: true });

const deleteInsurance = (data) => HttpClient(`/insurer/delete/ic-insurance-policy/${data}`, { method: "DELETE" });

const editInsurance = (data) => HttpClient(`/insurer/edit/ic-insurance-policy/${data}`, { method: "GET" });

const updateInsurance = (id, data) => HttpClient(`/insurer/update/ic-insurance-policy/${id}`, { method: "POST", data, dont_encrypt: true });

export default { getInsuranceLink, createInsurance, deleteInsurance, getInsurance, editInsurance, updateInsurance };
