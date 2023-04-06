import HttpClient from "../../api/httpClient";

//Customer
const CreateTATQuery = (data) => HttpClient('/admin/create/query-tat', { method: "POST", data });
const getAllTATQuery = (data) => HttpClient('/admin/get/query-tats', { method: "POST", data });
const deleteTATQuery = (id) => HttpClient(`/admin/delete/query-tat/${id}`, { method: 'DELETE' });
const updateTATQuery = (data) => HttpClient(`/admin/update/query-tat`, { method: 'POST', data });

const CreateBrokerTATQuery = (data) => HttpClient('/broker/create/query-tat', { method: "POST", data });
const getAllBrokerTATQuery = (data) => HttpClient('/broker/get/query-tats', { method: "POST", data });

export default {

    CreateTATQuery,
    getAllTATQuery,
    deleteTATQuery,
    updateTATQuery,

    CreateBrokerTATQuery,
    getAllBrokerTATQuery
}