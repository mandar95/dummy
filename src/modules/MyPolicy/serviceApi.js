import HttpClient from "../../api/httpClient";

const getpolicyData = () => HttpClient("/employee/policies", { method: "GET" });

const getMasterpolicy = () =>
  HttpClient("/employee/get/insurer-type", { method: "GET" });

const addMyPolicy = (data) =>
  HttpClient("/employee/add/mypolicy", { method: "POST", data, dont_encrypt: true });

const getPolicies = () =>
  HttpClient("/employee/get/mypolicy", { method: "GET" });

const getRenewal = () =>
  HttpClient("/employee/renewal/mypolicy", { method: "GET" });

const getInsuranceLink = () =>
  HttpClient("/employee/get/buy-insurance", { method: "GET" });



export { getpolicyData, getMasterpolicy, addMyPolicy, getPolicies, getRenewal, getInsuranceLink };
