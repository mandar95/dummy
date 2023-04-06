import HttpClient from 'api/httpClient';

// User Type DataTable
const getUserData = ({ status = 1, type = "users", currentUser, pageNo = 1, per_page = 200, cancelTokenSource, is_super_hr = 0, employer_id }) =>
  HttpClient(`/admin/users?type=${type}&status=${status}${employer_id ? `&employer_id=${employer_id < 0 ? 0 : employer_id}` : ``}${currentUser ? `&user_type_name=${currentUser}&page=${pageNo}&per_page=${per_page}&is_super_hr=${is_super_hr}` : ''}`,
    { cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getUserCount = ({ type = "users", currentUser, employer_id }) =>
  HttpClient(`/admin/users/count?type=${type}${employer_id ? `&employer_id=${employer_id < 0 ? 0 : employer_id}` : ``}${currentUser ? `&user_type_name=${currentUser}` : ''}`);
const deleteUser = (id) => HttpClient(`/admin/user/${id}`, { method: "DELETE" });
const getInsurers = () => HttpClient('/insurer/all-insurers');
const getInsurerUsers = (id) => HttpClient(`/insurer/ic-users/${id}`);
const insurerGetBrokers = (data) => HttpClient('/insurer/ic-brokers', { method: "POST", data });
const getTPA = (data) => HttpClient('/insurer/ic-tpas', { method: "POST", data });
const loadTotalLive = (data, pageNo) => HttpClient(`/admin/user-employee-total-lives?page=${pageNo}&per_page=250`, { method: "POST", data });

const getUserDataPagination = ({ data: { status = 1, type = "users", currentUser }, page = 1, per_page = 200 }) =>
  HttpClient(`/admin/users?type=${type}&status=${status}${currentUser ? `&user_type_name=${currentUser}&page=${page}&per_page=${per_page}` : ''}`);
const loadGenericUser = ({ data, page = 1, per_page = 200, filters, globalFilterState }, cancelTokenSource) =>
  HttpClient('/admin/generic-users', {
    method: "POST",
    data: { ...data, page, per_page, ...filters, ...globalFilterState && { filter_value: globalFilterState } },
    cancelToken: cancelTokenSource ? cancelTokenSource.token : false
  });

// Module
const postCreateModule = (data) => HttpClient(`/admin/create/module`, { method: "POST", data });
const getAllModules = (flag = 0, currentUser) =>
  HttpClient(`/admin/modules?onboard=${flag}${currentUser ? `&user_type_name=${currentUser}` : ''}`);
const getOneModule = (id) => HttpClient(`/admin/module/edit/${id}`);
const updateModule = (data, id) => HttpClient(`/admin/update/module/${id}`, { method: "PATCH", data });
const deleteModule = (id) => HttpClient(`/admin/module/${id}`, { method: "DELETE" });

// Role
const postCreateRole = (data, id, user = "broker") => HttpClient(`/${user}/create/${id}/role`, { method: "POST", data });
const postCreateRoleForEmployee = (data) => HttpClient(`/admin/employer/employee/module/mapping`, { method: "POST", data });
const getOneRole = (id, user = "broker", currentUser) =>
  HttpClient(`/${user}/role/edit/${id}${currentUser ? `?user_type_name=${currentUser}` : ''}`);
const updateRole = (data, id, user = "broker") => HttpClient(`/${user}/update/role/${id}`, { method: "PATCH", data });
const getRoles = (id, user = "broker") => HttpClient(`/${user}/${id}/roles`);
const getRolesEmployee = (data) => HttpClient(`/admin/get/employer/employee/module/mapping`, { method: "POST", data });
const deleteRole = (id, user) => HttpClient(`/${user}/role/${id}`, { method: "DELETE" });

// OnBoard
// const onboardBroker = (data) => HttpClient(`/admin/onboard/broker`, { method: "POST", data });
// const onboardEmployer = (data, id) => HttpClient(`/broker/${id}/onboard/employer`, { method: "POST", data });
const onboardBroker = (data) => HttpClient(`/admin/onboard/saas/client-broker`, { method: "POST", data, dont_encrypt: true });
const onboardEmployer = (data) => HttpClient(`/admin/onboard/saas/client-employer`, { method: "POST", data, dont_encrypt: true });
const onboardInsurer = (data) => HttpClient(`/insurer/create/insurance-company`, { method: "POST", data, dont_encrypt: true });
const onboardTpa = (data) => HttpClient('/insurer/onboard-tpa', { method: "POST", data });
const getPlans = () => HttpClient('/admin/plans');

// get lead data
const loadLeadData = (data) => HttpClient(`/admin/get/enquiry-details`, { method: 'POST', data });

// State/City/Pincode
const getStates = () => HttpClient(`/admin/get/state`);
const getCities = (data) => HttpClient(`/admin/get/city`, { method: "POST", data });

// Create Users
const postUserAdmin = (data) => HttpClient(`/admin/register`, { method: "POST", data });
const postUser = (data, id, user = "admin") => HttpClient(`/${user}/create/user/${id}`, { method: "POST", data });

// View Users
const getUserInfo = (user = "broker", id) => HttpClient(`/admin/${user}/${id}`);
const getEmployee = (id) => HttpClient('/admin/user', { method: "POST", data: { user_id: id, master_user_type_id: 5 } });
const getInsurer = (id) => HttpClient(`/insurer/show/insurer-data/${id}`);


// Update Organizaion
const updateUser = (data, id, user = "broker", post) =>
  HttpClient(`/broker/update/${user}/${id}`, { method: post ? 'POST' : "PATCH", data, dont_encrypt: true });
const updateInsurer = (data, id) => HttpClient(`/insurer/update/insurer-data/${id}`, { method: "POST", data, dont_encrypt: true });

// Update User
const userUpdate = (data) => HttpClient('/admin/update/user-details', { method: "PATCH", data });

// reporting
const getBrokerReportingData = (data) => HttpClient(`/broker/get/role/broker-reporting-person`, { method: "POST", data });
const getEmployerReportingData = (data) => HttpClient(`/employer/get/role/employer-reporting-person`, { method: "POST", data });
const getInsurerUser = () => HttpClient(`/insurer/ic-user-type`);

const ValidatePincode = (data) => HttpClient(`/admin/check-pincode`, { method: "POST", data });
const getinsurerReportingData = (data) => HttpClient(`/insurer/get/role/ic-reporting-person`, { method: "POST", data });

// branch
const createChildCompany = (data) => HttpClient(`/admin/create-child-company`, { method: "POST", data });
const editChildCompany = (data) => HttpClient(`/admin/update-child-company`, { method: "POST", data });
const removeChildCompany = (data) => HttpClient(`/admin/delete-child-company`, { method: "POST", data });
const getChildCompanys = (data) => HttpClient(`/admin/employer-all-child-companies`, { method: "POST", data });

//Regional mapping
const getRegionalMappingdata = (data) => HttpClient(`/admin/get/region`, { method: "POST", data });
const createRegionMapping = (data) => HttpClient(`/admin/create/region`, { method: "POST", data });
const createBulkRegionMapping = (data) => HttpClient(`/admin/create/excel/region`, { method: "POST", data, dont_encrypt: true });
const deleteRegionalMapping = (id) => HttpClient(`/admin/delete/region/${id}`, { method: "DELETE" });
const updateRegionMapping = (data, id) => HttpClient(`/admin/update/region/${id}`, { method: 'POST', data, dont_encrypt: true });

//Zonal mapping
const getZonalMappingdata = (data) => HttpClient(`/admin/get-all/zone`, { method: "POST", data });
const createZonalMapping = (data) => HttpClient(`/admin/create/zone`, { method: "POST", data });
const createBulkZonalMapping = (data) => HttpClient(`/admin/create/excel/zone`, { method: "POST", data, dont_encrypt: true });
const deleteZonalMapping = (id) => HttpClient(`/admin/delete/zone/${id}`, { method: "DELETE" });
const updateZonalMapping = (data, id) => HttpClient(`/admin/update/zone/${id}`, { method: 'POST', data, dont_encrypt: true });

const createNewPassword = (data) => HttpClient('/admin/create/new/password', { method: 'POST', data });
const verifyUser = (data) => HttpClient('/admin/verify-user', { method: 'POST', data });
const unblockUser = (data) => HttpClient('/admin/unblock-user', { method: 'POST', data });
const deleteUserType = (data) => HttpClient('/admin/delete-user', { method: 'POST', data });

// Employer Custom Sheet Mapping
const employerMapping = (data) => HttpClient('/admin/create-employer-template-mapping', { method: 'POST', data });
const selectiveEmployeeDataForDelete = (data) => HttpClient('/broker/get/employee-data', { method: 'POST', data });
const removeEmployee = (data) => HttpClient('/broker/remove/employee-data', { method: 'POST', data });
const getSelectedEmployeeMembers = (data) => HttpClient('/broker/get/employee-member-data', { method: 'POST', data });

// export excel
const exportUsersData = (data) => HttpClient("/admin/export/last/login-data", { method: "POST", data });

// enrolment status employee wise
const employeeWiseStatus = (data) => HttpClient("/admin/update/enrollment-confirmation", { method: "POST", data });

export default {
  getUserData, getUserCount, getInsurers, getTPA, loadTotalLive, getUserDataPagination,
  postCreateModule, getAllModules, getOneModule, updateModule,
  postCreateRole, getOneRole, updateRole, getRoles,
  onboardBroker, onboardEmployer, onboardInsurer, onboardTpa, loadLeadData,
  getStates, getCities,
  postUserAdmin, postUser, updateUser, updateInsurer,
  getUserInfo, deleteUser, deleteModule, deleteRole,
  getEmployee, getPlans, getInsurer,
  getBrokerReportingData, getEmployerReportingData,
  getInsurerUser, getInsurerUsers, insurerGetBrokers,
  ValidatePincode,
  getinsurerReportingData,
  createChildCompany, editChildCompany, removeChildCompany, getChildCompanys,
  userUpdate,
  getRegionalMappingdata, createRegionMapping, createBulkRegionMapping, deleteRegionalMapping, updateRegionMapping,
  getZonalMappingdata, createZonalMapping, createBulkZonalMapping, deleteZonalMapping, updateZonalMapping,
  createNewPassword, verifyUser, unblockUser, deleteUserType, loadGenericUser, postCreateRoleForEmployee, getRolesEmployee,
  employerMapping, selectiveEmployeeDataForDelete, removeEmployee,
  exportUsersData, employeeWiseStatus, getSelectedEmployeeMembers
};
