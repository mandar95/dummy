import HttpClient from "../../../api/httpClient";

// const getEmployer = () =>
//   HttpClient("/broker/get/employers", { method: "GET" });

const getPolicies = (data) =>
  HttpClient("/broker/get/employer/policy", { method: "POST", data });

const getWidgets = () =>
  HttpClient("/admin/super-admin/widgets", { method: "GET" });

const policyGraph = (data) =>
  HttpClient("/broker/dashboard/policy/wise/enrollement", {
    method: "POST",
    data,
  });

const endorsementGraph = (data) =>
  HttpClient("/broker/dashboard/endrosement/member/wise", {
    method: "POST",
    data,
  });

const memberEnrollGraph = (data) =>
  HttpClient("/broker/dashboard/member/wise/enrollement", {
    method: "POST",
    data,
  });

const endorsementPolicyWise = (data) =>
  HttpClient("/broker/dashboard/endrosement/policy/wise", {
    method: "POST",
    data,
  });

const memberWiseClaim = (data) =>
  HttpClient("/broker/dashboard/member/wise/claim", {
    method: "POST",
    data,
  });

const policyWiseClaim = (data) =>
  HttpClient("/broker/dashboard/policy/wise/claim", {
    method: "POST",
    data,
  });

//employer only-----------------------------------------------------
const claimTable = (is_super_hr = 0) =>
  HttpClient(`/employer/get/claims/details?is_super_hr=${is_super_hr}`, {
    method: "GET"
  });


const coverData = (url, is_super_hr = 0) =>
  HttpClient(`/employer/get/policy/cover/details?policy_type_id=${url}&is_super_hr=${is_super_hr}`, {
    method: "GET"
  });
//------------------------------------------------------------------

//admin only --------------------------------------------------------------
const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

const summary = () => HttpClient(`/admin/super-admin/client-plans-summary?type=table`);

const summarySubscription = () => HttpClient(`/admin/super-admin/subscription-summary`);

const policyPlanSummary = () => HttpClient(`/admin/super-admin/plan-policy-summary`);

const claimSummary = () => HttpClient(`/admin/super-admin/claim-summary`);
//--------------------------------------------------------------------

export {
  policyGraph, endorsementGraph, memberEnrollGraph, endorsementPolicyWise,
  memberWiseClaim, policyWiseClaim, getPolicies, getWidgets,
  claimTable, coverData, adminGetBroker, summary, summarySubscription,
  policyPlanSummary, claimSummary
};
