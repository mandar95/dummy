import httpClient from "../../../api/httpClient";

export const loadCashlessLogs = ({ page = 1, per_page = 200, globalFilterState }, cancelTokenSource) =>
  httpClient(`/admin/sync-cashless-api-logs?page=${page}&per_page=${per_page}${globalFilterState ? `&filter_value=${globalFilterState}` : ''}`, {
    method: "GET",
    cancelToken: cancelTokenSource ? cancelTokenSource.token : false
  });
