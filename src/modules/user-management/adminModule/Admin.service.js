import httpClient from "api/httpClient";

export const superadmin = (data) => httpClient('/admin/get/user-type/module/mapping', { method: "POST", data });