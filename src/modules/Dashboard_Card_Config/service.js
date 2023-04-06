import HttpClient from "api/httpClient";


const createDashboardCardConfig = (data) => HttpClient(`/broker/create/dashboard-card`, { method: 'POST', data ,dont_encrypt: true});
const createDashboardCardMapping = (data) => HttpClient(`/broker/submit/employer-card-mapping`, { method: 'POST', data});
const updateDashboardCardConfig = (id,data) => HttpClient(`/broker/update/dashboard-card/${id}`, { method: 'POST', data ,dont_encrypt: true});
const deleteCard = (data) => HttpClient(`/broker/delete/dashboard-card/${data}`, { method: 'DELETE' });
const getAllDashboardCards = (data) => HttpClient(`/broker/get/dashboard-cards?broker_id=${data}`);
const getDashboardCardMapping = (data) => HttpClient(`/broker/get/dashboard-card-mapping?employer_id=${data.data}`);
export default {
    createDashboardCardConfig,
    createDashboardCardMapping,
    updateDashboardCardConfig,
    deleteCard,
    getAllDashboardCards,
    getDashboardCardMapping,
};
