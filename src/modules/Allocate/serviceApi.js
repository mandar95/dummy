import HttpClient from "../../api/httpClient";

const sendFile = (data) => HttpClient('/employer/store/employee-flex', { method: "POST", data, dont_encrypt: true });

const getReport = (employer_id) => HttpClient(`/employer/get/flex-export${employer_id ? `?employer_id=${employer_id}` : ''}`, { method: "GET" });

const sampleFile = (id) =>
  HttpClient(
    `/admin/get/sample-file?sample_type_id=${id}`,
    { method: "POST" }
  );

const GetErrorSheetData = (data) => HttpClient('/employer/get/flex-allocation/error/sheet', { method: "POST", data });

export { sendFile, getReport, sampleFile, GetErrorSheetData }
