import HttpClient from "../../../api/httpClient";

const login = data => HttpClient("/admin/login", { method: "POST", data });
const getProfile = ({ master_user_type_id = false, user_id }) => HttpClient('/admin/user', master_user_type_id ? { method: "POST", data: { user_id, master_user_type_id } } : undefined);
const forgotPassword = data => HttpClient("/admin/request/forgot/password", { method: "POST", data });
const resetPassword = data => HttpClient("/admin/forgot/password", { method: "POST", data });
const logoutAction = data => HttpClient("/admin/logout", { method: "POST", data });
const token = (hash) => HttpClient(`/admin/verify/password/reset/request/${hash}`, { method: "GET" });
const changePassword = data => HttpClient("/admin/reset/password", { method: "POST", data });
const expiry = () => HttpClient("/admin/get/login-days-left", { method: "GET" });
const getSecurityQuestion = () => HttpClient("/admin/get/security-questions", { method: "GET" });
const storeSecurityQuestion = (data) => HttpClient("/admin/set/security-questions", { method: "POST", data });
const verifySecurityQA = (data) => HttpClient("/admin/verify/security-questions", { method: "POST", data });
const setLanguage = (data) => HttpClient("/admin/set/language", { method: "POST", data });

const azureRedirection = () => HttpClient("/admin/azure/sign-in");
const verifyOtp = (data) => HttpClient('/admin/verify/otp', { method: "POST", data })
const resendOtp = (data) => HttpClient('/admin/resend/otp', { method: "POST", data })

export default {
  login, getProfile, forgotPassword,
  resetPassword, logoutAction, token,
  changePassword, expiry,
  getSecurityQuestion, storeSecurityQuestion,
  verifySecurityQA, setLanguage,
  azureRedirection, verifyOtp, resendOtp
};
