import HttpClient from "api/httpClient";

// ===> get Api Type
export const getApiTypeData = (data) =>
  HttpClient("/admin/get-tpa-methods", { method: "POST", data });

export const submitTpaTrigger = (data) =>
  HttpClient("/admin/run-tpa-cron", { method: "POST", data });

export const getTpa = () => HttpClient("/admin/master/tpa");

export const getTpaJobData = () => HttpClient("/admin/get/tpa-job-data");
