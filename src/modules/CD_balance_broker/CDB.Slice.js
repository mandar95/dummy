import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployerNameData,
  getInsurerData,
  getPolicyTypeData,
  getPolicyNumberData,
  getPolicyDetailsData,
  getCdData,
  postCdBalanceData,
  getCdStatementFile,
  adminGetBroker,
  employeePremiumBalance
} from "./serviceApi";
import { getFirstError } from "../../utils";

export const cdBalancebroker = createSlice({
  name: "cdBalancebroker",
  initialState: {
    response: {},
    EmployerNameResponse: {},
    selectPolicyResponse: {},
    PolicyNumberResponse: {},
    PolicyDetailsResponse: {},
    CdUpdateResponse: {},
    CdBalanceResponse: {},
    CdStatementResponse: {},
    alert: null,
    updateAlert: null,
    success: null,
    broker: [],
    employeeCount: ''
  },

  //reducers
  reducers: {
    getEmployerNameDetails: (state, action) => {
      state.EmployerNameResponse = action.payload;
    },
    getInsurerId: (state, action) => {
      state.response = action.payload;
    },
    PolicyType: (state, action) => {
      state.selectPolicyResponse = action.payload;
    },
    PolicyNumber: (state, action) => {
      state.PolicyNumberResponse = action.payload;
    },
    PolicyDetails: (state, action) => {
      state.PolicyDetailsResponse = action.payload;
    },
    clearPolicyDetails: (state) => {
      state.PolicyDetailsResponse = {}
    },
    cdUpdateDetails: (state, action) => {
      state.CdUpdateResponse = action.payload;
    },
    getCdBalanceDetails: (state, action) => {
      state.CdBalanceResponse = action.payload;
    },
    getCdStatementDetails: (state, action) => {
      state.CdStatementResponse = action.payload;
    },
    alertMessage: (state, action) => {
      state.alert = action.payload;
    },
    clearAlertMessage: (state, action) => {
      state.alert = null;
    },
    updateMessage: (state, action) => {
      state.updateAlert = action.payload;
    },
    clearUpdateMessage: (state, action) => {
      state.updateAlert = null;
    },
    successMessage: (state, action) => {
      state.success = action.payload;
    },
    clearSuccessMessage: (state, action) => {
      state.success = null;
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    employeeCount: (state, { payload }) => {
      state.employeeCount = payload;
    }
  },
});

export const {
  getEmployerNameDetails,
  getInsurerId,
  PolicyType,
  PolicyNumber,
  PolicyDetails,
  cdUpdateDetails,
  getCdBalanceDetails,
  getCdStatementDetails,
  clearAlertMessage,
  alertMessage,
  updateMessage,
  clearUpdateMessage,
  successMessage,
  clearSuccessMessage,
  broker,
  clearPolicyDetails,
  employeeCount
} = cdBalancebroker.actions;

//Action Creators


export const getEmployerName = (data) => {
  return async (dispatch) => {
    const EmployerNameResponse = await getEmployerNameData(data)
    if (EmployerNameResponse.data) {
      dispatch(getEmployerNameDetails(EmployerNameResponse));
    } else {
    }
  };
};

export const getInsurerDetails = (data) => {
  return async (dispatch) => {
    const response = await getInsurerData(data);

    if (response.data) {
      dispatch(getInsurerId(response));
    } else {

    }
  };
};

export const getPolicyType = (data) => {
  return async (dispatch) => {
    const selectPolicyResponse = await getPolicyTypeData(data);

    if (selectPolicyResponse.data) {
      dispatch(PolicyType(selectPolicyResponse));
    } else {

    }
  };
};

export const getPolicyNumber = (data) => {
  return async (dispatch) => {
    const PolicyNumberResponse = await getPolicyNumberData(data);

    if (PolicyNumberResponse.data) {
      dispatch(PolicyNumber(PolicyNumberResponse));
    } else {

    }
  };
};

export const getPolicyDetails = (data) => {
  return async (dispatch) => {
    try {
      const PolicyDetailsResponse = await getPolicyDetailsData(data);

      if (PolicyDetailsResponse.data) {
        dispatch(PolicyDetails(PolicyDetailsResponse));
      } else {
        let error =
          PolicyDetailsResponse?.data?.errors &&
          getFirstError(PolicyDetailsResponse?.data?.errors);
        error = error
          ? error
          : PolicyDetailsResponse?.data?.message
            ? PolicyDetailsResponse?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error))
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"))
    }
  };
};

export const cdUpdate = (data) => {
  return async (dispatch) => {
    const CdUpdateResponse = await getCdData(data);

    if (CdUpdateResponse.data) {
      dispatch(cdUpdateDetails(CdUpdateResponse));
      if (CdUpdateResponse?.data?.status) {
        dispatch(successMessage(CdUpdateResponse?.data?.message))
        dispatch(employeeCountwrtPremium({ policy_id: data.policy_id }))
      }
      else {
        let error =
          CdUpdateResponse?.data?.errors &&
          getFirstError(CdUpdateResponse?.data?.errors);
        error = error
          ? error
          : CdUpdateResponse?.data?.message
            ? CdUpdateResponse?.data?.message
            : "Something went wrong";
        dispatch(updateMessage(error));
      }
    } else {
      dispatch(updateMessage(CdUpdateResponse?.message || "Something went wrong"));
    }
  };
};

export const cdBalanceDetails = (data) => {
  return async (dispatch) => {
    const CdBalanceResponse = await postCdBalanceData(data);

    if (CdBalanceResponse.data) {
      dispatch(getCdBalanceDetails(CdBalanceResponse));
    } else {

    }
  };
};

export const getCdStatement = (data) => {
  return async (dispatch) => {
    const CdStatementResponse = await getCdStatementFile(data);

    if (CdStatementResponse.data) {
      dispatch(getCdStatementDetails(CdStatementResponse));
    } else {

    }
  };
};

// Admin Get Broker

export const loadBroker = (userType) => {
  return async dispatch => {
    try {
      const { data } = await adminGetBroker(userType);
      if (data.data) {
        dispatch(broker(data.data));
      } else {
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
    }
  }
};

// employee count wrt premium 

export const employeeCountwrtPremium = (payload) => {
  return async dispatch => {
    try {
      const { data } = await employeePremiumBalance(payload);
      if (data.data) {
        dispatch(employeeCount(data.data));
      } else {
        dispatch(employeeCount(''));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
    }
  }
};


//Selectors
export const selectInsurerId = (state) => state?.cdBalancebroker?.response;
export const selectEmployerName = (state) =>
  state.cdBalancebroker?.EmployerNameResponse;
export const selectCdStatement = (state) =>
  state?.cdBalancebroker?.CdStatementResponse;
export const selectCdBalanceDetails = (state) =>
  state?.cdBalancebroker?.CdBalanceResponse;
export const selectCdUpdateDetails = (state) =>
  state?.cdBalancebroker?.CdUpdateResponse;
export const selectPolicyDetails = (state) =>
  state?.cdBalancebroker?.PolicyDetailsResponse;
export const selectPolicyType = (state) =>
  state?.cdBalancebroker?.selectPolicyResponse;
export const selectPolicyNumber = (state) =>
  state?.cdBalancebroker?.PolicyNumberResponse;
export const selectAlert = (state) =>
  state?.cdBalancebroker?.alert;
export const selectUpdateAlert = (state) =>
  state?.cdBalancebroker?.updateAlert;
export const selectSuccessAlert = (state) =>
  state?.cdBalancebroker?.success;

export default cdBalancebroker.reducer;
