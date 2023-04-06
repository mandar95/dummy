import httpClient from "api/httpClient";

const getWellNessLog = ({ page, per_page }) => httpClient(`/admin/get-all/wellness-log?page=${page}&per_page=${per_page}`);

export default {
  getWellNessLog
};
