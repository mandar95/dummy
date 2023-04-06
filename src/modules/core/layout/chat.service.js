import HttpClient from "api/httpClient";

const getAllDetails = (data) =>
    HttpClient("/employee/chatbot/get-all-details", { method: "POST", data });


export default {
    getAllDetails
}
