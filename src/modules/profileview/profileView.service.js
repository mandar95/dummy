import httpClient from '../../api/httpClient';

export const getUserInfo = (user_id, master_user_type_id) => httpClient('/admin/user', master_user_type_id ? { method: "POST", data: { user_id, master_user_type_id } } : undefined);
export const postPersonalData = (data) => httpClient("/admin/update/user", {
    method: "PATCH",
    data
});

export const getInsurerInfo = (data) => httpClient('/insurer/get/insurer-profile', { method: 'POST', data });
export const state_city = (data) => httpClient('/employee/get/state-city', { method: "POST", data });
export const updateProfile = (id, data) => httpClient(`/insurer/update/insurer-profile/${id}`, { method: "POST", data, dont_encrypt: true });
