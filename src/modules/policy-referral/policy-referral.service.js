import HttpClient from '../../api/httpClient';

// Get Insurer Type
const getInsurerType = () => HttpClient(`/employee/get/insurer-type`);

// Get Brokers
const getBrokers = (userType) => HttpClient(`/admin/users?type=Broker&status=1${userType ? `&user_type_name=${userType}` : ''}`);

// Get Brokers
const getPolicyReferrals = () => HttpClient(`/admin/get/broker-insurance-policy`);

// Delete Brokers
const deletePolicyReferrals = (id) => HttpClient(`/admin/delete/broker-insurance-policy/${id}`, { method: "DELETE" });

// Post Brokers
const postPolicyReferrals = (data) => HttpClient(`/admin/create/broker-insurance-policy`, { method: "POST", data });


export {
  getInsurerType,
  getBrokers,
  getPolicyReferrals,
  postPolicyReferrals,
  deletePolicyReferrals
};
