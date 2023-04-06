import HttpClient from 'api/httpClient';

export const loadContactUs = (currentUser) => HttpClient(`/admin/get/contact-us${currentUser ? `?user_type_name=${currentUser}` : ''}`);

// drop-downs
const loadEmployers = () => HttpClient('/broker/get/employer');
const loadPolicyNo = () => HttpClient('/admin/get/all-policies');

// contact-config
const addContact = (data) => HttpClient('/admin/create/contact-log', { method: "POST", data });
const getContacts = (data) => HttpClient('/admin/get/all/contact-log', { method: "POST", data });
const updateContact = (id, data) => HttpClient(`/admin/update/contact-log/${id}`, { method: "PATCH", data });
const deleteContact = (id) => HttpClient(`/admin/delete/contact-log/${id}`, { method: "DELETE" });

const loadContact = () => HttpClient('/employee/get/contact-logs')

export default {
  loadEmployers,
  loadPolicyNo,
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  loadContact,
  loadContactUs
}
