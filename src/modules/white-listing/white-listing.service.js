import HttpClient from "api/httpClient";

const loadWhiteListingIP = () => HttpClient('/broker/get/whitelisted/ip');
// const loadWhiteListingEmail = () => HttpClient('/broker/get/whitelisted/email');
const createWhiteListing = (data) => HttpClient('/broker/create/ip-whitelist', { method: 'POST', data });
const updateWhiteListing = (data,id) => HttpClient(`/broker/update/whitelisted/ip/${id}`, { method: 'POST', data });
const deleteWhiteListing = (id) => HttpClient(`/broker/delete/whitelisted/ip/${id}`, { method: 'DELETE' });

export default {
  loadWhiteListingIP,
  // loadWhiteListingEmail,
  createWhiteListing,
  updateWhiteListing,
  deleteWhiteListing,
}
