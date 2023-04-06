import { createSlice } from "@reduxjs/toolkit";
import service from './approve-policy.service';
import _ from 'lodash';
import { downloadSampleSuccess, setPageData } from "../policy-config.slice";
import { TopUpMapBase } from "../helper";
import swal from "sweetalert";
import CryptoJS from "crypto-js";

const SortRelation = (ageDetail = []) => {

  const first = [], second = [];

  ageDetail.sort(function (a, b) {
    return a?.relation_id - b?.relation_id;
  });

  ageDetail.forEach((elem, index) => {
    if (index % 2 === 0) first.push(elem)
    else second.push(elem)
  });
  return [...first, ...second]
}

export const approvePolicySlice = createSlice({
  name: "approve-policy",
  initialState: {
    loading: false,
    error: null,
    success: null,
    policyData: {},
    options: {},
    sampleURL: null,
    approved: null,
    broker: [],
    broker_id: null,
    members_enrolled: [],
    employerCdStatement: [],
    audit_trail: []
  },
  reducers: {
    loading: (state, { payload = true }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.success = payload;
    },
    error: (state, { payload }) => {
      let message = " "
      if (typeof payload === 'string')
        message = payload;
      else if (typeof payload === 'object') {
        for (const property in payload) {
          message = `${message}
${payload[property][0]}`;
        }
      }
      state.loading = null;
      state.error = message !== ' ' ? message : 'Unable to connect to the server, please check your internet connection.';
      state.success = null;
    },
    clear: (state) => {
      state.error = null;
      state.success = null;
      // state.loading = null;
    },
    policyData: (state, { payload }) => {
      state.loading = null;
      // let tempData = _.cloneDeep(payload.ageDetails)
      const AgeDetail = SortRelation([...payload.ageDetails]);
      const reverseAgeDetail = [...AgeDetail]
      reverseAgeDetail.reverse();

      let ageDetails = [];
      if (payload.policy_rater_type_id === 3) {
        for (let i = 0; i < AgeDetail.length / 2; ++i) {
          ageDetails[i] = {
            ...AgeDetail[i],
            additional_premium_opd: reverseAgeDetail
              .find(({ relation_id }) => relation_id === AgeDetail[i].relation_id).additional_premium,
            employee_contribution_opd: reverseAgeDetail
              .find(({ relation_id }) => relation_id === AgeDetail[i].relation_id).employee_contribution,
            employer_contribution_opd: reverseAgeDetail
              .find(({ relation_id }) => relation_id === AgeDetail[i].relation_id).employer_contribution,
          }
        }
      }
      else {
        ageDetails = [...AgeDetail]
      }
      if (AgeDetail[0]?.relation_id !== 1) {
        ageDetails.unshift({
          ...ageDetails[0],
          relation: "Self",
          relation_id: 1
        })
      }
      let topup_master_policy_ids = [];
      let topup_master_policy_names = [];
      if (payload.policy_type_id === 2) {
        TopUpMapBase.forEach(({ input, label, label2 }, index) => {
          if (payload[input]) {
            topup_master_policy_ids[index] = { policy_id: payload[input] };
            topup_master_policy_names[index] = (payload[label] || '') + ' : ' + (payload[label2] || '');
          }
        })
      }
      // state.policyData = payload;
      state.policyData = {
        ...payload,
        ageDetails: ageDetails.length ? ageDetails : payload.ageDetails,
        is_employee_included: payload.ageDetails[0]?.relation_id === 1 ? 1 : 0,
        ...(payload.policy_rater_type_id === 2 && {
          sum_insured_type_id: payload.opd_suminsured_type_id,
          sum_insured_sub_type_id: payload.opd_suminsured_sub_type_id,
          premium_type_id: payload.opd_premium_type_id,

          premium_contribution_type: payload.premium_contribution_type_opd,
          premium_tax: payload.premium_tax_opd,
          premium_tax_type: payload.premium_tax_type_opd
        }),
        enhance_suminsured_type_id: payload.enhance_suminsured_type,
        enhance_premium_type_id: payload.enhance_premium_type,
        enhance_suminsured_sub_type_id: payload.enhance_suminsured_sub_type,
        topup_master_policy_ids,
        topup_master_policy_names,
        top_up_policy_ids: payload.top_up_policy_ids?.length ? payload.top_up_policy_ids.map(elem => ({ id: elem.top_up_policy_id, value: elem.top_up_policy_id, label: `${elem.top_up_policy_name} : ${elem.top_up_policy_number}` })) : [],
        employee_eligibility: String(payload.employee_eligibility || 0)
      };
    },
    clearPolicyData: (state) => {
      state.policyData = {};
    },
    options: (state, { payload }) => {
      state.loading = null;
      state.options = payload;
    },
    clearOptions: (state) => {
      state.options = {};
    },
    sampleURL: (state, { payload }) => {
      state.sampleURL = payload;
    },
    clearSampleURL: (state) => {
      state.sampleURL = null;
    },
    approvedSuccess: (state) => {
      state.approved = true;
    },
    clearApproved: (state) => {
      state.approved = null;
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    broker_id: (state, { payload }) => {
      state.broker_id = payload;
    },
    clear_broker_id: (state) => {
      state.broker_id = null;
    },
    policyConfigData: (state, { payload }) => {
      state.loading = null;
      state.policyData = MapEditToConfig(payload, false)
    },
    updatePolicyConfigData: (state, { payload }) => {
      state.policyData = { ...state.policyData, ...payload }
    },
    clearPolicyConfigData: (state) => {
      state.policyData = {}
    },
    members_enrolled: (state, { payload }) => {
      state.members_enrolled = payload;
      state.loading = null;
    },
    employerCdStatement: (state, { payload }) => {
      state.employerCdStatement = payload;
      state.loading = null;
    },
    auditTrail: (state, { payload }) => {
      state.audit_trail = payload;
      state.loading = null;
    },
    clearAuditTrail: (state) => {
      state.audit_trail = []
    },
    generatePolicy: (state, { payload }) => {
      state.policyData = payload
    }
  }
});

export const {
  loading, success, error, clear,
  policyData, clearPolicyData,
  options, clearOptions,
  sampleURL, clearSampleURL,
  approvedSuccess, clearApproved,
  broker, broker_id, clear_broker_id,
  policyConfigData, generatePolicy,
  updatePolicyConfigData, clearPolicyConfigData,
  members_enrolled, employerCdStatement, auditTrail, clearAuditTrail
} = approvePolicySlice.actions;


//---------- Action creators ----------//

// Get Policy Data

export const loadPolicy = (payload, flag) => {
  return async dispatch => {
    try {
      dispatch(loading());
      // dispatch(clearPolicyData())
      const { data, message, errors } = await service.getPolicyDetail(payload);
      if (data.data) {
        dispatch(clear());
        flag ? dispatch(policyConfigData(data.data[0])) : dispatch(policyData(data.data[0]));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// Get Policy Data

export const generatePolicyJSON = async (payload) => {
  try {
    const { data, message, errors } = await service.getPolicyDetail(payload);
    if (data.data) {
      let policyDataResp = data.data[0];

      const policyData = MapEditToConfig(policyDataResp, true)

      if (navigator.clipboard) {

        // Encrypt
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(policyData), 'secret key 123').toString();
        navigator.clipboard.writeText(ciphertext).then(() => {
          swal('Copied to clipboard', '', 'success', { buttons: 'OK' })
        });
      } else {
        swal('URL Generated', '', 'success', { buttons: 'OK' })
      }

    } else {
      swal('Alert', 'Something went wrong', 'warning')
      console.error(message || errors)
    }
  } catch (err) {
    swal('Alert', 'Something went wrong', 'warning')
    console.error(err)
  }
};




export const loadOptions = (id) => {
  return async dispatch => {
    try {
      // dispatch(clearOptions())
      dispatch(loading());
      const { data, message, errors } = await service.getOptions(id);
      if (data.data) {
        dispatch(clear());
        dispatch(options(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// post audit trail

export const loadAuditTrail = (id) => {
  return async dispatch => {
    try {
      // dispatch(clearOptions())
      dispatch(loading());
      const { data, message, errors } = await service.getAuditTrail({ policy_id: id });
      if (data.data) {
        dispatch(clear());
        dispatch(auditTrail(data.data));
      } else {
        // dispatch(error(message || errors));
        console.error(message || errors)
        dispatch(loading(false));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      dispatch(loading(false));
      console.error(err)
    }
  }
};

// Downlaod Sample File

export const sampleFile = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.downloadSample({ sample_type_id: payload });
      if (data) {
        dispatch(sampleURL(data?.data[0].upload_path));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const editPolicy = (payload, id) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.updatePolicy(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadPolicy(id))
        // const { data: policy } = await service.getPolicyDetail(id);
        // if (policy.data) {
        //   dispatch(clear());
        //   dispatch(policyData(policy.data[0]));
        // }
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const policyApproved = (payload, id) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.confirmPolicy({ policy_id: payload, status: id });
      if (data.status === true) {
        // if (status === true) {
        //   const { data: live, message: liveMessage, errors: liveErrors } = await service.confirmPolicy({ policy_id: payload, status: id || 1 });
        //   if (live.status === true) {
        //     dispatch(success(live.message));
        //     dispatch(approvedSuccess());
        //   }
        //   else if (liveMessage || liveErrors) {
        //     dispatch(error(liveMessage || liveErrors));
        //     console.error(message || errors)
        //   }
        // }
        // else {
        dispatch(success(data.message));
        dispatch(approvedSuccess());
        dispatch(setPageData({
          firstPage: 1,
          lastPage: 1,
        }))
        // }
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// Admin Get Broker

export const loadBroker = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.adminGetBroker(payload);
      dispatch(clear());
      if (data.data) {
        dispatch(broker(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const loadMembersEnrolled = (payload, policyData) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.loadMembersEnrolled(payload);
      if (data.data) {
        dispatch(members_enrolled(data.data.map((elem) => ({
          ...elem,
          employee_enrollement_start_date: elem.employee_enrollement_start_date || policyData.enrollement_start_date,
          employee_enrollement_end_date: elem.employee_enrollement_end_date || policyData.enrollement_end_date,
          policy_start_date: policyData.start_date,
          policy_end_date: policyData.end_date
        }))));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const updateMembersEnrollmentDate = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateMembersEnrollmentDate(payload);
      if (data.status) {
        dispatch(success(data.message));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const updateMembersEnrollmentConfirmaton = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateMembersEnrollmentConfirmaton(payload);
      if (data.status) {
        dispatch(success(data.message));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
}

export const endorsementMapping = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.endorsementMapping(payload);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(setPageData({
          firstPage: 1,
          lastPage: 1,
        }))
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const loadBaseWiseSiPrSheet = (payload, config) => {
  return async dispatch => {
    try {
      // dispatch(loading());
      const { data, message, errors } = await service.loadBaseWiseSiPrSheet(payload);
      if (data.data) {
        dispatch((config ? sampleURL : downloadSampleSuccess)(data.data?.url || ''));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const checkEmployerCdStatement = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.checkEmployerCdStatement(payload);
      if (data.data) {
        dispatch(employerCdStatement(data.data));
      } else {
        dispatch(loading(false));
        // dispatch(error(message || errors));
        console.error(message || errors)
      }
    } catch (err) {
      dispatch(loading(false));
      // dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};


export const approvePolicy = state => state.approvePolicy;

export const cleanup = (dispatch) => { dispatch(clear()) }

export default approvePolicySlice.reducer;

const MapEditToConfig = (payload, isEdit) => {
  let tempData = _.cloneDeep(payload.ageDetails)
  if (tempData[0]?.relation_id !== 1) {
    tempData.unshift({
      ...tempData[0],
      relation: "Self",
      relation_id: 1,
      is_opd_contribution: 0
    })
    if (payload.policy_rater_type_id === 3) {
      tempData.unshift({
        ...tempData[0],
        is_opd_contribution: 1
      })
    }
  }

  const additional_premium_opd = payload.ageDetails.find(({ is_opd_contribution }) => is_opd_contribution)?.additional_premium

  let topup_master_policy_ids = [];
  if (payload.policy_type_id === 2) {
    TopUpMapBase.forEach(({ input, label, label2 }, index) => {
      if (payload[input]) {
        topup_master_policy_ids[index] = { policy_id: payload[input] };
      }
    })
  }

  return {
    ages: tempData.filter(({ is_opd_contribution, relation_id }) => !is_opd_contribution && [1, 2, 3, 5, 7, 9, 10].includes(relation_id)).map((age) => ({
      ...(age.max_age !== null && { max_age: age.max_age }),
      ...(age.min_age !== null && { min_age: age.min_age }),
      no_limit: age.min_age ? false : true,
      relation_id: age.relation_id,
      ...(age.additional_premium !== null && { additional_premium: age.additional_premium }),
      employee_contribution: age.employee_contribution || 0,
      employer_contribution: age.employer_contribution || 0,
      "is_special_member_allowed": !!age.is_special_member_allowed,
      ...(age.is_special_member_allowed && {
        "special_member_additional_premium": age.special_member_additional_premium,
        "special_member_employee_contribution": age.special_member_employee_contribution,
        "special_member_employer_contribution": age.special_member_employer_contribution,
      }),
      ...payload.is_allowed_for_gender && { is_allowed_for_gender: age.is_allowed_for_gender },
      ...payload.difference_from_relation && { difference_from_relation: age.difference_from_relation },
      age_difference: age.age_difference || 0,
    })),
    ages_opd: tempData.filter(({ is_opd_contribution, relation_id }) => is_opd_contribution && [1, 2, 3, 5, 7, 9, 10].includes(relation_id)).map((age) => ({
      ...(age.max_age !== null && { max_age: age.max_age }),
      ...(age.min_age !== null && { min_age: age.min_age }),
      no_limit: age.min_age ? false : true,
      relation_id: age.relation_id,
      ...(age.additional_premium !== null && { additional_premium: age.additional_premium }),
      employee_contribution: age.employee_contribution || 0,
      employer_contribution: age.employer_contribution || 0,
      "is_special_member_allowed": !!age.is_special_member_allowed,
      ...(age.is_special_member_allowed && {
        "special_member_additional_premium": age.special_member_additional_premium,
        "special_member_employee_contribution": age.special_member_employee_contribution,
        "special_member_employer_contribution": age.special_member_employer_contribution,
      })
    })),
    topup_master_policy_ids,
    description: payload.description,
    no_of_spouse: payload.ageDetails.find((elem) => elem.relation_id === 2)?.no_of_relation || '1',
    no_of_partner: payload.ageDetails.find((elem) => elem.relation_id === 10)?.no_of_relation || '1',
    no_of_daughter: payload.ageDetails.find((elem) => elem.relation_id === 3)?.no_of_relation || '1',
    no_of_son: payload.ageDetails.find((elem) => elem.relation_id === 4)?.no_of_relation || '1',
    is_employee_included: String(payload.ageDetails[0]?.relation_id === 1 ? 1 : 0),
    tpa: payload.tpa_id,
    insurer: payload.insurer_id,
    ...!isEdit && { employer: { id: payload.employer_id, value: payload.employer_id, label: payload.employer } },
    broker_id: payload.broker_id,
    max_twins: payload.ageDetails[0]?.max_twins,
    policy_no: payload.policy_number,
    policy_name: payload.policy_name,
    policy_type: payload.policy_type_id,
    // topup_master_policy_id: payload.topup_master_policy_id,
    no_of_member: payload.no_of_member,
    policy_start_date: payload.start_date,
    policy_end_date: payload.end_date,
    enrollement_start_date: payload.enrollement_status ? payload.enrollement_start_date : '',
    enrollement_end_date: payload.enrollement_status ? payload.enrollement_end_date : '',
    policy_sub_type: payload.policy_sub_type_id,
    co_oprate_buffer: payload.co_operate_buffer,
    enrollement_days: payload.enrollement_days,
    enrollement_type: payload.enrollement_type,
    broker_commission: payload.broker_commision,
    has_special_child: payload.has_special_child,
    enrollement_status: payload.enrollement_status,
    has_unmarried_child: payload.has_unmarried_child,
    unmarried_child_premium: payload.unmarried_child_premium,
    unmarried_child_employer_premium: payload.unmarried_child_employer_contribution,
    unmarried_child_employee_premium: payload.unmarried_child_employee_contribution,
    ...payload.has_unmarried_child && { unmarried_min_age: payload.unmarried_min_age },
    parent_cross_selection: payload.has_parent_cross_selection,
    special_child_employee_premium: payload.special_child_employee_contribution,
    special_child_employer_premium: payload.special_child_employer_contribution,
    special_child_additional_premium: payload.special_child_additional_premium,
    employee_contribution: !payload.additional_premium && payload.ageDetails.find(({ is_opd_contribution }) => !is_opd_contribution)?.employee_contribution,
    employer_contribution: !payload.additional_premium && payload.ageDetails.find(({ is_opd_contribution }) => !is_opd_contribution)?.employer_contribution,
    premium_type: payload.premium_type_id,
    si_sub_type: payload.sum_insured_sub_type_id,
    si_type: payload.sum_insured_type_id,
    has_flex: payload.has_flex,
    has_payroll: payload.has_payroll,
    additional_premium: payload.has_additional_premium,
    sum_insured: Array.isArray(payload.sum_insureds) ? payload.sum_insureds.map(({ sum_insured }) => sum_insured) : [],
    premium: Array.isArray(payload.premiums) ? payload.premiums : [],
    in_sum_insured: Array.isArray(payload.in_sum_insured) ? payload.in_sum_insured : [],
    in_premium: Array.isArray(payload.in_premium) ? payload.in_premium : [],
    contact_details: payload.contact_details.map((contact) => ({
      designation_id: { label: contact.designation_name, value: contact.designation_name },
      email: contact.contact_email,
      contact_name: contact.contact_name,
      contact_no: contact.contact_number,
      type: contact.type === '0' ? 0 : 1,
      level: contact.level
    })),
    benefits: payload.benefits,
    ...payload.benefits_type && { benefits_type: String(payload.benefits_type) },
    cd_balance: payload.cd_value || null,
    cd_balance_threshold: payload.cd_threshold_value || null,

    // new changes
    ...!isEdit && {
      employer_child: payload.employer_childs.map(({ employer_child_company_id, company_name }) => ({
        "id": employer_child_company_id,
        "name": company_name,
        "status": 1
      }))
    },
    has_lock_in: payload.has_lock_in,
    member_addition_lock_in: payload.member_addition_lock_in,
    member_addition_lock_in_unit: payload.member_addition_lock_in_unit,
    member_addition_lock_in_type: payload.member_addition_lock_in_type,
    member_removal_lock_in: payload.member_removal_lock_in,
    member_removal_lock_in_unit: payload.member_removal_lock_in_unit,
    member_removal_lock_in_type: payload.member_removal_lock_in_type,
    has_suminsured_lock_in: payload.has_suminsured_lock_in,
    suminsured_lock_in: payload.suminsured_lock_in,
    suminsured_lock_in_unit: payload.suminsured_lock_in_unit,

    policy_rater_type_id: payload.policy_rater_type_id,

    ...(payload.policy_rater_type_id === 3 && {
      sum_insured_opd: Array.isArray(payload.opd_suminsureds) ? payload.opd_suminsureds.map(({ sum_insured }) => sum_insured) : [],
      premium_opd: Array.isArray(payload.opd_premiums) ? payload.opd_premiums : [],
      opd_premium_type: payload.opd_premium_type_id,
      opd_suminsured_sub_type: payload.opd_suminsured_sub_type_id,
      opd_suminsured_type: payload.opd_suminsured_type_id,
      employee_contribution_opd: !additional_premium_opd && payload.ageDetails.find(({ is_opd_contribution }) => is_opd_contribution)?.employee_contribution,
      employer_contribution_opd: !additional_premium_opd && payload.ageDetails.find(({ is_opd_contribution }) => is_opd_contribution)?.employer_contribution,
      additional_premium_opd: additional_premium_opd
    }),

    cd_account_type: payload.cd_account_type,
    employer_child_cd: payload.employer_childs
      .filter(({ cd_amount, cd_threshold }) => cd_amount || cd_threshold)
      .map(({ cd_amount, cd_threshold }) => ({
        cd_amount, cd_threshold
      })),
    installment_allowed: !!payload.is_installment_allowed,
    installment_periods: payload.installment.map(({ installment }) => installment),
    salary: payload.salary || [],

    // New Changes Tue 30 Aug 2022
    broker_verification_needed: payload.broker_verification_needed || 0,
    employer_verification_needed: payload.employer_verification_needed || 0,
    is_flex_policy: payload.is_flex_policy,

    topup_compulsion_flag: String(payload.topup_compulsion_flag || 0),
    icici_imid_number: payload.icici_imid_number,
    icici_cdbg_number: payload.icici_cdbg_number,
    icici_customer_id: payload.icici_customer_id,


    no_of_adult: payload.no_of_adults,
    no_of_child: payload.no_of_childs,
    no_of_siblings: payload.no_of_siblings,
    no_of_parents: payload.max_parents,

    has_adopted_child: payload.has_adopted_child,
    is_parent_policy: payload.is_parent_policy,

    is_midterm_enrollement_allowed_for_spouse: payload.is_midterm_enrollement_allowed_for_spouse,
    default_midterm_enrollement_days_for_spouse: payload.default_midterm_enrollement_days_for_spouse,
    midterm_premium_calculation_from_for_spouse: payload.midterm_premium_calculation_from_for_spouse,
    is_midterm_enrollement_allowed_for_partner: payload.is_midterm_enrollement_allowed_for_partner,
    default_midterm_enrollement_days_for_partner: 0,
    midterm_premium_calculation_from_for_partner: payload.midterm_premium_calculation_from_for_partner,
    is_midterm_enrollement_allowed_for_kids: payload.is_midterm_enrollement_allowed_for_kids,
    default_midterm_enrollement_days_for_kids: payload.default_midterm_enrollement_days_for_kids,
    midterm_premium_calculation_from_for_kids: payload.midterm_premium_calculation_from_for_kids,

    installment_level: String(payload.installment_level || 0),
    is_installment_allowed: payload.is_installment_allowed,

    base_ipd_policy_id: payload.base_ipd_policy_id,

    premium_tax_type: payload.premium_tax_type,
    premium_tax: payload.premium_tax,
    premium_tax_type_opd: payload.premium_tax_type_opd,
    premium_tax_opd: payload.premium_tax_opd,
    premium_tax_type_enhance: payload.premium_tax_type_enhance,
    premium_tax_enhance: payload.premium_tax_enhance,
    premium_tax_type_topup: payload.premium_tax_type_topup,

    premium_contribution_type_opd: payload.premium_contribution_type_opd,
    premium_contribution_type_topup: payload.premium_contribution_type_topup,
    premium_contribution_type: payload.premium_contribution_type,

    top_up_cover_has_eligibility: payload.top_up_cover_has_eligibility,
    calculate_eligibility_from: payload.calculate_eligibility_from,

    inception_premium: payload.inception_premium,
    inception_premium_installment: payload.inception_premium_installment || null,
    installment_amounts: payload.installment_amounts,

    claim_back_date_days: payload.claim_back_date_days,
    is_claim_intimation_mandatory: Number(payload.is_claim_intimation_mandatory || 0),

    claims_array: payload.claimDocuments.filter(({ is_opd_document }) => !is_opd_document).map((elem) => ({
      id: elem.id,
      document_name: elem.document_name,
      document_type: elem.document_type,
      is_mandatory: elem.is_mandatory,
      is_opd_document: elem.is_opd_document,
    })),
    claims_array_opd: payload.claimDocuments.filter(({ is_opd_document }) => is_opd_document).map((elem) => ({
      id: elem.id,
      document_name: elem.document_name,
      document_type: elem.document_type,
      is_mandatory: elem.is_mandatory,
      is_opd_document: elem.is_opd_document,
    })),

    display_in_benefit_summary: payload.display_in_benefit_summary || '0',

    // New Changes Wed 14 Dec 2022
    show_gst_flag: payload.show_gst_flag,
    co_insurer_array: payload.coinsurer?.map(({ co_insurer_id, co_insurer_name, co_insurer_percentage }) => ({ id: co_insurer_id, name: co_insurer_name, percentage: co_insurer_percentage })) || []
  }
}
