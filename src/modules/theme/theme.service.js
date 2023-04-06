import HttpClient from 'api/httpClient';

const loadThemes = () => HttpClient('/admin/get/themes');
const storeTheme = (data) => HttpClient('/admin/add/new-theme', { method: 'POST', data });
const removeTheme = (id) => HttpClient(`/admin/delete/theme/${id}`, { method: 'DELETE' });
const loadTheme = (id) => HttpClient(`/admin/edit-theme/${id}`);
const updateTheme = (data, id) => HttpClient(`/admin/update-theme/${id}`, { method: 'PATCH', data });


export default {
  loadThemes, storeTheme, removeTheme,
  loadTheme, updateTheme
};
