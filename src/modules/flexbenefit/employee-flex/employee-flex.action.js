import swal from "sweetalert";
import { serializeError } from "utils"
import { loadPolicyCoverage } from "../../enrollment/enrollment.service";
import { NomineeConfig } from "../../enrollment/enrollment.slice";
import service from './employee-flex-.service';
import service2 from 'modules/policies/policy-config.service.js';
import { v4 as uuid } from 'uuid';
import { getEmployDashboard } from "../../dashboard/Dashboard.service";


export const initialState = {
  loading: true,
  loadingFlexPlan: true,
  details: [],
  flex_detail: {},
  policies: [],
  policy_types: [],
  policy_data: {},
  tempData: {}
}

export const reducer = (state, { type, payload }) => {

  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'LOADING': return {
      ...state,
      loading: payload,
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      errors: serializeError(payload)
    }
    default: return state;
  }
}


export const employeeFlexPolicies = async (dispatch, payload) => {
  try {
    const { data } = await service.employeeFlexPolicies(payload);
    if (data.data) {
      let featureResponse = await Promise.all(data.data.map(({ policy_id }) => service2.getFeatures({ policy_id })))
      featureResponse = featureResponse.map(({ data }) => (data.data || []));

      let filterData = data.data?.map((elem, index) => ({
        ...elem,
        flex_suminsured: elem.flex_suminsured?.length ? elem.flex_suminsured : elem.policy_suminsureds.map(si => ({ sum_insured: si })),
        allPolicyFeatures: featureResponse[index]
      }))
        .filter(({ flex_grades, employee_grade_id, enrollment_data }) => {
          if (flex_grades?.length && ((employee_grade_id && flex_grades.every(({ grade_id }) => employee_grade_id !== grade_id)) || !employee_grade_id)) {
            return false
          }
          if ([0, 2].includes(enrollment_data?.enrollement_status)) {
            if (window?.location?.search?.includes('showanyhow')) {
              return true
            }
            return false
          }

          return true
        }) || [];

      if ((filterData.filter(({ product_id, is_parent_policy }) => (product_id === 1) && !is_parent_policy).length === 1) ||
        (filterData.filter(({ product_id, is_parent_policy }) => (product_id === 2) && !is_parent_policy).length === 1) ||
        (filterData.filter(({ product_id, is_parent_policy }) => (product_id === 3) && !is_parent_policy).length === 1)) {
        for (let i = 0; i < filterData.length; ++i) {
          const elem = filterData[i];
          // if (/* [1, 2, 3, 4, 5, 6].includes(elem.product_id) && !elem.is_parent_policy && */ filterData.filter(({ product_id/* , is_parent_policy */ }) => (product_id === elem.product_id) /* && !is_parent_policy */).length === 1) {
          const { data: coverageData } = await loadPolicyCoverage({ policy_id: elem.policy_id, type_id: 1 });
          filterData[i].PolicyCoverages = coverageData?.data?.relations ? [...(coverageData?.data?.relations)] : null;
          filterData[i].NoPolicyCoverages = coverageData?.data?.relations_not_covered ? [...(coverageData?.data?.relations_not_covered)] : null;
          // }
        }
      }
      // extract base policy
      const BasePolicies = filterData.filter(({ product_id, is_parent_policy }) => [1, 2, 3].includes(product_id) && !is_parent_policy);

      // add topup and parent into base policy
      BasePolicies.forEach(({ policy_id, product_id: base_product_id }, index) => {
        const TopupPolicies = filterData.filter(({ topup_master_policy_id, product_id }) => product_id > 3 && (base_product_id + 3) === product_id && policy_id === topup_master_policy_id).map(elem => ({ ...elem, secret_uuid: uuid() }));
        BasePolicies[index].topup_policies = TopupPolicies || [];

        const ParentPolicies = filterData.filter(({ parent_base_policy_id, product_id }) => product_id <= 3 && base_product_id === product_id && policy_id === parent_base_policy_id).map(elem => ({ ...elem, secret_uuid: uuid() }));
        BasePolicies[index].parent_policies = ParentPolicies || [];
      })

      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          details: BasePolicies,
          loading: false,
          loadingFlexPlan: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

const ExtractFeature = (product_features = [], sum_insured) => {

  return product_features.filter(({
    // age = null,
    // content = "1 & 2 content",
    // designation = null,
    // designation_id = null,
    // grade = null,
    // grade_id = null,
    // image = null,
    is_opd = 0,
    is_policy_level = 0,
    // no_of_times_of_salary = null,
    // relation = null,
    // relation_id = null,
    // state = null,
    // state_id = null,
    suminsured,
    // title = "1 & 2",
  }) => {
    if (is_policy_level === 1) return true
    if (is_opd === 0 && Number(suminsured) === Number(sum_insured)) {
      return true
    }
    return false
  })

}

export const getSiPr = async (dispatch, payload, reducerdetails, { setPremiumUpdated, isSinglePlan }) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    let response = await Promise.all(payload.map(elem => service.getSiPr(elem)));

    response = response.map(({ data }, index) => ({ ...data.data, plan_id: payload[index].plan_id, suminsured: payload[index].sum_insured }))
    if (response) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          details: reducerdetails.map((elem) => {
            let plan_detail_si = response.find(({ plan_id }) => plan_id === elem.id);
            if (plan_detail_si && elem.is_differnce_premium && (elem.will_initial_premium_be_paid_by_employer ? (+elem?.intial_suminsured !== (+plan_detail_si?.suminsured || +elem.suminsured)) : true)) {
              const difference_premium = +plan_detail_si.employee_premium - +elem?.intial_employee_premium
              plan_detail_si.employer_premium += plan_detail_si.employee_premium - difference_premium
              plan_detail_si.employee_premium = difference_premium
              plan_detail_si.premium = plan_detail_si.employer_premium + plan_detail_si.employee_premium
            }
            if (isSinglePlan && (!!elem.employee_premium || elem.employee_premium === 0) && plan_detail_si && +plan_detail_si.employee_premium !== +elem.employee_premium && setPremiumUpdated) {
              setPremiumUpdated(prev => prev ? prev + 1 : prev)
            }
            return ({
              ...elem,
              ...plan_detail_si,
              ...(plan_detail_si && elem.will_initial_premium_be_paid_by_employer && +elem?.intial_suminsured === (+plan_detail_si?.suminsured || +elem.suminsured)) && {
                employee_premium: 0,
                employer_premium: plan_detail_si.premium
              },
              product_features: ExtractFeature(elem.product_features, plan_detail_si?.suminsured),
              // topup array
              topup_policies:
                elem.topup_policies.map((elem) => {
                  let plan_detail_si = response.find(({ plan_id }) => plan_id === elem.id);
                  if (plan_detail_si && elem.is_differnce_premium && (elem.will_initial_premium_be_paid_by_employer ? (+elem?.intial_suminsured !== (+plan_detail_si?.suminsured || +elem.suminsured)) : true)) {
                    const difference_premium = +plan_detail_si.employee_premium - +elem?.intial_employee_premium
                    plan_detail_si.employer_premium += plan_detail_si.employee_premium - difference_premium
                    plan_detail_si.employee_premium = difference_premium
                    plan_detail_si.premium = plan_detail_si.employer_premium + plan_detail_si.employee_premium
                  }
                  if (isSinglePlan && (!!elem.employee_premium || elem.employee_premium === 0) && plan_detail_si && +plan_detail_si.employee_premium !== +elem.employee_premium && setPremiumUpdated) {
                    setPremiumUpdated(prev => prev ? prev + 1 : prev)
                  }
                  return ({
                    ...elem,
                    ...plan_detail_si,
                    ...(plan_detail_si && elem.will_initial_premium_be_paid_by_employer && +elem?.intial_suminsured === (+plan_detail_si?.suminsured || +elem.suminsured)) && {
                      employee_premium: 0,
                      employer_premium: plan_detail_si.premium
                    },
                    product_features: ExtractFeature(elem.product_features, plan_detail_si?.suminsured),
                  })
                }) || [],
              parent_policies:
                elem.parent_policies.map((elem) => {
                  let plan_detail_si = response.find(({ plan_id }) => plan_id === elem.id);
                  if (plan_detail_si && elem.is_differnce_premium && (elem.will_initial_premium_be_paid_by_employer ? (+elem?.intial_suminsured !== (+plan_detail_si?.suminsured || +elem.suminsured)) : true)) {
                    const difference_premium = +plan_detail_si.employee_premium - +elem?.intial_employee_premium
                    plan_detail_si.employer_premium += plan_detail_si.employee_premium - difference_premium
                    plan_detail_si.employee_premium = difference_premium
                    plan_detail_si.premium = plan_detail_si.employer_premium + plan_detail_si.employee_premium
                  }
                  if (isSinglePlan && (!!elem.employee_premium || elem.employee_premium === 0) && plan_detail_si && +plan_detail_si.employee_premium !== +elem.employee_premium && setPremiumUpdated) {
                    setPremiumUpdated(prev => prev ? prev + 1 : prev)
                  }
                  return ({
                    ...elem,
                    ...plan_detail_si,
                    ...(plan_detail_si && elem.will_initial_premium_be_paid_by_employer && +elem?.intial_suminsured === (+plan_detail_si?.suminsured || +elem.suminsured)) && {
                      employee_premium: 0,
                      employer_premium: plan_detail_si.premium
                    },
                    product_features: ExtractFeature(elem.product_features, plan_detail_si?.suminsured),
                  })
                }) || []
            })
          }) || [],
          loading: false
        }
      });

    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const tempStorage = async (dispatch, payload,
  { history, handleNext, redirectTo = 'policy-flexible-benefits-form', setTab, nextTo, setReset, setShow }) => {
  try {
    dispatch({ type: 'LOADING', payload: true });

    const { data } = await service.tempStorage(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          tempData: payload || {},
          loading: false
        }
      });
      history && history.push(redirectTo);
      handleNext && handleNext();
      setTab && setTab(nextTo || 'GPA');
      setReset && setReset(true);
      setShow && setShow(true);
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const saveEnrolment = async (dispatch, payload, { history }) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.saveEnrolment(payload);
    if (data.status) {
      // dispatch({
      //   type: 'GENERIC_UPDATE', payload: {
      //     tempData: payload || {},
      //     loading: false
      //   }
      // });
      dispatch({ type: 'LOADING', payload: false });
      swal('Success', message, 'success').then(() => {
        history && history.push('/home');
      })
    } else {
      swal('Alert', serializeError(message || errors), 'warning')
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}



export const loadTempStorage = async (dispatch) => {
  try {
    const { data } = await service.loadTempStorage();
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          tempData: data.data || {},
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const getEmployeeOldBenefits = async (dispatch) => {
  try {
    const { data } = await service.getEmployeeOldBenefits();
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          oldBenefits: data.data.old_flex_expiry_data || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const getMeAllNomineeConfig = async (policy_ids, employer_id, setNomineeToAddConfig) => {
  try {
    const response = await Promise.all(policy_ids.map(({ id }) => NomineeConfig(id, employer_id)));
    setNomineeToAddConfig(response)
  }
  catch (err) {
    console.error("Error", err);
  }
};

export const loadPolicyDeclaration = async (payload, policies, setState) => {
  try {
    const response = await Promise.all(policies.map(({ policy_id }) => service.loadPolicyDeclaration({ ...payload, policy_id })));
    const policyContent = response.find(({ data }) => data.status);
    if (policyContent) {
      setState(policyContent.data.template_view)
    }
  }
  catch (err) {
    console.error("Error", err);
  }
}

export const loadEmployeePolicies = async (setState) => {
  try {
    const { data } = await getEmployDashboard(true);
    if (data.data) {
      setState(data.data)
    }
  }
  catch (err) {
    console.error("Error", err);
  }
}
