import HttpClient from "../../../api/httpClient";

const widgets = () => HttpClient("/insurer/get/insurer-widgest", { method: "GET" });

const policywise = (data) => HttpClient("/insurer/dashboard/plan-wise-report", { method: "POST", data });

const statuswise = (data) => HttpClient("/insurer/dashboard/status-wise-report", { method: "POST", data });

const premiumwise = (data) => HttpClient("/insurer/dashboard/status-wise-report", { method: "POST", data });

const activitywise = (data) => HttpClient("/insurer/dashboard/activity-wise-report", { method: "POST", data });

const GetVisitedCustomer = (data) => HttpClient("/insurer/dashboard/new-visitors-report", { method: "POST", data });

const documentWise = (data) => HttpClient("/insurer/operation/dashboard/plan-wise-report", { method: "POST", data });

export default {
    widgets, policywise, statuswise, premiumwise, activitywise, GetVisitedCustomer, documentWise
}