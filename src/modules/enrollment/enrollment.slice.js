import { createSlice } from "@reduxjs/toolkit";
import {
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
  getSummary,
  getTopup,
  // postTopup,
  // removeTopup,
  getFlexBalance,
  getFlexBalanceAll,
  getSalaryDeduction,
  getFlex,
  getRelations,
  getRelationsUnique,
  getPremiumValidate,
  getNomineeText,
  getUser,
  loaddeclaration,
  fetchPolcies,
  loadNomineeDeclarationForm,
} from './enrollment.service';
import nomineeConfigService from 'modules/policies/Nominee-Config/nominee.service.js'
import SecureLS from "secure-ls";
import { getTodayDate } from "./models/img-card";
import { downloadFile } from "utils";
// import { addTopup } from "./NewDesignComponents/enrolment.action";

const ls = new SecureLS();

export const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState: {
    loading: false,
    viewLoading: false,
    error: null,
    success: null,
    personalSuccess: null,
    member_option: [],
    member_option_topup: [],
    confirmation: {},
    nominees: [],
    topup: [],
    flex_balance: null,
    summary: null,
    salary_deduction: 0,
    policies: [],
    flex: null,
    relations: [],
    relations_topup: [],
    validate_premium: null,
    topup_premium: null,
    userData: {},
    flex_plan_data: {},
    step: 0,
    nomineeText: {},
    nominee_present: true,
    have_flex_policy: false,
    installments: [],
    nomineeSummary: [],
    declaration: null,
  },
  reducers: {
    nextStep: (state) => {
      state.step += 1
    },
    backStep: (state) => {
      state.step -= 1
    },
    set_step: (state, { payload = 0 }) => {
      state.step = payload
    },
    loading: (state, { payload = true }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
    },
    viewLoading: (state, { payload = true }) => {
      state.viewLoading = payload;
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
    },
    personalSuccess: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.personalSuccess = payload;
    },
    clearPersonalSuccess: (state) => {
      state.error = null;
      state.personalSuccess = null;
    },
    member_option: (state, { payload }) => {
      // state.loading = null;
      state.member_option = payload;
    },
    clearMember_option: (state) => {
      state.member_option = [];
    },
    member_option_topup: (state, { payload }) => {
      state.loading = null;
      state.member_option_topup = payload;
    },
    nominees: (state, { payload }) => {
      state.loading = null;
      state.nominees = payload;
    },
    clearNominees: (state) => {
      state.nominees = [];
    },
    topup: (state, { payload }) => {
      state.loading = null;
      state.topup = payload;
    },
    clearTopup: (state) => {
      state.topup = [];
    },
    relations_topup: (state, { payload }) => {
      state.loading = null;
      state.relations_topup = payload;
    },
    confirmation: (state, { payload }) => {
      state.confirmation = payload;
    },
    flex_balance: (state, { payload }) => {
      state.loading = null;
      state.flex_balance = payload;
    },
    clear_flex_balance: (state) => {
      state.flex_balance = null;
    },
    summary: (state, { payload }) => {
      state.loading = null;
      state.summary = payload;
    },
    salary_deduction: (state, { payload }) => {
      state.loading = null;
      state.salary_deduction = payload;
    },
    flex: (state, { payload }) => {
      // state.loading = null;
      state.flex = payload;
    },
    policies: (state, { payload }) => {
      state.loading = null;
      state.policies = payload;
    },
    relations: (state, { payload }) => {
      state.loading = null;
      state.relations = payload;
    },
    clear_relations: (state) => {
      state.relations = [];
    },
    validate_premium: (state, { payload }) => {
      state.loading = null;
      state.validate_premium = payload;
    },
    clear_validate_premium: (state) => {
      state.validate_premium = null;
    },
    topup_premium: (state, { payload }) => {
      state.loading = null;
      state.topup_premium = payload;
    },
    clear_topup_premium: (state) => {
      state.topup_premium = null;
    },
    userData: (state, { payload }) => {
      state.userData = payload;
      state.loading = null;
    },
    flex_plan_data: (state, { payload }) => {
      state.flex_plan_data = payload;
    },
    clearView: (state) => {
      state.topup = [];
      state.nominees = [];
      state.member_option = [];
      state.installments = [];
      state.nominee_present = true;
      state.declaration = null
    },
    set_getNomineeText: (state, { payload = {} }) => {
      state.nomineeText = payload
    },
    nominee_present: (state, { payload }) => {
      state.nominee_present = payload;
    },
    have_flex_policy: (state, { payload }) => {
      state.have_flex_policy = payload;
    },
    set_installments: (state, { payload }) => {
      const arrayUnique = [...new Map([...state.installments, ...payload].map(item =>
        [item['installment'], item])).values()];
      state.installments = arrayUnique.sort(function (a, b) {
        return a?.installment - b?.installment;
      });
    },
    setNomineeSummary: (state, { payload }) => {
      state.nomineeSummary = payload
    },
    Declaration: (state, { payload }) => {
      state.declaration = payload;
      state.loading = null;
    },
  }
});

export const {
  loading, success, error, clear, viewLoading,
  member_option, member_option_topup, clearMember_option,
  confirmation, summary, setNomineeSummary,
  nominees, clearNominees,
  topup, clearTopup, relations_topup,
  flex_balance, clear_flex_balance,
  salary_deduction, policies, flex,
  relations, clear_relations,
  validate_premium, clear_validate_premium,
  topup_premium, clear_topup_premium,
  personalSuccess, clearPersonalSuccess,
  userData, flex_plan_data, clearView,
  nextStep, backStep, set_step,
  set_getNomineeText, nominee_present,
  have_flex_policy, set_installments,
  Declaration
} = enrollmentSlice.actions;


//---------- Action creators ----------//

// Get User
export const loadUser = (id, noLoading) => {
  return async dispatch => {
    try {
      !noLoading && dispatch(loading());
      const { data, message, errors } = await getUser(id);
      if (data.data) {
        dispatch(userData(data.data[0]));
        ls.set("loggedInUser", data.data[0]);
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Get Policy Id
/*
 * Enrollment Status => 0  (CLOSE)
 * Enrollment Status => 1  (OPEN)
 * Enrollment Status => 2  (CONFIRMED)
*/
export const loadPolicyId = (dontLoadTopup) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await fetchPolcies();
      if (data.data) {
        const TopupResponse = !dontLoadTopup && await Promise.all(data.data.map(({ id }) => getTopup(id)));
        let TopDetail = []
        if (!dontLoadTopup && TopupResponse.some(({ data: topupData }) => topupData.data)) {
          TopupResponse.forEach(({ data: topupData }, index) => {
            const base_detail = data.data[index]
            const topup_detail = topupData?.data || [];
            if (topup_detail.length && [0, 2].includes(base_detail.enrollement_status)) {
              topup_detail.forEach(({ policy_id, enrollement_end_date, enrollement_start_date, suminsured, top_up_added, enrollement_status, policy_start_date, policy_end_date, ...rest }) => {
                const topup_detail_main = (data.data.find(({ id }) => (policy_id === id))) || {
                  enrollement_end_date, enrollement_start_date, enrollement_status: (new Date(getTodayDate()).getTime() <=
                    new Date(enrollement_end_date).getTime() &&
                    new Date(getTodayDate()).getTime() >=
                    new Date(enrollement_start_date).getTime() && suminsured && !top_up_added) ? 1 : 2
                }
                if (topup_detail_main.enrollement_status === 1 && suminsured &&
                  (/* new Date(policy_start_date).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&  */ !policy_end_date || new Date(policy_end_date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))) {
                  TopDetail.push({
                    description: rest.description,
                    enrollement_confirmed: topup_detail_main.enrollement_status === 2,
                    enrollement_end_date: topup_detail_main.enrollement_end_date,
                    enrollement_start_date: topup_detail_main.enrollement_start_date,
                    enrollement_status: topup_detail_main.enrollement_status,
                    id: base_detail.id,
                    is_flex_policy: false,
                    name: rest.policy_sub_type_name,
                    policy_enrollment_window: false,
                    policy_name: rest.policy_name,
                    policy_number: rest.policy_name + ":" + rest.policy_name,
                    policy_sub_type_id: rest.policy_sub_type_id,
                    topup_enrolment: true
                  })
                }
              })
            }


          })
        }
        dispatch(policies([...data.data, ...TopDetail]));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Get Flex

export const loadFlex = (payload, plan_id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      // dispatch(clear());
      const { data, message, errors } = await getFlex(payload, plan_id);
      if (data.status) {
        dispatch(flex(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};


// Get Member

export const loadMember = (payload, employee_id, view_loader) => {
  return async dispatch => {
    try {
      view_loader ? dispatch(viewLoading()) : dispatch(loading());

      // dispatch(clear());
      const { data } = await getMembers(payload, employee_id);
      if (data) {
        dispatch(member_option(data.data || []));
        view_loader && dispatch(viewLoading(false));
      } else {
        // if (data.errors)
        //   dispatch(error(data.errors));
        // if (data.message)
        //   dispatch(error(data.message));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Get Relations

export const loadRelations = (payload, flag, plan_id, uniqueRelation) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await (uniqueRelation ? getRelationsUnique({ policy_id: payload }) : getRelations(payload, plan_id))
      if (data.data) {
        dispatch(flag ? relations_topup(data.data.length ? data.data : []) :
          relations(data.data.length ? data.data : []));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Update User Info

export const editUser = (payload, id) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await updateUser(payload);
      if (data.status === true) {
        dispatch(personalSuccess(data.message));
        dispatch(loadUser(id))
      }
      else {
        dispatch(error(message || errors));
      }
    }
    catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Add Member

export const addMember = (payload, id, is_endorsement_detail, isTopup, onHide, topupDetail) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await postMember(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        // topupDetail?.length && topupDetail.forEach((elem) => {
        //   if (Number(elem?.top_up_added) === 1) {
        //     const premiums = elem?.premium?.split(",");
        //     const suminsureds = elem?.suminsured?.split(",");
        //     const premium = premiums[suminsureds.indexOf(String(elem?.top_up_suminsured))];
        //     addTopup(
        //       dispatch,
        //       {
        //         sum_insured: elem?.top_up_suminsured,
        //         final_amount: premium,
        //         flex_amount: 0,
        //         pay_amount: premium,
        //         deduction_type: elem?.deduction_type || "S",
        //         policy_id: elem?.policy_id,
        //         flexi_benefit_id: elem?.flexi_benefit_id,
        //         ...(Boolean(elem?.selected_installment_id) && {
        //           installment_id: elem?.selected_installment_id,
        //         }),
        //       },
        //       id,
        //       false
        //     )
        //   }
        // })
        if (isTopup) {
          dispatch(loadTopup(isTopup))
          return null;
        }
        if (!is_endorsement_detail) {
          dispatch(loadMember(id))
          dispatch(loadSummary(id))
        }
        onHide && onHide()
      }
      else {
        dispatch(error(message || errors));
      }
    }
    catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Delete Member

export const memberRemove = (payload, id) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await deleteMember(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadMember(id))
        // const { data: member } = await getMembers(id);
        // if (member.data) {
        //   dispatch(member_option(member.data));
        // }
        dispatch(loadSummary(id))
        // const { data: benefits } = await getSummary(id);
        // if (benefits.data) {
        //   dispatch(summary(benefits.data));
        // }
      }
      else {
        // dispatch(error(message || errors));
        console.error(message || errors)
      }
    }
    catch (err) {
      // dispatch(error("Something went wrong"));
      console.error(err)
    }
  };
}

// Get Nominees

export const loadNominees = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data } = await getNominees(payload);
      if (data) {
        dispatch(nominees(data.data || []));
      } else {
        // if (data.errors)
        //   dispatch(error(data.errors));
        // if (data.message)
        //   dispatch(error(data.message));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Add Nominee

export const addNominee = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await postNominee(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        const { data: nominee } = await getNominees({ policy_id: payload?.policy_id });
        if (nominee.data) {
          dispatch(nominees(nominee.data));
        }
      }
      else {
        dispatch(error(message || errors));
      }
    }
    catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Update Nominee

export const editNominee = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await updateNominee(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        const { data: nominee } = await getNominees({ policy_id: payload?.policy_id });
        if (nominee.data) {
          dispatch(nominees(nominee.data));
        }
      }
      else {
        dispatch(error(message || errors));
      }
    }
    catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Delete Nominee

export const nomineeRemove = (payload, policyNumber) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await deleteNominees(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        const { data: nominee } = await getNominees({ policy_id: policyNumber });
        if (nominee.data || nominee.message) {
          dispatch(nominees(nominee.data || []));
        }
      }
      else {
        dispatch(error(message || errors));
      }
    }
    catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// is nominee there ?

export const NomineeConfig = async (policy_id, employer_id) => {
  const { data } = await nomineeConfigService.getNomineeConfig({
    configurable_type: "policy",
    configurable_id: policy_id,
  });
  if (data?.data?.length) {
    return data?.data[0]
  } else {
    const { data: api_response } = await nomineeConfigService.getNomineeConfig({
      configurable_type: "employer",
      configurable_id: employer_id,
    });
    return (api_response?.data?.[0] || [])
  }
}

export const isNomineeThere = (policy_ids, employer_id) => {
  return async dispatch => {
    try {
      let response = await Promise.all(policy_ids.map(({ id }) => NomineeConfig(id, employer_id)));
      const nomineeThere = response.some(({ nominee_requirement }) => Number(nominee_requirement) !== 3)
      dispatch(nominee_present(nomineeThere ?? true))
    }
    catch (err) {
      console.error("Error", err);
    }
  };
}


// Get Topup

export const loadTopup = (payload, onlyCheck = false) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      let { data, message, errors } = await getTopup(payload);
      if (data.data) {
        if (!onlyCheck) {
          for (let i = 0; i < data.data.length; ++i) {
            const { data: memberData } = await getMembers(data.data[i].policy_id);
            data.data[i].memberData = memberData.data;
          }
        }
        dispatch(topup(data.data || []));
      } else {
        console.error(message || errors);
        // dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// is topup there ?

export const isTopupThere = (policy_ids) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      let response = await Promise.all(policy_ids.map(({ id }) => getTopup(id)));
      const topupThere = response
        .map(({ data, ...rest }) => ({
          ...rest, data: data?.data
            ?.some(({ policy_start_date, policy_end_date }) =>
            (/* new Date(policy_start_date).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) && */
              !policy_end_date ||
              new Date(policy_end_date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))) ? { data: data?.data } : []
        }))
        .find(({ data }) => data?.data?.length)
      if (topupThere) {
        dispatch(topup(topupThere.data.data || []));
      } else {
        console.error(response);
        // dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Validate Flex Amount

export const validateFlexAmt = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await getFlexBalance(payload);
      if (data.data) {
        dispatch(flex_balance(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

export const validateFlexAmtAll = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getFlexBalanceAll(payload);
      if (data.data) {
        dispatch(flex_balance(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Validate Premium

export const validatePremium = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await getPremiumValidate(payload);
      if (data && data.status) {
        dispatch(validate_premium(true));
        dispatch(topup_premium(data.premium))
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};



// Get Confirmation

export const loadConfirmtion = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await getConfirmation(payload);
      if (data.data) {
        dispatch(confirmation({
          ...data.data[0],
          no_of_installment_opted_for: data.no_of_installment_opted_for,
          is_installment_selected: data.is_installment_selected
        }));

      } else {
        if (message !== 'No Data Found') {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};


// Get All Salary Deduction

export const loadAllSalaryDeduction = (policy_ids) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const response = await Promise.all(policy_ids.map(({ id }) => getSalaryDeduction(id)));
      if (response) {
        dispatch(salary_deduction(response.reduce((total, { data }) => total + Number(data.salary_deduction), 0)));
      } else {
        dispatch(salary_deduction(0));
      }
    } catch (err) {
      dispatch(salary_deduction(0));
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Add Confirmation

export const enrollConfirmation = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await postConfirmation(payload);
      if (data.status === true) {
        dispatch(success(data.message));
      }
      else {
        dispatch(error(message || errors));
      }
    }
    catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Add All Policy Confirmation

export const enrollAllConfirmation = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const response = await Promise.all(payload.policy_ids
        .map(({ id }) => postConfirmation({
          policy_id: id,
          confirmation_flag: payload.confirmation_flag,
          ...payload.selectedInstallment && { installment_id: payload.selectedInstallment }
        })));

      if (response) {
        dispatch(success(response));
      }
      else {
        dispatch(error('-'));
      }
    }
    catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Get Summary

export const loadSummary = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await getSummary(payload);
      if (data.data) {
        dispatch(summary(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Load All Summary

export const loadAllSummary = (policy_ids) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const response = await Promise.all(policy_ids.map(({ id }) => getSummary(id)));
      if (response?.length) {
        dispatch(summary(response.map(({ data }) => ({ ...data.data }))));
      } else {
        dispatch(error(response));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// Load All Nominee Summary

export const loadAllNomineeSummary = (policy_ids) => {
  return async dispatch => {
    try {
      let responseNominee = null
      if (['DEVELOPMENT'].includes(process.env.REACT_APP_SERVER)) {
        responseNominee = await Promise.all(policy_ids.map(({ id }) => getNominees({ policy_id: id })));
      }
      if (responseNominee) {
        responseNominee && dispatch(setNomineeSummary(responseNominee
          .map((elem) => elem?.success ? elem?.data.data : [])));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

export const loadNomineeText = () => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await getNomineeText();
      if (data.data) {
        dispatch(set_getNomineeText(data.data));
      } else {
        // dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (error) {
      console.error(error)
    }
  };
}

export const loadDeclaration = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data } = await loaddeclaration(payload);
      if (data.status) {
        dispatch(Declaration({
          view: data.template_view,
          type: data.type
        }));

      } else {
        //dispatch(error(message || errors));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const loadNomineeDeclarationFormHandler = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data } = await loadNomineeDeclarationForm(payload);
      if (data.status && !!data?.url) {
        dispatch(loading(false));
        downloadFile(data?.url, null, true);
      } else {
        dispatch(loading(false));
        //dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(loading(false));
      console.error(err)
    }
  }
};

export const enrollment = state => state.enrollment;

export default enrollmentSlice.reducer;
