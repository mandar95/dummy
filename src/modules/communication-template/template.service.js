import HttpClient from "api/httpClient";

// const getAllTrigger = () => HttpClient('/admin/get/master/all-system-trigger');
const getAllTrigger = () => HttpClient('/admin/get/master/allowed-system-trigger');

const getALLEmailTemplate = (data) => HttpClient('/admin/get/all/system-trigger-templates', { method: "POST", ...(data && { data }) });

const createEmailTemplate = (data) => HttpClient('/admin/create/system-trigger-template', { method: "POST", data, dont_encrypt: true });

const updateEmailTemplate = (data, id) => HttpClient(`/admin/update/system-trigger-template/${id}`, { method: "POST", data, dont_encrypt: true });

const deleteTemplate = (id) => HttpClient(`/admin/delete/system-trigger-template/${id}`, { method: 'DELETE' });


const getTemplateMapping = (data) => HttpClient('/admin/get/all/system-trigger-template-mapping?broker_id=' + data.broker_id);
const createTemplateMapping = (data) => HttpClient('/admin/create/system-trigger-template-mapping', { method: "POST", data, dont_encrypt: true });
const deleteTemplateMapping = (id) => HttpClient(`/admin/delete/system-trigger-template-mapping/${id}`, { method: 'DELETE' });
const updateTemplateMapping = (data, id) => HttpClient(`/admin/update/system-trigger-template-mapping/${id}`, { method: "POST", data });

const getTemplateView = (data) => HttpClient('/admin/get/system-trigger-template-view', { method: 'POST', data });

// upload trigger
const loadSelectedEvent = () => HttpClient('/admin/get-selected-event');
const loadSampleFormat = (data) => HttpClient('/admin/export-event-data', { method: 'POST', data });
const loadTemplate = (data) => HttpClient('/admin/get-all-event-trigger-template', { method: 'POST', data });
const triggerEmailUplaod = (data) => HttpClient('/admin/import-event-data', { method: 'POST', data, dont_encrypt: true });

const loadFrequency = (data) => HttpClient('/admin/get-system_trigger-frequency', { method: 'POST', data });

const deleteTemeplateAttachement = ({ templateId, attachmentId }) => HttpClient(`/admin/system-trigger-template/delete-attachment/${templateId}/${attachmentId}`, { method: 'DELETE' });
const templateImageUpload = (data) => HttpClient('/admin/system-trigger-template/upload-attachment', { method: 'POST', data, dont_encrypt: true });



export default {
    getAllTrigger, getALLEmailTemplate, createEmailTemplate, updateEmailTemplate, deleteTemplate,
    getTemplateMapping, createTemplateMapping, deleteTemplateMapping, updateTemplateMapping,
    getTemplateView, loadSelectedEvent, loadSampleFormat, loadTemplate, triggerEmailUplaod, loadFrequency,
    deleteTemeplateAttachement, templateImageUpload
}
