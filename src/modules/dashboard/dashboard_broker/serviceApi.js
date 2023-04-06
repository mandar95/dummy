import HttpClient from "../../../api/httpClient";

const getEmployer = (id) =>
  HttpClient(`/broker/get/employers?broker_id=${id}`, { method: "GET" });

const getPolicies = (data) =>
  HttpClient("/broker/get/employer/policy", { method: "POST", data });

const getWidgets = () =>
  HttpClient("/broker/dashboard/widgets", { method: "GET" });

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

const widgetsEmployer = (is_super_hr = 0) =>
  HttpClient(`/employer/dashboard/widget?is_super_hr=${is_super_hr}`, { method: "GET" });

const coverData = (url, is_super_hr = 0) =>
  HttpClient(`/employer/get/policy/cover/details?policy_type_id=${url}&is_super_hr=${is_super_hr}`, {
    method: "GET"
  });
//------------------------------------------------------------------

export {
  policyGraph, endorsementGraph, memberEnrollGraph, endorsementPolicyWise,
  memberWiseClaim, policyWiseClaim, getEmployer, getPolicies, getWidgets,
  claimTable, widgetsEmployer, coverData
};
