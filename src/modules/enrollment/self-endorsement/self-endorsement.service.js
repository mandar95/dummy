import HttpClient from "api/httpClient";

const loadPolicyDetail = (data) => HttpClient('/admin/self/enrollment/data', { method: "POST", data });

const submitEndorsement = (data) => HttpClient('/admin/self/enrollment', { method: "POST", data });

export default {
  loadPolicyDetail,
  submitEndorsement
};
