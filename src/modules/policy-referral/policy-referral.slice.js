import { createSlice } from "@reduxjs/toolkit";
import {
  getInsurerType,
  getBrokers,
  getPolicyReferrals,
  postPolicyReferrals,
  deletePolicyReferrals
} from './policy-referral.service';

export const PolicyReferralSlice = createSlice({
  name: "referral",
  initialState: {
    loading: false,
    error: null,
    success: null,
    brokers: [],
    insurer_types: [],
    policy_referrals: null
  },
  reducers: {
    loading: (state) => {
      state.loading = true;
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
    },
    brokers: (state, { payload }) => {
      state.loading = null;
      state.brokers = payload;
    },
    clearBrokers: (state) => {
      state.brokers = null;
    },
    insurerTypes: (state, { payload }) => {
      state.insurer_types = payload;
    },
    clearInsurerTypes: (state) => {
      state.insurer_types = null;
    },
    policyReferrals: (state, { payload }) => {
      state.loading = null;
      state.policy_referrals = payload;
    },
  }
});

export const {
  loading, success, error, clear,
  brokers, clearBrokers,
  insurerTypes, clearInsurerTypes,
  policyReferrals
} = PolicyReferralSlice.actions;


//---------- Action creators ----------//

// Get Brokers

export const loadBrokers = () => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await getBrokers();
      if (data.data) {
        dispatch(brokers(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
};

// Get Isurer Type

export const loadInsurerType = () => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await getInsurerType();
      if (data.data) {
        dispatch(insurerTypes(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
};

// Get Policy Referrals

export const loadPolicyReferrals = () => {
  return async dispatch => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await getPolicyReferrals();
      if (data.data) {
        dispatch(policyReferrals(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
};

// Submit Policy Referral

export const submitPolicyReferal = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await postPolicyReferrals(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadPolicyReferrals());
        // const { data: policyData } = await getPolicyReferrals();
        // if (policyData.data) {
        //   dispatch(policyReferrals(policyData.data));
        // }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
};

// Delete Policy Referral

export const removePolicyReferal = (payload) => {
  return async dispatch => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await deletePolicyReferrals(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadPolicyReferrals());
        // const { data: policyData } = await getPolicyReferrals();
        // if (policyData.data) {
        //   dispatch(policyReferrals(policyData.data));
        // }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
};

export const referral = state => state.policyReferral;

export default PolicyReferralSlice.reducer;
