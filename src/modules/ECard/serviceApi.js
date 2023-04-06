import HttpClient from "../../api/httpClient";

const getEmployerNameData = (data, pageNo = 1, perPage = 100) =>
  HttpClient(`/admin/get/employer?page=${pageNo}&per_page=${perPage}`, { method: "POST", data });

const getPolicySubtype = (data) =>
  HttpClient("/admin/get/policy/gmc", { method: "POST", data });

const getEmployPolicies = () => HttpClient("/employee/get/dashboard");

const getEmployee = (data) =>
  HttpClient("/admin/get/employee/bysubtype", { method: "POST", data });

const getMembers = (data) =>
  HttpClient("/admin/get/emp_member", { method: "POST", data });

const getCard = (data) =>
  HttpClient("/admin/get/healthEcard", { method: "POST", data });

const adminGetBroker = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

const PostECardDataTPA = (data) => HttpClient(`/admin/upload/e-card`, { method: "POST", data, dont_encrypt: true });

export { getPolicySubtype, getEmployerNameData, getEmployee, getMembers, getCard, adminGetBroker, PostECardDataTPA, getEmployPolicies };
