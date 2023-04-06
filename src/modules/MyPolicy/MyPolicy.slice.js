import { createSlice } from "@reduxjs/toolkit";
import { getpolicyData, getMasterpolicy, addMyPolicy, getPolicies, getRenewal, getInsuranceLink } from "./serviceApi";

export const myPolicy = createSlice({
  name: "myPolicy",
  initialState: {
    getPolicyDataResponse: {},
    getMasterPolicyDataResponse: {},
    addMyPolicyDataResponse: {},
    getPoliciesDataResponse: {},
    getRenewalDataResponse: {},
    insurance_link: []
  },

  //reducers
  reducers: {
    getMasterPolicyDetails: (state, action) => {
      state.getMasterPolicyDataResponse = action.payload;
    },
    getPolicyDetails: (state, action) => {
      state.getPolicyDataResponse = action.payload;
    },
    addMyPolicyDetails: (state, action) => {
      state.addMyPolicyDataResponse = action.payload;
    },
    getPoliciesDetails: (state, action) => {
      state.getPoliciesDataResponse = action.payload;
    },
    getRenewalDetails: (state, action) => {
      state.getRenewalDataResponse = action.payload;
    },
    insurance_link: (state, { payload }) => {
      state.insurance_link = payload;
    },
  },
});

export const { getRenewalDetails, getPolicyDetails, getMasterPolicyDetails, addMyPolicyDetails, getPoliciesDetails, insurance_link } = myPolicy.actions;

//Action Creator
export const getMasterPolicyData = () => {
  return async (dispatch) => {
    const getMasterPolicyDataResponse = await getMasterpolicy();
    if (getMasterPolicyDataResponse?.data) {
      dispatch(getMasterPolicyDetails(getMasterPolicyDataResponse));
    } else {
      console.error("MasterPolicy API failed");
    }
  };
};

export const getPolicyData = () => {
  return async (dispatch) => {
    const getPolicyDataResponse = await getpolicyData();
    if (getPolicyDataResponse?.data) {
      dispatch(getPolicyDetails(getPolicyDataResponse));
    } else {
      console.error("CardData API failed");
    }
  };
};

export const addMyPolicyData = (data) => {
  return async (dispatch) => {
    const addMyPolicyDataResponse = await addMyPolicy(data);
    if (addMyPolicyDataResponse?.data) {
      dispatch(addMyPolicyDetails(addMyPolicyDataResponse));
    } else {
      console.error("addMyPolicy API failed");
    }
  };
};

export const getPoliciesData = () => {
  return async (dispatch) => {
    const getPoliciesDataResponse = await getPolicies();
    if (getPoliciesDataResponse?.data) {
      dispatch(getPoliciesDetails(getPoliciesDataResponse));
    } else {
      console.error("getMyPolicy API failed");
    }
  };
};

export const getRenewalData = () => {
  return async (dispatch) => {
    const getRenewalDataResponse = await getRenewal();
    if (getRenewalDataResponse?.data) {
      dispatch(getRenewalDetails(getRenewalDataResponse));
    } else {
      console.error("getRenewal API failed");
    }
  };
};

export const loadInsuranceLink = () => {
  return async (dispatch) => {
    try {
      const { data } = await getInsuranceLink();
      if (data?.data) {
        dispatch(insurance_link(data.data));
      } else {
        console.error("InsuranceLink API failed");
      }
    } catch (err) {
      console.error("InsuranceLink API failed");
    }
  };
};

//Selectors
export const selectPolicies = (state) =>
  state.myPolicy?.getPoliciesDataResponse;
export const selectMyPolicyData = (state) =>
  state.myPolicy?.addMyPolicyDataResponse;
export const selectMasterPolicyData = (state) =>
  state.myPolicy?.getMasterPolicyDataResponse;
export const selectPolicyData = (state) =>
  state.myPolicy?.getPolicyDataResponse;
export const selectRenewalData = (state) =>
  state.myPolicy?.getRenewalDataResponse;
export const selectInsuranceLink = (state) =>
  state.myPolicy?.insurance_link;
export default myPolicy.reducer;
