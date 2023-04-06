import HttpClient from "../../api/httpClient";

const loadCorporateBufferWidget = (employer_id) =>
  HttpClient(`/admin/corporate-buffer-widget-data${employer_id ? `?employer_id=${employer_id}` : ''}`);

const loadCorporateBufferData = (employer_id) =>
  HttpClient(`/admin/policy-corporate-data${employer_id ? `?employer_id=${employer_id}` : ''}`);

const loadEmployers = (userType) => HttpClient(`/admin/users?type=Employer&status=1${userType ? `&user_type_name=${userType}` : ''}&per_page=10000`);


export { loadCorporateBufferWidget, loadCorporateBufferData, loadEmployers };
