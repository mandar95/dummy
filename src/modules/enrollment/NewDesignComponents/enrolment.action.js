import swal from "sweetalert";
import { serializeError } from "../../../utils";

import {
  getMembers,
  postMember,
  deleteMember,
  postNominee,
  getNominees,
  deleteNominees,
  updateNominee,
  getTopup,
  postTopup,
  removeTopup,
  // getFlexBalance,
  getFlex,
  getRelations,
  getRelationsUnique,
  getPremiumValidate,
  loadPolicyCoverage,
  addInstallment

} from '../enrollment.service';
import { loadAllSummary, loading } from "../enrollment.slice";


export const initialState = {
  loading: true,
  flex: {},
  member_option: [],
  success: null,
  error: null,
  flex_plan_data: {},
  topup: [],
  flex_balance: null,
  topup_premium: null,
  nominees: [],
  policy_coverage: '',
  gate: true
}

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    case 'LOADING': return {
      ...state,
      loading: payload,
    }
    case 'SUCCESS': return {
      ...state,
      loading: false,
      success: payload
    }
    case 'CLEAR': return {
      ...state,
      loading: false,
      success: null,
      error: null
    }
    case 'SET_GATE': return {
      ...state,
      gate: payload
    }
    default: return state;
  }
}

// API Calls

// load Policy Data
export const loadFlex = async (dispatch, payload, plan_id) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await getFlex(payload, plan_id);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          flex: data || {},
        }
      });
    } else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  } catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

// load Policy Relations 

export const loadRelations = async (dispatch, payload, flag, plan_id, uniqueRelation) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await (uniqueRelation ? getRelationsUnique({ policy_id: payload }) : getRelations(payload, plan_id))
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          relations: data.data || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  } catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

// load Policy Members

export const loadMember = async (dispatch, payload, employee_id) => {
  try {
    const { data } = await getMembers(payload, employee_id);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          member_option: data.data || [],
        }
      });
    }
  } catch (err) {
    console.error(err)
  }
};

// add Member into Policy

const checkParentPair = (delete_member_relation_id, current_member_relation_id) => {

  if ([5, 6].includes(delete_member_relation_id) && [5, 6].includes(current_member_relation_id)) {
    return true;
  }

  if ([7, 8].includes(delete_member_relation_id) && [7, 8].includes(current_member_relation_id)) {
    return true;
  }

  return false

}


export const findParentPairSI = (member_option, current_member_relation_id, change_member_relation_id, change_member_sum_insured) => {
  if (+member_option?.[0]?.cover_type === 1) {
    return member_option[0].suminsured

  }
  if ([5, 6].includes(current_member_relation_id)) {
    // parent
    const father = change_member_relation_id === 5 ? { suminsured: change_member_sum_insured } : member_option.find(elem => elem.relation_id === 5)
    const mother = change_member_relation_id === 6 ? { suminsured: change_member_sum_insured } : member_option.find(elem => elem.relation_id === 6)
    return (father?.suminsured) || mother?.suminsured;
  }
  if ([7, 8].includes(current_member_relation_id)) {
    // parent in law
    const fatherInLaw = change_member_relation_id === 7 ? { suminsured: change_member_sum_insured } : member_option.find(elem => elem.relation_id === 7)
    const motherInLaw = change_member_relation_id === 8 ? { suminsured: change_member_sum_insured } : member_option.find(elem => elem.relation_id === 8)
    return fatherInLaw?.suminsured || motherInLaw?.suminsured;
  }

  return 0

}

export const addMember = async (dispatch, payload, id, is_endorsement_detail,
  { flex = {}, member_option = [], Data, midTerm, sum_insured, add_member_relation_id, cover_type/* , isParentPolicy */ } = {},
  { dispatchRedux, policy_ids } = {}) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await postMember(payload);
    if (data.status === true) {
      dispatch({ type: 'SUCCESS', payload: data.message });

      if (flex?.premium_id === 19 && member_option.find(({ id }) => id === Data.id).employee_premium /* && (+cover_type === 2 || (+cover_type === 1 && +member_option[0].cover_type === 2)) */) {
        for (let i = 0; i < member_option.length; ++i) {
          const member = member_option[i];
          if (member.id !== Data.id) {
            const formData = new FormData();
            member.marriage_date && formData.append("member_marriage_date", member.marriage_date);
            formData.append(
              "member_gender",
              member.gender
            );
            formData.append("member_firstname", member.first_name);
            member.last_name &&
              formData.append("member_lastname", member.last_name);
            formData.append("member_dob", member.dob);

            formData.append("member_relation_id", member?.relation_id);
            formData.set("sum_insured", (+cover_type === 2 /* || isParentPolicy */) ? findParentPairSI(member_option, member?.relation_id, +add_member_relation_id, sum_insured) || member?.suminsured : (sum_insured || member?.suminsured));
            !midTerm && member.id && formData.append("family_member_id", member.id);
            formData.append("policy_id", id);
            formData.append("type", (midTerm || !member.id) ? 1 : 2);
            const { data: memberData } = await postMember(formData);
            if (memberData && (member_option.length - 1) === i) {
              loadMember(dispatch, id);
              dispatchRedux(loadAllSummary(policy_ids))
              return null
            }
          } else if ((member_option.length - 1) === i) {
            loadMember(dispatch, id)
            dispatchRedux(loadAllSummary(policy_ids))
            return null
          }
        }
        if (!is_endorsement_detail) {
          loadMember(dispatch, id)
        }
      }
      if (!is_endorsement_detail) {
        loadMember(dispatch, id)
      }
    }
    else if (message === 'Insufficient Flex Amount') {
      dispatch({ type: 'LOADING', payload: false });
      swal({
        title: "Not Enough Amount?",
        text: `You can choose available amount to be deducted from Flex Wallet and remaining amount to be deducted from Payroll !`,
        icon: "info",
        buttons: true,
        dangerMode: true,
      }).then((submit) => {
        if (submit) {
          payload.set('deductible', 'F,S')
          dispatch(addMember(dispatch, payload, id, is_endorsement_detail))
        }
      });
    } else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  }
  catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

export const updateFlexToInd = async (member_option, policy_id, policy_ids, parentIndex, updateMemberLoad, dispatchRedux) => {
  try {
    dispatchRedux(loading());
    for (let i = 0; i < member_option.length; ++i) {
      const member = member_option[i];
      const formData = new FormData();
      member.marriage_date && formData.append("member_marriage_date", member.marriage_date);
      formData.append("member_gender", member.gender);
      formData.append("member_firstname", member.first_name);
      member.last_name &&
        formData.append("member_lastname", member.last_name);
      formData.set("cover_type", 1);
      formData.append("member_dob", member.dob);
      formData.append("member_relation_id", member?.relation_id);
      formData.set("sum_insured", member_option[0]?.suminsured);
      formData.append("family_member_id", member.id);
      formData.append("policy_id", policy_id);
      formData.append("type", 2);
      const { data: memberData } = await postMember(formData);
      if (memberData && (member_option.length - 1) === i) {
        updateMemberLoad(prev => {
          const prevCopy = [...prev];
          prevCopy[parentIndex] = prevCopy[parentIndex] ? prevCopy[parentIndex] + 1 : 1;
          return prevCopy;
        })
        dispatchRedux(loading(false));
        dispatchRedux(loadAllSummary(policy_ids));
        return null
      }
    }
    dispatchRedux(loading(false));
  } catch (err) {
    dispatchRedux(loading(false));
    console.error(err)
  }
}


// remove Member from Policy

export const memberRemove = async (dispatch, payload, id,
  { flex = {}, member_option = [], Data, midTerm, sum_insured, delete_member_relation_id/* , isParentPolicy */ } = {},
  { dispatchRedux, policy_ids } = {}) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await deleteMember(payload);
    if (data.status === true) {
      dispatch({ type: 'SUCCESS', payload: data.message });
      if (flex?.premium_id === 19 /* && +member_option.cover_type === 2 */) {
        for (let i = 0; i < member_option.length; ++i) {
          const member = member_option[i];
          if (member.id !== Data.id) {
            const formData = new FormData();
            member.marriage_date && formData.append("member_marriage_date", member.marriage_date);
            formData.append(
              "member_gender",
              member.gender
            );
            formData.append("member_firstname", member.first_name);
            member.last_name &&
              formData.append("member_lastname", member.last_name);
            formData.append("member_dob", member.dob);

            formData.append("member_relation_id", member?.relation_id);
            const pairSI = checkParentPair(delete_member_relation_id, member?.relation_id, member_option)
            formData.set("sum_insured", (+member.cover_type === 2 /* || isParentPolicy */) ? (!pairSI ? findParentPairSI(member_option, member?.relation_id, delete_member_relation_id, sum_insured) || member?.suminsured : (sum_insured || member?.suminsured)) : (sum_insured || member?.suminsured));
            !midTerm && member.id && formData.append("family_member_id", member.id);
            formData.append("policy_id", id);
            formData.append("type", (midTerm || !member.id) ? 1 : 2);
            const { data: memberData } = await postMember(formData);
            if (memberData && (member_option.length - 1) === i) {
              loadMember(dispatch, id);
              dispatchRedux(loadAllSummary(policy_ids))
              return null
            }
          } else if ((member_option.length - 1) === i) {
            loadMember(dispatch, id)
            dispatchRedux(loadAllSummary(policy_ids))
            return null
          }
        }
        loadMember(dispatch, id)
      }
      loadMember(dispatch, id)
      // dispatch(loadSummary(id))
    }
    else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  }
  catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

// Load Topup Policy

export const loadTopup = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    let { data, message, errors } = await getTopup(payload);
    if (data.data) {
      let topupData = data.data.filter(({ policy_start_date, policy_end_date }) => (/* new Date(policy_start_date).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) && */!policy_end_date || new Date(policy_end_date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)));
      for (let i = 0; i < topupData.length; ++i) {
        const { data: memberData } = await getMembers(topupData[i].policy_id);
        topupData[i].memberData = memberData.data;

        const { data: coverageData } = await loadPolicyCoverage({ policy_id: topupData[i].policy_id, type_id: 1 });
        topupData[i].coverageData = coverageData.data?.relations ? coverageData.data?.relations : null;

        const { data: baseMemberData } = await getMembers(payload);
        topupData[i].baseMemberData = baseMemberData.data.map(({ relation_id }) => relation_id);
      }
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          topup: topupData || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
      console.error(message || errors);
    }
  } catch (err) {
    console.error(err);
    dispatch({ type: 'LOADING', payload: false });
  }
};

// Validate Premium

export const validatePremium = async (set_validate_premium, set_topup_premium, payload) => {
  try {
    const { data, message, errors } = await getPremiumValidate(payload);
    if (data && data.status) {
      set_validate_premium(true);
      set_topup_premium(data.premium)
    } else {
      console.error(message || errors);
    }
  } catch (err) {
    console.error(err)
  }
};

// Add Topup

export const addTopup = async (dispatch, payload, policy_id, popupshow = true) => {
  try {
    popupshow && dispatch({ type: 'LOADING', payload: true });

    const { data, message, errors } = await postTopup(payload);
    if (data.status === true) {
      dispatch({ type: 'SUCCESS', payload: popupshow ? data.message : "gateclose" });
    }
    else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  }
  catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

// Remove Topup

export const resetTopup = async (dispatch, payload, policy_id) => {
  try {
    dispatch({ type: 'LOADING', payload: true });

    const { data, message, errors } = await removeTopup(payload);
    if (data.status === true) {
      dispatch({ type: 'SUCCESS', payload: data.message });
    }
    else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  }
  catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
}

// Get Nominees

export const loadNominees = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data } = await getNominees(payload);
    if (data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          nominees: data.data || [],
          loading: false
        }
      });
    }
  } catch (err) {
    console.error(err)
  }
};

// Add Nominee

export const addNominee = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await postNominee(payload);
    if (data.status === true) {
      dispatch({ type: 'SUCCESS', payload: data.message });
    }
    else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  }
  catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

// Delete Nominee

export const nomineeRemove = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await deleteNominees(payload);
    if (data.status === true) {
      dispatch({ type: 'SUCCESS', payload: data.message });
    }
    else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  }
  catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

// Update Nominee

export const editNominee = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await updateNominee(payload);
    if (data.status === true) {
      dispatch({ type: 'SUCCESS', payload: data.message });
    }
    else {
      dispatch({ type: 'ERROR', payload: message || errors });
    }
  }
  catch (err) {
    dispatch({ type: 'ERROR', payload: 'Something Went Wrong!' });
    console.error(err)
  }
};

// submit installment
export const submitInstallment = (payload, policy_ids, setpolicyMembers) => {
  return async dispatch => {
    try {
      const { data } = await addInstallment(payload);
      if (data.status === true) {
        dispatch(loadAllSummary(policy_ids, setpolicyMembers))
      }
    }
    catch (err) {
      console.error(err)
    }
  }
};


export const getPolicyCoverage = async (setPolicyCoverages, setNotPolicyCoverages, policy_ids, type_id) => {
  try {
    const response = await Promise.all(policy_ids.map(({ id: policy_id }) => loadPolicyCoverage({ policy_id, type_id })));
    setPolicyCoverages && setPolicyCoverages(response.map(({ data }) => data?.data?.relations ? [...(data?.data?.relations)] : null))
    setNotPolicyCoverages && setNotPolicyCoverages(response.map(({ data }) => data?.data?.relations_not_covered ? [...(data?.data?.relations_not_covered)] : null))
  } catch (err) {
    console.error(err)
  }
};
