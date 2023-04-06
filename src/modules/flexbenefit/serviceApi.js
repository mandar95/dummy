import HttpClient from "../../api/httpClient";

const getWidget = () =>
  HttpClient("/employer/get/flex-details", { method: "GET" });

const getUtilization = () =>
  HttpClient("/employer/get/flex-utilization", { method: "GET" });

const getEmployeeWidget = () => HttpClient("/employee/get/flex-benefit");

const postFlexBenefitTransaction = (data) => HttpClient("/employee/store/flexi_benefit", { method: "POST", data });

const widgetFlexSummary = () => HttpClient('/employee/get/flexi-details');

const wellnessData = () => HttpClient('/employee/get/wellness-details');

const getEmployers = (id) => HttpClient(`/broker/get/employers?broker_id=${id}`);

const getAllFlexBenefits = (data) => HttpClient(`/admin/get/master/flexi-benefits-all?type=${data.type}`);

const allocateFlexbenefitToEmployer = (data) => HttpClient('/admin/allocate-flexi-benefits-to-employer', { method: "POST", data });

const deleteFlexBenefit = (id) => HttpClient(`/admin/delete-flexi-benefits-to-employer/${id}`);

const addBenefits = (data) => HttpClient('/admin/create/master/flexi-benefits', { method: "POST", data, dont_encrypt: true });

const updateBenefits = (data, id) => HttpClient(`/admin/update/master/flexi-benefits/${id}`, { method: "POST", data, dont_encrypt: true });

const deleteBenefit = (id) => HttpClient(`/admin/delete/master/flexi-benefits/${id}`, { method: "DELETE" });


const adminGetBroker = (userType = 'Super Admin') => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);
const adminGetEmployer = (id) => HttpClient(`/broker/get/employers?broker_id=${id}`);

const getFlexPolicies = () => HttpClient('/employee/get/flex-benefit/policies');
const saveFlexPolicy = (data) => HttpClient('/employee/buy-flex-policy', { method: "POST", data, dont_encrypt: true });


export {
  getWidget, getUtilization, getEmployeeWidget, postFlexBenefitTransaction,
  widgetFlexSummary, wellnessData, getEmployers, getAllFlexBenefits,
  allocateFlexbenefitToEmployer, addBenefits, deleteFlexBenefit,
  adminGetBroker, adminGetEmployer, getFlexPolicies,
  updateBenefits, deleteBenefit, saveFlexPolicy
};
