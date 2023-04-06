import HttpClient from "../../api/httpClient";

const getBrokerDetails = (data) => HttpClient('/admin/get/broker/details', { method: "POST", data });
const getICDetails = (data) => HttpClient('/admin/get/ic/details', { method: "POST", data });
const getEmployerDetails = (data) => HttpClient('/admin/get/employer/details', { method: "POST", data });
const getTPADetails = (data) => HttpClient('/admin/get/tpa/details', { method: "POST", data });
const updateBrokerDetails = (data) => HttpClient(`/admin/update/broker/details`, { method: 'POST', data });
const updateICDetails = (data) => HttpClient(`/admin/update/ic/details`, { method: 'POST', data });
const updateEmployerDetails = (data) => HttpClient(`/admin/update/employer/details`, { method: 'POST', data });
const updateTPADetails = (data) => HttpClient(`/admin/update/tpa/details`, { method: 'POST', data });

export default {
    getBrokerDetails,
    getICDetails,
    getEmployerDetails,
    getTPADetails,
    updateBrokerDetails,
    updateICDetails,
    updateEmployerDetails,
    updateTPADetails
}