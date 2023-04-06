import HttpClient from '../../../api/httpClient';

export const getRenewalDetails = (id) => HttpClient(`/broker/policy/renewal/data${id ? `?broker_id=${id}` : ''}`);

export const getExcelData = (data) => HttpClient('/broker/policy/export/data', { method: "POST", data });   