import HttpClient from "../../../api/httpClient";

const getWidget = () =>
  HttpClient("/broker/get/flex-details", { method: "GET" });

const getUtilization = () =>
  HttpClient("/broker/get/flex-utilization", { method: "GET" });

const getEmployeeWidget = () => HttpClient("/employee/get/flex-benefit");

const postFlexBenefitTransaction = (data) => HttpClient("/employee/store/flexi_benefit", { method: "POST", data });

const widgetFlexSummary = () => HttpClient('/employee/get/flexi-details');

const wellnessData = () => HttpClient('/employee/get/wellness-details');

const getEmployers = (id) => HttpClient(`/broker/get/employers${id ? `?broker_id=${id}` : ''}`);

const getAllFlexBenefits = () => HttpClient('/admin/get/master/flexi-benefits-all');

const allocateFlexbenefitToEmployer = (data) => HttpClient('/admin/allocate-flexi-benefits-to-employer', { method: "POST", data });

const getEmployerFlexDetails = (data) => HttpClient(`/broker/single/employer/flex-details`, { method: "POST", data });

const getEmployerFlexWidget = (data) => HttpClient(`/broker/single/employer/flex-widget`, { method: "POST", data });

const downloadExcel = (data) => HttpClient(`/admin/get/flex-benefit/export`, { method: "POST", data });

export {
  getWidget, getUtilization, getEmployeeWidget,
  postFlexBenefitTransaction, widgetFlexSummary, wellnessData, getEmployers, getAllFlexBenefits,
  allocateFlexbenefitToEmployer, getEmployerFlexDetails, getEmployerFlexWidget, downloadExcel
};
