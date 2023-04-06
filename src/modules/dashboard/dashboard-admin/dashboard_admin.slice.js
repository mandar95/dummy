import { createSlice } from "@reduxjs/toolkit";
import {
  getWidgets, policyGraph, endorsementGraph,
  memberEnrollGraph, endorsementPolicyWise, memberWiseClaim,
  policyWiseClaim, claimTable, coverData, summary, summarySubscription,
  policyPlanSummary, claimSummary
} from "./serviceApi";
import { getFirstError } from "../../../utils";

export const dashboardAdmin = createSlice({
  name: "dashboardAdmin",
  initialState: {
    getWidgetsDataResponse: {},
    getpolicyGraphResponse: {},
    getendorsementGraphResponse: {},
    getMemberEnrollGraphResponse: {},
    getendorsementPolicyWiseResponse: {},
    getmemberWiseClaimResponse: {},
    getpolicyWiseClaimResponse: {},
    getclaimTableResponse: {},
    getWidgetsEmployerResponse: {},
    getCoverDataResponse: {},
    getResp: {},
    getSummaryResp: {},
    policyPlanResp: {},
    claimResp: {},
    alert: null,
  },

  //reducers
  reducers: {
    getWidgetsDetails: (state, action) => {
      state.getWidgetsDataResponse = action.payload;
    },
    policyGraphDetails: (state, action) => {
      state.getpolicyGraphResponse = action.payload;
    },
    getendorsementGraphDetails: (state, action) => {
      state.getendorsementGraphResponse = action.payload;
    },
    getMemberEnrollGraphDetails: (state, action) => {
      state.getMemberEnrollGraphResponse = action.payload;
    },
    getendorsementPolicyWiseDetails: (state, action) => {
      state.getendorsementPolicyWiseResponse = action.payload;
    },
    getmemberWiseClaimDetails: (state, action) => {
      state.getmemberWiseClaimResponse = action.payload;
    },
    getpolicyWiseClaimDetails: (state, action) => {
      state.getpolicyWiseClaimResponse = action.payload;
    },
    getclaimTableDetails: (state, action) => {
      state.getclaimTableResponse = action.payload;
    },
    getWidgetsEmployerDetails: (state, action) => {
      state.getWidgetsEmployerResponse = action.payload;
    },
    getCoverDataDetails: (state, action) => {
      state.getCoverDataResponse = action.payload;
    },
    getSummaryrDetails: (state, action) => {
      state.getResp = action.payload;
    },
    getSubscriptionDetails: (state, action) => {
      state.getSummaryResp = action.payload;
    },
    getPolicyPlanDetails: (state, action) => {
      state.policyPlanResp = action.payload;
    },
    getClaimSummaryDetails: (state, action) => {
      state.claimResp = action.payload;
    },
    alertMessage: (state, action) => {
      state.alert = action.payload;
    },
    clearAlertMessage: (state, action) => {
      state.alert = null;
    },
  },
});

export const {
  getWidgetsDetails, policyGraphDetails, getendorsementGraphDetails, getMemberEnrollGraphDetails,
  getendorsementPolicyWiseDetails, getmemberWiseClaimDetails, getpolicyWiseClaimDetails,
  getclaimTableDetails, getWidgetsEmployerDetails, getCoverDataDetails, getSummaryrDetails,
  alertMessage, clearAlertMessage, getSubscriptionDetails, getPolicyPlanDetails, getClaimSummaryDetails
} = dashboardAdmin.actions;

//Action Creator

// export const getEmployerData = () => {
//   return async (dispatch) => {
//     const getEmployerDataResponse = await getEmployer();
//     if (getEmployerDataResponse?.data) {
//       dispatch(getEmployerDetails(getEmployerDataResponse));
//     } else {
//     }
//   };
// };
//
// export const getPoliciesData = (data) => {
//   return async (dispatch) => {
//     const getPoliciesDataResponse = await getPolicies(data);
//     if (getPoliciesDataResponse?.data) {
//       dispatch(getPoliciesDetails(getPoliciesDataResponse));
//     } else {
//     }
//   };
// };

export const getWidgetsData = () => {
  return async (dispatch) => {
    const getWidgetsDataResponse = await getWidgets();
    if (getWidgetsDataResponse?.data) {
      dispatch(getWidgetsDetails(getWidgetsDataResponse));
    } else {
      console.error("getWidgets API failed");
    }
  };
};

export const getpolicyGraph = (data) => {
  return async (dispatch) => {
    const getpolicyGraphResponse = await policyGraph(data);
    if (getpolicyGraphResponse?.data) {
      dispatch(policyGraphDetails(getpolicyGraphResponse));
    } else {
      console.error("policyGraph API failed");
    }
  };
};

export const getEndorsementGraph = (data) => {
  return async (dispatch) => {
    const getendorsementGraphResponse = await endorsementGraph(data);
    if (getendorsementGraphResponse?.data) {
      dispatch(getendorsementGraphDetails(getendorsementGraphResponse));
    } else {
      console.error("getendorsementGraph API failed");
    }
  };
};

export const getMemberEnrollGraph = (data) => {
  return async (dispatch) => {
    const getMemberEnrollGraphResponse = await memberEnrollGraph(data);
    if (getMemberEnrollGraphResponse?.data) {
      dispatch(getMemberEnrollGraphDetails(getMemberEnrollGraphResponse));
    } else {
      console.error("memberEnrollGraph API failed");
    }
  };
};

export const getendorsementPolicyWise = (data) => {
  return async (dispatch) => {
    const getendorsementPolicyWiseResponse = await endorsementPolicyWise(data);
    if (getendorsementPolicyWiseResponse?.data) {
      dispatch(
        getendorsementPolicyWiseDetails(getendorsementPolicyWiseResponse)
      );
    } else {
      console.error("endorsementPolicyWise API failed");
    }
  };
};

export const getmemberWiseClaim = (data) => {
  return async (dispatch) => {
    const getmemberWiseClaimResponse = await memberWiseClaim(data);
    if (getmemberWiseClaimResponse?.data) {
      dispatch(
        getmemberWiseClaimDetails(getmemberWiseClaimResponse)
      );
    } else {
      console.error("memberWiseClaim API failed");
    }
  };
};

export const getpolicyWiseClaim = (data) => {
  return async (dispatch) => {
    const getpolicyWiseClaimResponse = await policyWiseClaim(data);
    if (getpolicyWiseClaimResponse?.data) {
      dispatch(
        getpolicyWiseClaimDetails(getpolicyWiseClaimResponse)
      );
    } else {
      console.error("policyWiseClaim API failed");
    }
  };
};

export const getclaimTable = (is_super_hr) => {
  return async (dispatch) => {
    const getclaimTableResponse = await claimTable(is_super_hr);
    if (getclaimTableResponse?.data) {
      dispatch(
        getclaimTableDetails(getclaimTableResponse)
      );
    } else {
      console.error("claimTable API failed");
    }
  };
};

export const getCoverData = (url, is_super_hr) => {
  return async (dispatch) => {
    const getCoverDataResponse = await coverData(url, is_super_hr);
    if (getCoverDataResponse?.data) {
      dispatch(
        getCoverDataDetails(getCoverDataResponse)
      );
    } else {
      console.error("coverData API failed");
    }
  };
};


export const getSummary = (data) => {
  return async (dispatch) => {
    try {
      const getResp = await summary(data);
      if (getResp?.data) {
        dispatch(getSummaryrDetails(getResp));
      } else {
        let error =
          getResp?.data?.errors && getFirstError(getResp?.data?.errors);
        error = error
          ? error
          : getResp?.data?.message
            ? getResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};


export const getSummarySubscription = (data) => {
  return async (dispatch) => {
    try {
      const getSummaryResp = await summarySubscription(data);
      if (getSummaryResp?.data) {
        dispatch(getSubscriptionDetails(getSummaryResp));
      } else {
        let error =
          getSummaryResp?.data?.errors && getFirstError(getSummaryResp?.data?.errors);
        error = error
          ? error
          : getSummaryResp?.data?.message
            ? getSummaryResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};


export const getPolicyPlanSummary = (data) => {
  return async (dispatch) => {
    try {
      const policyPlanResp = await policyPlanSummary(data);
      if (policyPlanResp?.data) {
        dispatch(getPolicyPlanDetails(policyPlanResp));
      } else {
        let error =
          policyPlanResp?.data?.errors && getFirstError(policyPlanResp?.data?.errors);
        error = error
          ? error
          : policyPlanResp?.data?.message
            ? policyPlanResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};


export const getClaimSummary = (data) => {
  return async (dispatch) => {
    try {
      const claimResp = await claimSummary(data);
      if (claimResp?.data) {
        dispatch(getClaimSummaryDetails(claimResp));
      } else {
        let error =
          claimResp?.data?.errors && getFirstError(claimResp?.data?.errors);
        error = error
          ? error
          : claimResp?.data?.message
            ? claimResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};


//Selectors
export const selectWidgetsData = (state) =>
  state.dashboardAdmin?.getWidgetsDataResponse;
export const selectpolicyGraph = (state) =>
  state.dashboardAdmin?.getpolicyGraphResponse;
export const selectEndorsementGraph = (state) =>
  state.dashboardAdmin?.getendorsementGraphResponse;
export const selectMemberEnrollGraph = (state) =>
  state.dashboardAdmin?.getMemberEnrollGraphResponse;
export const selectendorsementPolicyWise = (state) =>
  state.dashboardAdmin?.getendorsementPolicyWiseResponse;
export const selectmemberWiseClaim = (state) =>
  state.dashboardAdmin?.getmemberWiseClaimResponse;
export const selectpolicyWiseClaim = (state) =>
  state.dashboardAdmin?.getpolicyWiseClaimResponse;
export const selectclaimTable = (state) =>
  state.dashboardAdmin?.getclaimTableResponse;
export const selectWidgetsEmployer = (state) =>
  state.dashboardAdmin?.getWidgetsEmployerResponse;
export const selectCoverData = (state) =>
  state.dashboardAdmin?.getCoverDataResponse;
export const selectSummaryData = (state) =>
  state.dashboardAdmin?.getResp;
export const selectSubscriptionData = (state) =>
  state.dashboardAdmin?.getSummaryResp;
export const selectPolicyPlanData = (state) =>
  state.dashboardAdmin?.policyPlanResp;
export const selectClaimsData = (state) =>
  state.dashboardAdmin?.claimResp;
export default dashboardAdmin.reducer;
