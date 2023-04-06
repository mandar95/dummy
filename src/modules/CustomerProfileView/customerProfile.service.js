import HttpClient from "../../api/httpClient";

const getCustomerProfileData = () => HttpClient('/admin/get/customer-profile-data');
const updateCustomerProfile = (data) => HttpClient('/admin/update/customer-company-details', { method: "POST", data });
const CreateMemberDetails = (data) => HttpClient('/admin/create/team-member-details', { method: "POST", data });
const deleteMemberDetails = (id) => HttpClient(`/admin/delete/team-member-details/${id}`, { method: "DELETE" });
const editMemberDetails = (id) => HttpClient(`/admin/edit/team-member-details/${id}`);
const updateMemberDetails = (id, data) => HttpClient(`/admin/update/team-member-details/${id}`, { method: 'POST', data, dont_encrypt: true });

export default {
    getCustomerProfileData,
    updateCustomerProfile,
    CreateMemberDetails,
    deleteMemberDetails,
    editMemberDetails,
    updateMemberDetails
}
