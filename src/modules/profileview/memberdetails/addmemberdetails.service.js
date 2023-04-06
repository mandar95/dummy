import httpClient from "../../../api/httpClient";

export const getRelations = () => httpClient("/employee/get/relation");
export const addMemberDetails = (data) =>
  httpClient("/employee/add/family-member", { method: "post", data });
