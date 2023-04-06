import HttpClient from "../../api/httpClient";

export const getEmployDashboard = (inactive) => HttpClient("/employee/get/dashboard" + (inactive ? '?inactive=1' : ''));
export const EmployeeMemberDetails = (data) =>
  HttpClient("/employee/get/member-details", { method: "POST", data }); //data - policy_id = 6;
export const EmployeeImageUpload = (data) =>
  HttpClient("/employee/update/employee-member-details", {
    method: "POST",
    data,
    dont_encrypt: true,
  });
