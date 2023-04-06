import httpClient from "api/httpClient";

const getTpaLog = ({ page, per_page }) => httpClient(`/admin/get-all/tpa-log?page=${page}&per_page=${per_page}`);

const loadTpaMethods = (data) => httpClient('/admin/get-method/tpa-log', { method: 'POST', data });

const loadTpaLogs = ({ data, page = 1, per_page = 5 }) => httpClient(`/admin/get-all/tpa-log-method?page=${page}&per_page=${per_page}`, { method: 'POST', data });

export default {
  getTpaLog,
  loadTpaMethods,
  loadTpaLogs
};
