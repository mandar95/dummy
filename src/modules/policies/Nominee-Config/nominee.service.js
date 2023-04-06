import httpClient from "api/httpClient";
const getNomineeConfig = (p) =>
  httpClient(
    `/broker/get/nominee-config?configurable_type=${p.configurable_type}&configurable_id=${p.configurable_id}`,
    {
      method: "POST",
    }
  );
const getRelations = (p) =>
  httpClient("/admin/get/master/relation", {
    method: "GET",
  });
const postNomineeConfig = (p) =>
  httpClient("/broker/submit/nominee-config", {
    method: "POST",
    data: p,
  });
export default {
    getNomineeConfig,
    getRelations,
    postNomineeConfig
}
