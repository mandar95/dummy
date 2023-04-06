import HttpClient from "api/httpClient";

const employeeFlexPolicies = () => HttpClient('/employee/fetch-all-flex-plans')

const getSiPr = (data) => HttpClient('/employee/calculate-policy-rates', { method: 'POST', data })

const tempStorage = (data) => HttpClient('/employee/save-temp-flex-plan-data', { method: 'POST', data })

const loadTempStorage = () => HttpClient('/employee/temp-flex-data')

const saveEnrolment = (data) => HttpClient('/employee/buy-policy-and-flex', { method: 'POST', data })

const getEmployeeOldBenefits = () => HttpClient('/employee/flex-existing-expired-benefits')

const loadPolicyDeclaration = (data) => HttpClient('/admin/get/custom-declaration/sample', { method: 'POST', data });

export default {
  employeeFlexPolicies,
  getSiPr,
  tempStorage,
  loadTempStorage,
  saveEnrolment,
  getEmployeeOldBenefits,
  loadPolicyDeclaration
};
