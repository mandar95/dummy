import HttpClient from "api/httpClient";


const createHealthCheckup = (data) => HttpClient('/broker/submit/health-checkup', { method: 'POST', data ,dont_encrypt: true});
const updateHealthCheckup = (data) => HttpClient('/broker/submit/health-checkup', { method: 'POST', data });
const deleteHealthCheckup = (id) => HttpClient('/broker/delete-health-checkup', { method: 'POST', data: { record_id: id } });
const getHealthCheckup = (data) => HttpClient('/broker/get-health-checkup-list', { method: 'POST', data });
const getHealthCheckupByMember = (data) => HttpClient(`/broker/get/health-checkup-by-member?employee_member_mapping_id=${data.employee_member_mapping_id}&user_type_name=${data.user_type_name}`);
const Fetch = (payload) => HttpClient("/broker/get/health-checkup-export", {
    method: "POST",
    data: {
      broker_id: payload,
    },
  });
const ErrorSheetHandler = (data,is_super_hr) => HttpClient("/broker/get/error-sheet", {
    method: "POST",
    data: {
      broker_id: data,
      document_type_id: 18,
    },
  });
export default {
    createHealthCheckup,
    updateHealthCheckup,
    deleteHealthCheckup,
    getHealthCheckup,
    getHealthCheckupByMember,Fetch,ErrorSheetHandler
};
