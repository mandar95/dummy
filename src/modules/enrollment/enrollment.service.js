import HttpClient from 'api/httpClient';

// Get Policy
const fetchPolcies = () => HttpClient('/employee/get/policies');

// Get Members
const getMembers = (id, employee_id) => HttpClient(`/employee/get/enroll/members?policy_id=${id}${employee_id ? '&employee_id=' + employee_id : ''}`);

// Get Relations
const getRelations = (id, plan_id) => HttpClient(`/admin/get/family-construct?policy_id=${id}${plan_id ? `&plan_id=${plan_id}` : ''}`);
const getRelationsUnique = (data) => HttpClient('/employee/get-unique-family-construct', { method: 'POST', data });


//------------------ Steps -------------------//
// Presonal Detail
const updateUser = (data) => HttpClient('/admin/update/user', { method: 'PATCH', data });
const getUser = (id) => HttpClient('/admin/user', { method: "POST", data: { user_id: id, master_user_type_id: 5 } });

// Add Member
const postMember = (data) => HttpClient('/employee/enroll/family/members', { method: 'POST', data, dont_encrypt: true })
// Remove Member: member_id,policy_id
const deleteMember = (data) => HttpClient('/employee/remove/family/members', { method: 'POST', data })
// Is Flex
const getFlex = (id, plan_id) => HttpClient(`/employee/policy/rate/details?policy_id=${id}${plan_id ? `&plan_id=${plan_id}` : ''}`);
// Add Instalment
const addInstallment = (data) => HttpClient('/employee/submit-installment', { method: 'POST', data })


// Add Nominee
const postNominee = (data) => HttpClient("/employee/add/nominee", { method: "POST", data });
// Get Nominee
const getNominees = (data) => HttpClient('/employee/get/nominee', { method: "POST", data });
// DELETE Nominee
const deleteNominees = (id) => HttpClient(`/employee/delete/nominee/${id}`, { method: "DELETE" });
// Update Nominee
const updateNominee = (data) => HttpClient("/employee/update/nominee", { method: "POST", data });
const getNomineeText = () => HttpClient('/employee/avaliable-policy-types');


// Get Topup
const getTopup = (id = 1) => HttpClient(`/employee/get/cover/details?policy_id=${id}`); //changes
// Post Topup
const postTopup = (data) => HttpClient("/employee/submit/toup", { method: "POST", data });
// Remove Topup
const removeTopup = (data) => HttpClient("/employee/reset/flex", { method: "POST", data });
// Validate Flex
const getFlexBalance = (id) => HttpClient(`/employee/get/balance/utilization?policy_id=${id}`);
const getFlexBalanceAll = (data) => HttpClient('/employee/get/multiple/policies/balance/utilization', { method: "POST", data });
// Validate Premium
const getPremiumValidate = (data) => HttpClient('/employee/get/permilly-premium', { method: "POST", data });

// Benefit Summary
const getSummary = (id) => HttpClient(`/employee/get/all-policy-member?policy_id=${id}`);


// Confirmation
const getSalaryDeduction = (id = 1) => HttpClient(`/employee/get/salary-deduction?policy_id=${id}`);
const getConfirmation = (id = 1) => HttpClient('/employee/get/confirmation', { method: 'POST', data: { policy_sub_type_id: id } });
const postConfirmation = (data) => HttpClient('/employee/get/enroll/confirmation', { method: 'POST', data });

// Policy Config Validation
const loadPolicyCoverage = (data) => HttpClient('/employee/get/employee-coverage', { method: 'POST', data });

const loaddeclaration = (data) => HttpClient('/admin/get/custom-declaration/sample', { method: 'POST', data });

// nominee declaration form

const loadNomineeDeclarationForm = (data) => HttpClient('/employee/nominee-declaration-form', { method: 'POST', data });



export {
  getMembers,
  updateUser,
  postMember,
  deleteMember,
  getConfirmation,
  postConfirmation,
  postNominee,
  getNominees,
  deleteNominees,
  updateNominee,
  getNomineeText,
  getSummary,
  getTopup,
  postTopup,
  removeTopup,
  getFlexBalance,
  getSalaryDeduction,
  getFlex,
  addInstallment,
  getRelations,
  getRelationsUnique,
  getPremiumValidate,
  getUser,
  getFlexBalanceAll,

  loadPolicyCoverage,
  loaddeclaration,
  fetchPolcies,

  loadNomineeDeclarationForm
};
