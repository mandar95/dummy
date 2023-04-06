import HttpClient from "../../api/httpClient";

const getEmployerNameData = (data, pageNo = 1) =>
  HttpClient(`/admin/get/employer?page=${pageNo}&per_page=100`, { method: "POST", data });

const getPolicySubtype = (data) =>
  HttpClient("/admin/get/policy/subtype", { method: "POST", data });

const getpolicy = (data) =>
  HttpClient("/admin/get/policyno", { method: "POST", data });

const getUncheckPolicy = (data) => HttpClient('/broker/get/policy/type/numbers', { method: 'POST', data })

const getState = (data) =>
  HttpClient("/admin/get/networkhospital/state", { method: "POST", data });

const getCity = (data) =>
  HttpClient("/admin/get/networkhospital/city", { method: "POST", data });

const getHospital = (data) =>
  HttpClient("/admin/get/networkhospital/details", { method: "POST", data });

const getContact = (data) =>
  HttpClient("/admin/network/hospital/communicate", { method: "POST", data });

const getByName = (data) =>
  HttpClient("/admin/get/networkhospital/name", { method: "POST", data });

const getByPinCode = (data) =>
  HttpClient("/admin/get/statcity/pincode", { method: "POST", data });

const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

const getLocation = (data) =>
  HttpClient(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1&q=${data}`, { method: "GET", data }, true);

const PostNetworkHospitalTPA = (data) => HttpClient("/admin/create/excel/networkhospital", { method: "POST", data, dont_encrypt: true });

const GetErrorSheetData = (data) => HttpClient("/admin/get/networkhospitals/error-sheet", { method: "GET", data });
const NetworkHospitalDownload = (data) => HttpClient("/admin/network-hospital/report-export", { method: "POST", data });

export {
  getEmployerNameData, getPolicySubtype, getState,
  getCity, getHospital, getContact, getByName,
  getByPinCode, adminGetBroker, getpolicy,
  getLocation, PostNetworkHospitalTPA,
  GetErrorSheetData, getUncheckPolicy,NetworkHospitalDownload
};
