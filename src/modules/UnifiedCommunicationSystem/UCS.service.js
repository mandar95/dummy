import HttpClient from "../../api/httpClient";

const getEmailLogs = (pageNo = 1, employer_id) => HttpClient(`/admin/get/email-logs?page=${pageNo}&per_page=1000&employer_id=${employer_id < 0 ? 0 : employer_id}`);
const resendEmail = (id) => HttpClient(`/admin/resend/email/${id}`);
const FetchTemplate = (data, api) => HttpClient(api || '/admin/get/trigger-mail/sample', {
    method: "POST",
    data
});

const loadUCCType = () => HttpClient('/admin/get-ucc-email-type');
const exportUCC = (data, api) => HttpClient(api || '/admin/ucc-export-logs', { method: "POST", data });


export default {
    getEmailLogs,
    resendEmail,
    FetchTemplate,
    loadUCCType,
    exportUCC
}
