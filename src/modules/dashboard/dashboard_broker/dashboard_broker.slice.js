import { createSlice } from "@reduxjs/toolkit";
import {
  getPolicies, getWidgets, getEmployer, policyGraph, endorsementGraph,
  memberEnrollGraph, endorsementPolicyWise, memberWiseClaim,
  policyWiseClaim, claimTable, widgetsEmployer, coverData
} from "./serviceApi";

export const dashboardBroker = createSlice({
  name: "dashboardBroker",
  initialState: {
    getEmployerDataResponse: {},
    getPoliciesDataResponse: {},
    getWidgetsDataResponse: {},
    getpolicyGraphResponse: {},
    getendorsementGraphResponse: {},
    getMemberEnrollGraphResponse: {},
    getendorsementPolicyWiseResponse: {},
    getmemberWiseClaimResponse: {},
    getpolicyWiseClaimResponse: {},
    getclaimTableResponse: {},
    getWidgetsEmployerResponse: {},
    // getCoverDataResponse: {}
    coverData: [],
    topUpData: []
  },

  //reducers
  reducers: {
    getEmployerDetails: (state, action) => {
      state.getEmployerDataResponse = action.payload;
    },
    getPoliciesDetails: (state, action) => {
      state.getPoliciesDataResponse = action.payload;
    },
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
    getCoverDataDetails: (state, { payload }) => {
      if (payload.type === 1) {
        state.coverData = payload.data;
      } else {
        state.topUpData = payload.data
      }
    },
  },
});

export const {
  getEmployerDetails, getPoliciesDetails, getWidgetsDetails,
  policyGraphDetails, getendorsementGraphDetails, getMemberEnrollGraphDetails,
  getendorsementPolicyWiseDetails, getmemberWiseClaimDetails, getpolicyWiseClaimDetails,
  getclaimTableDetails, getWidgetsEmployerDetails, getCoverDataDetails
} = dashboardBroker.actions;

//Action Creator

export const getEmployerData = (broker_id) => {
  return async (dispatch) => {
    const getEmployerDataResponse = await getEmployer(broker_id);
    if (getEmployerDataResponse.data) {
      dispatch(getEmployerDetails(getEmployerDataResponse));
    } else {
      console.error("getEmployer API failed");
    }
  };
};

export const getPoliciesData = (data) => {
  return async (dispatch) => {
    const getPoliciesDataResponse = await getPolicies(data);
    if (getPoliciesDataResponse.data) {
      dispatch(getPoliciesDetails(getPoliciesDataResponse));
    } else {
      console.error("getPolicies API failed");
    }
  };
};

export const getWidgetsData = () => {
  return async (dispatch) => {
    const getWidgetsDataResponse = await getWidgets();
    if (getWidgetsDataResponse.data) {
      dispatch(getWidgetsDetails(getWidgetsDataResponse));
    } else {
      console.error("getWidgets API failed");
    }
  };
};

export const getpolicyGraph = (data) => {
  return async (dispatch) => {
    const getpolicyGraphResponse = await policyGraph(data);
    if (getpolicyGraphResponse.data) {
      dispatch(policyGraphDetails(getpolicyGraphResponse));
    } else {
      console.error("policyGraph API failed");
    }
  };
};

export const getEndorsementGraph = (data) => {
  return async (dispatch) => {
    const getendorsementGraphResponse = await endorsementGraph(data);
    if (getendorsementGraphResponse.data) {
      dispatch(getendorsementGraphDetails(getendorsementGraphResponse));
    } else {
      console.error("getendorsementGraph API failed");
    }
  };
};

export const getMemberEnrollGraph = (data) => {
  return async (dispatch) => {
    const getMemberEnrollGraphResponse = await memberEnrollGraph(data);
    if (getMemberEnrollGraphResponse.data) {
      dispatch(getMemberEnrollGraphDetails(getMemberEnrollGraphResponse));
    } else {
      console.error("memberEnrollGraph API failed");
    }
  };
};

export const getendorsementPolicyWise = (data) => {
  return async (dispatch) => {
    const getendorsementPolicyWiseResponse = await endorsementPolicyWise(data);
    if (getendorsementPolicyWiseResponse.data) {
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
    if (getmemberWiseClaimResponse.data) {
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
    if (getpolicyWiseClaimResponse.data) {
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
    if (getclaimTableResponse.data) {
      dispatch(
        getclaimTableDetails(getclaimTableResponse)
      );
    } else {
      console.error("claimTable API failed");
    }
  };
};

export const getWidgetsEmployer = (is_super_hr) => {
  return async (dispatch) => {
    const getWidgetsEmployerResponse = await widgetsEmployer(is_super_hr);
    if (getWidgetsEmployerResponse.data) {
      dispatch(
        getWidgetsEmployerDetails(getWidgetsEmployerResponse)
      );
    } else {
      console.error("widgetsEmployer API failed");
    }
  };
};

export const getCoverData = (url, is_super_hr) => {
  return async (dispatch) => {
    const { data } = await coverData(url, is_super_hr);
    if (data.data) {
      dispatch(getCoverDataDetails({ data: data.data, type: url }));
    } else {
      console.error("coverData API failed");
    }
  };
};

//Selectors
export const selectEmployerData = (state) =>
  state.dashboardBroker?.getEmployerDataResponse;
export const selectPolicyData = (state) =>
  state.dashboardBroker?.getPoliciesDataResponse;
export const selectWidgetsData = (state) =>
  state.dashboardBroker?.getWidgetsDataResponse;
export const selectpolicyGraph = (state) =>
  state.dashboardBroker?.getpolicyGraphResponse;
export const selectEndorsementGraph = (state) =>
  state.dashboardBroker?.getendorsementGraphResponse;
export const selectMemberEnrollGraph = (state) =>
  state.dashboardBroker?.getMemberEnrollGraphResponse;
export const selectendorsementPolicyWise = (state) =>
  state.dashboardBroker?.getendorsementPolicyWiseResponse;
export const selectmemberWiseClaim = (state) =>
  state.dashboardBroker?.getmemberWiseClaimResponse;
export const selectpolicyWiseClaim = (state) =>
  state.dashboardBroker?.getpolicyWiseClaimResponse;
export const selectclaimTable = (state) =>
  state.dashboardBroker?.getclaimTableResponse;
export const selectWidgetsEmployer = (state) =>
  state.dashboardBroker?.getWidgetsEmployerResponse;
export const selectCoverData = (state) =>
  state.dashboardBroker?.getCoverDataResponse;
export default dashboardBroker.reducer;
