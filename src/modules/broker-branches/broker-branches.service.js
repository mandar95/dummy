import HttpClient from "api/httpClient";

export const loadBrokerBranches = (broker_id) => HttpClient(`/broker/get/broker-branches?broker_id=${broker_id}`);
const createBrokerBranches = (data) => HttpClient('/broker/create-broker-branch', { method: 'POST', data });
const updateBrokerBranches = (data) => HttpClient('/broker/update-broker-branch', { method: 'POST', data });
const deleteBrokerBranches = (id) => HttpClient(`/broker/delete-broker-branch/${id}`, { method: 'DELETE' });

export default {
  loadBrokerBranches,
  createBrokerBranches,
  updateBrokerBranches,
  deleteBrokerBranches,
}
