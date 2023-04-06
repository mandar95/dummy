import HttpClient from "../../../api/httpClient";

const loadAllClaims = (employer_id, policyId) =>
  HttpClient(
    policyId
      ? `/employer/get/claim/graph?employer_id=${employer_id}&policy_id=${policyId}`
      : `/employer/get/claim/graph?employer_id=${employer_id}`
  );

const loadAllFilterClaims = (employer_id) =>
  HttpClient(`/employer/get/claim/graph?employer_id=${employer_id}`);

const loadAllEnrollmentDetails = (employer_id, policyId) =>
  HttpClient(
    policyId
      ? `/employer/get/enrollment-confirmation/graph?employer_id=${employer_id}&policy_id=${policyId}`
      : `/employer/get/enrollment-confirmation/graph?employer_id=${employer_id}`
  );
const loadAllEndorsments = (employer_id, policyId) =>
  HttpClient(
    policyId
      ? `/employer/get/endorsement/graph?employer_id=${employer_id}&policy_id=${policyId}`
      : `/employer/get/endorsement/graph?employer_id=${employer_id}`
  );

const loadAllClaimsDetails = (is_super_hr) => HttpClient(`/employer/get/claims/details?is_super_hr=${is_super_hr}`);

const getCoverData = () =>
  HttpClient("/employer/get/policy/cover/details?policy_type_id=1");

const getPopUpData = () =>
  HttpClient("/employer/get/policy/cover/details?policy_type_id=2");

export {
  loadAllClaims,
  loadAllFilterClaims,
  loadAllEnrollmentDetails,
  loadAllEndorsments,
  loadAllClaimsDetails,
  getCoverData,
  getPopUpData,
};
