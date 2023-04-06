import HttpClient from "../../../api/httpClient";

const widgets = () => HttpClient("/admin/get/customer-widget", { method: "GET" });
const searches = () => HttpClient("/admin/get/customer-policy-searches", { method: "GET" });
const bought = () => HttpClient("/admin/get/customer-bought-policies", { method: "GET" });
const quotesSearches = () => HttpClient("/admin/get/customer-policy-searches", { method: "GET" });
const loadPaymentHistory = () => HttpClient("/admin/get/payment-history", { method: "GET" });
const deficiency = (id, data) => HttpClient(`/admin/update/rfq-deficiency/${id}`, { method: "POST", data, dont_encrypt: true });
const StatusWise = (data) => HttpClient("/admin/dashboard/status-wise-report", { method: "POST", data });
const getPlanList = () => HttpClient("/admin/dashboard/plan-list");
const MemberWise = (data) => HttpClient("/admin/dashboard/plan-wise-report", { method: "POST", data });

export default {
    widgets, searches, bought, quotesSearches,
    loadPaymentHistory, deficiency, StatusWise, getPlanList, MemberWise
}
