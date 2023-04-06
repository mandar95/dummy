import httpClient from "../../../api/httpClient";

const bankName = () =>
  httpClient("/employee/get/bank/name", { method: "get" });
const bankDetail = () =>
  httpClient("/employee/get/employee/bank-details", { method: "GET" });
const storeBankDetails = (data) =>
  httpClient("/employee/store/bank/details", { method: "post", data, dont_encrypt: true });
//AddBankDetails
const bankCity = (data) =>
  httpClient("/employee/get/bank-city", { method: "post", data });
const bankBranch = (data) =>
  httpClient("/employee/get/bank-branch", { method: "post", data });
const cityIfscByBranch = (data) =>
  httpClient("/employee/get/bank-ifsc-city", { method: "post", data });

export {
  bankName, bankDetail, storeBankDetails, bankCity,
  bankBranch, cityIfscByBranch
};
