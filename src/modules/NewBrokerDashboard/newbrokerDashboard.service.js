import HttpClient from "api/httpClient";

const getEmailEventTriggers = (data) => HttpClient('/admin/email-events-triggers');
const getInsurerAndTpa = (data) => HttpClient('/broker/dashboard/tpa-insurer-details');
const getAllEmailLogs = (data, cancelTokenSource) => HttpClient('/admin/get-all-email-logs-dashboard', { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getEmailLogsDetails = (data, pageNo = 1) => HttpClient(`/admin/email-logs-details?page=${pageNo}&per_page=100`, { method: 'POST', data });
const sendTriggerOffOnEmail = (data) => HttpClient('/admin/email-dashboard-send', { method: 'POST', data });
const getQueriesCount = (data, cancelTokenSource) => HttpClient(`/broker/dashboard/total-queries-count`, { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getEndorsementCount = (data, cancelTokenSource) => HttpClient(`/broker/dashboard/enrdorsement-count`, { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getAllClaimCount = (data, cancelTokenSource) => HttpClient(`/broker/dashboard/claim-status-count`, { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getEnrolmentInProgress = (data, cancelTokenSource) => HttpClient(`/broker/dashboard/enrolment-inprogress`, { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getStates = (data, cancelTokenSource) => HttpClient('/broker/dashboard/get-state-data', { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getMapWiseBusinessDetails = (data) => HttpClient('/broker/dashboard/map-wise-broker-details', { method: 'POST', data });
const getLiveCaselessClaim = (data, cancelTokenSource) => HttpClient('/broker/dashboard/live-cashless-claim', { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const policySubType = (data) => HttpClient('/broker/dashboard/policy-sub-type', { method: 'POST', data });
const getWidgets = (data, cancelTokenSource) => HttpClient('/broker/dashboard/new-widgets', { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getPolicyCover = (data, cancelTokenSource) => HttpClient('/broker/dashboard/policy/cover/details', { method: 'POST', data, cancelToken: cancelTokenSource ? cancelTokenSource.token : false });
const getUserData = ({ status = 1, type = "Employer", currentUser = "Employer", pageNo = 1, per_page = 200, cancelTokenSource, is_super_hr = 0 }) =>
  HttpClient(`/admin/users?type=${type}&status=${status}${currentUser ? `&user_type_name=${currentUser}&page=${pageNo}&per_page=${per_page}&is_super_hr=${is_super_hr}` : ''}`,
    { cancelToken: cancelTokenSource ? cancelTokenSource.token : false });

export default {
  getEmailEventTriggers, getAllEmailLogs, getEmailLogsDetails, sendTriggerOffOnEmail, getQueriesCount,
  getEndorsementCount, getAllClaimCount, getInsurerAndTpa, getEnrolmentInProgress, getStates, getMapWiseBusinessDetails,
  getLiveCaselessClaim, policySubType, getWidgets, getUserData, getPolicyCover
};
